import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/supabase/admin";
import {
  getEventRegistrations,
  updateRegistrationStatus,
  updateRegistrationFields,
  deleteRegistrations,
} from "@/lib/supabase/events";
import { createServiceClient } from "@/lib/supabase/service";
import { sendEmail } from "@/lib/email";
import { WaitlistPromotedEmail } from "@/components/emails/waitlist-promoted";
import type { RegistrationStatus } from "@/lib/supabase/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const result = await getEventRegistrations(id, page, limit);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Get registrations error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

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

    // Single registration field update (inline edit)
    if (body.registration_id && body.fields) {
      const { registration_id, fields } = body as {
        registration_id: string;
        fields: {
          name?: string;
          email?: string;
          phone?: string;
          note?: string;
        };
      };
      const success = await updateRegistrationFields(registration_id, fields);
      if (!success) {
        return NextResponse.json({ error: "更新失敗" }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    // Bulk status update
    const { registration_ids, status } = body as {
      registration_ids: string[];
      status: RegistrationStatus;
    };

    if (!registration_ids || !status) {
      return NextResponse.json({ error: "缺少必填欄位" }, { status: 400 });
    }

    // If promoting to confirmed, find which ones are currently waitlisted
    let waitlistedIds: Set<string> = new Set();
    if (status === "confirmed") {
      const supabase = createServiceClient();
      const { data: regs } = await supabase
        .from("registrations")
        .select("id, status")
        .in("id", registration_ids)
        .eq("status", "waitlisted");
      waitlistedIds = new Set((regs || []).map((r) => r.id));
    }

    const results = await Promise.all(
      registration_ids.map((regId) => updateRegistrationStatus(regId, status)),
    );

    const successCount = results.filter(Boolean).length;

    // Send promotion emails to newly confirmed waitlisted registrations
    if (waitlistedIds.size > 0 && successCount > 0) {
      // Fire and forget — don't block the response
      sendPromotionEmails(eventId, [...waitlistedIds]).catch((err) =>
        console.error("Failed to send promotion emails:", err),
      );
    }

    return NextResponse.json({ success: true, updated: successCount });
  } catch (err) {
    console.error("Update registrations error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

/** Send waitlist-promoted emails to registrations that were just promoted */
async function sendPromotionEmails(
  eventId: string,
  registrationIds: string[],
) {
  const supabase = createServiceClient();

  // Fetch event info
  const { data: event } = await supabase
    .from("events")
    .select(
      "title, starts_at, ends_at, format, venue_name, venue_address, online_url, slug",
    )
    .eq("id", eventId)
    .single();

  if (!event) return;

  // Fetch registration + ticket type info
  const { data: regs } = await supabase
    .from("registrations")
    .select("id, name, email, ticket_type_id")
    .in("id", registrationIds);

  if (!regs || regs.length === 0) return;

  // Fetch ticket types
  const ticketTypeIds = [...new Set(regs.map((r) => r.ticket_type_id))];
  const { data: ticketTypes } = await supabase
    .from("ticket_types")
    .select("id, name")
    .in("id", ticketTypeIds);

  const ticketMap = new Map(
    (ticketTypes || []).map((t) => [t.id, t.name]),
  );

  const TZ = "Asia/Taipei";
  const startDate = new Date(event.starts_at);
  const endDate = event.ends_at ? new Date(event.ends_at) : null;

  const dateStr = new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: TZ,
  }).format(startDate);

  const timeFmt = new Intl.DateTimeFormat("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  });
  const timeStr =
    timeFmt.format(startDate) +
    (endDate ? `–${timeFmt.format(endDate)}` : "");

  const hasVenue = event.format === "offline" || event.format === "hybrid";
  const venue = hasVenue ? event.venue_name || "待通知" : "線上活動";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.solo.tw";

  const calendarLocation = hasVenue
    ? [event.venue_name, event.venue_address].filter(Boolean).join(" ")
    : event.online_url || "線上";

  const calStart = startDate
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const calEnd = endDate
    ? endDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
    : calStart;
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${calStart}/${calEnd}&location=${encodeURIComponent(calendarLocation)}`;

  // Send emails concurrently
  await Promise.allSettled(
    regs.map((reg) =>
      sendEmail({
        to: reg.email,
        subject: `好消息！你的《${event.title}》報名已確認`,
        react: WaitlistPromotedEmail({
          name: reg.name,
          eventTitle: event.title,
          eventDate: dateStr,
          eventTime: timeStr,
          venue,
          venueAddress: event.venue_address || undefined,
          ticketType: ticketMap.get(reg.ticket_type_id) || "",
          eventUrl: `${baseUrl}/events/${event.slug}`,
          calendarUrl,
          cancelUrl: `${baseUrl}/dashboard/events`,
          format: event.format as "online" | "offline" | "hybrid",
          onlineUrl: event.online_url || undefined,
        }),
      }),
    ),
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { registration_ids } = body as { registration_ids: string[] };

    if (!registration_ids || registration_ids.length === 0) {
      return NextResponse.json({ error: "缺少報名 ID" }, { status: 400 });
    }

    const deleted = await deleteRegistrations(registration_ids);
    return NextResponse.json({ success: true, deleted });
  } catch (err) {
    console.error("Delete registrations error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
