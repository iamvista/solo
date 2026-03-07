import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  createEventUpdate,
  getEventRegistrations,
} from "@/lib/supabase/events";
import { sendEmail } from "@/lib/email";
import { EventUpdateEmail } from "@/components/emails/event-update-email";

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
    const { title, content, target } = body;

    if (!title) {
      return NextResponse.json({ error: "請填寫公告標題" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const update = await createEventUpdate({
      event_id: eventId,
      title,
      content: content || null,
      created_by: user?.id || null,
    });

    if (!update) {
      return NextResponse.json({ error: "公告建立失敗" }, { status: 500 });
    }

    // Get event info for email
    const { data: event } = await supabase
      .from("events")
      .select(
        "title, slug, starts_at, ends_at, format, venue_name, venue_address, online_url",
      )
      .eq("id", eventId)
      .single();

    // Get registrations to send emails
    const { registrations } = await getEventRegistrations(eventId, 1, 1000);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.solo.tw";

    // Filter by target audience
    const targetRegs = registrations.filter((r: any) => {
      if (target === "confirmed") return r.status === "confirmed";
      if (target === "waitlisted") return r.status === "waitlisted";
      return r.status !== "cancelled"; // "all" = confirmed + waitlisted
    });

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

    // Send emails — MUST await on Vercel serverless (otherwise function dies before emails send)
    const emailResults = await Promise.allSettled(
      targetRegs.map((reg: any) =>
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

    const emailsSent = emailResults.filter(
      (r) => r.status === "fulfilled",
    ).length;
    const emailsFailed = emailResults.filter(
      (r) => r.status === "rejected",
    ).length;

    if (emailsFailed > 0) {
      console.error(
        `Event update emails: ${emailsSent} sent, ${emailsFailed} failed`,
        emailResults
          .filter((r) => r.status === "rejected")
          .map((r) => (r as PromiseRejectedResult).reason),
      );
    }

    // Mark as sent
    await supabase
      .from("event_updates")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", update.id);

    return NextResponse.json({
      success: true,
      update,
      emailsSent,
      emailsFailed,
    });
  } catch (err) {
    console.error("Create event update error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
