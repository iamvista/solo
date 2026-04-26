import { createHmac } from "crypto";

// Dedicated HMAC secret for unsubscribe links. We must NOT fall back to
// SUPABASE_SERVICE_ROLE_KEY: that key grants full DB bypass, so reusing it
// as an HMAC secret crosses trust boundaries (any leaked unsubscribe URL
// becomes a tiny oracle for the most privileged credential we own).
function getSecret(): string {
  const secret = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "NEWSLETTER_UNSUBSCRIBE_SECRET is not configured (need ≥32 chars)",
    );
  }
  return secret;
}

/** Generate HMAC token for unsubscribe link */
export function generateUnsubscribeToken(email: string): string {
  return createHmac("sha256", getSecret())
    .update(email.toLowerCase().trim())
    .digest("hex")
    .slice(0, 32);
}

/** Verify HMAC token for unsubscribe link */
export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = generateUnsubscribeToken(email);
  // Constant-time comparison
  if (expected.length !== token.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return mismatch === 0;
}
