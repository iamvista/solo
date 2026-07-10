import { NextRequest, after } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  validateWaitlistPayload,
  isHoneypotTriggered,
  type CleanWaitlist,
} from "@/lib/waitlist";
import { generateWaitlistToken } from "@/lib/waitlist-token";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { WaitlistConfirmEmail } from "@/components/emails/waitlist-confirm";
import { workshops } from "@/lib/workshops";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

/** 確認信：best-effort。寄失敗只記 log，名單已經寫進去了，不該讓使用者看到錯誤。 */
async function sendConfirmation(id: string, data: CleanWaitlist) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "https://www.solo.tw";
    const token = generateWaitlistToken(id);
    const courseTitle =
      workshops.find((w) => w.id === data.course_slug)?.title ??
      data.course_slug;

    await sendEmail({
      to: data.email,
      subject: `《${courseTitle}》開課通知已為你登記`,
      react: WaitlistConfirmEmail({
        name: data.name,
        courseTitle,
        intent: data.intent,
        preferenceUrlBase: `${base}/waitlist/preference?token=${token}`,
        unsubscribeUrl: `${base}/waitlist/unsubscribe?token=${token}`,
      }),
    });
  } catch (e) {
    console.error("waitlist confirmation email failed:", e);
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (!checkRateLimit(ip, { max: 10, windowMs: 60_000 })) {
    return json({ ok: false, error: "請求過於頻繁，請稍後再試" }, 429);
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  // 機器人：回傳與正常提交無異的成功回應，不寫入、不寄信、不揭露偵測邏輯
  if (isHoneypotTriggered(raw)) return json({ ok: true });

  const v = validateWaitlistPayload(raw);
  if (!v.ok) return json({ ok: false, error: v.error }, 400);
  const data = v.value;

  const supabase = createServiceClient();

  // 走 RPC 而非 .upsert()：衝突時 intent 不覆寫、utm_* 僅補空值，
  // 這種逐欄條件在 supabase-js 的 upsert 無法表達。
  const { data: rowId, error } = await supabase.rpc("upsert_course_waitlist", {
    p_course_slug: data.course_slug,
    p_name: data.name,
    p_email: data.email,
    p_intent: data.intent,
    p_instructor_slug: data.instructor_slug,
    p_phone: data.phone,
    p_source_page: data.source_page,
    p_utm_source: data.utm_source,
    p_utm_medium: data.utm_medium,
    p_utm_campaign: data.utm_campaign,
    p_utm_content: data.utm_content,
  });

  if (error || !rowId) {
    console.error("waitlist upsert error:", error);
    return json({ ok: false, error: "儲存失敗，請稍後再試" }, 500);
  }

  // 同步進電子報池（best-effort，失敗不影響候補成功）
  // newsletter_subscribers.email 只有 partial unique index (WHERE status='active')，
  // 不支援 onConflict:"email" upsert → 改用 check-then-insert，鏡像 /api/newsletter/subscribe
  try {
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", data.email)
      .maybeSingle();

    if (!existing) {
      await supabase.from("newsletter_subscribers").insert({
        email: data.email,
        name: data.name,
        status: "active",
        source: "waitlist",
        tags: [`waitlist:${data.course_slug}`],
      });
    }
  } catch (e) {
    console.error("waitlist newsletter sync failed:", e);
  }

  after(() => sendConfirmation(rowId as string, data));

  return json({ ok: true });
}
