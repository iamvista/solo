/**
 * 課程報名表單需要的後設資料。
 * 新增課程：在這裡登記，/courses/[course]/register 會自動拿來生表單。
 */

export interface CourseConfig {
  /** 課程 slug，對應 URL */
  slug: string;
  /** 顯示名稱 */
  title: string;
  /** 副標／描述（出現在表單頁標頭） */
  subtitle: string;
  /** 開課時間（顯示用） */
  date: string;
  /** 上課時段 */
  time: string;
  /** 地點 */
  location: string;
  /** 名額限制 */
  capacity: number;
  /** 早鳥 Recur 產品 ID（如有早鳥則必填） */
  recurProductIdEarlyBird?: string;
  /** 早鳥金額 */
  earlyBirdPrice?: number;
  /** 早鳥截止日期 yyyy-mm-dd */
  earlyBirdDeadline?: string;
  /** 原價 Recur 產品 ID */
  recurProductIdRegular: string;
  /** 原價金額 */
  regularPrice: number;
  /** Recur 公開金鑰（前端 SDK 用）由環境變數注入 */
  /** 課程詳細頁路徑（用於回退連結） */
  detailUrl: string;
  /** 是否包含午餐（決定要不要顯示飲食欄位） */
  hasMeal?: boolean;
  /** 客製欄位：「目前最想解決的提案問題」這類有上下文的提示文 */
  customQuestionLabel?: string;
  customQuestionPlaceholder?: string;
}

export const COURSE_CONFIGS: Record<string, CourseConfig> = {
  "ai-proposal-spotlight": {
    slug: "ai-proposal-spotlight",
    title: "AI 提案亮點實戰課",
    subtitle: "讓主管與客戶更容易點頭｜陳建銘老師親授",
    date: "2026/6/13（六）",
    time: "9:00–16:00（含午休）",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 16,
    recurProductIdEarlyBird: "ayaalujxfzgv6c4r0i8n8qkp",
    earlyBirdPrice: 4980,
    earlyBirdDeadline: "2026-05-30",
    recurProductIdRegular: "k0kbiflm1tckzvqd39u4uw3w",
    regularPrice: 7800,
    detailUrl: "/courses/ai-proposal-spotlight",
    hasMeal: true,
    customQuestionLabel: "目前最卡住的提案問題（選填，但寫了講師會優先在課堂上回答）",
    customQuestionPlaceholder:
      "例：每次提案到一半就被主管說『沒亮點』，但我也不知道她想要什麼……",
  },
};

export function getCourseConfig(slug: string): CourseConfig | null {
  return COURSE_CONFIGS[slug] ?? null;
}

/** 早鳥是否仍在優惠期內 */
export function isEarlyBirdActive(config: CourseConfig, now: Date = new Date()): boolean {
  if (!config.earlyBirdDeadline || !config.recurProductIdEarlyBird) return false;
  const deadline = new Date(`${config.earlyBirdDeadline}T23:59:59+08:00`);
  return now <= deadline;
}

/** 取得目前該收的價格與對應 product ID */
export function resolvePricing(
  config: CourseConfig,
  now: Date = new Date(),
): { productId: string; amount: number; isEarlyBird: boolean } {
  if (
    config.recurProductIdEarlyBird &&
    config.earlyBirdPrice !== undefined &&
    isEarlyBirdActive(config, now)
  ) {
    return {
      productId: config.recurProductIdEarlyBird,
      amount: config.earlyBirdPrice,
      isEarlyBird: true,
    };
  }
  return {
    productId: config.recurProductIdRegular,
    amount: config.regularPrice,
    isEarlyBird: false,
  };
}
