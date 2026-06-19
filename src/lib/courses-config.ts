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
  /** 雙人同行 Recur 產品 ID（選填） */
  recurProductIdDual?: string;
  /** 雙人同行金額 */
  dualPrice?: number;
  /** 舊生優惠 Recur 產品 ID（選填，需在 alumni 欄位提交過去報名憑證） */
  recurProductIdAlumni?: string;
  /** 舊生優惠金額 */
  alumniPrice?: number;
  /** 舊生優惠的提示說明（顯示在表單方案卡片下） */
  alumniNote?: string;
  /** Recur 公開金鑰（前端 SDK 用）由環境變數注入 */
  /** 課程詳細頁路徑（用於回退連結） */
  detailUrl: string;
  /** 是否包含午餐（決定要不要顯示飲食欄位） */
  hasMeal?: boolean;
  /** 隱藏「公司報帳發票」區塊（無法開立電子發票時使用） */
  hideInvoiceSection?: boolean;
  /** 客製欄位：「目前最想解決的提案問題」這類有上下文的提示文 */
  customQuestionLabel?: string;
  customQuestionPlaceholder?: string;
  /** 報名前提示（顯示在表單頁頂部與課程資訊區，例如「需自備 Claude Pro 訂閱」） */
  preRegistrationNotice?: string;
}

export const COURSE_CONFIGS: Record<string, CourseConfig> = {
  "vibe-coding-claude-code": {
    slug: "vibe-coding-claude-code",
    title: "Vibe Coding for Claude Code 實戰工作坊",
    subtitle: "用 Claude Code 在終端機裡 3 小時打造你的數位資產",
    date: "2026/6/27（六）",
    time: "9:00–12:00（3 小時）",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 12,
    recurProductIdRegular: "xi7s0fxgw8zxetstmv2xv7lc",
    regularPrice: 4500,
    recurProductIdAlumni: "qs4uz4gbiarnwflfok8u4szw",
    alumniPrice: 3500,
    alumniNote:
      "限曾上過 Antigravity 版 Vibe Coding 工作坊的學員，請在備註欄填寫過去報名憑證；信任制報名 + 課前抽查",
    detailUrl: "/courses/vibe-coding-claude-code",
    hideInvoiceSection: true,
    customQuestionLabel:
      "目前最想用 Claude Code 解決的事（選填，但寫了講師會優先在課堂上示範）",
    customQuestionPlaceholder:
      "例：想做一個服務銷售頁、想把舊網站搬到自己能改的版本、想自動化我的內容工作流……",
    preRegistrationNotice:
      "本課程使用 Claude Code（CLI 版本），請於課前自行訂閱 Claude Pro（每月 US$20）或 Claude Max（每月 US$100 起），並在筆電安裝完成。詳細安裝指南課前一週寄送。",
  },
  "ai-content": {
    slug: "ai-content",
    title: "AI 內容產製系統工作坊",
    subtitle: "一份素材，自動產出六種格式：3 小時建立你的內容產製系統",
    date: "2026/7/12（日）",
    time: "9:00–12:00（3 小時，含休息）",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 16,
    recurProductIdRegular: "gngyqhltfyujbl0wjd78304x",
    regularPrice: 5000,
    detailUrl: "/courses/ai-content",
    hideInvoiceSection: true,
    customQuestionLabel:
      "目前最想用 AI 解決的內容產製問題（選填，但寫了講師會優先在課堂上示範）",
    customQuestionPlaceholder:
      "例：想把一篇長文自動拆成電子報＋社群貼文、想讓 AI 寫出我的風格、想自動化產業趨勢研究……",
    preRegistrationNotice:
      "本課程實作會用到 Claude Code，請於課前自行訂閱 Claude Pro（每月 US$20），並準備 2-3 篇你過去寫的文章（課堂會用來建立你的個人風格檔案）。",
  },
  "vibe-coding": {
    slug: "vibe-coding",
    title: "Vibe Coding 實戰工作坊",
    subtitle: "用 AI 建立你的數位資產，不需要寫程式：3 小時做出第一個能上線的網站",
    date: "2026/7/26（日）",
    time: "9:00–12:00（3 小時）",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 12,
    recurProductIdRegular: "y7q482kwsc16h7iw3akwufzq",
    regularPrice: 4000,
    detailUrl: "/courses/vibe-coding",
    hideInvoiceSection: true,
    customQuestionLabel:
      "你最想用這堂課做出什麼網站或頁面？（選填，但寫了講師會優先在課堂上對應你的情境）",
    customQuestionPlaceholder:
      "例：個人品牌官網、服務銷售頁、名單收集頁、活動報名頁……",
    preRegistrationNotice:
      "課前建議先準備一個 AI 工具帳號（Gemini／Claude／ChatGPT 擇一即可），並帶上你想製作的網站內容素材（文字、圖片、Logo 等）。請攜帶筆電（Mac 或 Windows）。",
  },
  "concept-monetization-bootcamp": {
    slug: "concept-monetization-bootcamp",
    title: "概念變現陪跑營",
    subtitle: "6 週，用 AI 把你的專業變成一個會賣的知識產品",
    date: "2026/8/6 起連續 6 週（週四）",
    time: "週四 20:00–21:30（21:30–22:00 QA），連續 6 週",
    location: "線上 Zoom（報名後寄送連結，全程錄影、提供回放）",
    capacity: 12,
    recurProductIdRegular: "df2j3u3vfh8u2wwh14048yym",
    regularPrice: 9999,
    recurProductIdDual: "bq16q93lbuddoarykucd311m",
    dualPrice: 18000,
    detailUrl: "/courses/concept-monetization-bootcamp",
    hideInvoiceSection: true,
    customQuestionLabel:
      "你最想變現的專業主題是什麼？目前最大的卡關是什麼？（報名後會再寄一份完整的課前概念問卷）",
    customQuestionPlaceholder:
      "例：我有 8 年企業培訓經驗，想把它做成線上課，但不知道從哪個主題切入、定價多少、第一版該做成課程還是諮詢……",
    preRegistrationNotice:
      "本陪跑營為 6 週線上直播課（每週四晚上 90 分鐘 + QA + 每週實作作業 + 社群互評）。適合已有專業經驗、想把它做成可銷售知識產品的講師／顧問／教練／資深自由工作者；不適合完全沒有專業基礎、只想學工具或提示詞的人。創辦梯次價僅此一梯，下一梯起調回原價。",
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

export type PricingPlan = "early_bird" | "regular" | "dual" | "alumni";

export interface ResolvedPricing {
  plan: PricingPlan;
  productId: string;
  amount: number;
  isEarlyBird: boolean;
}

/** 取得目前該收的價格與對應 product ID（單人預設早鳥／原價自動切） */
export function resolvePricing(
  config: CourseConfig,
  now: Date = new Date(),
  plan: PricingPlan = "early_bird",
): ResolvedPricing {
  if (
    plan === "alumni" &&
    config.recurProductIdAlumni &&
    config.alumniPrice !== undefined
  ) {
    return {
      plan: "alumni",
      productId: config.recurProductIdAlumni,
      amount: config.alumniPrice,
      isEarlyBird: false,
    };
  }

  if (
    plan === "dual" &&
    config.recurProductIdDual &&
    config.dualPrice !== undefined
  ) {
    return {
      plan: "dual",
      productId: config.recurProductIdDual,
      amount: config.dualPrice,
      isEarlyBird: false,
    };
  }

  if (
    plan === "early_bird" &&
    config.recurProductIdEarlyBird &&
    config.earlyBirdPrice !== undefined &&
    isEarlyBirdActive(config, now)
  ) {
    return {
      plan: "early_bird",
      productId: config.recurProductIdEarlyBird,
      amount: config.earlyBirdPrice,
      isEarlyBird: true,
    };
  }
  return {
    plan: "regular",
    productId: config.recurProductIdRegular,
    amount: config.regularPrice,
    isEarlyBird: false,
  };
}

/** 列出該課所有可選方案（給表單 radio 用） */
export function availablePlans(
  config: CourseConfig,
  now: Date = new Date(),
): Array<{
  plan: PricingPlan;
  label: string;
  amount: number;
  description?: string;
  productId: string;
}> {
  const plans: Array<{
    plan: PricingPlan;
    label: string;
    amount: number;
    description?: string;
    productId: string;
  }> = [];

  if (
    config.recurProductIdEarlyBird &&
    config.earlyBirdPrice !== undefined &&
    isEarlyBirdActive(config, now)
  ) {
    plans.push({
      plan: "early_bird",
      label: "單人早鳥",
      amount: config.earlyBirdPrice,
      description: config.earlyBirdDeadline
        ? `${config.earlyBirdDeadline} 截止`
        : undefined,
      productId: config.recurProductIdEarlyBird,
    });
  } else {
    plans.push({
      plan: "regular",
      label: "單人原價",
      amount: config.regularPrice,
      productId: config.recurProductIdRegular,
    });
  }

  if (config.recurProductIdDual && config.dualPrice !== undefined) {
    plans.push({
      plan: "dual",
      label: "雙人同行",
      amount: config.dualPrice,
      description: "兩人同行可在課堂互相扮演提案方與決策方",
      productId: config.recurProductIdDual,
    });
  }

  if (config.recurProductIdAlumni && config.alumniPrice !== undefined) {
    plans.push({
      plan: "alumni",
      label: "舊生優惠",
      amount: config.alumniPrice,
      description:
        config.alumniNote ??
        "限曾上過同系列工作坊的學員，請在備註欄填寫過去報名憑證",
      productId: config.recurProductIdAlumni,
    });
  }

  return plans;
}
