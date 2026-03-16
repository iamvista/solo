import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { EXP_REWARDS, type ExpAction } from "@/lib/leveling";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "未登入" }, { status: 401 });
    }

    const { action } = await request.json() as { action: string };

    if (!action || !(action in EXP_REWARDS)) {
      return NextResponse.json({ error: "無效的操作" }, { status: 400 });
    }

    const expAmount = EXP_REWARDS[action as ExpAction];

    // Check for duplicate: don't grant same one-time action twice
    const oneTimeActions = ["set_username", "upload_avatar", "write_bio", "first_event_registration"];
    if (oneTimeActions.includes(action)) {
      const { data: existing } = await supabase
        .from("exp_events")
        .select("id")
        .eq("user_id", user.id)
        .eq("action", action)
        .limit(1)
        .single();

      if (existing) {
        return NextResponse.json({ error: "已獲得此獎勵", duplicate: true });
      }
    }

    const { data, error } = await supabase.rpc("grant_exp", {
      target_user_id: user.id,
      exp_amount: expAmount,
      action_name: action,
    });

    if (error) {
      console.error("Grant EXP error:", error);
      return NextResponse.json({ error: "發放 EXP 失敗" }, { status: 500 });
    }

    const result = data?.[0] || data;

    return NextResponse.json({
      success: true,
      exp_gained: expAmount,
      new_exp: result?.new_exp,
      new_level: result?.new_level,
      leveled_up: result?.leveled_up,
    });
  } catch {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
