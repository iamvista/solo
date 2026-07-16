import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { getVerifiedStudent } from "@/lib/assignment-access";
import {
  SUBMISSIONS_BUCKET,
  getAssignment,
  submissionStoragePath,
} from "@/lib/assignments";

/**
 * Issue a signed URL the browser uses to PUT a file straight into private
 * storage.
 *
 * The bytes deliberately never traverse this handler: Vercel caps a route
 * handler's request body at 4.5MB, which would silently become the maximum
 * attachment size. The bucket carries no policies, so a server-signed URL is
 * the only way in.
 */
export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const assignment = await getAssignment(id);
  if (!assignment || !assignment.is_published) {
    return NextResponse.json({ error: "找不到這份作業" }, { status: 404 });
  }

  const student = await getVerifiedStudent(assignment.course_id);
  if (!student) {
    return NextResponse.json({ error: "請先取得作業區入口連結" }, { status: 401 });
  }

  if (!assignment.allow_file) {
    return NextResponse.json(
      { error: "這份作業不收檔案" },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "格式錯誤" }, { status: 400 });
  }

  const filename = String((body as { filename?: unknown })?.filename ?? "");
  if (!filename) {
    return NextResponse.json({ error: "缺少檔名" }, { status: 400 });
  }

  const path = submissionStoragePath(
    assignment.course_id,
    assignment.id,
    randomBytes(8).toString("hex"),
    filename,
  );

  const supabase = createServiceClient();
  const { data, error } = await supabase.storage
    .from(SUBMISSIONS_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    console.error("Signed upload URL error:", error);
    return NextResponse.json({ error: "無法建立上傳連結" }, { status: 500 });
  }

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path,
  });
}
