import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Download,
  FileText,
  Sparkles,
  Mail,
  Bot,
  MessageCircle,
  Gem,
  BookOpen,
  ChevronDown,
  CheckCircle2,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "AI 個人脈絡庫：兩份免費模板｜solo.tw",
  description:
    "一份寫給 AI 讀的風格底稿，也是寫作者重新認識自己的語言地圖。兩份免費模板，提高 AI 輸出接近你的機率。可放進 Claude Project、ChatGPT Project 或其他 AI 工作區使用。",
  openGraph: {
    title: "AI 個人脈絡庫：兩份免費模板",
    description:
      "讓 AI 從泛用助理更接近懂你脈絡的協作夥伴。純 Markdown 檔，不留 Email。",
  },
  alternates: {
    canonical: "https://www.solo.tw/tools/ai-context-library",
  },
};

const templates = [
  {
    badge: "模板 1 ／ 6 個欄位",
    title: "個人定位卡",
    desc: "這是一張寫給 AI 看的自我介紹。它最重要的不是你會什麼，而是讓 AI 知道：你真正想服務誰，以及你不想被帶去哪裡。",
    bullets: [
      "一句話定位",
      "你的商業形式：你提供什麼價值",
      "你的拒絕領域：你不做什麼、不賣什麼",
      "你和相似競品最大的差異",
      "你的個人標誌與代表性元素",
      "五年後，你希望別人如何記得你",
    ],
    href: "/templates/personal-brand-template.md",
    filename: "personal-brand-template.md",
    hint: "下載後可直接填寫並放進 AI 工作區使用",
  },
  {
    badge: "模板 2 ／ 7 個維度 + 範例樣本",
    title: "寫作風格 Profile（簡版）",
    desc: "這是你寫作的指紋。AI 的預訓練語料裡沒有完整的「你」，只有大量平均化的語言樣本。這份檔給 AI 一份可參照的風格底稿：你常用哪些詞、避開哪些詞、句子怎麼轉折、段落怎麼呼吸、文章如何從場景推進到觀點。",
    bullets: [
      "語氣調性",
      "用詞偏好",
      "句式結構",
      "修辭手法",
      "排版習慣",
      "觀點結構（你的思考順序）",
      "禁忌清單（不要怎麼寫）",
    ],
    href: "/templates/voice-profile-template.md",
    filename: "voice-profile-template.md",
    hint: "每個維度都附範例答案，最後可附 2–3 段代表作品供 AI 參照",
  },
];

const installPlatforms = [
  {
    id: "claude",
    name: "Claude Project",
    tagline: "推薦寫作主力",
    plan: "Claude Pro 以上",
    difficulty: "⭐",
    Icon: Bot,
    accent: "border-l-amber-500",
    iconBg: "bg-amber-50 text-amber-700",
    defaultOpen: true,
    steps: [
      {
        title: "建立 Project",
        body: "打開 claude.ai 登入。左側欄點「Projects」→「+ New Project」，命名為「{你的名字} 脈絡庫」（例如「Vista 脈絡庫」）。描述欄填一句話定位即可。",
      },
      {
        title: "上傳 10 份 Markdown",
        body: "進入 Project，找到「Project knowledge」（中文介面叫「專案知識」）區塊，點「+ Add content」或拖曳 10 個 .md 檔進去。每份檔 1–10KB，幾秒內完成。",
      },
      {
        title: "設定 Custom Instructions",
        body: "點 Project 設定（齒輪圖示），在 Custom Instructions 欄位貼上下方內容：",
        code: `你正在跟一位個人創作者協作。Project 裡的 10 份 Markdown 是這位創作者的個人脈絡庫，每次回答前請先參照相關文件。

寫作前的內部檢查：
- 銷售文案、開頭段：先看 02-audience.md 和 10-voice-of-customer.md
- 觀點型內容：先看 03-belief-map.md
- 風格對齊：先看 05-voice-profile.md
- 引用作品：優先用 06-knowledge-assets.md，不要編造引用
- 工具教學：只用 07-tech-stack.md 列的工具
- 規劃內容：依 04-content-matrix.md 的黃金組合

回答時請告訴我你引用了哪幾份檔案。`,
      },
      {
        title: "驗證安裝",
        body: "開新對話輸入測試 prompt：",
        code: `請依照 05-voice-profile.md 的風格，寫一段 100 字介紹我自己的工作。寫完後告訴我你引用了哪些維度。`,
      },
    ],
    note: "Claude 不會永久學會這些內容，每次對話開始時會把 Project knowledge 載入當次上下文。修改檔案後要重新上傳才會生效。",
  },
  {
    id: "chatgpt",
    name: "ChatGPT Project",
    tagline: "推薦多模態主力",
    plan: "ChatGPT Plus 以上",
    difficulty: "⭐",
    Icon: MessageCircle,
    accent: "border-l-emerald-500",
    iconBg: "bg-emerald-50 text-emerald-700",
    defaultOpen: false,
    steps: [
      {
        title: "建立 Project",
        body: "打開 chatgpt.com 登入。左側欄找到「Projects」區塊，點「+」建立。命名為「{你的名字} 脈絡庫」。",
      },
      {
        title: "上傳 10 份 Markdown",
        body: "進入 Project，點「Files」或「Add files」，一次選 10 份 .md 上傳。ChatGPT 會幫每份建索引。",
      },
      {
        title: "設定 Project Instructions",
        body: "點「Instructions」區塊，貼上下方內容：",
        code: `你正在跟一位個人創作者協作。Project Files 裡有 10 份 Markdown，是這位創作者的個人脈絡庫。

每次回答前的優先順序：
1. 銷售／開頭段：先讀 02-audience.md、10-voice-of-customer.md
2. 觀點型內容：先讀 03-belief-map.md
3. 風格對齊：先讀 05-voice-profile.md
4. 引用作品：用 06-knowledge-assets.md，不要編造
5. 工具教學：只用 07-tech-stack.md 列的工具
6. 內容規劃：依 04-content-matrix.md 的黃金組合

回答時請告訴我你引用了哪幾份檔案。`,
      },
      {
        title: "驗證安裝",
        body: "新對話輸入：",
        code: `參考 02-audience.md 和 05-voice-profile.md，幫我寫一個 Threads 貼文 hook，題目自選。寫完告訴我你怎麼引用這兩份的。`,
      },
    ],
    note: "Plus 方案 Project Files 上限通常 20 個檔，10 份模板綽綽有餘。ChatGPT 對中文 retrieval 偶爾不穩定，重要對話建議在 prompt 裡明確點名要參考哪份檔。",
  },
  {
    id: "gemini",
    name: "Gemini Gem",
    tagline: "Google Workspace 整合",
    plan: "Gemini Advanced",
    difficulty: "⭐⭐",
    Icon: Gem,
    accent: "border-l-sky-500",
    iconBg: "bg-sky-50 text-sky-700",
    defaultOpen: false,
    steps: [
      {
        title: "建立 Gem",
        body: "打開 gemini.google.com，左側欄找「Gem manager」，點「+ New Gem」。命名為「{你的名字} 脈絡庫」。",
      },
      {
        title: "設定 Gem Instructions",
        body: "在「Instructions」欄位貼上下方內容：",
        code: `你是一位個人創作者的長期協作夥伴。下方 Knowledge 區的 10 份 Markdown 是這位創作者的個人脈絡庫。

回應前請先參照：
- 02-audience：讀者畫像
- 03-belief-map：思想立場
- 05-voice-profile：寫作風格
- 06-knowledge-assets：作品清單
- 07-tech-stack：工具棧
- 10-voice-of-customer：受眾原話

寫銷售、開頭、客戶回信時優先引用 10-voice-of-customer 的原話。
寫觀點型內容時嚴格依 03-belief-map 的立場。`,
      },
      {
        title: "上傳 Markdown 到 Knowledge",
        body: "在 Gem 編輯介面找「Knowledge」區，一次選 10 份 .md 上傳。Gemini 會花 10–30 秒解析。",
      },
      {
        title: "儲存並驗證",
        body: "點「Save」儲存 Gem。打開 Gem 開新對話：",
        code: `依照 03-belief-map.md，寫一段我會反對的觀點，並用我的語氣反駁。`,
      },
    ],
    note: "Gem Knowledge 檔案數上限通常是 10 個（剛好等於我們的 10 份模板，但沒空間再加）。修改檔案要重新上傳並儲存 Gem。",
  },
  {
    id: "notebooklm",
    name: "NotebookLM",
    tagline: "免費，研究參照主力",
    plan: "免費（Google 帳號）",
    difficulty: "⭐",
    Icon: BookOpen,
    accent: "border-l-violet-500",
    iconBg: "bg-violet-50 text-violet-700",
    defaultOpen: false,
    steps: [
      {
        title: "建立 Notebook",
        body: "打開 notebooklm.google.com，點「+ Create new notebook」。命名為「{你的名字} 脈絡庫」。",
      },
      {
        title: "上傳 10 份 Markdown 為 Sources",
        body: "在 Notebook 內點「+ Add source」→「Upload file」，一次選 10 份 .md。每份約 5–10 秒完成索引。",
      },
      {
        title: "跟 Notebook 對話",
        body: "NotebookLM 不像 Claude／ChatGPT 是 chat 助手定位，它更偏「研究工具」。可以直接在輸入框問：",
        code: `依照 03-belief-map 的立場，寫一篇 600 字反駁「AI 會取代寫作者」的短文。`,
      },
      {
        title: "驗證安裝",
        body: "問一個只有你的脈絡庫才能回答的問題：",
        code: `我反對的 3 個流行觀點是什麼？`,
      },
    ],
    note: "強項：跟你的資料對話、source citation、Audio Overview（podcast 風格音訊）、一鍵生 Mind Map。弱項：替你產出新內容的流暢度不如 Claude／ChatGPT。建議當研究輔助、不當主力。",
  },
];

const dfyBullets = [
  "個人定位卡",
  "讀者畫像",
  "思想地圖",
  "內容矩陣",
  "寫作風格 Profile",
  "知識資產盤點",
  "工具棧",
  "標竿作品庫",
  "研究脈絡卡",
  "真實對話／受眾語料庫",
];

const faqItems = [
  {
    question: "什麼是 AI 個人脈絡庫？",
    answer:
      "AI 個人脈絡庫是一套放進 AI 工作區的長期上下文文件，內容涵蓋你的定位、受眾、思想、內容、風格、知識資產等十個維度。它不會讓 AI 真的「懂」你，但會在每次協作時多一份可參照的風格底稿，提高輸出「接近你」的機率。完整版有 10 份文件，這頁免費提供其中兩份門檻最高的入門模板。",
  },
  {
    question: "這兩份模板適合誰下載？",
    answer:
      "適合知識工作者、講師、顧問、作者、研究者，以及靠觀點與寫作變現的 獨立創作者。只要你常用 Claude、ChatGPT、Gemini、NotebookLM 之類的 AI 工具寫作或思考，這兩份模板就能幫你大幅提升輸出可用率。",
  },
  {
    question: "下載要付費或留 Email 嗎？",
    answer:
      "兩份模板都是純 Markdown 檔案、完全免費、不需要留 Email、不會綁訂閱。直接點下載按鈕、存到本機、放進你的 AI 工作區即可。",
  },
  {
    question: "為什麼只有兩份，剩下八份呢？",
    answer:
      "個人定位卡和寫作風格 Profile 是 10 份文件中門檻最高、最多人不知道怎麼開頭的兩份。先完成這兩份，你就已經有能力繼續延伸出後面的八份脈絡文件。如果你希望有人陪你把整套建立起來，可以參考頁面下方的進階版顧問服務。",
  },
  {
    question: "用了這兩份模板，AI 輸出真的會變好嗎？",
    answer:
      "差別最大的是「像不像你」。少了這兩份，AI 容易用它預訓練的華語自媒體平均語氣替你寫作；放進去之後，AI 會用你的詞、你的句法、你的拒絕清單來思考。第一稿可用率從 20% 拉到 80% 是真實可達的範圍。",
  },
  {
    question: "只能用 Claude 嗎？",
    answer:
      "不是。任何支援「專案知識」「自訂指令」或「長期上下文」的 AI 工具都能用，包括 Claude Project、ChatGPT Project、Gemini Gem、NotebookLM 等。本模板與任何 AI 平台無官方合作、授權或背書關係，請依個人需求自由選擇工具。",
  },
  {
    question: "這個方法跟海外的 context-first 工作流有什麼差別？",
    answer:
      "「上下文比 prompt 重要」這個方向，近年在海外 AI Operator 社群已是趨勢。但海外案例多半服務於 SaaS、電商或銷售漏斗型的 internet business owner。對華語世界的知識工作者、講師、顧問、作者與獨立創作者來說，真正需要的不是更重的 funnel，而是能保存思想脈絡、研究積累、寫作風格與內容資產的個人脈絡庫。AI 個人脈絡庫的 10 份文件設計、訪談方法與產出格式都是 Vista 為這個族群原創設計。",
  },
];

export default function ContextLibraryPage() {
  return (
    <div className="min-h-screen">
      <JsonLd
        data={breadcrumbSchema([
          { name: "首頁", href: "/" },
          { name: "工具與資源", href: "/tools" },
          {
            name: "AI 個人脈絡庫",
            href: "/tools/ai-context-library",
          },
        ])}
      />
      <JsonLd data={faqSchema(faqItems)} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,140,110,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(168,140,110,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              免費模板下載 ✦ 不留 Email
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              AI 個人脈絡庫
            </h1>
            <p className="mt-4 text-lg font-semibold text-stone-700 sm:text-xl">
              兩份免費模板，讓 AI 輸出更接近你的定位、受眾與寫作風格
            </p>
            <p className="mt-6 text-base leading-relaxed text-stone-500 sm:text-lg">
              AI 寫得不像你，很多時候不是因為你 prompt 下得不夠好。
              <br className="hidden sm:block" />
              真正的問題是：它還不認識你。
            </p>
          </div>
        </div>
      </section>

      {/* Concept */}
      <section className="bg-white pb-16 sm:pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-primary bg-stone-50 p-8 sm:p-10">
            <h2 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
              從 prompt 工程，到上下文工程
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-600">
              <p>
                AI 不知道你的受眾是誰，不知道你真正想服務的人，也不知道哪些題目你想深耕、哪些領域你根本不想碰。於是，它只能把你當成一個泛用的「知識工作者」，用一種看起來正確、其實沒有靈魂的方式替你寫作。這不是 prompt 的問題，而是上下文的問題。
              </p>
              <p>
                如 AI Operator 等海外社群很流行一種 context-first 的工作法：與其每次都重新修 prompt，不如先把自己的商業定位、產品、受眾、語氣、知識資產與工作流程，整理成一套 AI 可以長期讀取的脈絡文件。
              </p>
              <p>
                我很認同這個方向。但我也發現，許多海外案例主要服務於 SaaS、電商或強銷售漏斗型的 internet business owner；對華語世界的{" "}
                <span className="font-bold text-stone-900">
                  知識工作者、講師、顧問、作者與獨立創作者
                </span>
                來說，我們真正需要的不是更重的 funnel，而是一套能保存思想脈絡、研究積累、寫作風格與內容資產的個人脈絡庫。
              </p>
              <p>
                所以，我重新設計了一套適合知識型一人公司的文件架構，命名為{" "}
                <span className="font-bold text-stone-900">
                  AI 個人脈絡庫
                </span>
                。這頁先開放其中兩份免費模板：個人定位卡、寫作風格 Profile，這是 10 份裡面門檻最高、最多人不知道怎麼開頭的兩份。
              </p>
              <p>
                這兩份不是寫給人看的自我介紹，而是寫給 AI 讀的工作底稿。當 AI 在每次協作時能參照這兩份文件，它就有更高機率從「泛用助理」更接近一個懂你脈絡的協作夥伴。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="bg-gradient-to-b from-white to-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              兩份免費模板
            </h2>
            <p className="mt-2 text-base text-stone-500">
              純 Markdown 檔，下載後可直接填寫，並放進 Claude Project、ChatGPT Project 或其他 AI 工作區使用。
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:mt-12 md:grid-cols-2 lg:gap-8">
            {templates.map((tpl) => (
              <article
                key={tpl.title}
                className="flex flex-col rounded-2xl border border-stone-200 border-t-4 border-t-primary bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-8"
              >
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {tpl.badge}
                </div>
                <h3 className="mt-3 text-xl font-bold text-stone-900">
                  {tpl.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  {tpl.desc}
                </p>
                <ul className="mt-5 flex-1 space-y-1.5 text-sm leading-relaxed text-stone-500">
                  {tpl.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button
                    asChild
                    className="w-full shadow-sm shadow-primary/15"
                  >
                    <a
                      href={tpl.href}
                      download={tpl.filename}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      下載{tpl.title}（.md）
                    </a>
                  </Button>
                  <p className="mt-3 text-center text-xs text-stone-400">
                    {tpl.hint}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Install Guide */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Bot className="h-3.5 w-3.5" />
              下一步
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              四大平臺安裝教學
            </h2>
            <p className="mt-3 text-base text-stone-500">
              下載完模板後，跟著步驟做，10 分鐘就能放進你的 AI 工作區。
              <br className="hidden sm:block" />
              建議至少裝兩個：一個主力寫作（Claude／ChatGPT 二選一），一個研究參照（NotebookLM）。
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {installPlatforms.map((p) => {
              const Icon = p.Icon;
              return (
                <details
                  key={p.id}
                  open={p.defaultOpen}
                  className={`group overflow-hidden rounded-2xl border border-stone-200 border-l-4 ${p.accent} bg-white shadow-sm transition-all`}
                >
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${p.iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-lg font-bold text-stone-900">
                          {p.name}
                        </h3>
                        <span className="text-xs font-medium text-stone-500">
                          {p.tagline}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-stone-500">
                        <span>方案：{p.plan}</span>
                        <span aria-hidden>·</span>
                        <span>難度 {p.difficulty}</span>
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 shrink-0 text-stone-400 transition-transform group-open:rotate-180" />
                  </summary>

                  <div className="border-t border-stone-100 bg-stone-50/50 p-6 sm:p-8">
                    <ol className="space-y-6">
                      {p.steps.map((step, i) => (
                        <li key={i} className="flex gap-4">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                            {i + 1}
                          </div>
                          <div className="flex-1 pt-0.5">
                            <h4 className="text-base font-bold text-stone-900">
                              {step.title}
                            </h4>
                            <p className="mt-2 text-sm leading-relaxed text-stone-600">
                              {step.body}
                            </p>
                            {step.code && (
                              <pre className="mt-3 overflow-x-auto rounded-lg bg-stone-900 p-4 text-xs leading-relaxed text-stone-100">
                                <code className="whitespace-pre-wrap break-words">
                                  {step.code}
                                </code>
                              </pre>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>

                    <div className="mt-6 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <p className="text-xs leading-relaxed text-amber-900">
                        <span className="font-semibold">注意：</span>
                        {p.note}
                      </p>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 to-white p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  跨平臺使用技巧
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-stone-600">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      <span className="font-semibold">prompt 引用慣例：</span>
                      明確點名比丟出去讓 AI 自己找有效得多。例如：「依照 05-voice-profile 的『禁忌清單』，寫一段⋯⋯」「對標 02-audience 的『代表受眾 1』，回答⋯⋯」
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      <span className="font-semibold">同步紀律：</span>
                      10 份模板更新後，主動重新上傳到所有已安裝的平臺。建議每月最後一個週日做「脈絡庫同步日」，calendar 設成 recurring event。
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>
                      <span className="font-semibold">驗證 checklist：</span>
                      安裝完問三題：「我反對的 3 個流行觀點是什麼？」「我最常用的 5 個慣用詞是什麼？」「我的代表受眾 1 是誰？」三題答得準代表載入成功。
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upsell */}
      <section className="bg-stone-900 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/20">
            進階版顧問服務
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            想做完整版本？
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-300">
            如果你不只想拿模板，而是希望有人陪你把整套 AI 個人脈絡庫建立起來，Vista 也提供單次顧問服務。完整版本會協助你整理 10 份文件，並協助你放進 Claude Project 或其他 AI 工具，成為你日後寫作、企劃、課程設計與內容產製的長期基礎。
          </p>
          <ul className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-2 text-left text-sm leading-relaxed text-stone-200">
            {dfyBullets.map((b) => (
              <li key={b} className="flex gap-2">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button
              size="lg"
              asChild
              className="h-12 px-8 shadow-sm shadow-primary/15"
            >
              <Link href="/ai-context-library-dfy">
                查看進階版服務
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            想看更多 AI 工作流的長文？
          </h2>
          <p className="mt-4 text-base text-stone-500">
            每週一封《Vista 電子報》，分享一人公司怎麼用 AI 把寫作變成複利資產。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild className="h-12 px-6 shadow-sm shadow-primary/15">
              <a
                href="https://iamvista.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="mr-2 h-4 w-4" />
                免費訂閱電子報
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 border-stone-300 px-6 text-stone-700 hover:bg-stone-50"
            >
              <Link href="/tools">回到工具與資源</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-stone-200 bg-white py-10">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-xs leading-relaxed text-stone-400">
            本模板為 Vista Cheng 設計之個人 AI 工作流文件，非 Anthropic、Claude 或其他 AI 平台之官方產品，亦未與相關平台建立合作、授權或背書關係。模板可依需求用於 Claude、ChatGPT、Gemini、NotebookLM 或其他支援專案知識的 AI 工具。
          </p>
        </div>
      </section>
    </div>
  );
}
