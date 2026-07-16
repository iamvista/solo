import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getCourseConfig } from "@/lib/courses-config";
import { getAssignment } from "@/lib/assignments";
import { listEligibleStudents } from "@/lib/assignment-access";
import { requireCourseTeacher } from "@/lib/teaching";
import { sendBatchEmails } from "@/lib/email";
import { AssignmentPublishedEmail } from "@/components/emails/assignment-published";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.solo.tw";

/** Resend's batch endpoint takes at most 100 per call. */
const BATCH_SIZE = 100;

/**
 * Mail every eligible student about a published assignment.
 *
 * This is the ONLY path in the system that mails students about an assignment.
 * Creating, publishing, or editing an assignment sends nothing: mail cannot be
 * recalled, and a teacher fixing a typo must not mail the whole class again.
 * Saving is not an outward-facing act.
 */
export async function POST(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const assignment = await getAssignment(id);
  if (!assignment) {
    return NextResponse.json({ error: "找不到這份作業" }, { status: 404 });
  }

  // Permission is checked against the course the assignment belongs to, read
  // from the row rather than taken from the caller.
  const teacher = await requireCourseTeacher(assignment.course_id);
  if (!teacher) {
    return NextResponse.json({ error: "沒有權限" }, { status: 403 });
  }

  // Mailing a link to a page the student cannot open only generates complaints.
  if (!assignment.is_published) {
    return NextResponse.json(
      { error: "請先發布這份作業，學員才看得到" },
      { status: 400 },
    );
  }

  const course = getCourseConfig(assignment.course_id);
  if (!course) {
    return NextResponse.json({ error: "找不到這門課" }, { status: 404 });
  }

  // Derived from the same eligibility rule the assignment area itself uses, so
  // nobody is mailed about a page they cannot open and no student is missed.
  const students = await listEligibleStudents(assignment.course_id);
  if (students.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, failed: 0 });
  }

  const assignmentUrl = `${SITE_URL}/courses/${course.slug}/assignments/${assignment.id}`;
  const dueLabel = assignment.due_at
    ? new Date(assignment.due_at).toLocaleDateString("zh-TW")
    : null;

  const messages = students.map((s) => ({
    to: s.email,
    subject: `${course.title} 有新作業：${assignment.title}`,
    react: AssignmentPublishedEmail({
      studentName: s.name || "同學",
      courseName: course.title,
      assignmentTitle: assignment.title,
      assignmentUrl,
      dueLabel,
    }),
  }));

  // Chunked rather than passed whole: the batch endpoint caps at 100, and a
  // class larger than that would otherwise be silently truncated.
  let sent = 0;
  let failed = 0;
  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const result = await sendBatchEmails(messages.slice(i, i + BATCH_SIZE));
    sent += result.sent;
    failed += result.failed;
  }

  if (sent > 0) {
    const supabase = createServiceClient();
    // Record what actually went out, not what was attempted.
    const { error } = await supabase.from("assignment_notifications").insert({
      assignment_id: assignment.id,
      sent_by: teacher.id,
      recipient_count: sent,
    });
    if (error) console.error("Notification log error:", error);
  }

  return NextResponse.json({ ok: true, sent, failed });
}
