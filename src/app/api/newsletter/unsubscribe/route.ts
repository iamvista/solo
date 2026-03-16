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
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email 為必填" }, { status: 400 });
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("email", email.toLowerCase().trim())
      .eq("status", "active");

    if (error) {
      console.error("Unsubscribe error:", error);
    }

    // 無論成功失敗都回傳成功（避免洩漏 email 是否存在）
    return NextResponse.json({ success: true, message: "已取消訂閱" });
  } catch (err) {
    console.error("Unsubscribe API error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}

// GET 也支援（方便在 email 中加入取消連結）
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return new Response("Missing email parameter", { status: 400 });
  }

  const supabase = getSupabase();
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
