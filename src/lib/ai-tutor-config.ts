import { CONSULTING_LEVELS, CONSULTING_ATTRIBUTION, CONSULTING_DESIRED_START } from "./consulting-config";

export interface AiTutorTier {
  slug: "starter" | "advanced" | "deep";
  name: string;
  hours: number;
  price: number;
  pricePerHour: number;
  highlight?: boolean;
  suitedFor: string;
}

export const AI_TUTOR_TIERS: AiTutorTier[] = [
  { slug: "starter", name: "啟航", hours: 6, price: 21600, pricePerHour: 3600, suitedFor: "想先試、有單一明確目標" },
  { slug: "advanced", name: "進階", hours: 12, price: 40800, pricePerHour: 3400, highlight: true, suitedFor: "完整帶上手、做出可用成果" },
  { slug: "deep", name: "深掘陪跑", hours: 24, price: 76800, pricePerHour: 3200, suitedFor: "長期陪跑、團隊或多專案" },
];

export interface AiTutorDirection {
  slug: string;
  emoji: string;
  title: string;
  oneLiner: string;
}

export const AI_TUTOR_DIRECTIONS: AiTutorDirection[] = [
  { slug: "build-tools", emoji: "💻", title: "用 AI 做出自己的工具", oneLiner: "把重複的工作變成一個能用的小程式" },
  { slug: "content", emoji: "✍️", title: "AI 內容與行銷", oneLiner: "研究、撰稿、去 AI 味、多平臺分發" },
  { slug: "decision", emoji: "🎯", title: "AI 輔助決策與簡報", oneLiner: "用 AI 整理資料、做分析、生出能上場的簡報" },
  { slug: "knowledge", emoji: "🧠", title: "第二大腦與知識管理", oneLiner: "把散落的資料變成隨問隨答的知識庫" },
  { slug: "workflow", emoji: "🎛", title: "工作流自動化", oneLiner: "把現有工具串成能自己運作的系統" },
  { slug: "custom", emoji: "🌀", title: "我有別的需求", oneLiner: "把你的真實業務帶來，課綱為你客製" },
];

export const AI_TUTOR_PAIN_POINTS = [
  {
    emoji: "⏳",
    title: "沒時間從零摸索",
    body: "你的時間很貴。網路教學一大堆，但你需要的是有人直接幫你篩掉雜訊，只教你現在用得上的。",
  },
  {
    emoji: "🎯",
    title: "通用課程學不到自己要的",
    body: "團體課照顧的是多數人。你的產業、你的決策場景、你的資料，需要為你量身設計的課綱。",
  },
  {
    emoji: "🔒",
    title: "想用自己的真實業務練",
    body: "你不想用罐頭範例，而是想把公司真實的問題拿來練。一對一才能放心談、放心做。",
  },
];

export const AI_TUTOR_COMPARISON = [
  { dimension: "課綱", group: "團體課 / 線上課", tutor: "依你的目標與產業客製" },
  { dimension: "練習素材", group: "罐頭範例", tutor: "你自己的真實專案與資料" },
  { dimension: "進度", group: "跟著全班走", tutor: "你決定快慢與深淺" },
  { dimension: "隱私", group: "公開課堂", tutor: "一對一，放心談機密" },
  { dimension: "產出", group: "聽完就忘", tutor: "帶走可直接用的成果" },
];

export const AI_TUTOR_PROCESS = [
  { step: 1, title: "預約免費諮詢", body: "填一份簡單表單，我會親自回信，約 30 分鐘聊你的目標與卡關。" },
  { step: 2, title: "客製你的課綱", body: "依你的程度、產業與想達成的成果，設計專屬的學習路徑與時數。" },
  { step: 3, title: "一對一陪學", body: "線上或實體，用你自己的真實業務邊做邊學，進度你決定。" },
  { step: 4, title: "帶走可用成果", body: "每堂都有具體產出：一個工具、一套流程、一份能上場的成品。" },
];

export const AI_TUTOR_PERSONAS = [
  {
    emoji: "🛒",
    role: "電商公司創辦人",
    took: "把每天耗時的選品、文案、客服回覆，變成一套 AI 輔助流程，團隊跟著一起用。",
  },
  {
    emoji: "🏛",
    role: "上市公司獨立董事",
    took: "學會用 AI 快速讀懂財報與產業資料、為董事會議題做足功課，判斷更有底氣。",
  },
  {
    emoji: "🧩",
    role: "心理諮商師",
    took: "用 AI 整理個案筆記與文獻、產出衛教素材，把更多時間留給真正重要的對話。",
  },
];

export const AI_TUTOR_FAQS = [
  { q: "為什麼要先預約諮詢，不能直接報名？", a: "因為這是完全客製的一對一服務，課綱與時數會依你的目標調整。先聊 30 分鐘，我才能為你設計對的內容，你也能確認我是不是對的人。" },
  { q: "上課是線上還是實體？", a: "都可以。多數學員選實體，大臺北以外地區需支付高鐵等交通費用。時間一對一彈性安排。" },
  { q: "我完全不會寫程式 / 不太會用 AI，可以嗎？", a: "可以。學員不乏完全新手，課綱會從你現在的程度開始。" },
  { q: "時數有效期多久？", a: "套餐自購買日起 6 個月內使用，必要時可延長 3 個月。實際以諮詢後的方案為準。" },
  { q: "上課內容和我提供的資料會保密嗎？", a: "會。一對一本來就封閉，你帶來的業務資料與商業機密只用於課堂；需要的話也可簽保密協議。" },
  { q: "費用怎麼算？", a: "頁面上三個方案是參考價，實際課綱與時數於免費諮詢後客製確認，無隱藏費用。" },
];

// 表單重用既有常數
export const AI_TUTOR_LEVELS = CONSULTING_LEVELS;
export const AI_TUTOR_ATTRIBUTION = CONSULTING_ATTRIBUTION;
export const AI_TUTOR_DESIRED_START = CONSULTING_DESIRED_START;

export const AI_TUTOR_TIER_INTEREST = [
  ...AI_TUTOR_TIERS.map((t) => ({
    value: t.slug as string,
    label: `${t.name}（${t.hours} 小時・NT$${t.price.toLocaleString()}）`,
  })),
  { value: "undecided", label: "還沒決定，想先聊聊" },
];
