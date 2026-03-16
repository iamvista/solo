/**
 * Simple in-memory rate limiter for serverless (per-instance).
 * Not perfect for distributed, but effective for basic abuse prevention on Vercel.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

/**
 * Check rate limit for a given key (e.g. IP address).
 * @returns `true` if the request is allowed, `false` if rate-limited.
 */
export function checkRateLimit(
  key: string,
  { maxRequests = 5, windowMs = 60_000 }: { maxRequests?: number; windowMs?: number } = {},
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  entry.count++;
  return entry.count <= maxRequests;
}

/** Extract IP from request headers (Vercel / Cloudflare / fallback) */
export function getClientIp(request: Request): string {
  const headers = new Headers(request.headers);
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
