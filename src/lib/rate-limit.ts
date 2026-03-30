/**
 * 簡易 IP Rate Limiter（記憶體內，每個 serverless instance 獨立）
 * 適合 Vercel serverless 環境的輕量級限流
 */

const store = new Map<string, { count: number; resetAt: number }>();

// 定期清理過期紀錄，避免記憶體洩漏
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 60_000);

export interface RateLimitOptions {
  /** 時間窗口（毫秒），預設 60 秒 */
  windowMs?: number;
  /** 窗口內允許的最大請求數，預設 10 */
  max?: number;
}

/**
 * 檢查是否超過限流
 * @returns true = 允許通過，false = 超過限制
 */
export function checkRateLimit(
  ip: string,
  options?: RateLimitOptions
): boolean {
  const windowMs = options?.windowMs ?? 60_000;
  const max = options?.max ?? 10;
  const now = Date.now();

  const entry = store.get(ip);
  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  entry.count++;
  return entry.count <= max;
}

/** 從 request headers 取得客戶端 IP */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
