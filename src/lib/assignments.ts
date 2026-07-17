import { createServiceClient } from "@/lib/supabase/service";

export const SUBMISSIONS_BUCKET = "submissions";

export interface Assignment {
  id: string;
  course_id: string;
  /**
   * 這份作業屬於哪一期。學員只看得到自己那幾期的作業。
   * 對應 courses-config.ts 的 cohorts[].key，弱連結，比照 course_id。
   */
  cohort_key: string | null;
  title: string;
  description: string | null;
  sort_order: number;
  allow_file: boolean;
  allow_text: boolean;
  allow_link: boolean;
  due_at: string | null;
  is_published: boolean;
}

export interface SubmissionFile {
  id: string;
  filename: string;
  size_bytes: number;
  mime_type: string | null;
  storage_path: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_email: string;
  text_content: string | null;
  link_url: string | null;
  submitted_at: string;
  updated_at: string;
  teacher_comment: string | null;
  reviewed_at: string | null;
}

const ASSIGNMENT_COLUMNS =
  "id, course_id, cohort_key, title, description, sort_order, allow_file, allow_text, allow_link, due_at, is_published";
const SUBMISSION_COLUMNS =
  "id, assignment_id, student_email, text_content, link_url, submitted_at, updated_at, teacher_comment, reviewed_at";

/**
 * Fetch an assignment by id regardless of publication state.
 *
 * Callers facing students MUST check `is_published` themselves — this returns
 * unpublished rows because the teaching surface needs them.
 */
export async function getAssignment(
  assignmentId: string,
): Promise<Assignment | null> {
  if (!assignmentId) return null;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("assignments")
    .select(ASSIGNMENT_COLUMNS)
    .eq("id", assignmentId)
    .maybeSingle();

  if (error || !data) return null;
  return data as Assignment;
}

/**
 * Published assignments for the cohorts a student belongs to, in display order.
 *
 * Student surfaces only. Takes the student's cohorts rather than a course:
 * passing a course would hand a first-cohort student the second cohort's work.
 */
export async function listPublishedAssignments(
  courseId: string,
  cohortKeys: string[],
): Promise<Assignment[]> {
  if (cohortKeys.length === 0) return [];
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("assignments")
    .select(ASSIGNMENT_COLUMNS)
    .eq("course_id", courseId)
    .eq("is_published", true)
    .in("cohort_key", cohortKeys)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as Assignment[];
}

/**
 * Every assignment for a course, published or not.
 *
 * Teacher surfaces only — a teacher needs to see drafts. Never call this from
 * a student-facing path; use listPublishedAssignments there.
 */
export async function listAllAssignments(
  courseId: string,
): Promise<Assignment[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("assignments")
    .select(ASSIGNMENT_COLUMNS)
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as Assignment[];
}

/**
 * A student's own submission for one assignment.
 *
 * The email is ALWAYS supplied by the caller from a verified session, never
 * from the request body — that is what stops one student reading another's
 * work by guessing an address or an id.
 */
export async function getOwnSubmission(
  assignmentId: string,
  studentEmail: string,
): Promise<Submission | null> {
  if (!assignmentId || !studentEmail) return null;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("submissions")
    .select(SUBMISSION_COLUMNS)
    .eq("assignment_id", assignmentId)
    .eq("student_email", studentEmail)
    .maybeSingle();

  if (error || !data) return null;
  return data as Submission;
}

/**
 * The student's submissions across a set of assignments, keyed by assignment id.
 *
 * Takes ids rather than a course so callers that already listed the assignments
 * do not pay for that query twice.
 */
export async function getOwnSubmissions(
  assignmentIds: string[],
  studentEmail: string,
): Promise<Map<string, Submission>> {
  if (assignmentIds.length === 0 || !studentEmail) return new Map();

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("submissions")
    .select(SUBMISSION_COLUMNS)
    .eq("student_email", studentEmail)
    .in("assignment_id", assignmentIds);

  if (error || !data) return new Map();
  return new Map((data as Submission[]).map((s) => [s.assignment_id, s]));
}

export async function getSubmissionFiles(
  submissionId: string,
): Promise<SubmissionFile[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("submission_files")
    .select("id, filename, size_bytes, mime_type, storage_path")
    .eq("submission_id", submissionId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as SubmissionFile[];
}

/**
 * Reduce a browser-supplied filename to something Supabase Storage accepts as
 * an object key.
 *
 * ASCII only, deliberately. Storage rejects non-ASCII keys outright
 * (`InvalidKey`), so preserving Chinese here would make every 作業.pdf upload
 * fail at the last step. The student's original filename is kept verbatim in
 * submission_files.filename and is what both they and the teacher actually see
 *: the key is plumbing, not a label.
 *
 * Also strips directory separators, traversal, leading dots, and control
 * characters so a crafted name cannot steer the key out of its prefix.
 */
export function safeFilename(raw: string): string {
  const base = (raw.split(/[/\\]/).pop() ?? "").replace(/[\x00-\x1f\x7f]/g, "");

  // Stem and extension are sanitized separately. Sanitizing the whole string at
  // once loses the extension when the stem is entirely non-ASCII: 作業.pdf
  // collapses to "_.pdf", and stripping the leading punctuation then leaves a
  // bare "pdf" with no extension at all.
  const dot = base.lastIndexOf(".");
  const rawStem = dot > 0 ? base.slice(0, dot) : base;
  const rawExt = dot > 0 ? base.slice(dot + 1) : "";

  const toAscii = (s: string) =>
    s
      .replace(/[^A-Za-z0-9_-]/g, "_")
      .replace(/_{2,}/g, "_")
      .replace(/^_+|_+$/g, "");

  const stem = toAscii(rawStem).slice(0, 100) || "file";
  const ext = toAscii(rawExt).slice(0, 16);

  return ext ? `${stem}.${ext}` : stem;
}

/**
 * Build the storage key for a submitted file.
 *
 * The key deliberately carries no email address: storage keys end up in logs
 * and error payloads, and a student's address is personal data. Ownership is
 * recorded in submission_files instead, so it is never inferred from the path.
 */
export function submissionStoragePath(
  courseId: string,
  assignmentId: string,
  randomId: string,
  filename: string,
): string {
  return `${courseId}/${assignmentId}/${randomId}-${safeFilename(filename)}`;
}
