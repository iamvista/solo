// 工作坊與課程資料

export interface Instructor {
  name: string;
  title: string;
  avatar?: string;
  url?: string;
  /** 有 slug 才會生成作者頁 /t/[slug] */
  slug?: string;
  /** 一句定位（Hero 副標） */
  bio?: string;
  /** 段落式自我介紹，支援 \n 換行 */
  longBio?: string;
  /** 社群／官網連結 */
  links?: { label: string; url: string }[];
  /** 加 LINE 好友連結，預設沿用站台 LINE OA */
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

// AI 變現研究院為三師聯合授課，列表卡片以研究院為單位呈現
const monetizationInstitute: Instructor = {
  name: "Joyce・Claire・Vista",
  title: "三位專家聯手授課",
  avatar: "/images/courses/ai-monetization-institute/instructor-vista.webp",
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
    id: "ai-monetization-institute",
    title: "AI 變現研究院",
    subtitle: "學 AI，不如學會用 AI 賺錢｜三位專家 × 三大主軸 × 一個目標",
    description:
      "從「會用 AI」走到「用 AI 賺錢」，中間隔著定位、效率、變現三道關卡。三位老師、四堂課各鎮守一關，陪你打造一條屬於自己的收入管道。單堂 NT$7,500，四堂套票 NT$19,800（原價 30,000，現省 10,200）。",
    instructor: monetizationInstitute,
    emoji: "💰",
    date: "2026 年 7/4、7/11、7/18、7/25（週六）",
    sortDate: "2026-07-04",
    time: "上午 9:00–12:00",
    duration: "4 堂 × 3 小時",
    location: "臺北市中山區松江路 64 巷 6 號（捷運松江南京站步行可達）",
    capacity: 20,
    price: {
      original: 30000,
      regular: 19800,
    },
    tags: ["AI", "個人品牌", "內容變現", "聯合授課"],
    status: "open",
    url: "/courses/ai-monetization-institute",
    isExternal: false,
    highlights: [
      "個人品牌、AI 生產力、內容變現三大關卡一次補齊",
      "Joyce 李文娟、Claire 張可佳、Vista 鄭緯筌三師聯手・共四堂",
      "五大學習階段：定位 → 工具 → 內容 → 流量 → 變現",
      "四堂套票 NT$19,800，現省 NT$10,200",
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
    date: "2026 年 7 月 26 日（日）",
    sortDate: "2026-07-26",
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
    subtitle: "在終端機裡 3 小時建立你的數位資產（Claude Code 首發班）",
    description:
      "Anthropic 官方 CLI、旗艦級 Claude 模型、整個資料夾的上下文。3 小時跑通 Plan Mode、Skills、Hooks、MCP，舊生現折 NT$1,000。請自備 Claude Pro 或 Claude Max 訂閱。",
    instructor: vista,
    emoji: "🛠️",
    date: "2026 年 6 月 27 日（六）",
    sortDate: "2026-06-27",
    time: "9:00–12:00",
    duration: "3 小時",
    location: "臺北市區・捷運站步行可達（報名後告知教室地址）",
    capacity: 12,
    featured: true,
    price: {
      original: 4500,
      regular: 4500,
    },
    tags: ["AI", "Claude Code", "進階", "實作"],
    status: "open",
    url: "/courses/vibe-coding-claude-code",
    isExternal: false,
    highlights: [
      "Claude Code 首發班・限 12 名小班制",
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
    date: "2026 年 7 月 12 日（日）",
    sortDate: "2026-07-12",
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
];

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
  const mine = workshops.filter((w) => w.instructor.slug === slug);
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
