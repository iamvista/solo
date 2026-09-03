import { claims } from './claims.generated';

/**
 * 全站共用的社會證明數字
 *
 * ⚠️ 訂戶數、場次數、著作數的 canonical 來源是
 * vista-official-site/data/registry.json，改那裡再跑 scripts/pull-claims.mjs --fix。
 * 只有本站專屬的數字（診斷次數、工作坊場次）才在這裡手寫。
 */
export const SOCIAL_PROOF = {
  diagnoseCount: "1,000+",
  newsletterSubscribers: claims.newsletter_subscribers.value,
  verifiedSessions: claims.verified_sessions.value,
  books: claims.books.value,
  workshopCount: "50+",
  consultingHours: "200+",
} as const;
