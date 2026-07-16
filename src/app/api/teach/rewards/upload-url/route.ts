import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { SUBMISSIONS_BUCKET, getAssignment, safeFilename } from "@/lib/assignments";
import { requireCourseTeacher } from "@/lib/teaching";

/**
 * Issue a signed URL for a teacher to upload a handout straight into private
 * storage.
 *
 * Deliberately separate from the student upload route despite the near-identical
 * shape: the two authorize against entirely different things (a course_teachers
 * mapping vs. a signed session cookie). Folding both into one handler would put
 * two authorization models in one place, which is exactly where a hole gets
 * written. Similar is not the same as shared.
 *
 * Handouts are keyed under `rewards/` so they never collide with, or get
 * mistaken for, a student's submitted work.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "格式錯誤" }, { status: 400 });
  }

  const b = body as { assignment_id?: unknown; filename?: unknown };
  const assignmentId = String(b?.assignment_id ?? "");
  const filename = String(b?.filename ?? "");

  if (!filename) {
    return NextResponse.json({ error: "缺少檔名" }, { status: 400 });
  }

  // The course is read from the assignment, never from the request, so a
  // teacher cannot name their own course to upload against someone else's.
  const assignment = await getAssignment(assignmentId);
  if (!assignment) {
    return NextResponse.json({ error: "找不到這份作業" }, { status: 404 });
  }

  const teacher = await requireCourseTeacher(assignment.course_id);
  if (!teacher) {
    return NextResponse.json({ error: "沒有權限" }, { status: 403 });
  }

  const path = `rewards/${assignment.course_id}/${randomBytes(8).toString("hex")}-${safeFilename(filename)}`;

  const supabase = createServiceClient();
  const { data, error } = await supabase.storage
    .from(SUBMISSIONS_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    console.error("Reward upload URL error:", error);
    return NextResponse.json({ error: "無法建立上傳連結" }, { status: 500 });
  }

  return NextResponse.json({ signedUrl: data.signedUrl, token: data.token, path });
}
