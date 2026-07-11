import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { head } from "@vercel/blob";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { ARMY_BLOB_PATHNAME, ARMY_DOWNLOAD_FILENAME } from "@/lib/army-kit";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();

  // 沿用 ai-coach-kit／ars 下載 route 的限流慣例：30 次/分鐘/IP。
  const ip = getClientIp(request.headers);
  if (!checkRateLimit(`download-army:${ip}`, { max: 30, windowMs: 60_000 })) {
    return NextResponse.json(
      { error: "請求過於頻繁，請稍後再試" },
      { status: 429 },
    );
  }

  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "缺少下載 token" }, { status: 400 });
  }

  const { data: tokenRecord, error } = await supabase
    .from("download_tokens")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !tokenRecord) {
    return NextResponse.json({ error: "無效的下載連結" }, { status: 404 });
  }

  // Entitlement 一律以 product_id 比對；非本系 token（如 ai-coach-kit、ars）一律 403。
  if (tokenRecord.product_id !== "army-kit") {
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

  if (tokenRecord.download_count >= tokenRecord.max_downloads) {
    return NextResponse.json(
      { error: "已達下載次數上限，請聯繫 iamvista@gmail.com" },
      { status: 429 },
    );
  }

  // Fetch the blob *before* charging a download attempt so a transient
  // upstream error (Blob 5xx, network blip) doesn't burn one of the
  // user's allowed downloads.
  let blob: Awaited<ReturnType<typeof head>>;
  let blobResp: Response;
  try {
    blob = await head(ARMY_BLOB_PATHNAME);
    blobResp = await fetch(blob.url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!blobResp.ok || !blobResp.body) {
      throw new Error(`Blob fetch failed: ${blobResp.status}`);
    }
  } catch (err) {
    console.error("[download/army] blob fetch failed", err);
    return NextResponse.json(
      { error: "檔案暫時無法取得，請聯繫 iamvista@gmail.com" },
      { status: 500 },
    );
  }

  // 原子性次數遞增：靠 SQL WHERE download_count < max_downloads 擋在資料庫層，
  // affected rows（RETURNING 是否有列）判斷放行，避免併發下載衝破上限（比照 download/ars）。
  const { data: incremented, error: incrementError } = await supabase.rpc(
    "increment_download_count",
    { p_token: token },
  );
  if (incrementError) {
    console.error(
      "[download/army] increment_download_count failed",
      incrementError,
    );
    return NextResponse.json(
      { error: "系統錯誤，請聯繫 iamvista@gmail.com" },
      { status: 500 },
    );
  }
  if (!incremented || (Array.isArray(incremented) && incremented.length === 0)) {
    // RPC 回空有兩種可能：已達下載次數上限（429），或 token 在上面 precheck 之後、
    // fetch blob 期間剛好過期（410）。用 precheck 就撈到的 tokenRecord.expires_at
    // 重新判斷一次，不必為此多打一次 DB。
    if (new Date(tokenRecord.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "下載連結已過期，請聯繫 iamvista@gmail.com" },
        { status: 410 },
      );
    }
    return NextResponse.json(
      { error: "已達下載次數上限，請聯繫 iamvista@gmail.com" },
      { status: 429 },
    );
  }

  return new NextResponse(blobResp.body, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${ARMY_DOWNLOAD_FILENAME}"`,
      "Content-Length": String(blob.size),
    },
  });
}
