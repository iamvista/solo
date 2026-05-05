// 工作坊與課程資料

export interface Instructor {
  name: string;
  title: string;
  avatar?: string;
  url?: string;
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
  status: "open" | "filling" | "full" | "coming_soon";
  url: string;
  isExternal: boolean;
  highlights: string[];
  category: "ai" | "finance" | "innovation";
  featured?: boolean;
}

// 講師資料
const vista: Instructor = {
  name: "Vista",
  title: "AI 應用培訓師・內容策略顧問",
  avatar: "/images/workshops/instructor-vista.webp",
  url: "https://www.vista.tw",
};

const jianming: Instructor = {
  name: "陳建銘",
  title: "創新先生・職場創新顧問",
  url: "https://www.innovators.tw",
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
  title: "社群內容策略師・心理學碩士",
  avatar: "/images/workshops/instructor-susie-2.webp",
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
    id: "ai-proposal-spotlight",
    title: "AI 提案成交力",
    subtitle: "讓主管與客戶點頭的實戰工作坊｜陳建銘老師親授",
    description:
      "你的提案其實並不差，而是還沒找到讓對方點頭的那個理由。用「靈感製造機法則」把『沒亮點』變成『非做不可』，現場做出一份下週可呈交的優化版提案。",
    instructor: jianming,
    emoji: "✨",
    date: "2026/6/13（六）",
    sortDate: "2026-06-13",
    time: "9:00–16:00",
    duration: "6 小時",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 16,
    featured: true,
    price: {
      original: 7800,
      earlyBird: 4980,
      earlyBirdDeadline: "2026/5/30",
    },
    tags: ["AI", "提案", "職場進化", "說服"],
    status: "open",
    url: "/courses/ai-proposal-spotlight",
    isExternal: false,
    highlights: [
      "用靈感製造機法則找到讓對方點頭的理由，再讓 AI 把亮點放大",
      "5 樣實戰工具：檢核表、12 維拆解、30 種改法、Prompt 模板、優化版提案",
      "雙人同行 NT$8,888（兩人互相扮演提案方/決策方練習）",
      "限 16 名小班・含精美午餐・早鳥贈限量《創新的秘密》工具牌",
    ],
    category: "innovation",
  },
  {
    id: "ai-command-center",
    title: "用 AI 建你的個人指揮中心",
    subtitle: "6 小時帶走一套能跑的目標管理 × 知識管理 × AI 自動化系統",
    description:
      "用 Claude Code + Obsidian 打造目標管理、知識管理、AI 自動化工作流。不用寫程式，帶著能跑的系統回家。",
    instructor: vista,
    emoji: "🚀",
    date: "2026/5/16（六）",
    sortDate: "2026-05-16",
    time: "9:00–16:00",
    duration: "6 小時",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 20,
    price: {
      original: 12800,
      regular: 9800,
      dual: 10800,
    },
    tags: ["AI", "生產力", "系統化", "實作"],
    status: "open",
    url: "/courses/ai-command-center",
    isExternal: false,
    highlights: [
      "帶走 12 週目標追蹤表 + 知識庫 + 2 個自動化腳本",
      "Claude Code + Obsidian 全實作，不需寫程式",
      "兩位講師聯手：內容策略 × AI 工作流",
      "限 20 名，現場完成一套可立即使用的系統",
    ],
    category: "ai",
  },
  {
    id: "vibe-coding",
    title: "Vibe Coding 實戰工作坊",
    subtitle: "用 AI 打造你的數位資產，不需要寫程式",
    description:
      "3 小時實作課程，學會用 AI 建立個人品牌網站、銷售頁、名單收集漏斗與互動工具。",
    instructor: vista,
    emoji: "💻",
    date: "2026 年 5 月 9 日（六）",
    sortDate: "2026-05-09",
    time: "9:00–12:00",
    duration: "3 小時",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 12,
    price: {
      original: 6500,
      earlyBird: 4000,
      earlyBirdDeadline: "開課前 14 天",
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
    id: "ai-content",
    title: "AI 內容產製系統工作坊",
    subtitle: "一份素材，自動產出六種格式",
    description:
      "3 小時實作課程，用 Claude Code 建立完整的內容產製系統，從輸入到多平台分發一次搞定。",
    instructor: vista,
    emoji: "✍️",
    date: "2026 年 5 月 23 日（六）",
    sortDate: "2026-05-23",
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
    title: "用 AI 寫出讓人忍不住留言的社群內容 ｜好評加開",
    subtitle: "心理學 × AI 提問術，3 小時帶走一套高互動內容產製系統",
    description:
      "結合社群互動心理學與 AI 協作，學會設計讓人想按讚、想留言、想分享的內容。不只教你下 prompt，而是教你一套從靈感到發布的完整系統。",
    instructor: susie,
    emoji: "💬",
    date: "2026 年 5 月 3 日（日）",
    sortDate: "2026-05-03",
    time: "9:00–12:00",
    duration: "3 小時",
    location: "臺北市區（報名後通知地點）",
    capacity: 20,
    price: {
      original: 4500,
      earlyBird: 3500,
      earlyBirdDeadline: "開課前 14 天",
    },
    tags: ["AI", "社群經營", "內容策略", "心理學"],
    status: "open",
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
];
