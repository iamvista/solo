// 書籍資料唯一來源。書名、購買連結確定後只改這裡。
// 上層規劃：~/08_Solo/planning/2026-07-02-solo-tw-books-hub-redesign.md（openspec: add-books-hub）

export type BookStatus = "available" | "preorder" | "coming";

export type BuyLink = {
  name: string;
  url: string;
};

export type Book = {
  slug: string;
  /** 正式書名（Vibe Coding 書名以出版社最終版為準） */
  title: string;
  subtitle: string;
  status: BookStatus;
  statusLabel: string;
  publisher: string;
  publishDate: string;
  /** hub 卡片用的一句話 */
  tagline: string;
  description: string;
  audience: string[];
  buyLinks: BuyLink[];
  /** 書封漸層（尚無書封圖時的字體封面） */
  coverGradient: string;
};

export const VIBE_CODING_BOOK: Book = {
  slug: "vibe-coding",
  // TODO: 出版社確認正式書名後更新此處與副標
  title: "Vibe Coding",
  subtitle: "不會寫程式，也能把想法變成上線作品",
  status: "coming",
  statusLabel: "2026 年 7 月上市",
  publisher: "碁峰資訊",
  publishDate: "2026 年 7 月",
  tagline: "零基礎入門書：用自然語言指揮 AI，從第一個 App 到自動化獲客系統。",
  description:
    "你不需要先學會程式語言，只需要學會把需求說清楚。這本書從 Vibe Coding 是什麼、工具怎麼選，一路帶你完成第一個專案、架出自己的網站、做出名單磁鐵工具、銷售頁與數據儀表板，最後教你把關 AI 程式碼的品質與風險。全書以 vista.tw 與 solo.tw 的真實建置過程為例，你看到的每個案例，都是作者自己用同一套方法做出來的。",
  audience: [
    "從未寫過程式，但想做出自己工具的行銷、企劃、講師與顧問",
    "想幫事業做網站、銷售頁、名單系統的自由工作者與創業者",
    "想導入 AI 開發、卻不知道從哪開始的中小企業工作者",
  ],
  buyLinks: [],
  coverGradient: "from-amber-400 via-orange-400 to-rose-400",
};

/** 書中十四章（依 2026-05-30 一校目錄，章名以出版社最終版為準） */
export const VIBE_CODING_TOC: { no: number; title: string; hook: string }[] = [
  { no: 1, title: "歡迎來到 Vibe Coding 的時代", hook: "從 Karpathy 的一則推文，到人人可用的開發方式" },
  { no: 2, title: "AI 助手完全攻略", hook: "三大主流 AI 助手比較、對話的藝術與進階技巧" },
  { no: 3, title: "工具箱——你的 Vibe Coding 兵器庫", hook: "Cursor、Antigravity、Lovable、Claude Code 怎麼選" },
  { no: 4, title: "你的第一個 Vibe Coding 專案", hook: "從構想到成品，完成你的待辦清單 App" },
  { no: 5, title: "提示詞的藝術——如何跟 AI 說話", hook: "CLEAR 框架與十個職場常見場景的提示詞範本" },
  { no: 6, title: "看懂 AI 寫的程式——你真的不用會寫", hook: "如何閱讀而非撰寫，找出關鍵修改點" },
  { no: 7, title: "當程式出錯——用 AI 修復 AI 的錯誤", hook: "錯誤訊息是你的朋友，修 Bug 的正確對話方式" },
  { no: 8, title: "從零打造你的網站——以 vista.tw 與 solo.tw 為例", hook: "內容型網站與互動式應用的兩種策略、部署與 SEO" },
  { no: 9, title: "名單磁鐵工具——打造你的自動化獲客系統", hook: "從需求訪談到工具上線的完整流程" },
  { no: 10, title: "品牌銷售頁", hook: "設計思維結合 AI 開發，含 A/B 測試與持續優化" },
  { no: 11, title: "數據分析儀表板", hook: "作者現身說法：vista.tw 流量分析與名單管理系統" },
  { no: 12, title: "品質把關——Vibe Coding 的風險管理", hook: "AI 程式碼可靠嗎？安全性檢查清單（非技術版）" },
  { no: 13, title: "從 Vibe Coder 到 Citizen Developer", hook: "持續學習路線圖與組織內推廣策略" },
  { no: 14, title: "Vibe Coding 的未來", hook: "從 Vibe Coding 到 AI Agent 的演進" },
];

export const COMPANY_OF_NONE_BOOK: Book = {
  slug: "company-of-none",
  title: "無人公司",
  // 副標建議版本，以出版社最終版為準
  subtitle: "AI 時代，一個人指揮一支 AI 軍團的經營法則",
  status: "coming",
  statusLabel: "撰寫中・已簽約",
  publisher: "已簽約，出版社資訊後續公布",
  publishDate: "預計 2026 年底至 2027 年初",
  tagline: "公司只有你一個人，卻運作得像有一百個人。",
  description:
    "當 AI 能承擔執行，「公司一定要有人」這個前提就崩了。無人公司，指的是無「員工」之人：公司裡沒有別人，只有你，加上一支聽你指揮的 AI 軍團，產出卻像一整個團隊。這本書要回答三個問題：為什麼「雇人才能擴張」已是過時的假設；一家無人公司實際上長什麼樣（作者每天就這樣營運）；以及你如何從「做事的人」變成「指揮 AI 的人」。",
  audience: [
    "已有專業、想用 AI 一個人把事業放大的講師、顧問、設計師與創作者",
    "被 AI 焦慮推著走、想脫離「靠雇人才能擴張」舊路的個體工作者",
    "對「一人公司」不滿足、想看下一步的讀者",
  ],
  buyLinks: [],
  coverGradient: "from-stone-700 via-stone-800 to-stone-950",
};

export const BOOKS: Book[] = [VIBE_CODING_BOOK, COMPANY_OF_NONE_BOOK];

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}

/** 完整著作清單的外部連結（20 本既有著作在 vistacheng.com 維護，不重複建） */
export const ALL_BOOKS_URL = "https://vistacheng.com/books";
