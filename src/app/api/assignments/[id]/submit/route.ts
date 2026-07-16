import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getVerifiedStudent } from "@/lib/assignment-access";
import { getAssignment } from "@/lib/assignments";

interface IncomingFile {
  path: string;
  filename: string;
  size_bytes: number;
  mime_type?: string | null;
}

function parseFiles(raw: unknown): IncomingFile[] | null {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) return null;

  const files: IncomingFile[] = [];
  for (const entry of raw) {
    const f = entry as Partial<IncomingFile>;
    if (
      typeof f?.path !== "string" ||
      !f.path ||
      typeof f?.filename !== "string" ||
      !f.filename ||
      typeof f?.size_bytes !== "number" ||
      !Number.isFinite(f.size_bytes) ||
      f.size_bytes < 0
    ) {
      return null;
    }
    files.push({
      path: f.path,
      filename: f.filename,
      size_bytes: f.size_bytes,
      mime_type: typeof f.mime_type === "string" ? f.mime_type : null,
    });
  }
  return files;
}

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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "格式錯誤" }, { status: 400 });
  }

  const payload = body as {
    text_content?: unknown;
    link_url?: unknown;
    files?: unknown;
  } | null;

  const textContent = String(payload?.text_content ?? "").trim() || null;
  const linkUrl = String(payload?.link_url ?? "").trim() || null;
  const files = parseFiles(payload?.files);

  if (files === null) {
    return NextResponse.json({ error: "附件格式錯誤" }, { status: 400 });
  }

  // Reject content submitted in a form this assignment does not accept, rather
  // than silently dropping it — a student who typed an essay into a
  // link-only assignment deserves to be told, not to have it vanish.
  if (textContent && !assignment.allow_text) {
    return NextResponse.json({ error: "這份作業不收文字內容" }, { status: 400 });
  }
  if (linkUrl && !assignment.allow_link) {
    return NextResponse.json({ error: "這份作業不收連結" }, { status: 400 });
  }
  if (files.length > 0 && !assignment.allow_file) {
    return NextResponse.json({ error: "這份作業不收檔案" }, { status: 400 });
  }

  if (!textContent && !linkUrl && files.length === 0) {
    return NextResponse.json({ error: "請至少填寫一項內容" }, { status: 400 });
  }

  // Files must live under this assignment's own prefix. Without this check a
  // student could name any key in the bucket — including another student's
  // upload — and have it attached to their own submission, which would then
  // hand them a signed URL for it.
  const prefix = `${assignment.course_id}/${assignment.id}/`;
  if (files.some((f) => !f.path.startsWith(prefix))) {
    return NextResponse.json({ error: "附件路徑不正確" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const now = new Date().toISOString();

  // Resubmission updates in place: one row per (assignment, student), no
  // version history. The teacher's review columns are deliberately absent from
  // this payload so a resubmission never clears an existing comment.
  const { data: submission, error: submitError } = await supabase
    .from("submissions")
    .upsert(
      {
        assignment_id: assignment.id,
        student_email: student.email,
        text_content: textContent,
        link_url: linkUrl,
        updated_at: now,
      },
      { onConflict: "assignment_id,student_email" },
    )
    .select("id")
    .maybeSingle();

  if (submitError || !submission) {
    console.error("Submission upsert error:", submitError);
    return NextResponse.json({ error: "繳交失敗，請再試一次" }, { status: 500 });
  }

  // Attachments are replaced wholesale so the stored set always matches what
  // the student last submitted. Orphaned objects stay in the bucket by design;
  // see design.md 失敗模式.
  await supabase.from("submission_files").delete().eq("submission_id", submission.id);

  if (files.length > 0) {
    const { error: filesError } = await supabase.from("submission_files").insert(
      files.map((f) => ({
        submission_id: submission.id,
        storage_path: f.path,
        filename: f.filename,
        size_bytes: f.size_bytes,
        mime_type: f.mime_type,
      })),
    );
    if (filesError) {
      console.error("Submission files insert error:", filesError);
      return NextResponse.json({ error: "附件儲存失敗" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, submissionId: submission.id });
}
