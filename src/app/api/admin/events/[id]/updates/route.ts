import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createEventUpdate } from "@/lib/supabase/events";
import { sendEmail } from "@/lib/email";
import { EventUpdateEmail } from "@/components/emails/event-update-email";

// Allow up to 120 seconds for sending many emails
export const maxDuration = 120;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: eventId } = await params;
    const body = await request.json();
    const { title, content, target, testEmail } = body;

    if (!title) {
      return NextResponse.json({ error: "請填寫公告標題" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get event info for email
    const { data: event } = await supabase
      .from("events")
      .select(
        "title, slug, starts_at, ends_at, format, venue_name, venue_address, online_url",
      )
      .eq("id", eventId)
      .single();

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.solo.tw";

    // ─── Test mode: send to a single email, skip DB insert ───
    if (target === "test" && testEmail) {
      const TZ = "Asia/Taipei";
      const eventDate = event?.starts_at
        ? new Intl.DateTimeFormat("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            weekday: "short",
            timeZone: TZ,
          }).format(new Date(event.starts_at))
        : undefined;
      const timeFmt = new Intl.DateTimeFormat("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: TZ,
      });
      const eventTime = event?.starts_at
        ? timeFmt.format(new Date(event.starts_at)) +
          (event.ends_at ? `–${timeFmt.format(new Date(event.ends_at))}` : "")
        : undefined;
      const hasVenue =
        event?.format === "offline" || event?.format === "hybrid";
      const venue = hasVenue
        ? event?.venue_name || "待通知"
        : event?.format === "online"
          ? "線上活動"
          : undefined;

      const result = await sendEmail({
        to: testEmail,
        subject: `[測試] 活動公告：${event?.title} — ${title}`,
        react: EventUpdateEmail({
          name: "測試收件人",
          eventTitle: event?.title || "",
          updateTitle: title,
          updateContent: content || "",
          eventUrl: `${baseUrl}/events/${event?.slug}`,
          eventDate,
          eventTime,
          venue,
          venueAddress: event?.venue_address || undefined,
          onlineUrl: event?.online_url || undefined,
        }),
      });

      if (!result.success) {
        return NextResponse.json({ error: "測試信寄送失敗" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        emailsSent: 1,
        emailsFailed: 0,
      });
    }

    // ─── Normal mode: create DB record + send to registrants ───

    const update = await createEventUpdate({
      event_id: eventId,
      title,
      content: content || null,
      created_by: user?.id || null,
    });

    if (!update) {
      return NextResponse.json({ error: "公告建立失敗" }, { status: 500 });
    }

    // Get registrations to send emails (bypass RLS with service client)
    const serviceClient = createServiceClient();
    const { data: allRegs, error: regsError } = await serviceClient
      .from("registrations")
      .select("name, email, status")
      .eq("event_id", eventId)
      .neq("status", "cancelled");

    if (regsError) {
      console.error("Fetch registrations error:", regsError);
    }

    console.log(
      `[Event Update] eventId=${eventId}, allRegs=${allRegs?.length ?? 0}, target=${target}`,
    );

    // Filter by target audience
    const targetRegs = (allRegs || []).filter((r) => {
      if (target === "confirmed") return r.status === "confirmed";
      if (target === "waitlisted") return r.status === "waitlisted";
      return true; // "all" = confirmed + waitlisted (cancelled already excluded)
    });

    console.log(`[Event Update] targetRegs=${targetRegs.length}`);

    // Build event info for email
    const TZ = "Asia/Taipei";
    const eventDate = event?.starts_at
      ? new Intl.DateTimeFormat("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          weekday: "short",
          timeZone: TZ,
        }).format(new Date(event.starts_at))
      : undefined;
    const timeFmt = new Intl.DateTimeFormat("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: TZ,
    });
    const eventTime = event?.starts_at
      ? timeFmt.format(new Date(event.starts_at)) +
        (event.ends_at ? `–${timeFmt.format(new Date(event.ends_at))}` : "")
      : undefined;
    const hasVenue = event?.format === "offline" || event?.format === "hybrid";
    const venue = hasVenue
      ? event?.venue_name || "待通知"
      : event?.format === "online"
        ? "線上活動"
        : undefined;

    // Send emails in small batches with delay to respect Resend rate limit (2/sec)
    const BATCH_SIZE = 2;
    const BATCH_DELAY_MS = 1200; // 1.2s between batches
    let emailsSent = 0;
    let emailsFailed = 0;
    const failedEmails: { email: string; error: unknown }[] = [];

    for (let i = 0; i < targetRegs.length; i += BATCH_SIZE) {
      const batch = targetRegs.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map((reg) =>
          sendEmail({
            to: reg.email,
            subject: `活動公告：${event?.title} — ${title}`,
            react: EventUpdateEmail({
              name: reg.name,
              eventTitle: event?.title || "",
              updateTitle: title,
              updateContent: content || "",
              eventUrl: `${baseUrl}/events/${event?.slug}`,
              eventDate,
              eventTime,
              venue,
              venueAddress: event?.venue_address || undefined,
              onlineUrl: event?.online_url || undefined,
            }),
          }),
        ),
      );

      for (let j = 0; j < batchResults.length; j++) {
        if (batchResults[j].success) {
          emailsSent++;
        } else {
          emailsFailed++;
          failedEmails.push({
            email: batch[j].email,
            error: batchResults[j].error,
          });
        }
      }

      // Rate limit: wait between batches (skip after last batch)
      if (i + BATCH_SIZE < targetRegs.length) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
      }
    }

    if (emailsFailed > 0) {
      console.error(
        `[Event Update] ${emailsSent} sent, ${emailsFailed} failed. Errors:`,
        JSON.stringify(failedEmails.slice(0, 5)),
      );
    }

    console.log(
      `[Event Update] Done: ${emailsSent} sent, ${emailsFailed} failed`,
    );

    // Mark as sent
    await supabase
      .from("event_updates")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", update.id);

    return NextResponse.json({
      success: true,
      update,
      totalRegistrations: targetRegs.length,
      emailsSent,
      emailsFailed,
    });
  } catch (err) {
    console.error("Create event update error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

// ─── PATCH: Update an existing event update (title / content) ───

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: eventId } = await params;
    const body = await request.json();
    const { updateId, title, content } = body;

    if (!updateId) {
      return NextResponse.json({ error: "缺少公告 ID" }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: "請填寫公告標題" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("event_updates")
      .update({ title, content: content || null })
      .eq("id", updateId)
      .eq("event_id", eventId)
      .select()
      .single();

    if (error) {
      console.error("Update event update error:", error);
      return NextResponse.json({ error: "更新失敗" }, { status: 500 });
    }

    return NextResponse.json({ success: true, update: data });
  } catch (err) {
    console.error("Patch event update error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
