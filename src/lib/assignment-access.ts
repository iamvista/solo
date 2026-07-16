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
export async function findEligibleStudent(
  courseId: string,
  email: string,
): Promise<EligibleStudent | null> {
  const normalized = normalizeEmail(email);
  if (!normalized || !courseId) return null;

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
