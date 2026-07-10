import { createHmac } from "crypto";

// Dedicated HMAC secret for waitlist preference & unsubscribe links.
// Deliberately NOT NEWSLETTER_UNSUBSCRIBE_SECRET: the two lists have different
// unsubscribe semantics (leaving the newsletter is not leaving a course
// waitlist), so sharing a secret would let a token issued by one act on the
// other. Also must never fall back to SUPABASE_SERVICE_ROLE_KEY.
function getSecret(): string {
  const secret = process.env.WAITLIST_TOKEN_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "WAITLIST_TOKEN_SECRET is not configured (need ≥32 chars)",
    );
  }
  return secret;
}

function b64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function sign(id: string): string {
  return createHmac("sha256", getSecret()).update(id).digest("base64url");
}

/** Build the token addressing a single course_waitlist row. */
export function generateWaitlistToken(id: string): string {
  return `${b64url(id)}.${sign(id)}`;
}

/**
 * Verify a token and return the row id it addresses, or null when the token is
 * malformed, truncated, or its signature does not match.
 */
export function verifyWaitlistToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedId, signature] = parts;
  if (!encodedId || !signature) return null;

  let id: string;
  try {
    id = Buffer.from(encodedId, "base64url").toString("utf8");
  } catch {
    return null;
  }
  if (!id) return null;

  const expected = sign(id);
  if (expected.length !== signature.length) return null;

  // Constant-time comparison
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0 ? id : null;
}
