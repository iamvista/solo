import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { verifyWaitlistToken } from "@/lib/waitlist-token";
import { WAITLIST_TIMESLOTS } from "@/lib/waitlist-timeslots";
import { resultPage } from "@/app/waitlist/result-page";

export const runtime = "nodejs";

/**
 * 刻意允許 GET 直接寫入。企業郵件安全閘道會預抓信中連結，此處被預抓的後果
 * 只是填了一個可被使用者再次點擊覆寫的時段偏好，損害極低，不值得多收一次
 * 點擊。退訂則相反，見 ../unsubscribe/route.ts。
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? "";
  const slot = searchParams.get("slot") ?? "";

  const id = verifyWaitlistToken(token);
  if (!id) {
    return resultPage(
      "連結無效",
      "這個連結看起來不完整或已被更動，請直接回信告訴我們你方便的時段。",
      400,
    );
  }

  if (!(WAITLIST_TIMESLOTS as readonly string[]).includes(slot)) {
    return resultPage(
      "選項無效",
      "這個時段選項我們不認得，請回到信件重新點選。",
      400,
    );
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("course_waitlist")
    .update({ preferred_timeslot: slot, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("waitlist preference update failed:", error);
    return resultPage("儲存失敗", "請稍後再點一次，或直接回信告訴我們。", 500);
  }

  return resultPage(
    "收到了，謝謝你",
    "我們排下一梯時會把你的時段偏好算進去。想改隨時回信件再點另一個選項就好。",
  );
}
