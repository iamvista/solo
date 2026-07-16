import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export interface Teacher {
  id: string;
  email: string;
}

/**
 * Teaching authorization, deliberately independent of `isAdmin()`.
 *
 * The two models MUST NOT share a helper or inherit from one another: teaching
 * a course is a narrow grant over one course's students, while platform
 * administration reaches the whole site. If one delegated to the other,
 * widening either would silently widen the other.
 *
 * Teachers reuse the site's existing sign-in — they are few and already hold
 * accounts, so a separate credential store would be pure overhead.
 */
export async function getCurrentTeacher(): Promise<Teacher | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  return { id: user.id, email: user.email ?? "" };
}

/**
 * Course ids this account teaches.
 *
 * Uses the service client because course_teachers carries no policies: a
 * session-scoped client would read zero rows. Authorization therefore lives
 * here, in application code, not in the database.
 */
export async function listTeachingCourseIds(
  teacherId: string,
): Promise<string[]> {
  if (!teacherId) return [];
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("course_teachers")
    .select("course_id")
    .eq("teacher_id", teacherId);

  if (error || !data) return [];
  return data.map((row) => row.course_id as string);
}

export async function isCourseTeacher(
  teacherId: string,
  courseId: string,
): Promise<boolean> {
  if (!teacherId || !courseId) return false;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("course_teachers")
    .select("id")
    .eq("teacher_id", teacherId)
    .eq("course_id", courseId)
    .maybeSingle();

  return !error && data !== null;
}

/**
 * The single gate every teaching surface passes through.
 *
 * Returns the teacher only when they are signed in AND mapped to this course.
 * Callers treat null as "deny" without distinguishing the two cases: telling a
 * stranger apart from a non-teacher would confirm the course has a roster.
 */
export async function requireCourseTeacher(
  courseId: string,
): Promise<Teacher | null> {
  const teacher = await getCurrentTeacher();
  if (!teacher) return null;

  if (!(await isCourseTeacher(teacher.id, courseId))) return null;
  return teacher;
}

export interface TeacherSubmissionRow {
  id: string;
  student_email: string;
  text_content: string | null;
  link_url: string | null;
  submitted_at: string;
  updated_at: string;
  teacher_comment: string | null;
  reviewed_at: string | null;
}

/** Every submission for one assignment, newest first. Teacher surfaces only. */
export async function listSubmissions(
  assignmentId: string,
): Promise<TeacherSubmissionRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("submissions")
    .select(
      "id, student_email, text_content, link_url, submitted_at, updated_at, teacher_comment, reviewed_at",
    )
    .eq("assignment_id", assignmentId)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data as TeacherSubmissionRow[];
}

/** How many submissions each of these assignments has. */
export async function countSubmissions(
  assignmentIds: string[],
): Promise<Map<string, number>> {
  if (assignmentIds.length === 0) return new Map();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("assignment_id")
    .in("assignment_id", assignmentIds);

  if (error || !data) return new Map();

  const counts = new Map<string, number>();
  for (const row of data) {
    const key = row.assignment_id as string;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

/**
 * Resolve a submission to the course that owns it, so a teacher's permission
 * can be checked against that course rather than anything the caller claims.
 */
export async function getSubmissionCourse(
  submissionId: string,
): Promise<{ assignmentId: string; courseId: string } | null> {
  if (!submissionId) return null;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("assignment_id, assignments!inner(course_id)")
    .eq("id", submissionId)
    .maybeSingle();

  if (error || !data) return null;

  const joined = data as unknown as {
    assignment_id: string;
    assignments: { course_id: string } | { course_id: string }[];
  };
  const assignments = Array.isArray(joined.assignments)
    ? joined.assignments[0]
    : joined.assignments;
  if (!assignments) return null;

  return { assignmentId: joined.assignment_id, courseId: assignments.course_id };
}

export interface LastNotification {
  sent_at: string;
  recipient_count: number;
}

/** The most recent notification for an assignment, or null if never sent. */
export async function getLastNotification(
  assignmentId: string,
): Promise<LastNotification | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("assignment_notifications")
    .select("sent_at, recipient_count")
    .eq("assignment_id", assignmentId)
    .order("sent_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as LastNotification;
}
