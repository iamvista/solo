import { NextResponse } from "next/server";
import { findActiveAffiliateByCode } from "@/lib/affiliates";
import { getCourseConfig } from "@/lib/courses-config";

export const runtime = "nodejs";

/**
 * 公開：驗證推薦碼對某課程是否有效，並回傳可享的折扣金額。
 * 只回傳 { valid, discount }，不洩漏夥伴資訊。供報名表單即時顯示折扣用。
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code")?.trim() ?? "";
  const courseSlug = url.searchParams.get("course")?.trim() ?? "";

  if (!code || !courseSlug) {
    return NextResponse.json({ valid: false, discount: 0 });
  }

  const course = getCourseConfig(courseSlug);
  if (!course) {
    return NextResponse.json({ valid: false, discount: 0 });
  }

  const affiliate = await findActiveAffiliateByCode(code, courseSlug);
  const valid = !!affiliate;
  const discount = valid ? course.referralDiscount ?? 0 : 0;

  return NextResponse.json(
    { valid, discount },
    { headers: { "Cache-Control": "no-store" } },
  );
}
