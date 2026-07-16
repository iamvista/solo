import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getSubmissionCourse, requireCourseTeacher } from "@/lib/teaching";

/**
 * Record a teacher's comment on a submission.
 *
 * Review is the ONLY way these columns are ever written: the student submit
 * route deliberately omits them, so a resubmission cannot clear a comment and
 * a student cannot write one for themselves.
 *
 * Reviewing has no effect on reward access — rewards unlock on submission, so
 * a student is never left waiting on the teacher.
 */
export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  // Resolve the owning course from the submission itself, then check permission
  // against that. Taking a course id from the caller would let any teacher name
  // their own course and review someone else's students.
  const owner = await getSubmissionCourse(id);
  if (!owner) {
    return NextResponse.json({ error: "找不到這筆繳交" }, { status: 404 });
  }

  const teacher = await requireCourseTeacher(owner.courseId);
  if (!teacher) {
    return NextResponse.json({ error: "沒有權限" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "格式錯誤" }, { status: 400 });
  }

  const comment = String((body as { comment?: unknown })?.comment ?? "").trim();
  if (!comment) {
    return NextResponse.json({ error: "請填寫評語" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("submissions")
    .update({
      teacher_comment: comment,
      reviewed_at: new Date().toISOString(),
      reviewed_by: teacher.id,
    })
    .eq("id", id);

  if (error) {
    console.error("Review update error:", error);
    return NextResponse.json({ error: "儲存失敗，請再試一次" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
