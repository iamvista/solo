import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const LINE_CHANNEL_ID = process.env.LINE_LOGIN_CHANNEL_ID;
const LINE_CHANNEL_SECRET = process.env.LINE_LOGIN_CHANNEL_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.solo.tw"}/api/line/callback`;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.solo.tw";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code || !state) {
    return NextResponse.redirect(`${BASE_URL}/settings?line=error`);
  }

  if (!LINE_CHANNEL_ID || !LINE_CHANNEL_SECRET) {
    return NextResponse.redirect(`${BASE_URL}/settings?line=config_error`);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${BASE_URL}/auth/login`);
  }

  // Verify state (CSRF protection)
  const { data: stateRecord } = await supabase
    .from("line_login_states")
    .select("user_id, redirect_url")
    .eq("state", state)
    .single();

  if (!stateRecord || stateRecord.user_id !== user.id) {
    return NextResponse.redirect(`${BASE_URL}/settings?line=invalid_state`);
  }

  // Clean up used state
  await supabase.from("line_login_states").delete().eq("state", state);

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: LINE_CHANNEL_ID,
        client_secret: LINE_CHANNEL_SECRET,
      }),
    });

    if (!tokenRes.ok) {
      console.error("LINE token error:", await tokenRes.text());
      return NextResponse.redirect(`${BASE_URL}/settings?line=token_error`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Get LINE profile
    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      return NextResponse.redirect(`${BASE_URL}/settings?line=profile_error`);
    }

    const lineProfile = await profileRes.json();

    // Save to profile
    await supabase
      .from("profiles")
      .update({
        line_uid: lineProfile.userId,
        line_display_name: lineProfile.displayName || null,
        line_picture_url: lineProfile.pictureUrl || null,
        line_linked_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    return NextResponse.redirect(`${BASE_URL}${stateRecord.redirect_url || "/settings"}?line=success`);
  } catch (err) {
    console.error("LINE callback error:", err);
    return NextResponse.redirect(`${BASE_URL}/settings?line=error`);
  }
}
