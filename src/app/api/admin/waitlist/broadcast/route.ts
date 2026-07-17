import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/supabase/admin";
import { sendBatchEmails } from "@/lib/email";
import { generateWaitlistToken } from "@/lib/waitlist-token";
import { CohortAnnouncementEmail } from "@/components/emails/cohort-announcement";
import { fetchWaitlist, type WaitlistFilters, type WaitlistRow } from "@/lib/waitlist-query";
import { workshops } from "@/lib/workshops";

export const runtime = "nodejs";

/** Resend batch API 的上限。 */
const BATCH_SIZE = 100;

interface BroadcastBody {
  filters?: WaitlistFilters;
  cohortDate?: string;
  enrolUrl?: string;
  note?: string;
  /** 未帶 confirm 時只回傳收件人數，不寄信。 */
  confirm?: boolean;
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: BroadcastBody;
  try {
    body = (await request.json()) as BroadcastBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const filters = body.filters ?? {};

  // 一則公告只帶一個梯次日期與一條報名連結，但每封信的標題用的是收件人自己的
  // 課程名稱。跨課程寄出時，非目標課程的每個人都會收到自己的課名配上別堂課的
  // 日期與連結。信寄出去收不回來，所以這裡擋在算人數之前。
  if (!filters.course) {
    return NextResponse.json(
      { error: "廣播必須指定課程：一則公告只帶一個梯次日期與報名連結，跨課程寄出會讓其他課的候補者收到錯誤資訊。" },
      { status: 400 },
    );
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // 已退訂者一律排除，不論篩選條件為何
  const { rows, error } = await fetchWaitlist(supabase, filters, {
    excludeUnsubscribed: true,
    limit: 5000,
  });
  if (error) return NextResponse.json({ error }, { status: 500 });

  // 預覽：只回人數，讓後臺顯示「即將寄給 N 人」並要求二次確認
  if (!body.confirm) {
    return NextResponse.json({ recipientCount: rows.length, sent: 0, failed: 0 });
  }

  const cohortDate = (body.cohortDate ?? "").trim();
  const enrolUrl = (body.enrolUrl ?? "").trim();
  if (!cohortDate || !enrolUrl) {
    return NextResponse.json(
      { error: "請填寫梯次日期與報名連結" },
      { status: 400 },
    );
  }
  if (rows.length === 0) {
    return NextResponse.json({ recipientCount: 0, sent: 0, failed: 0 });
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://www.solo.tw";
  const titleOf = (slug: string) =>
    workshops.find((w) => w.id === slug)?.title ?? slug;

  const render = (r: WaitlistRow) => ({
    to: r.email,
    subject: `《${titleOf(r.course_slug)}》新梯次開課：${cohortDate}`,
    react: CohortAnnouncementEmail({
      name: r.name,
      courseTitle: titleOf(r.course_slug),
      cohortDate,
      enrolUrl,
      note: body.note?.trim() || undefined,
      unsubscribeUrl: `${base}/waitlist/unsubscribe?token=${generateWaitlistToken(r.id)}`,
    }),
  });

  let sent = 0;
  let failed = 0;

  // Resend 的 batch API 只回報整批的成敗，沒有逐一收件人的結果。
  // 因此只有「整批無誤」的批次才寫 notified_at，失敗批次留待重試。
  for (const group of chunk(rows, BATCH_SIZE)) {
    const result = await sendBatchEmails(group.map(render));

    if (result.error || result.failed > 0) {
      failed += group.length;
      console.error("cohort broadcast batch failed:", result.error);
      continue;
    }

    const { error: markError } = await supabase
      .from("course_waitlist")
      .update({ notified_at: new Date().toISOString() })
      .in(
        "id",
        group.map((r) => r.id),
      );

    if (markError) {
      // 信已寄出，但 notified_at 沒寫進去。回報為成功（使用者確實收到信），
      // 只把寫入失敗記進 log，避免操作者重寄造成收件人收到兩封。
      console.error("cohort broadcast notified_at update failed:", markError);
    }
    sent += group.length;
  }

  return NextResponse.json({ recipientCount: rows.length, sent, failed });
}
