/**
 * 課程報名表單需要的後設資料。
 * 新增課程：在這裡登記，/courses/[course]/register 會自動拿來生表單。
 */

/**
 * 一門課的一期。
 *
 * 期別放在設定檔而非資料庫，理由與課程本身相同：它是課程設定，不是交易資料。
 * 開新一期＝在 cohorts 陣列加一筆並把 open 移過去，與新增課程同一個動作。
 *
 * 先前沒有這個概念，於是開第二期時 date 被就地改掉（commit ef7188e），
 * 第一期的日期從此消失。cohorts 讓每一期各自留存。
 */
export interface Cohort {
  /**
   * 穩定識別碼，會寫進 course_enrollments.cohort_key。
   * 一旦有人報名就不可更改，否則既有報名會對不到期別。
   */
  key: string;
  /** 顯示名稱，例如「第一期」 */
  name: string;
  /** 開課日期（顯示用），例如 "2026/8/16（日）" */
  date: string;
  /**
   * 機器可讀的開課時間，ISO 8601 且必須帶 +08:00 時區，例 "2026-08-30T09:00:00+08:00"。
   *
   * 只給倒數提醒 cron 用來算 D-N，不影響任何顯示。沒填就不寄倒數提醒，
   * 這是刻意的：寧可漏寄，也不要用猜的日期寄錯時間給付費學員。
   */
  startsAt?: string;
  /** 是否招生中。一門課至多一期為 true；報名時據此決定 cohort_key。 */
  open?: boolean;
  /**
   * 這一期的 Recur 商品 ID（早鳥與原價等全部列入）。
   *
   * 每期一組獨立商品是刻意的：商品若跨期共用後改名，前一期學員的收據會
   * 變成後一期的日期，而 recur_product_id 也就分不出期別。回填正是靠這個
   * 陣列把既有報名對應到期。
   */
  productIds: string[];
}

export interface CourseConfig {
  /** 課程 slug，對應 URL */
  slug: string;
  /** 顯示名稱 */
  title: string;
  /** 副標／描述（出現在表單頁標頭） */
  subtitle: string;
  /**
   * 開課時間（顯示用）。永遠等於招生中那一期的 date。
   *
   * 保留在頂層而非改由 cohorts 推導：date 有五處讀取（報名頁、課程列表、
   * OG 圖等），改動它們等於讓收錢頁面的渲染多依賴一層查詢。兩者的一致性
   * 由 courses-config.test.ts 釘死，改了一邊沒改另一邊測試會紅。
   */
  date: string;
  /** 上課時段 */
  time: string;
  /** 地點 */
  location: string;
  /** 名額限制 */
  capacity: number;
  /**
   * 期別。每門課至少一期。
   *
   * 招生中那一期的 date 與 productIds 必須與頂層的 date、
   * recurProductId* 一致；courses-config.test.ts 會驗。
   */
  cohorts: Cohort[];
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
  /** VIP 方案 Recur 產品 ID（選填） */
  recurProductIdVip?: string;
  /** VIP 方案金額 */
  vipPrice?: number;
  /** VIP 方案說明（顯示在方案卡片下） */
  vipNote?: string;
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
  /** 客製「怎麼知道這堂課」選項（不填則用共用預設）；通常用來把該課講師的社群放第一 */
  attributionOptions?: string[];
}

export const COURSE_CONFIGS: Record<string, CourseConfig> = {
  "positioning-convergence": {
    slug: "positioning-convergence",
    title: "定位收斂工作坊",
    subtitle: "什麼都會的人，如何選出那一個能變現的自己",
    date: "2026/9/5（六）",
    time: "臺灣時間 15:00 – 18:00（3 小時）",
    location: "線上舉辦（報名後通知會議網址連結）",
    capacity: 20,
    cohorts: [
      {
        key: "1",
        name: "第一期",
        date: "2026/7/19（日）",
        productIds: ["pf2eoon7kaofq8m8ufybmauu"],
      },
      {
        key: "2",
        name: "第二期",
        date: "2026/9/5（六）",
        open: true,
        productIds: ["ffgmhhdizaem3hxpq9gb7xsq"],
      },
    ],
    recurProductIdRegular: "ffgmhhdizaem3hxpq9gb7xsq",
    regularPrice: 4500,
    detailUrl: "/courses/positioning-convergence",
    hideInvoiceSection: true,
    customQuestionLabel:
      "最想被「收斂」解決的卡點是什麼？（選填，但寫了講師會優先在課堂上回應你的情境）",
    customQuestionPlaceholder:
      "例：我同時做命理、寫作、教練，不知道對外該主打哪一個；抬頭一長串卻講不清楚自己是誰……",
    preRegistrationNotice:
      "課前請把你過去到現在的經歷、技能、興趣、學過的東西先想一輪；現場我們會帶你一起攤開、盤點、再收斂。",
    attributionOptions: [
      "Susie 的 FB／IG／Threads",
      "朋友／同事推薦",
      "Vista 的電子報",
      "Vista 的 FB／IG／Threads",
      "搜尋引擎找到的",
      "其他（請在備註說明）",
    ],
  },
  "ai-academic-writing": {
    slug: "ai-academic-writing",
    title: "AI 賦能學術研究與寫作實戰工作坊",
    subtitle: "用 AI Agent 當研究副駕駛——加速研究與寫作，但不代寫",
    date: "2026/9/12（六）",
    time: "09:00–12:00（3 小時）",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 20,
    cohorts: [
      // 第一期報名已截止（18/20），商品已於 Recur 設為 active: false。
      {
        key: "1",
        name: "第一期",
        date: "2026/8/16（日）",
        productIds: [
          "b3dc06svryzlii74r2bpn6qo", // 早鳥
          "u0rnbc9kgub6azuw44ub72ml", // 原價
        ],
      },
      {
        key: "2",
        name: "第二期",
        date: "2026/9/12（六）",
        open: true,
        productIds: [
          "tpl4a90ujudu17w69oggetbk", // 早鳥
          "dckcqar572yqgeij7ubqsljj", // 原價
        ],
      },
    ],
    recurProductIdEarlyBird: "tpl4a90ujudu17w69oggetbk",
    earlyBirdPrice: 4500,
    earlyBirdDeadline: "2026-08-12",
    recurProductIdRegular: "dckcqar572yqgeij7ubqsljj",
    regularPrice: 5500,
    detailUrl: "/courses/ai-academic-writing",
    hideInvoiceSection: true,
    customQuestionLabel:
      "你目前的研究階段與最想用 AI 解決的卡點？（選填，寫了講師會優先在課堂回應你的情境）",
    customQuestionPlaceholder:
      "例：碩二在寫文獻回顧，想用 AI 有效率地讀完幾十篇論文；或：初稿卡住，想用 AI 把草稿改得更清楚、更有邏輯……",
    preRegistrationNotice:
      "本課程以 AI Agent 實作為主，請務必自備筆電，並建議於課前訂閱一個月 Claude Pro（US$20／月），先安裝、登入 Claude Code（若用 Codex，它沒有獨立方案、包含在 ChatGPT 付費帳號／ChatGPT Plus 中；課程不代付）。【重要原則】這堂課教的是 AI 輔助研究與寫作的方法論與心態，不教也不鼓勵 AI 代寫；核心思考與研究洞察仍須來自你自己，課程會一併帶到學術倫理與 AI 使用揭露。",
    attributionOptions: [
      "Vista 的電子報",
      "Vista 的 FB／IG／Threads",
      "聽過 Vista 的演講／上過課",
      "朋友／同事推薦",
      "學校／實驗室推薦",
      "搜尋引擎找到的",
      "其他（請在備註說明）",
    ],
  },
  // vibe-coding-claude-code（第 2 班）已取消 8/1 開課，改為開課通知模式（2026-07-12）。
  // 報名表單設定停用，比照 ai-social-content 等已下架課程的慣例：不留 COURSE_CONFIGS 條目，
  // /courses/vibe-coding-claude-code/register 直接 404；課程狀態見 src/lib/workshops.ts（status: coming_soon）。
  "ai-content": {
    slug: "ai-content",
    title: "AI 內容產製系統工作坊",
    subtitle: "一份素材，自動產出六種格式：3 小時建立你的內容產製系統",
    date: "2026/8/30（日）",
    time: "9:00–12:00（3 小時，含休息）",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 16,
    cohorts: [
      {
        key: "1",
        name: "第一期",
        date: "2026/8/30（日）",
        startsAt: "2026-08-30T09:00:00+08:00",
        open: true,
        productIds: ["gngyqhltfyujbl0wjd78304x"],
      },
    ],
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
    date: "2026/8/15（六）",
    time: "9:00–12:00（3 小時）",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 12,
    cohorts: [
      {
        key: "1",
        name: "第一期",
        date: "2026/8/15（六）",
        open: true,
        productIds: ["y7q482kwsc16h7iw3akwufzq"],
      },
    ],
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
    location: "線上 Google Meet＋LINE 群組互動討論（報名後寄送連結、提供回放）",
    capacity: 15,
    cohorts: [
      {
        key: "1",
        name: "創辦梯次",
        date: "2026/8/6 起連續 6 週（週四）",
        open: true,
        productIds: [
          "df2j3u3vfh8u2wwh14048yym", // 單人
          "bq16q93lbuddoarykucd311m", // 雙人同行
          "jz9tbaygcitkkdpr3y5ah97z", // VIP 診斷席
        ],
      },
    ],
    recurProductIdRegular: "df2j3u3vfh8u2wwh14048yym",
    regularPrice: 9999,
    recurProductIdDual: "bq16q93lbuddoarykucd311m",
    dualPrice: 18000,
    recurProductIdVip: "jz9tbaygcitkkdpr3y5ah97z",
    vipPrice: 16800,
    vipNote:
      "限 5 名：含 6 週全部內容，另加課前概念診斷＋課後 30 分鐘一對一產品診斷與銷售角度修改建議",
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

export type PricingPlan = "early_bird" | "regular" | "vip" | "dual" | "alumni";

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
  let base: ResolvedPricing;

  if (
    plan === "alumni" &&
    config.recurProductIdAlumni &&
    config.alumniPrice !== undefined
  ) {
    base = {
      plan: "alumni",
      productId: config.recurProductIdAlumni,
      amount: config.alumniPrice,
      isEarlyBird: false,
    };
  } else if (
    plan === "vip" &&
    config.recurProductIdVip &&
    config.vipPrice !== undefined
  ) {
    base = {
      plan: "vip",
      productId: config.recurProductIdVip,
      amount: config.vipPrice,
      isEarlyBird: false,
    };
  } else if (
    plan === "dual" &&
    config.recurProductIdDual &&
    config.dualPrice !== undefined
  ) {
    base = {
      plan: "dual",
      productId: config.recurProductIdDual,
      amount: config.dualPrice,
      isEarlyBird: false,
    };
  } else if (
    plan === "early_bird" &&
    config.recurProductIdEarlyBird &&
    config.earlyBirdPrice !== undefined &&
    isEarlyBirdActive(config, now)
  ) {
    base = {
      plan: "early_bird",
      productId: config.recurProductIdEarlyBird,
      amount: config.earlyBirdPrice,
      isEarlyBird: true,
    };
  } else {
    base = {
      plan: "regular",
      productId: config.recurProductIdRegular,
      amount: config.regularPrice,
      isEarlyBird: false,
    };
  }

  return base;
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

  if (config.recurProductIdVip && config.vipPrice !== undefined) {
    plans.push({
      plan: "vip",
      label: "VIP 診斷席",
      amount: config.vipPrice,
      description: config.vipNote ?? "含全部內容，另加一對一產品診斷",
      productId: config.recurProductIdVip,
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

/**
 * 招生中的那一期，沒有就回 null。
 *
 * 報名時據此決定 cohort_key。至多一期為 open 由 courses-config.test.ts 保證。
 */
export function getOpenCohort(config: CourseConfig): Cohort | null {
  return config.cohorts.find((c) => c.open) ?? null;
}

/** 以 key 取得期別。 */
export function getCohort(config: CourseConfig, key: string): Cohort | null {
  return config.cohorts.find((c) => c.key === key) ?? null;
}

/**
 * 依 Recur 商品 ID 找出期別。
 *
 * 回填與報名歸期的依據：買了哪個商品就是哪一期。這是付款紀錄裡的事實，
 * 不是從時間推論出來的。
 */
export function getCohortByProductId(
  config: CourseConfig,
  productId: string,
): Cohort | null {
  return config.cohorts.find((c) => c.productIds.includes(productId)) ?? null;
}
