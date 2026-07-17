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
  /**
   * The cohorts this person belongs to on this course.
   *
   * Usually one. A returning student who paid for two cohorts belongs to both,
   * and sees both cohorts' assignments — that is the rule working, not a
   * special case: they paid for both.
   *
   * Empty is impossible: a student with no cohort is not eligible.
   */
  cohortKeys: string[];
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
    .select("email, name, cohort_key")
    .eq("course_id", courseId)
    .eq("status", "paid")
    .ilike("email", escapeLike(normalized));

  if (error || !data) return null;

  // ilike narrows using the index; this comparison is what actually decides.
  // Relying on ilike alone would be wrong even with escaping, because its
  // case-folding rules are the database's, not JavaScript's.
  const matches = data.filter(
    (row) => normalizeEmail(row.email ?? "") === normalized,
  );
  if (matches.length === 0) return null;

  // One row per cohort they paid for.
  const cohortKeys = [
    ...new Set(
      matches.map((r) => r.cohort_key as string | null).filter(Boolean) as string[],
    ),
  ];

  return {
    email: normalized,
    name: (matches[0].name ?? "").trim(),
    cohortKeys,
  };
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
    .select("email, name, cohort_key")
    .eq("course_id", courseId)
    .eq("email", normalized);

  if (error || !data || data.length === 0) return null;

  const cohortKeys = [
    ...new Set(
      data.map((r) => r.cohort_key as string | null).filter(Boolean) as string[],
    ),
  ];

  return {
    email: normalized,
    name: (data[0].name ?? "").trim(),
    cohortKeys,
  };
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

  // Both grants are consulted and their cohorts merged: someone who paid for
  // the first cohort and was comped into the second belongs to both. Returning
  // on the first hit would silently drop the other cohort.
  const [paid, guest] = await Promise.all([
    findPaidEnrollment(courseId, normalized),
    findGuest(courseId, normalized),
  ]);

  if (!paid && !guest) return null;

  const cohortKeys = [
    ...new Set([...(paid?.cohortKeys ?? []), ...(guest?.cohortKeys ?? [])]),
  ];
  if (cohortKeys.length === 0) return null;

  return {
    email: normalized,
    // The paid record's name wins: it is what they typed when paying.
    name: paid?.name || guest?.name || "",
    cohortKeys,
  };
}

/**
 * Everyone eligible for one cohort: paying students plus admitted guests.
 *
 * Scoped to a cohort, not a course: a notification about the second cohort's
 * assignment must not reach the first cohort's students. They cannot open it,
 * and mailing them about it is noise at best.
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
  cohortKey: string,
): Promise<EligibleStudent[]> {
  if (!courseId || !cohortKey) return [];
  const supabase = createServiceClient();

  const [paid, guests] = await Promise.all([
    supabase
      .from("course_enrollments")
      .select("email, name")
      .eq("course_id", courseId)
      .eq("cohort_key", cohortKey)
      .eq("status", "paid"),
    supabase
      .from("course_guests")
      .select("email, name")
      .eq("course_id", courseId)
      .eq("cohort_key", cohortKey),
  ]);

  const byEmail = new Map<string, EligibleStudent>();
  for (const row of [...(paid.data ?? []), ...(guests.data ?? [])]) {
    const email = normalizeEmail(row.email ?? "");
    if (!email || byEmail.has(email)) continue;
    byEmail.set(email, {
      email,
      name: (row.name ?? "").trim(),
      cohortKeys: [cohortKey],
    });
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
