import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { registerForEvent, cancelRegistration } from "@/lib/supabase/events";
import { sendEmail } from "@/lib/email";
import { RegistrationConfirmEmail } from "@/components/emails/registration-confirm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      event_id,
      ticket_type_id,
      name,
      email,
      phone,
      note,
      utm_source,
      utm_medium,
      utm_campaign,
    } = body;

    if (!event_id || !ticket_type_id || !name || !email) {
      return NextResponse.json({ error: "缺少必填欄位" }, { status: 400 });
    }

    // Get current user if logged in
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { registration, error } = await registerForEvent({
      event_id,
      ticket_type_id,
      user_id: user?.id || null,
      name,
      email,
      phone: phone || null,
      status: "confirmed", // registerForEvent will override based on capacity
      note: note || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // Fetch event and ticket info for email
    const { data: event } = await supabase
      .from("events")
      .select(
        "title, starts_at, ends_at, format, venue_name, venue_address, online_url, slug",
      )
      .eq("id", event_id)
      .single();

    const { data: ticketType } = await supabase
      .from("ticket_types")
      .select("name")
      .eq("id", ticket_type_id)
      .single();

    if (event && registration) {
      const startDate = new Date(event.starts_at);
      const endDate = event.ends_at ? new Date(event.ends_at) : null;

      const TZ = "Asia/Taipei";
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

      // Build calendar location with address
      const calendarLocation = hasVenue
        ? [event.venue_name, event.venue_address].filter(Boolean).join(" ")
        : event.online_url || "線上";

      // Send confirmation email (must await on Vercel serverless)
      await sendEmail({
        to: email,
        subject:
          registration.status === "confirmed"
            ? `報名確認：${event.title}`
            : `候補通知：${event.title}`,
        react: RegistrationConfirmEmail({
          name,
          eventTitle: event.title,
          eventDate: dateStr,
          eventTime: timeStr,
          venue,
          venueAddress: event.venue_address || undefined,
          ticketType: ticketType?.name || "",
          eventUrl: `${baseUrl}/events/${event.slug}`,
          calendarUrl: buildGoogleCalendarUrl(
            event.title,
            event.starts_at,
            event.ends_at,
            calendarLocation,
          ),
          cancelUrl: `${baseUrl}/dashboard/events`,
          format: event.format as "online" | "offline" | "hybrid",
          onlineUrl: event.online_url || undefined,
          status: registration.status as "confirmed" | "waitlisted",
        }),
      });
    }

    // Invalidate page cache so ticket counts refresh
    if (event?.slug) {
      revalidatePath(`/events/${event.slug}`);
    }

    return NextResponse.json({
      success: true,
      registration,
      message:
        registration?.status === "confirmed" ? "報名成功！" : "已加入候補名單",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

function buildGoogleCalendarUrl(
  title: string,
  start: string,
  end: string | null,
  location: string,
): string {
  const startDate = new Date(start)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const endDate = end
    ? new Date(end)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "")
    : startDate;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${startDate}/${endDate}`,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 });
    }

    const { registrationId } = await request.json();

    if (!registrationId) {
      return NextResponse.json({ error: "缺少報名 ID" }, { status: 400 });
    }

    const success = await cancelRegistration(registrationId, user.id);

    if (!success) {
      return NextResponse.json({ error: "取消失敗" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "已取消報名" });
  } catch (err) {
    console.error("Cancel registration error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
