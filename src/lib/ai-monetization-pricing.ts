// AI 變現研究院（ai-monetization-institute）票價模型
// 前端表單與後端 API 共用，確保顯示金額與伺服器權威金額一致。

export type SessionKey = "joyce" | "claire" | "vista";

export interface SessionDef {
  key: SessionKey;
  instructor: string;
  axis: string;
  dates: string;
  /** 單元定價（Joyce 為雙堂合併價） */
  price: number;
}

export const AM_SESSIONS: SessionDef[] = [
  {
    key: "joyce",
    instructor: "Joyce 李文娟",
    axis: "個人品牌 × 影響力（雙堂）",
    dates: "7/4 + 7/18",
    price: 15000,
  },
  {
    key: "claire",
    instructor: "Claire 張可佳",
    axis: "AI 落地 × 生產力",
    dates: "7/11",
    price: 7500,
  },
  {
    key: "vista",
    instructor: "Vista 鄭緯筌",
    axis: "內容變現 × 流量力",
    dates: "7/25",
    price: 7500,
  },
];

/** 三組全選的套票價 */
export const AM_BUNDLE_PRICE = 19800;
/** 三組單買加總原價 */
export const AM_FULL_PRICE = 30000;

const VALID_KEYS = new Set<SessionKey>(["joyce", "claire", "vista"]);

/** 過濾出合法且去重的單元 key（保持 AM_SESSIONS 的順序） */
export function normalizeSessions(input: unknown): SessionKey[] {
  if (!Array.isArray(input)) return [];
  const set = new Set<SessionKey>();
  for (const v of input) {
    if (typeof v === "string" && VALID_KEYS.has(v as SessionKey)) {
      set.add(v as SessionKey);
    }
  }
  return AM_SESSIONS.map((s) => s.key).filter((k) => set.has(k));
}

/** 伺服器端權威金額計算：三組全選 → 套票價，否則加總 */
export function computeAmount(keys: SessionKey[]): number {
  const uniq = normalizeSessions(keys);
  if (uniq.length === 3) return AM_BUNDLE_PRICE;
  return uniq.reduce(
    (sum, k) => sum + (AM_SESSIONS.find((s) => s.key === k)?.price ?? 0),
    0,
  );
}

/** 是否套用套票價 */
export function isBundle(keys: SessionKey[]): boolean {
  return normalizeSessions(keys).length === 3;
}

/** 人類可讀的單元清單，如「Joyce 李文娟（個人品牌 × 影響力（雙堂））、Vista 鄭緯筌（內容變現 × 流量力）」 */
export function describeSessions(keys: SessionKey[]): string {
  return normalizeSessions(keys)
    .map((k) => {
      const s = AM_SESSIONS.find((x) => x.key === k);
      return s ? `${s.instructor}（${s.axis}）` : k;
    })
    .join("、");
}
