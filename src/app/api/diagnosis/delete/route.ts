import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 驗證用戶身份
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "未登入" },
        { status: 401 }
      );
    }

    const { diagnosisIds } = await request.json();

    if (!diagnosisIds || !Array.isArray(diagnosisIds) || diagnosisIds.length === 0) {
      return NextResponse.json(
        { error: "請提供要刪除的診斷 ID" },
        { status: 400 }
      );
    }

    // 軟刪除：更新 is_deleted 和 deleted_at
    const { error } = await supabase
      .from("diagnosis_results")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .in("id", diagnosisIds);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { error: "刪除失敗" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `已刪除 ${diagnosisIds.length} 筆診斷紀錄`,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "伺服器錯誤" },
      { status: 500 }
    );
  }
}
