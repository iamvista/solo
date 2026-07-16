import { createHmac } from "crypto";

// Dedicated HMAC secret for student assignment sessions.
// Deliberately NOT WAITLIST_TOKEN_SECRET or NEWSLETTER_UNSUBSCRIBE_SECRET: those
// address a waitlist row / a newsletter subscription, this one asserts "the
// holder controls this email address and is enrolled in this course". Sharing a
// secret would let a token minted for one purpose act as another.
// Must never fall back to SUPABASE_SERVICE_ROLE_KEY.
function getSecret(): string {
  const secret = process.env.ASSIGNMENT_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ASSIGNMENT_SESSION_SECRET is not configured (need ≥32 chars)",
    );
  }
  return secret;
}

export interface AssignmentSession {
  email: string;
  courseId: string;
}

/**
 * Cookie name is scoped per course so a student enrolled in two courses holds
 * two sessions rather than overwriting one with the other. The course id is
 * ALSO carried inside the signed payload — without that, swapping the cookie
 * name would move a valid session onto another course.
 */
export function sessionCookieName(courseId: string): string {
  return `assignment_session_${courseId.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

function b64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function sign(body: string): string {
  return createHmac("sha256", getSecret()).update(body).digest("base64url");
}

export function generateSessionToken(session: AssignmentSession): string {
  const body = b64url(
    JSON.stringify({ email: session.email, courseId: session.courseId }),
  );
  return `${body}.${sign(body)}`;
}

/**
 * Verify a session cookie and return its payload, or null when the cookie is
 * malformed, truncated, or its signature does not match.
 *
 * A valid signature only proves the payload was minted here — it does NOT prove
 * the enrollment is still paid. Callers MUST re-check eligibility; see
 * getVerifiedStudent() in assignment-access.ts.
 */
export function verifySessionToken(token: string): AssignmentSession | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [body, signature] = parts;
  if (!body || !signature) return null;

  const expected = sign(body);
  if (expected.length !== signature.length) return null;

  // Constant-time comparison
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  if (mismatch !== 0) return null;

  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (
      typeof parsed?.email !== "string" ||
      typeof parsed?.courseId !== "string" ||
      !parsed.email ||
      !parsed.courseId
    ) {
      return null;
    }
    return { email: parsed.email, courseId: parsed.courseId };
  } catch {
    return null;
  }
}
