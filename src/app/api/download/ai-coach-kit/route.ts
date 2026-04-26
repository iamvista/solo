import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { head } from "@vercel/blob";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
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

  if (new Date(tokenRecord.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "下載連結已過期，請聯繫 support@solo.tw" },
      { status: 410 }
    );
  }

  if (tokenRecord.download_count >= tokenRecord.max_downloads) {
    return NextResponse.json(
      { error: "已達下載次數上限，請聯繫 support@solo.tw" },
      { status: 429 }
    );
  }

  await supabase
    .from("download_tokens")
    .update({ download_count: tokenRecord.download_count + 1 })
    .eq("id", tokenRecord.id);

  try {
    const blob = await head("products/ai-coach-kit.zip");
    const blobResp = await fetch(blob.url, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!blobResp.ok || !blobResp.body) {
      throw new Error(`Blob fetch failed: ${blobResp.status}`);
    }
    return new NextResponse(blobResp.body, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="ai-coach-kit.zip"',
        "Content-Length": String(blob.size),
      },
    });
  } catch (err) {
    console.error("[download] blob fetch failed", err);
    return NextResponse.json(
      { error: "檔案暫時無法取得，請聯繫 support@solo.tw" },
      { status: 500 }
    );
  }
}
