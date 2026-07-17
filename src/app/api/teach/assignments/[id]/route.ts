import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAssignment } from "@/lib/assignments";
import { requireCourseTeacher } from "@/lib/teaching";
import { parseAssignmentInput } from "../route";

/**
 * Load an assignment and confirm the caller teaches the course that owns it.
 * The course is read from the assignment, never from the request.
 */
async function authorize(assignmentId: string) {
  const assignment = await getAssignment(assignmentId);
  if (!assignment) return { ok: false as const, status: 404 as const };

  const teacher = await requireCourseTeacher(assignment.course_id);
  if (!teacher) return { ok: false as const, status: 403 as const };

  return { ok: true as const, assignment };
}

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const auth = await authorize(id);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.status === 404 ? "找不到這份作業" : "沒有權限" },
      { status: auth.status },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "格式錯誤" }, { status: 400 });
  }

  const parsed = parseAssignmentInput(body, auth.assignment.course_id);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("assignments")
    .update({ ...parsed.value, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Assignment update error:", error);
    return NextResponse.json({ error: "儲存失敗" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const auth = await authorize(id);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.status === 404 ? "找不到這份作業" : "沒有權限" },
      { status: auth.status },
    );
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("assignments").delete().eq("id", id);

  if (error) {
    console.error("Assignment delete error:", error);
    return NextResponse.json({ error: "刪除失敗" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
