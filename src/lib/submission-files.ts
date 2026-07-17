import { createServiceClient } from "@/lib/supabase/service";
import { getVerifiedStudent, normalizeEmail } from "@/lib/assignment-access";
import { requireCourseTeacher } from "@/lib/teaching";
import type { SubmissionFile } from "@/lib/assignments";

/**
 * Server-only, like rewards.ts and for the same reason: it reaches next/headers
 * through the session and teaching helpers.
 *
 * This deliberately does not live in assignments.ts. That module is imported by
 * client components for SUBMISSIONS_BUCKET, and putting authorization there
 * dragged next/headers into the browser bundle and broke the build. Data access
 * is shared; authorization is not.
 */

export type SubmissionFileAuthResult =
  | { ok: true; file: SubmissionFile }
  | { ok: false; status: 401 | 403 | 404 };

/**
 * Single authorization path for a submitted attachment's bytes.
 *
 * Two parties may read one: the course's teacher, and the student who submitted
 * it. Nobody else — not another student, not a teacher of another course.
 *
 * The caller supplies only the attachment's id. Everything authorization turns
 * on is read back from the database here: which submission owns the file, whose
 * email is on it, and which course the assignment belongs to. Nothing the
 * request asserts about ownership is believed, because a client that could name
 * its own owner could name someone else's.
 *
 * Order mirrors authorizeReward(): the teacher gate runs first because a teacher
 * holds no student session, then the student gate. No denial carries the
 * storage path.
 */
export async function authorizeSubmissionFile(
  fileId: string,
): Promise<SubmissionFileAuthResult> {
  if (!fileId) return { ok: false, status: 404 };

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("submission_files")
    .select(
      "id, filename, size_bytes, mime_type, storage_path, submissions!inner(student_email, assignments!inner(course_id))",
    )
    .eq("id", fileId)
    .maybeSingle();

  if (error || !data) return { ok: false, status: 404 };

  // PostgREST types an embedded row as an array; it is one row here because both
  // joins are on a foreign key. getSubmissionCourse() unwraps the same shape.
  const joined = data as unknown as {
    id: string;
    filename: string;
    size_bytes: number;
    mime_type: string | null;
    storage_path: string;
    submissions:
      | {
          student_email: string;
          assignments: { course_id: string } | { course_id: string }[];
        }
      | {
          student_email: string;
          assignments: { course_id: string } | { course_id: string }[];
        }[];
  };
  const submission = Array.isArray(joined.submissions)
    ? joined.submissions[0]
    : joined.submissions;
  if (!submission) return { ok: false, status: 404 };

  const assignment = Array.isArray(submission.assignments)
    ? submission.assignments[0]
    : submission.assignments;
  if (!assignment) return { ok: false, status: 404 };

  const file: SubmissionFile = {
    id: joined.id,
    filename: joined.filename,
    size_bytes: joined.size_bytes,
    mime_type: joined.mime_type,
    storage_path: joined.storage_path,
  };

  if (await requireCourseTeacher(assignment.course_id)) {
    return { ok: true, file };
  }

  // The student session cookie is per-course, so the course had to be resolved
  // from the attachment before this call could be made at all.
  const student = await getVerifiedStudent(assignment.course_id);
  if (!student) return { ok: false, status: 401 };

  if (student.email !== normalizeEmail(submission.student_email)) {
    return { ok: false, status: 403 };
  }

  return { ok: true, file };
}
