import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { verifyWaitlistToken } from "@/lib/waitlist-token";
import { confirmPage, resultPage } from "@/app/waitlist/result-page";

export const runtime = "nodejs";

const INVALID_TITLE = "連結無效";
const INVALID_BODY =
  "這個退訂連結看起來不完整或已被更動。若你不想再收到通知，直接回信告訴我們也可以。";

/**
 * GET 只渲染確認頁，絕不寫入。企業郵件安全閘道（如 Outlook SafeLinks）會預抓
 * 信中所有連結；若此處直接退訂，使用者根本沒點就被移出名單，且不可逆。
 */
export async function GET(request: NextRequest) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!verifyWaitlistToken(token)) {
    return resultPage(INVALID_TITLE, INVALID_BODY, 400);
  }

  return confirmPage(
    "確認退出名單？",
    "退出後，這門課下次開課時我們不會再通知你。",
    "/waitlist/unsubscribe",
    token,
    "確認退出",
  );
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const token = String(form.get("token") ?? "");

  const id = verifyWaitlistToken(token);
  if (!id) return resultPage(INVALID_TITLE, INVALID_BODY, 400);

  const supabase = createServiceClient();
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("course_waitlist")
    .update({ unsubscribed_at: now, updated_at: now })
    .eq("id", id);

  if (error) {
    console.error("waitlist unsubscribe failed:", error);
    return resultPage("退出失敗", "請稍後再試一次，或直接回信告訴我們。", 500);
  }

  return resultPage(
    "已退出名單",
    "我們不會再寄這門課的開課通知給你。如果哪天改變主意，隨時可以重新登記。",
  );
}
