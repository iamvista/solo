// src/lib/consulting-config.ts
export type ConsultingTopicSlug =
  | "vibe-coding"
  | "personal-site"
  | "solo-os"
  | "content-pipeline"
  | "second-brain"
  | "academic-writing"
  | "solo-business"
  | "custom";

export type ConsultingPlanSlug = "1hr" | "3hr" | "5hr" | "10hr" | "20hr";

export interface ConsultingTopic {
  slug: ConsultingTopicSlug;
  emoji: string;
  group: "tech" | "workflow" | "academic" | "business" | "custom";
  title: string;
  oneLiner: string;
  takeaway: string;
}

export interface ConsultingPlan {
  slug: ConsultingPlanSlug;
  hours: number;
  totalPrice: number;
  pricePerHour: number;
  label: string;
  suitedFor: string;
  recurProductId: string;
}

export const CONSULTING_TOPICS: ConsultingTopic[] = [
  {
    slug: "vibe-coding",
    emoji: "💻",
    group: "tech",
    title: "Vibe Coding 入門",
    oneLiner: "第一個 web app／小工具，從零到上線",
    takeaway: "一個部署在 Vercel / GitHub Pages 的可用作品",
  },
  {
    slug: "personal-site",
    emoji: "🌐",
    group: "tech",
    title: "個人網站系統",
    oneLiner: "仿 solo.tw / vista.tw 的一人媒體站",
    takeaway: "上線的個人網站 + 部署 SOP",
  },
  {
    slug: "solo-os",
    emoji: "🎛",
    group: "workflow",
    title: "個人作業系統建置",
    oneLiner: "把 Calendar / Notion / Anytype / Obsidian 串成能運作的一人事業系統",
    takeaway: "個人化作業系統設定 + 工作流 SOP",
  },
  {
    slug: "content-pipeline",
    emoji: "✍️",
    group: "workflow",
    title: "內容生產 Pipeline",
    oneLiner: "研究 → 撰稿 → 去 AI 味 → 多平臺分發",
    takeaway: "個人化內容 pipeline + 模板包",
  },
  {
    slug: "second-brain",
    emoji: "🧠",
    group: "workflow",
    title: "第二大腦／知識管理",
    oneLiner: "Wiki、backlink、AI 檢索",
    takeaway: "知識管理系統 + AI 檢索 SOP",
  },
  {
    slug: "academic-writing",
    emoji: "📚",
    group: "academic",
    title: "AI 輔助學術寫作",
    oneLiner: "文獻、Intro、方法、投稿，AI 是您的研究伙伴",
    takeaway: "學術寫作 workflow + AI prompt 模板",
  },
  {
    slug: "solo-business",
    emoji: "🎯",
    group: "business",
    title: "一人事業起步診斷",
    oneLiner: "定位、產品、定價、首批客戶",
    takeaway: "個人化事業地圖 + 90 天行動計畫",
  },
  {
    slug: "custom",
    emoji: "🌀",
    group: "custom",
    title: "我有別的需求",
    oneLiner: "不在上面這七個主題裡？告訴我您的卡關",
    takeaway: "客製方案",
  },
];

export const CONSULTING_PLANS: ConsultingPlan[] = [
  {
    slug: "1hr",
    hours: 1,
    totalPrice: 3000,
    pricePerHour: 3000,
    label: "1 小時諮詢",
    suitedFor: "試水溫、單點問題",
    recurProductId: "zimy2xm5pv24dfxx194axeev",
  },
  {
    slug: "3hr",
    hours: 3,
    totalPrice: 8400,
    pricePerHour: 2800,
    label: "3 小時套票",
    suitedFor: "入門包、一個小主題收尾",
    recurProductId: "efmn8pw5tielzrgwffb76swd",
  },
  {
    slug: "5hr",
    hours: 5,
    totalPrice: 13500,
    pricePerHour: 2700,
    label: "5 小時套票",
    suitedFor: "一個主題深入",
    recurProductId: "dwdt6ikhule9j0hs1px77rke",
  },
  {
    slug: "10hr",
    hours: 10,
    totalPrice: 26000,
    pricePerHour: 2600,
    label: "10 小時套票",
    suitedFor: "跨主題諮詢",
    recurProductId: "mndmvwsgvevq7ogdklt7i3h6",
  },
  {
    slug: "20hr",
    hours: 20,
    totalPrice: 48000,
    pricePerHour: 2400,
    label: "20 小時套票",
    suitedFor: "長期顧問關係",
    recurProductId: "q2z9d2dd6vymycdq1b35iz2w",
  },
];

export const CONSULTING_LEVELS = [
  { value: "beginner", label: "完全新手，連 ChatGPT 都不太會用" },
  { value: "basic", label: "會用 ChatGPT / Claude，能寫基本 prompt" },
  { value: "intermediate", label: "用過 Cursor / Claude Code，做過小東西" },
  { value: "advanced", label: "已有作品，想升級工作流" },
  { value: "expert", label: "我是工程師／研究者，要進階知識" },
] as const;

export const CONSULTING_DESIRED_START = [
  { value: "this_week", label: "本週" },
  { value: "2_weeks", label: "兩週內" },
  { value: "1_month", label: "一個月內" },
  { value: "no_rush", label: "兩個月內" },
] as const;

export const CONSULTING_ATTRIBUTION = [
  "朋友推薦",
  "工作坊",
  "《Vista 電子報》",
  "社群媒體",
  "Google 搜尋",
  "其他",
] as const;

export const EXPIRY_MONTHS = 6;
export const EXTENSION_MONTHS = 3;

export function getPlanBySlug(slug: ConsultingPlanSlug | "undecided"): ConsultingPlan | null {
  if (slug === "undecided") return null;
  return CONSULTING_PLANS.find((p) => p.slug === slug) ?? null;
}

export function getTopicBySlug(slug: string): ConsultingTopic | null {
  return CONSULTING_TOPICS.find((t) => t.slug === slug) ?? null;
}
