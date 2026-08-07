import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "crypto";
import { sendEmail } from "@/lib/email";
import { EventReminderEmail } from "@/components/emails/event-reminder";
import { CourseReminderEmail } from "@/components/emails/course-reminder";
import { COURSE_CONFIGS } from "@/lib/courses-config";
import { dueOffsets, reminderCopy, isTestOrder } from "@/lib/reminder-dates";

function authorizedCron(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  const authHeader = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${cronSecret}`;
  const a = Buffer.from(authHeader);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  if (!authorizedCron(request)) {
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

  // 3. 課程倒數提醒（D-7／D-5／D-3／D-1）
  //
  // 為什麼要另外做一段：上面第 1 段只掃 events 表，而課程報名寫的是
  // course_enrollments，兩套資料完全不相通。在補上這段之前，付費課程學員
  // 從報名到開課不會收到任何自動提醒。
  //
  // 安全開關：REMINDER_SEND_ENABLED 不等於 "1" 就只試算不寄，也不寫任何
  // 去重紀錄。刻意不寫，否則試算過的名單會被誤判為已寄，正式開啟後就漏寄。
  const sendEnabled = process.env.REMINDER_SEND_ENABLED === "1";
  let courseRemindersSent = 0;
  let courseRemindersSkipped = 0;
  let courseRemindersFailed = 0;
  const courseReminderPlan: Array<{
    course: string;
    cohort: string | null;
    offsetDays: number;
    recipients: number;
  }> = [];

  for (const course of Object.values(COURSE_CONFIGS)) {
    // 開課日一律由期別提供，不從課程層級取：頂層的 date 只是招生中那一期的
    // 複本，用它算 D-N 會讓已結束的期別也被重新計算。每門課至少有一期，
    // 這條不變式由 courses-config.test.ts 把關。
    const targets = course.cohorts.map((c) => ({
      cohortKey: c.key as string | null,
      startsAt: c.startsAt,
    }));

    for (const target of targets) {
      // 沒填 startsAt 就跳過。寧可漏寄，也不要用猜的日期寄錯時間給付費學員。
      if (!target.startsAt) continue;

      for (const offset of dueOffsets(now, target.startsAt)) {
        let query = supabase
          .from("course_enrollments")
          .select("email, name, amount")
          .eq("course_id", course.slug)
          .eq("status", "paid")
          // 手動排除：改期前的舊場次學員、或任何確定不屬於本場的列。
          .eq("reminder_excluded", false);
        query = target.cohortKey
          ? query.eq("cohort_key", target.cohortKey)
          : query.is("cohort_key", null);

        const { data: enrollments, error: enrollErr } = await query;
        if (enrollErr) {
          console.error(
            `[course-reminder] 讀取報名資料失敗 ${course.slug}/${target.cohortKey}:`,
            enrollErr,
          );
          continue;
        }

        // 測試單（NT$1 那類）不寄，避免自己的驗證資料混進學員名單。
        const recipients = (enrollments ?? []).filter(
          (e) => !isTestOrder(e.amount),
        );
        courseReminderPlan.push({
          course: course.slug,
          cohort: target.cohortKey,
          offsetDays: offset,
          recipients: recipients.length,
        });

        if (!sendEnabled) {
          courseRemindersSkipped += recipients.length;
          continue;
        }

        const copy = reminderCopy(offset, course.title);

        for (const person of recipients) {
          // 先寫去重紀錄、再寄信。順序顛倒的話，寄成功但寫失敗會造成重寄；
          // 這個順序最壞情況是漏寄一封，比對學員重複轟炸好。
          const { error: dupErr } = await supabase
            .from("course_reminders")
            .insert({
              course_id: course.slug,
              cohort_key: target.cohortKey,
              registrant_email: person.email,
              offset_days: offset,
            });
          // unique 衝突代表這封已經寄過，正常情況，不是錯誤。
          if (dupErr) continue;

          const result = await sendEmail({
            to: person.email,
            subject: copy.subject,
            react: CourseReminderEmail({
              name: person.name,
              courseTitle: course.title,
              headline: copy.headline,
              whenLabel: copy.whenLabel,
              courseDate: course.date,
              courseTime: course.time,
              location: course.location,
              courseUrl: `${process.env.NEXT_PUBLIC_SITE_URL}${course.detailUrl}`,
              preparationNotice: course.preRegistrationNotice,
            }),
          });

          if (result.success) {
            courseRemindersSent++;
          } else {
            // 寄失敗就把去重紀錄收回，讓明天的 cron 重試。
            courseRemindersFailed++;
            let rollback = supabase
              .from("course_reminders")
              .delete()
              .eq("course_id", course.slug)
              .eq("registrant_email", person.email)
              .eq("offset_days", offset);
            // 必須帶上期別，否則同一人同時報了兩期時會把另一期的紀錄一起刪掉。
            rollback = target.cohortKey
              ? rollback.eq("cohort_key", target.cohortKey)
              : rollback.is("cohort_key", null);
            await rollback;
          }
        }
      }
    }
  }

  return NextResponse.json({
    success: true,
    remindersSent,
    archived: archivedData?.length || 0,
    courseReminders: {
      enabled: sendEnabled,
      sent: courseRemindersSent,
      skipped: courseRemindersSkipped,
      failed: courseRemindersFailed,
      plan: courseReminderPlan,
    },
  });
}
