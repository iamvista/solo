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

// 工作坊列表
export const workshops: Workshop[] = [
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
  },
  {
    id: "innovation-workshop",
    title: "創新實戰工作坊",
    subtitle: "6 小時，把你卡住的問題做成一張「可落地的解法藍圖」",
    description:
      "不是來聽課，是現場把你的問題做完。用「創新方程式」六步驟，帶你從真實工作難題走到可執行方案。",
    instructor: jianming,
    emoji: "💡",
    date: "2026/3/14 (六)",
    time: "9:00–16:00",
    duration: "6 小時",
    location: "台北市區・捷運站步行可達",
    capacity: 10,
    price: {
      original: 5980,
      earlyBird: 3280,
      earlyBirdDeadline: "3/7 前",
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
  },
];
