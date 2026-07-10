import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isArsBundle, isArsVertical, type ArsBundle } from "@/lib/ars-bundles";

// 只有 grad／faculty／addon-vertical 三個 bundle 需要（也允許）事後自選學科垂直：
// clinician 在 webhook fulfilment 時就已鎖定 chosen_vertical="medical"；
// allaccess 本來就拿全部 vertical，不需要選；其餘非 ARS token（如 ai-coach-kit）不適用。
const VERTICAL_SELECTABLE_BUNDLES: ArsBundle[] = ["grad", "faculty", "addon-vertical"];

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();

  let body: { token?: string; vertical?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "請求格式錯誤" }, { status: 400 });
  }

  const { token, vertical } = body;
  if (!token) {
    return NextResponse.json({ error: "缺少下載 token" }, { status: 400 });
  }
  if (!isArsVertical(vertical)) {
    return NextResponse.json({ error: "不支援的學科垂直" }, { status: 400 });
  }

  const { data: tokenRecord, error } = await supabase
    .from("download_tokens")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !tokenRecord) {
    return NextResponse.json({ error: "無效的下載連結" }, { status: 404 });
  }

  // Entitlement：非 ARS token，或 bundle 不允許事後自選垂直（clinician 已在 fulfilment
  // 時鎖定、allaccess 本就拿全部 vertical）一律 403，杜絕越權猜 token 呼叫此 route。
  if (
    !isArsBundle(tokenRecord.product_id) ||
    !VERTICAL_SELECTABLE_BUNDLES.includes(tokenRecord.product_id)
  ) {
    return NextResponse.json(
      { error: "此下載連結不適用於本項目" },
      { status: 403 },
    );
  }

  if (new Date(tokenRecord.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "下載連結已過期，請聯繫 iamvista@gmail.com" },
      { status: 410 },
    );
  }

  // 已鎖定：回既有值，不重選（比對 DB 現值，避免先讀後寫的競態）。
  if (tokenRecord.chosen_vertical) {
    return NextResponse.json({ ok: true, vertical: tokenRecord.chosen_vertical });
  }

  // 原子性一次性鎖定：WHERE chosen_vertical IS NULL 擋在資料庫層，
  // affected rows 判斷成敗，杜絕連點或並發雙寫的競態。
  const { data: updated, error: rpcError } = await supabase.rpc(
    "select_ars_vertical",
    { p_token: token, p_vertical: vertical },
  );
  if (rpcError) {
    console.error("[download/ars/select-vertical] rpc failed", rpcError);
    return NextResponse.json({ error: "系統錯誤，請稍後再試" }, { status: 500 });
  }

  const updatedRow = Array.isArray(updated) ? updated[0] : updated;
  if (!updatedRow) {
    // 已被別的並發請求搶先鎖定：回讀現值，不覆寫。
    const { data: latest } = await supabase
      .from("download_tokens")
      .select("chosen_vertical")
      .eq("token", token)
      .maybeSingle();
    return NextResponse.json({ ok: true, vertical: latest?.chosen_vertical ?? null });
  }

  return NextResponse.json({ ok: true, vertical: updatedRow.chosen_vertical });
}
