// 工作坊與課程資料

export interface Instructor {
  name: string;
  title: string;
  avatar?: string;
  url?: string;
}

export interface WorkshopPrice {
  original: number;
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
    id: "ai-command-center",
    title: "用 AI 建你的個人指揮中心",
    subtitle: "6 小時帶走一套能跑的目標管理 × 知識管理 × AI 自動化系統",
    description:
      "用 Claude Code + Obsidian 打造目標管理、知識管理、AI 自動化工作流。不用寫程式，帶著能跑的系統回家。",
    instructor: vista,
    emoji: "🚀",
    date: "2026/5/16（六）",
    time: "9:00–16:00",
    duration: "6 小時",
    location: "台北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 20,
    price: {
      original: 12800,
      earlyBird: 6000,
      earlyBirdDeadline: "4 月 10 日前",
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
    featured: true,
  },
  {
    id: "vibe-coding",
    title: "Vibe Coding 實戰工作坊",
    subtitle: "用 AI 打造你的數位資產，不需要寫程式",
    description:
      "3 小時實作課程，學會用 AI 建立個人品牌網站、銷售頁、名單收集漏斗與互動工具。",
    instructor: vista,
    emoji: "💻",
    date: "2026/3/7 (六)、3/21 (六)",
    time: "9:00–12:00",
    duration: "3 小時",
    location: "台北市區・捷運站步行可達",
    capacity: 10,
    price: {
      original: 4000,
      earlyBird: 3600,
      earlyBirdDeadline: "開課前 14 天",
      dual: 3500,
    },
    tags: ["AI", "網站建置", "實作"],
    status: "open",
    url: "https://www.vista.tw/workshop/vibe-coding",
    isExternal: true,
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
    date: "2026/4/25 (六)",
    time: "9:00–12:00",
    duration: "3 小時",
    location: "台北市區・捷運站步行可達",
    capacity: 10,
    price: {
      original: 4800,
      earlyBird: 4500,
      earlyBirdDeadline: "開課前 14 天",
      dual: 3800,
    },
    tags: ["AI", "內容經營", "系統化"],
    status: "open",
    url: "https://www.vista.tw/workshop/ai-content",
    isExternal: true,
    highlights: [
      "建立五層內容產製架構",
      "一份內容自動轉六種格式",
      "用 Claude Code 實作完整系統",
      "含 30 分鐘課後一對一諮詢",
    ],
    category: "ai",
  },
  {
    id: "innovation-workshop",
    title: "創新實戰工作坊",
    subtitle: "6 個小時，用創新思維解決職場三大問題",
    description:
      "不光是來聽課，而是現場就讓你的問題迎刃而解！用「創新方程式」六步驟，帶你從真實工作難題走到可執行方案。",
    instructor: jianming,
    emoji: "💡",
    date: "2026/3/14 (六)",
    time: "9:00–16:00",
    duration: "6 小時",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 10,
    price: {
      original: 7200,
      earlyBird: 3600,
      earlyBirdDeadline: "3 月 7 日前",
    },
    tags: ["創新", "問題解決", "實作"],
    status: "open",
    url: "/courses/innovation-workshop",
    isExternal: false,
    highlights: [
      "帶走一份《解法設計藍圖》",
      "50% 方法拆解 + 50% 現場實作",
      "創新方程式六步驟完整走一輪",
      "小組協作 + 遊戲化引導思考",
    ],
    category: "innovation",
  },
  {
    id: "senior-asset-safety",
    title: "樂齡資產安全與傳承實戰課",
    subtitle: "3 小時打造你的資產安全藍圖",
    description:
      "不是談理論，而是教你如何真正守住資產、守住家人。退休不是終點，真正的風險，才正要開始。",
    instructor: runsheng,
    emoji: "🔒",
    date: "2026/4/19（日）",
    time: "14:00–17:00",
    duration: "3 小時",
    location: "台北市區（報名後通知地點）",
    capacity: 10,
    price: {
      original: 2800,
      earlyBird: 2000,
      earlyBirdDeadline: "開課前 14 天",
      dual: 1800,
    },
    tags: ["資產安全", "信託規劃", "傳承"],
    status: "open",
    url: "/courses/senior-asset-safety",
    isExternal: false,
    highlights: [
      "全面檢視資產現況與風險缺口",
      "了解遺囑、醫療決定、意定監護",
      "掌握信託規劃的基本架構",
      "真實案例解析，回家就能開始行動",
    ],
    category: "finance",
  },
];
