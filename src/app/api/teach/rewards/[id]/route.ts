import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAssignment } from "@/lib/assignments";
import { getReward } from "@/lib/rewards";
import { requireCourseTeacher } from "@/lib/teaching";

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  // reward → assignment → course → permission. Every hop is read from the row
  // itself, so nothing the caller sends can redirect the check.
  const reward = await getReward(id);
  if (!reward) {
    return NextResponse.json({ error: "找不到這項資源" }, { status: 404 });
  }

  const assignment = await getAssignment(reward.assignment_id);
  if (!assignment) {
    return NextResponse.json({ error: "找不到這項資源" }, { status: 404 });
  }

  const teacher = await requireCourseTeacher(assignment.course_id);
  if (!teacher) {
    return NextResponse.json({ error: "沒有權限" }, { status: 403 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("rewards").delete().eq("id", id);

  if (error) {
    console.error("Reward delete error:", error);
    return NextResponse.json({ error: "刪除失敗" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
