import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { checkRateLimit, getClientIp } from "@/lib/newsletter/rate-limit";
import { verifyUnsubscribeToken } from "@/lib/newsletter/token";

export async function POST(request: Request) {
  try {
    // Rate limit: 10 requests per IP per minute
    const ip = getClientIp(request);
    if (!checkRateLimit(`unsubscribe:${ip}`, { maxRequests: 10, windowMs: 60_000 })) {
      return NextResponse.json({ error: "請求過於頻繁，請稍後再試" }, { status: 429 });
    }

    const supabase = createServiceClient();
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Email 與 token 為必填" }, { status: 400 });
    }

    // Require HMAC token: same authorization as the GET unsubscribe link.
    // Without this, anyone who knows an email could mass-unsubscribe.
    if (!verifyUnsubscribeToken(email, token)) {
      return NextResponse.json({ error: "連結無效或已過期" }, { status: 403 });
    }

    await supabase
      .from("newsletter_subscribers")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("email", email.toLowerCase().trim())
      .eq("status", "active");

    // 無論成功失敗都回傳成功（避免洩漏 email 是否存在）
    return NextResponse.json({ success: true, message: "已取消訂閱" });
  } catch (err) {
    console.error("Unsubscribe API error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

// GET：用於 email 中的取消訂閱連結（需 HMAC token 防 CSRF）
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email || !token) {
    return new Response("缺少必要參數", { status: 400 });
  }

  // 驗證 HMAC token
  if (!verifyUnsubscribeToken(email, token)) {
    return new Response("連結無效或已過期", { status: 403 });
  }

  // Rate limit
  const ip = getClientIp(request);
  if (!checkRateLimit(`unsubscribe-get:${ip}`, { maxRequests: 10, windowMs: 60_000 })) {
    return new Response("請求過於頻繁", { status: 429 });
  }

  const supabase = createServiceClient();
  await supabase
    .from("newsletter_subscribers")
    .update({
      status: "unsubscribed",
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("email", email.toLowerCase().trim())
    .eq("status", "active");

  // 重導到首頁帶感謝訊息
  return NextResponse.redirect(new URL("/?unsubscribed=true", request.url));
}
