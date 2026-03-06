import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import { EventReminderEmail } from "@/components/emails/event-reminder";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 1. Send reminders for tomorrow's events
  const tomorrowStart = new Date(tomorrow);
  tomorrowStart.setHours(0, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(23, 59, 59, 999);

  const { data: tomorrowEvents } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .gte("starts_at", tomorrowStart.toISOString())
    .lte("starts_at", tomorrowEnd.toISOString());

  let remindersSent = 0;
  for (const event of tomorrowEvents || []) {
    const { data: registrations } = await supabase
      .from("registrations")
      .select("name, email")
      .eq("event_id", event.id)
      .eq("status", "confirmed");

    const hasVenue = event.format === "offline" || event.format === "hybrid";
    const venue = hasVenue ? event.venue_name || "待通知" : "線上活動";

    for (const reg of registrations || []) {
      await sendEmail({
        to: reg.email,
        subject: `明天見！提醒你參加《${event.title}》`,
        react: EventReminderEmail({
          name: reg.name,
          eventTitle: event.title,
          eventTime: new Intl.DateTimeFormat("zh-TW", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Taipei",
          }).format(new Date(event.starts_at)),
          venue,
          venueAddress: event.venue_address || undefined,
          eventUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/events/${event.slug}`,
          format: event.format as "online" | "offline" | "hybrid",
          onlineUrl: event.online_url || undefined,
        }),
      });
      remindersSent++;
    }
  }

  // 2. Auto-archive past events
  const { data: archivedData } = await supabase
    .from("events")
    .update({ status: "archived" })
    .eq("status", "published")
    .lt("ends_at", now.toISOString())
    .select();

  return NextResponse.json({
    success: true,
    remindersSent,
    archived: archivedData?.length || 0,
  });
}
