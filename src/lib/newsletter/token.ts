import { createHmac } from "crypto";

const SECRET = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Generate HMAC token for unsubscribe link */
export function generateUnsubscribeToken(email: string): string {
  return createHmac("sha256", SECRET).update(email.toLowerCase().trim()).digest("hex").slice(0, 32);
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
