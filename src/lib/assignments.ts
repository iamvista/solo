import { createServiceClient } from "@/lib/supabase/service";

export const SUBMISSIONS_BUCKET = "submissions";

export interface Assignment {
  id: string;
  course_id: string;
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
  "id, course_id, title, description, sort_order, allow_file, allow_text, allow_link, due_at, is_published";
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

/** Published assignments for a course, in display order. */
export async function listPublishedAssignments(
  courseId: string,
): Promise<Assignment[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("assignments")
    .select(ASSIGNMENT_COLUMNS)
    .eq("course_id", courseId)
    .eq("is_published", true)
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
 * Strip everything that could steer a storage key somewhere unintended:
 * directory separators, traversal, leading dots, control characters.
 */
export function safeFilename(raw: string): string {
  const base = raw.split(/[/\\]/).pop() ?? "";
  const cleaned = base
    .replace(/[\x00-\x1f\x7f]/g, "")
    .replace(/[^\w.\-一-鿿]/g, "_")
    .replace(/^\.+/, "")
    .slice(0, 120);
  return cleaned || "file";
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
