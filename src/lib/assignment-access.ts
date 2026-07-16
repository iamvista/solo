import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/service";
import {
  sessionCookieName,
  verifySessionToken,
} from "@/lib/assignment-session";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
export const ACCESS_TOKEN_TTL_MINUTES = 30;

export interface EligibleStudent {
  /** Always lower-cased. */
  email: string;
  /** Display name taken from the enrollment record; may be empty. */
  name: string;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Escape LIKE metacharacters — `_` is common in real email addresses. */
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (m) => `\\${m}`);
}

/**
 * Resolve an email to a paid enrollment for a course.
 *
 * READ ONLY. This system never writes to course_enrollments: that table holds
 * payment records and sits on the checkout path.
 */
async function findPaidEnrollment(
  courseId: string,
  normalized: string,
): Promise<EligibleStudent | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("course_enrollments")
    .select("email, name")
    .eq("course_id", courseId)
    .eq("status", "paid")
    .ilike("email", escapeLike(normalized));

  if (error || !data) return null;

  // ilike narrows using the index; this comparison is what actually decides.
  // Relying on ilike alone would be wrong even with escaping, because its
  // case-folding rules are the database's, not JavaScript's.
  const match = data.find((row) => normalizeEmail(row.email ?? "") === normalized);
  if (!match) return null;

  return { email: normalized, name: (match.name ?? "").trim() };
}

/**
 * Resolve an email to a guest entry: someone a teacher admitted without a
 * payment (bank transfer, comped seat, an assistant sitting in).
 *
 * Guests live in their own table rather than as fabricated enrollments.
 * course_enrollments answers "who paid"; a person who never paid has no answer
 * to give there, and inventing one would corrupt every figure derived from that
 * table.
 */
async function findGuest(
  courseId: string,
  normalized: string,
): Promise<EligibleStudent | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("course_guests")
    .select("email, name")
    .eq("course_id", courseId)
    .eq("email", normalized)
    .maybeSingle();

  if (error || !data) return null;
  return { email: normalized, name: (data.name ?? "").trim() };
}

/**
 * The single place course eligibility is decided.
 *
 * A person is eligible if they paid OR a teacher admitted them. The two grants
 * are independent: a refunded student who is also on the guest roster keeps
 * access, because the teacher's grant said so on its own terms.
 *
 * Notification recipients are derived from this same function. Writing a second
 * query for "who should get the mail" would let the two drift, and the failure
 * would be silent: mailing people who cannot open the page, or missing someone
 * who can.
 */
export async function findEligibleStudent(
  courseId: string,
  email: string,
): Promise<EligibleStudent | null> {
  const normalized = normalizeEmail(email);
  if (!normalized || !courseId) return null;

  // Paying students are the common case, so they cost one query. Only someone
  // without a payment reaches the second.
  const paid = await findPaidEnrollment(courseId, normalized);
  if (paid) return paid;

  return findGuest(courseId, normalized);
}

/**
 * Everyone eligible for a course: paying students plus admitted guests.
 *
 * Deliberately built from the same two grants findEligibleStudent() checks, so
 * "who may enter" and "who gets the mail" cannot answer differently. A separate
 * query here would drift, and the drift would be invisible until a student
 * complained about a link they could not open.
 *
 * Duplicates are collapsed: someone who paid AND was admitted as a guest is one
 * person and must receive one mail.
 */
export async function listEligibleStudents(
  courseId: string,
): Promise<EligibleStudent[]> {
  if (!courseId) return [];
  const supabase = createServiceClient();

  const [paid, guests] = await Promise.all([
    supabase
      .from("course_enrollments")
      .select("email, name")
      .eq("course_id", courseId)
      .eq("status", "paid"),
    supabase.from("course_guests").select("email, name").eq("course_id", courseId),
  ]);

  const byEmail = new Map<string, EligibleStudent>();
  for (const row of [...(paid.data ?? []), ...(guests.data ?? [])]) {
    const email = normalizeEmail(row.email ?? "");
    if (!email || byEmail.has(email)) continue;
    byEmail.set(email, { email, name: (row.name ?? "").trim() });
  }
  return [...byEmail.values()];
}

/**
 * Resolve the current student from their session cookie, or null.
 *
 * Re-checks the enrollment on every call rather than trusting the cookie: a
 * refunded or cancelled enrollment must lose access immediately, without
 * waiting for the 30-day cookie to lapse.
 */
export async function getVerifiedStudent(
  courseId: string,
): Promise<EligibleStudent | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(sessionCookieName(courseId))?.value;
  if (!raw) return null;

  const session = verifySessionToken(raw);
  if (!session) return null;

  // The cookie name is per-course, but the name is attacker-controlled while
  // the payload is signed. Trust the payload.
  if (session.courseId !== courseId) return null;

  return findEligibleStudent(courseId, session.email);
}
