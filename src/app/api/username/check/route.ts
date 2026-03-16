import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;
const USERNAME_INVALID_START = /^[0-9_]/;
const USERNAME_DOUBLE_UNDERSCORE = /__/;

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.toLowerCase().trim();

  if (!username) {
    return NextResponse.json({ available: false, reason: "請輸入使用者名稱" }, { status: 400 });
  }

  // Format validation
  if (!USERNAME_REGEX.test(username)) {
    return NextResponse.json({
      available: false,
      reason: "使用者名稱須為 3-20 字元，僅限小寫英文、數字和底線",
    });
  }

  if (USERNAME_INVALID_START.test(username)) {
    return NextResponse.json({
      available: false,
      reason: "使用者名稱不能以數字或底線開頭",
    });
  }

  if (USERNAME_DOUBLE_UNDERSCORE.test(username)) {
    return NextResponse.json({
      available: false,
      reason: "使用者名稱不能包含連續底線",
    });
  }

  try {
    const supabase = await createClient();

    // Check reserved usernames
    const { data: reserved } = await supabase
      .from("reserved_usernames")
      .select("username")
      .eq("username", username)
      .single();

    if (reserved) {
      return NextResponse.json({ available: false, reason: "此名稱已被保留" });
    }

    // Check existing profiles
    const { data: existing } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single();

    if (existing) {
      return NextResponse.json({ available: false, reason: "此名稱已被使用" });
    }

    return NextResponse.json({ available: true, reason: null });
  } catch {
    return NextResponse.json({ available: false, reason: "檢查失敗，請稍後再試" }, { status: 500 });
  }
}
