import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { checkRateLimit, getClientIp } from "@/lib/newsletter/rate-limit";

export async function POST(request: Request) {
  try {
    // Rate limit: 5 requests per IP per minute
    const ip = getClientIp(request);
    if (!checkRateLimit(`subscribe:${ip}`, { maxRequests: 5, windowMs: 60_000 })) {
      return NextResponse.json({ error: "請求過於頻繁，請稍後再試" }, { status: 429 });
    }

    const supabase = createServiceClient();
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email 為必填" }, { status: 400 });
    }

    // 簡易 email 格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email 格式不正確" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 驗證並限制輸入欄位
    const safeName = typeof body.name === "string" ? body.name.trim().slice(0, 100) : null;
    const safeSource = typeof body.source === "string" ? body.source.trim().slice(0, 50) : "website";
    const safeTags = Array.isArray(body.tags)
      ? body.tags.filter((t: unknown) => typeof t === "string").slice(0, 5).map((t: string) => t.slice(0, 30))
      : [];
    const safeMetadata = {
      referrer: typeof body.metadata?.referrer === "string" ? body.metadata.referrer.slice(0, 500) : "",
      url: typeof body.metadata?.url === "string" ? body.metadata.url.slice(0, 500) : "",
    };

    // 檢查是否已存在（包含已取消訂閱的）
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existing) {
      if (existing.status === "active") {
        // 統一回應訊息，避免 email 枚舉
        return NextResponse.json({ success: true, message: "訂閱成功" });
      }

      // 重新啟用已取消的訂閱
      await supabase
        .from("newsletter_subscribers")
        .update({
          status: "active",
          unsubscribed_at: null,
          subscribed_at: new Date().toISOString(),
          ...(safeTags.length > 0 ? { tags: safeTags } : {}),
        })
        .eq("id", existing.id);

      return NextResponse.json({ success: true, message: "訂閱成功" });
    }

    // 新訂閱
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: normalizedEmail,
      name: safeName,
      source: safeSource,
      tags: safeTags,
      metadata: safeMetadata,
    });

    if (error) {
      console.error("Newsletter subscribe error:", error);
      return NextResponse.json({ error: "訂閱失敗，請稍後再試" }, { status: 500 });
    }

    // Do NOT leak the unsubscribe HMAC token in the subscribe response.
    // Anyone who can POST to /api/newsletter/subscribe could otherwise
    // request the deterministic token for any never-before-seen email and
    // permanently retain the ability to unsubscribe that email. The token
    // belongs in the per-email link Vista sends out via Resend.
    return NextResponse.json({ success: true, message: "訂閱成功" });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
