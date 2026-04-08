import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { readFile } from "fs/promises";
import path from "path";

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

  const zipPath = path.join(process.cwd(), "private", "ai-coach-kit.zip");

  try {
    const fileBuffer = await readFile(zipPath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="ai-coach-kit.zip"',
        "Content-Length": String(fileBuffer.length),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "檔案不存在，請聯繫 support@solo.tw" },
      { status: 500 }
    );
  }
}
