import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    const { email, name, source, tags, metadata } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email 為必填" }, { status: 400 });
    }

    // 簡易 email 格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email 格式不正確" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 檢查是否已存在（包含已取消訂閱的）
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existing) {
      if (existing.status === "active") {
        // 已經訂閱中，回傳成功（不洩漏資訊）
        return NextResponse.json({ success: true, message: "已訂閱" });
      }

      // 重新啟用已取消的訂閱
      await supabase
        .from("newsletter_subscribers")
        .update({
          status: "active",
          unsubscribed_at: null,
          subscribed_at: new Date().toISOString(),
          ...(tags ? { tags } : {}),
        })
        .eq("id", existing.id);

      return NextResponse.json({ success: true, message: "重新訂閱成功" });
    }

    // 新訂閱
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: normalizedEmail,
      name: name || null,
      source: source || "website",
      tags: tags || [],
      metadata: metadata || {},
    });

    if (error) {
      console.error("Newsletter subscribe error:", error);
      return NextResponse.json({ error: "訂閱失敗，請稍後再試" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "訂閱成功" });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
