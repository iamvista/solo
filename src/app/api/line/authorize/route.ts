import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

const LINE_CHANNEL_ID = process.env.LINE_LOGIN_CHANNEL_ID;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.solo.tw"}/api/line/callback`;

// GET: Redirect user to LINE Login
export async function GET() {
  if (!LINE_CHANNEL_ID) {
    return NextResponse.json({ error: "LINE Login 尚未設定" }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_SITE_URL));
  }

  // Generate state for CSRF protection
  const state = randomUUID();
  await supabase.from("line_login_states").insert({
    state,
    user_id: user.id,
    redirect_url: "/settings",
  });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: LINE_CHANNEL_ID,
    redirect_uri: REDIRECT_URI,
    state,
    scope: "profile openid",
    bot_prompt: "aggressive", // prompt user to add official account
  });

  return NextResponse.redirect(`https://access.line.me/oauth2/v2.1/authorize?${params}`);
}
