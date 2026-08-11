// 工作坊與課程資料

export interface Instructor {
  name: string;
  title: string;
  avatar?: string;
  url?: string;
  /** 有 slug 才會生成作者頁 /teachers/[slug] */
  slug?: string;
  /** 一句定位（Hero 副標） */
  bio?: string;
  /** 段落式自我介紹，支援 \n 換行 */
  longBio?: string;
  /** 社群／官網連結 */
  links?: { label: string; url: string }[];
  /** 加 LINE 好友連結，預設沿用站臺 LINE OA */
  lineOaUrl?: string;
}

export interface WorkshopPrice {
  original: number;
  regular?: number;
  earlyBird?: number;
  earlyBirdDeadline?: string;
  dual?: number;
}

export interface Workshop {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  instructor: Instructor;
  emoji: string;
  date: string;
  sortDate: string; // ISO 格式 YYYY-MM-DD，用於排序
  time: string;
  duration: string;
  location: string;
  capacity: number;
  price: WorkshopPrice;
  tags: string[];
  status: "open" | "filling" | "full" | "coming_soon" | "ended";
  url: string;
  isExternal: boolean;
  highlights: string[];
  category: "ai" | "finance" | "innovation";
  featured?: boolean;
  /** 完全隱藏：從 /courses 列表與講師頁都不露出（暫時下架用，資料保留） */
  hidden?: boolean;
  /** 梯次標示，例 "第 8 班" */
  cohort?: string;
  /** 結束課補充，例 "已開 7 梯、結訓 90+ 人" */
  endedNote?: string;
  /** Phase 2：課程回顧頁連結 */
  recapUrl?: string;
}

// 講師資料
const vista: Instructor = {
  name: "Vista",
  title: "AI 應用培訓師・內容策略顧問",
  avatar: "/images/workshops/instructor-vista.webp",
  url: "https://www.vista.tw",
  slug: "vista",
  bio: "用 AI 把你的專業變成能上線、能變現的數位資產。",
  longBio:
    "鄭緯筌（Vista），AI 應用培訓師與內容策略顧問。\n陪伴上千位專業工作者，用 AI 與 vibe coding 把知識變成網站、課程與一人事業。\n相信工具是手段，留下能複利的數位資產才是目的。",
  links: [
    { label: "官網 vista.tw", url: "https://www.vista.tw" },
    { label: "Threads", url: "https://www.threads.com/@vista" },
    { label: "YouTube", url: "https://www.youtube.com/@vistacheng" },
  ],
};

const wenhao: Instructor = {
  name: "余文皓",
  title: "AI 工作流設計師・全端開發者",
  avatar: "/images/workshops/instructor-wenhao.webp",
};

const runsheng: Instructor = {
  name: "駱潤生",
  title: "CFP® 國際認證理財規劃顧問",
  avatar: "/images/workshops/instructor-runsheng-avatar.webp",
};

const susie: Instructor = {
  name: "Susie Li",
  title: "社群內容策略師・心理學碩士・資深媒體人",
  avatar: "/images/workshops/instructor-susie-2.webp",
  slug: "susie",
  bio: "心理學 × 內容力：從零打造不靠廣告的真實社群影響力。",
  longBio:
    "從臺灣媒體圈出發，移居海外後從零開始經營個人粉專，不靠廣告預算、不靠演算法紅利，純粹用內容的力量建立影響力。\n擁有心理學碩士背景與多年主流媒體經驗，深諳內容產製邏輯，更理解人為什麼會想回應、想分享。",
  links: [
    { label: "Facebook", url: "https://www.facebook.com/susie.li.35" },
  ],
};

// 課程分類
export const categories = {
  ai: { label: "AI 應用系列", emoji: "🤖" },
  finance: { label: "樂齡理財系列", emoji: "🔒" },
  innovation: { label: "創新思維系列", emoji: "💡" },
} as const;

export type WorkshopCategory = keyof typeof categories;

// 工作坊列表
export const workshops: Workshop[] = [
  {
    // 2026-08-11 新建：《無人公司》翻書為課的六小時工作坊。
    // 開課日期尚未拍板，沿用 vibe-coding-claude-code 的 coming_soon 寫法：
    // date 寫成給人看的說明、sortDate 用 9999-12-31 排到最後，
    // 沒有 COURSE_CONFIGS 對應項（沒有報名表單，CTA 是開課通知）。
    // 2026-08-12 依 Vista 指示不把時間寫死：time 與 duration 不寫時刻與時數，
    // 招生頁的課程表也改成段落序號而非時刻表，避免開課單位或學員拿時間點反問，
    // 也讓現場節奏有調整餘裕。
    // 定價走創始會員結構（2026-08-12 依市場行情調整）：正式價 12,800、創始梯次 8,800。
    // 原本訂 8,800／5,800 明顯低於市場：商業實體一日 vibe coding 課的
    // 真實價格帶是 10,800 至 16,800（dotdot.school 七小時實體原價 16,800、
    // 優惠 10,800）。先前參照的 ACCUPASS 4,380 是對比掛牌 63,000+ 的引流特價，
    // 不是行情。5,800 在這個區間會被讀成便宜貨，反而傷定位。
    // 回訓 NT$1,000（2026-08-12 Vista 拍板）：市場上「複訓」慣例是免費或只收
    // 500 元左右的場地行政費（無極限培訓集團就是 500），跟「舊生重新報名打
    // 七到九折」是兩回事。原本寫的「回訓終身鎖定 5,800」等於日後付全額，
    // 不是誘因，已修正。
    id: "solo-company",
    title: "無人公司工作坊",
    subtitle: "一個人，如何把自己寫成一套會運轉的系統",
    description:
      "給案子接得到、客戶回得完，卻每一件都得自己碰一次的人。不是 AI 工具課，是用 AI 當執行力的經營課。一整天、八次動手，把重複又消耗你的工作變成一位當天就上工的 AI 員工與一條跑過一次的流程。創始梯次價 NT$8,800（正式價 12,800），限 20 名。",
    instructor: vista,
    emoji: "🏗️",
    date: "尚未公告，留信箱通知你",
    sortDate: "9999-12-31",
    time: "全日課程，上下半場各一段，中間午休（午餐自理）",
    duration: "一整天",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 20,
    featured: true,
    cohort: "創始梯次",
    price: {
      original: 12800,
      regular: 8800,
    },
    tags: ["AI", "一人公司", "自動化", "系統化", "實作"],
    status: "coming_soon",
    url: "/courses/solo-company",
    isExternal: false,
    highlights: [
      "下課前那位 AI 員工已經上工，並照你的標準交過一次東西",
      "核心是設定卡與 AOP 八格：把腦子裡的判斷寫成別人接得住的流程",
      "含護欄、責任與法律地基，不是只教油門不教煞車",
      "創始梯次價 NT$8,800（正式價 12,800）・限 20 名・日後回訓只收 NT$1,000",
    ],
    category: "ai",
  },
  {
    // 2026-08-01 Vista 指示下架：hidden 讓它從 /courses、講師頁、sitemap 與
    // llms.txt 全部退場，資料保留可隨時復原。頁面網址本身仍可直接開啟，
    // Recur 三個付款方案也仍然有效，那兩層要另外處理。
    id: "concept-monetization-bootcamp",
    title: "概念變現陪跑營",
    subtitle: "6 週，用 AI 把你的專業變成一個會賣的知識產品",
    description:
      "給已有專業、卻卡在「想很久卻沒做成產品」的講師、顧問、教練。6 週線上直播陪跑，帶你用 AI 盤點專業、校準市場痛點、設計最小可賣產品，並真的發出第一波市場測試。結業帶走一份概念變現事業藍圖。創辦梯次價 NT$9,999（原價 16,800），限 15 名。",
    instructor: vista,
    emoji: "🎯",
    date: "2026 年 8/6 起連續 6 週（週四晚上）",
    sortDate: "2026-08-06",
    time: "20:00–21:30",
    duration: "6 週 × 90 分鐘",
    location: "線上 Google Meet",
    capacity: 15,
    featured: true,
    cohort: "創辦梯次",
    price: {
      original: 16800,
      regular: 9999,
      dual: 18000,
    },
    tags: ["AI", "知識變現", "產品化", "線上陪跑"],
    status: "open",
    hidden: true,
    url: "/courses/concept-monetization-bootcamp",
    isExternal: false,
    highlights: [
      "6 週直播陪跑＋社群互評，不是上完就結束",
      "賣的是結果：帶走可測試的產品雛形並真的發出去",
      "適合已有專業、想把它做成會賣產品的講師／顧問／教練",
      "創辦梯次價 NT$9,999（原價 16,800）・限 15 名",
    ],
    category: "ai",
  },
  {
    id: "positioning-convergence",
    title: "定位收斂工作坊",
    subtitle: "什麼都會的人，如何選出那一個能變現的自己",
    description:
      "給「什麼都會、卻選不出一個自己」的人：命理師、占卜師、各類教練與身心靈工作者。這不是寫作課，而是陪你用六步收斂法狠下心收斂成一個記得住、又能變現的定位。3 小時帶走一句話定位與一個主產品方向。",
    instructor: susie,
    emoji: "🧭",
    date: "2026 年 9 月 5 日（六）",
    sortDate: "2026-09-05",
    time: "臺灣時間 15:00–18:00",
    duration: "3 小時",
    location: "線上舉辦（報名後通知會議網址連結）",
    capacity: 20,
    price: {
      original: 4500,
      regular: 4500,
    },
    tags: ["定位", "個人品牌", "內容策略", "收斂取捨"],
    status: "open",
    cohort: "第二期",
    url: "/courses/positioning-convergence",
    isExternal: false,
    highlights: [
      "六步收斂法：從一團亂走到一個清楚定位",
      "核心是第三步「收斂取捨」：陪你走過「捨」這一關",
      "五層內容引擎：把感受翻成讓人記住的語言",
      "3 小時帶走一句話定位＋一個主產品方向",
    ],
    category: "innovation",
  },
  {
    id: "ai-academic-writing",
    title: "AI 賦能學術研究與寫作實戰工作坊",
    subtitle: "用 AI Agent 當研究副駕駛，加速研究與寫作（不是代寫）",
    description:
      "給研究生、博士生、大學教師與研究員：用 AI Agent（Claude Code／Codex）當研究副駕駛，從方法與心態到文獻搜集與改稿，跑通研究與寫作工作流。強調 AI 輔助而非代寫，核心思考仍來自你自己，含學術倫理與 AI 揭露。課程以 AI Agent 實作，請自備筆電並建議訂閱 Claude Pro（Codex 含於 ChatGPT 付費帳號）。3 小時帶走一套可複用的個人 AI 學術工作流。",
    instructor: vista,
    emoji: "🎓",
    date: "2026 年 9 月 12 日（六）",
    sortDate: "2026-09-12",
    time: "9:00–12:00",
    duration: "3 小時",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 20,
    price: {
      original: 5500,
      earlyBird: 4500,
      earlyBirdDeadline: "8/12 前",
    },
    tags: ["AI", "學術研究", "論文寫作", "研究生"],
    status: "open",
    url: "/courses/ai-academic-writing",
    isExternal: false,
    highlights: [
      "AI 當研究副駕駛：心態、方法、文獻搜集到改稿一次跑通",
      "輔助不代寫：核心思考與洞察仍來自你自己",
      "實作用 AI Agent，需自備筆電並建議訂閱 Claude Pro（Codex 含於 ChatGPT 帳號）",
      "含學術倫理與 AI 使用揭露原則，投稿不踩雷",
    ],
    category: "ai",
  },
  {
    id: "vibe-coding",
    title: "Vibe Coding 實戰工作坊",
    subtitle: "用 AI 建立你的數位資產，不需要寫程式",
    description:
      "3 小時實作課程，學會用 AI 建立個人品牌網站、銷售頁、名單收集漏斗與互動工具。",
    instructor: vista,
    emoji: "💻",
    date: "2026 年 8 月 15 日（六）",
    sortDate: "2026-08-15",
    time: "9:00–12:00",
    duration: "3 小時",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 12,
    price: {
      original: 4000,
      regular: 4000,
    },
    tags: ["AI", "網站建置", "實作"],
    status: "open",
    url: "/courses/vibe-coding",
    isExternal: false,
    highlights: [
      "零程式基礎也能上手",
      "現場完成一個可上線的網站",
      "學會 AI 溝通與 Prompt 技巧",
      "含部署、分析、設計全流程",
    ],
    category: "ai",
  },
  {
    id: "vibe-coding-claude-code",
    title: "Vibe Coding for Claude Code 實戰工作坊",
    subtitle: "在終端機裡 3 小時建立你的數位資產（Claude Code 第 2 班）",
    description:
      "Anthropic 官方 CLI、旗艦級 Claude 模型、整個資料夾的上下文。3 小時跑通 Plan Mode、Skills、Hooks、MCP，舊生現折 NT$1,000。請自備 Claude Pro 或 Claude Max 訂閱。",
    instructor: vista,
    emoji: "🛠️",
    // 第 2 班取消 8/1 開課（2026-07-12），改為開課通知模式，日期尚未公告
    date: "尚未公告，留信箱通知你",
    sortDate: "9999-12-31",
    time: "9:00–12:00",
    duration: "3 小時",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 12,
    cohort: "第 2 班",
    price: {
      original: 4500,
      regular: 4500,
    },
    tags: ["AI", "Claude Code", "進階", "實作"],
    status: "coming_soon",
    url: "/courses/vibe-coding-claude-code",
    isExternal: false,
    highlights: [
      "Claude Code 第 2 班・限 12 名小班制",
      "用旗艦 Claude 模型 + 整個資料夾的上下文",
      "Plan Mode、Skills、Hooks、MCP 一次跑通",
      "Antigravity 版舊生報名現折 NT$1,000",
    ],
    category: "ai",
  },
  {
    id: "ai-content",
    title: "AI 內容產製系統工作坊",
    subtitle: "一份素材，自動產出六種格式",
    description:
      "3 小時實作課程，用 Claude Code 建立完整的內容產製系統，從輸入到多平臺分發一次搞定。",
    instructor: vista,
    emoji: "✍️",
    date: "2026 年 8 月 30 日（日）",
    sortDate: "2026-08-30",
    time: "9:00–12:00",
    duration: "3 小時",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 16,
    price: {
      original: 7000,
      earlyBird: 5000,
      earlyBirdDeadline: "開課前 14 天",
    },
    tags: ["AI", "內容經營", "系統化"],
    status: "open",
    url: "/courses/ai-content",
    isExternal: false,
    highlights: [
      "建立五層內容產製架構",
      "一份內容自動轉六種格式",
      "用 Claude Code 實作完整系統",
      "學員好評推薦的實戰課程",
    ],
    category: "ai",
  },
  {
    id: "ai-social-content",
    title: "用 AI 寫出讓人忍不住留言的社群內容",
    subtitle: "心理學 × AI 提問術，3 小時帶走一套高互動內容產製系統",
    description:
      "結合社群互動心理學與 AI 協作，學會設計讓人想按讚、想留言、想分享的內容。不只教你下 prompt，而是教你一套從靈感到發布的完整系統。",
    instructor: susie,
    emoji: "💬",
    date: "2026 年 5 月（已開三班）",
    sortDate: "2026-05-30",
    time: "9:00–12:00",
    duration: "3 小時",
    location: "臺北市區",
    capacity: 20,
    price: {
      original: 4500,
      earlyBird: 3500,
      earlyBirdDeadline: "開課前 14 天",
    },
    tags: ["AI", "社群經營", "內容策略", "心理學"],
    status: "ended",
    cohort: "已開三班",
    endedNote: "好評加開三班、結訓學員口碑推薦；想上下一梯可在下方留下聯絡方式。",
    url: "/courses/ai-social-content",
    isExternal: false,
    highlights: [
      "學會五種高互動內容的心理學模型",
      "用 AI 產出有溫度、有互動的社群貼文",
      "帶走一套從靈感到發布的內容工作流",
      "現場完成一篇可直接發布的高互動貼文",
    ],
    category: "ai",
  },
  {
    // stories.tw 培育序列第 4、5 封的落點。
    // 2026-08-01 銷售頁上線並公開，同日經 Vista 拍板改為 open。
    // 注意：本期線上刷卡尚未開通，報名走留信箱後人工確認。銷售頁因此不使用
    // CourseNotifyEntry：open 狀態下它會降級成「這個時間無法參加」的次要連結，
    // 那句話在沒有報名按鈕的頁面上是錯的，也會藏起唯一的轉換點。該頁改為
    // 直接展開收單表單，送出的 intent 與 source_page 與原本一致。
    id: "story-canvas",
    title: "故事力就是你的成交力",
    subtitle: "把一則沒人記得的產品介紹，改成別人聽完會想問多少錢的故事",
    description:
      "會說故事跟靠故事賣東西是兩回事。這堂課處理後者：找出客戶掏錢那一刻的成交故事，放進開場、見證、報價與追單四個位置，現場唸給陌生人聽，驗收兩件事：他複述得出來嗎，以及他聽完會不會想問價格。",
    instructor: vista,
    emoji: "💬",
    date: "2026 年 10 月 18 日（日）",
    sortDate: "2026-10-18",
    time: "9:00–12:00",
    duration: "3 小時",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 20,
    price: {
      original: 5000,
      earlyBird: 3600,
      earlyBirdDeadline: "2026/9/18",
    },
    tags: ["敘事", "文案", "成交", "個人品牌"],
    status: "open",
    url: "/courses/story-canvas",
    isExternal: false,
    highlights: [
      "雙層判準：複述得出來，而且聽完會想問價格",
      "四個賣點位置：開場鉤子、見證改寫、報價說明、售後追單",
      "把形容詞換成數字、畫面與代價",
      "實體小班 20 人，現場找陌生人做轉述測試",
    ],
    category: "ai",
  },
];

/** 取課程（依 slug）。課程頁的通知入口共用這支，免得各入口各查一份而漂移。 */
export function getWorkshopBySlug(slug: string): Workshop | undefined {
  return workshops.find((w) => w.id === slug);
}

/** 取得有作者頁的老師（依 slug） */
export function getInstructorBySlug(slug: string): Instructor | undefined {
  return workshops.map((w) => w.instructor).find((i) => i.slug === slug);
}

/** 所有有 slug 的老師（給 generateStaticParams） */
export function getAllInstructorSlugs(): string[] {
  const slugs = workshops.map((w) => w.instructor.slug).filter(
    (s): s is string => !!s,
  );
  return Array.from(new Set(slugs));
}

/** 取某老師的課，依狀態分三組；enrolling/comingSoon 由近到遠、ended 由新到舊 */
export function getInstructorWorkshops(slug: string): {
  enrolling: Workshop[];
  comingSoon: Workshop[];
  ended: Workshop[];
} {
  const mine = workshops.filter((w) => w.instructor.slug === slug && !w.hidden);
  const byDateAsc = (a: Workshop, b: Workshop) =>
    a.sortDate.localeCompare(b.sortDate);
  const byDateDesc = (a: Workshop, b: Workshop) =>
    b.sortDate.localeCompare(a.sortDate);
  return {
    enrolling: mine
      .filter((w) => ["open", "filling", "full"].includes(w.status))
      .sort(byDateAsc),
    comingSoon: mine.filter((w) => w.status === "coming_soon").sort(byDateAsc),
    ended: mine.filter((w) => w.status === "ended").sort(byDateDesc),
  };
}
