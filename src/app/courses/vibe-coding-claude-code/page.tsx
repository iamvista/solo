import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd, courseSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { CourseNotifyEntry } from "@/components/course/CourseNotifyEntry";
import { CourseNotifyFooter } from "@/components/course/CourseNotifyFooter";

export const metadata: Metadata = {
  title:
    "Vibe Coding for Claude Code 實戰工作坊｜開課通知・3 小時用 CLI 打造你的數位資產 | solo.tw",
  description:
    "在終端機裡跟 AI 對話，3 小時打造可上線的網站、銷售頁、自動化腳本。Claude Code 第 2 班開課日期尚未公告，留信箱優先通知。Antigravity 版舊生現折 NT$1,000。請自備 Claude Pro 或 Claude Max 訂閱。",
  openGraph: {
    title:
      "Vibe Coding for Claude Code 實戰工作坊｜在終端機裡 3 小時打造數位資產",
    description:
      "Claude Code 第 2 班・開課日期尚未公告，留信箱優先通知・Antigravity 舊生 −NT$1,000。請自備 Claude Pro 或 Claude Max 訂閱。",
    images: [
      {
        url: "/courses/vibe-coding-claude-code/og",
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "https://www.solo.tw/courses/vibe-coding-claude-code",
  },
};

const whyClaudeCode = [
  {
    emoji: "\u{1F9E0}",
    title: "Claude 的最強模型直接給你用",
    text: "Claude Code 直接吃 Claude Opus／Sonnet 旗艦模型，推理、寫長 code、改大型專案的能力遠超瀏覽器版的對話框。",
  },
  {
    emoji: "\u{1F4C2}",
    title: "整個資料夾都是上下文",
    text: "不用一次貼一個檔案，Claude Code 直接讀你整個專案；改一行、加一頁、重構一個流程，AI 都看得到全貌。",
  },
  {
    emoji: "⚡",
    title: "終端機 + 你慣用的編輯器",
    text: "在 Cursor、VS Code、Warp 都能跑，沒有平台綁定。改完直接 git commit、deploy，不用反覆貼來貼去。",
  },
  {
    emoji: "\u{1F510}",
    title: "Plan Mode + 權限控管",
    text: "重要動作（刪檔、跑指令、推上線）會先問你；Plan Mode 讓你看完計畫再執行，比一般 AI agent 安全很多。",
  },
  {
    emoji: "\u{1F501}",
    title: "Skills、Hooks、MCP 一次學",
    text: "把你的工作流變成可重用的 Skill；用 Hook 在每個動作前後做檢查；用 MCP 接上 Notion、Anytype、各種服務。",
  },
  {
    emoji: "\u{1F4B0}",
    title: "比請工程師便宜兩個量級",
    text: "Claude Pro US$20／月就能起步；做一個專業銷售頁的市場行情 NT$15,000–50,000，第一個案子就回本。",
  },
];

const painPoints = [
  {
    emoji: "\u{1F4BB}",
    title: "上過 Antigravity 版，但想學更強的",
    text: "Antigravity 適合入門，但你想做更複雜的專案、更深入掌控自己的程式碼？該升級工具了。",
  },
  {
    emoji: "\u{1F310}",
    title: "用網頁版 Claude／ChatGPT 改網站好累",
    text: "貼 code、改 code、再貼回來……一個小修改要來回好幾趟，整個專案的 context 還會掉。",
  },
  {
    emoji: "\u{1F50C}",
    title: "想做的專案越來越大，AI 跟不上了",
    text: "三五個檔案還行，超過十個就開始失憶。需要一個真的能讀整個資料夾的 AI 助手。",
  },
  {
    emoji: "\u{1F6E0}️",
    title: "想把工作流自動化，但搞不定 CLI",
    text: "知道終端機很強，但每次看到黑底白字就退縮。想有人手把手帶你跑通第一次。",
  },
  {
    emoji: "\u{1F4DC}",
    title: "聽過 Skills、Hooks、MCP，但不知道怎麼用",
    text: "看了一堆推文都在講，但找不到一個系統性的入門。3 小時讓你跑通完整心智模型。",
  },
  {
    emoji: "\u{1F680}",
    title: "想當 indie hacker，需要更專業的工具",
    text: "副業、SaaS、產品 demo——需要一個能把想法快速落地、又能長期維護的工具鏈。",
  },
];

const claudeCodeStack = [
  {
    emoji: "\u{1F4BB}",
    title: "Claude Code CLI",
    desc: "Anthropic 官方終端機介面，課堂手把手安裝",
  },
  {
    emoji: "\u{1F4DC}",
    title: "Plan Mode",
    desc: "讓 AI 先給計畫再執行，避免亂改",
  },
  {
    emoji: "\u{1F9E9}",
    title: "Skills（自訂技能）",
    desc: "把你的工作流封裝成可重用的指令",
  },
  {
    emoji: "\u{1FA9D}",
    title: "Hooks",
    desc: "在每個動作前後自動跑檢查／驗證",
  },
  {
    emoji: "\u{1F517}",
    title: "MCP Servers",
    desc: "接上 GitHub、Notion、雲端服務",
  },
  {
    emoji: "\u{1F310}",
    title: "Cloudflare Pages／Vercel",
    desc: "一鍵部署上線，免費起步",
  },
];

const schedule = [
  {
    time: "第一小時",
    duration: "60 分鐘",
    module: "Claude Code 心智模型 + 環境設定",
    content:
      "為什麼 Claude Code 比網頁版強・安裝 Node.js + Claude Code CLI・第一次登入 Pro／Max・Plan Mode 與 Auto-Accept 模式・基本對話節奏",
  },
  {
    time: "第二小時",
    duration: "60 分鐘",
    module: "在終端機裡實作你的專案",
    content:
      "三選一專案（個人網站／服務銷售頁／名單收集漏斗）・讓 Claude 讀整個資料夾・即時除錯與回滾・用 Skills 把重複工作封裝起來",
  },
  {
    time: "第三小時",
    duration: "50 分鐘",
    module: "部署上線 + Hooks / MCP 進階",
    content:
      "Cloudflare Pages 或 Vercel 一鍵部署・用 Hook 在 commit 前自動跑檢查・接 GitHub MCP 管版本・課後維運心法",
  },
  {
    time: "收尾",
    duration: "10 分鐘",
    module: "Q&A + 成果分享",
    content: "",
  },
];

const comparison = [
  {
    label: "上下文範圍",
    cc: "整個資料夾（數十～上百檔）",
    web: "單次貼上的內容",
    antigrav: "整個專案，但同樣綁瀏覽器",
  },
  {
    label: "模型能力",
    cc: "Claude Opus／Sonnet（旗艦）",
    web: "依方案而異",
    antigrav: "Gemini 系列為主",
  },
  {
    label: "執行環境",
    cc: "你的終端機、整合 Cursor／VS Code",
    web: "瀏覽器分頁",
    antigrav: "Google 託管的瀏覽器 IDE",
  },
  {
    label: "部署／git",
    cc: "直接跑 git push、wrangler、vercel",
    web: "需另外手動操作",
    antigrav: "整合 Google 系；自架站需另開",
  },
  {
    label: "可擴充性",
    cc: "Skills、Hooks、MCP、Subagents",
    web: "Custom GPT、單次工具呼叫",
    antigrav: "內建 agent，但較封閉",
  },
  {
    label: "適合誰",
    cc: "想長期累積專案、做副業／產品的人",
    web: "問問題、寫一次性的東西",
    antigrav: "完全零基礎、想最快上手的人",
  },
];

const testimonials: {
  name: string;
  role: string;
  batch: string;
  quote: string;
  link?: string;
}[] = [
  {
    name: "陳家蓁",
    role: "學員",
    batch: "Vibe Coding for Claude Code 首發班",
    quote:
      "因為職業，有很多免費的 AI 研習，但我喜歡來上老師的課。雖然我的職業不是老師開課的主要客群，但透過異業互相激盪，常常可以在聆聽老師與同學互動的過程中，學習到跨領域思惟。我是一個詳閱使用說明書才會開始動手的人，但老師要我們先開始再優化。今天最後做了讓我平日最討厭、最浪費時間的貼照片整理器，真的可以用 😂，也增加了信心。",
  },
  {
    name: "首發班學員",
    role: "律師",
    batch: "Vibe Coding for Claude Code 首發班",
    quote:
      "我是律師出身，過去對寫程式一直敬而遠之。沒想到這堂課完全顛覆想像：把想法講清楚、跟 AI 來回討論，就能把東西做出來。課程最後 30 分鐘實作，我把履歷和形象照丟給 Claude，前後不到 20 分鐘，一個有模有樣的個人網站就成形了；回家再花約兩小時微調、買網域，最後請 Claude Code 幫我部署，現在網站已經正式上線。我帶著『先來看看』的心態走進教室，離開時卻多了一個上線的網站、一個明確方向，還有一種『原來我也做得到』的信心。",
    link: "https://huangcclaw.com/",
  },
  {
    name: "陳建銘",
    role: "創新培訓師",
    batch: "Vibe Coding 第 1 班",
    quote:
      "Vista 在課堂上用一個多小時就做出一個創新測驗的原型，這個概念非常有趣且市場性十足。",
  },
  {
    name: "Tiffany",
    role: "保險經紀人",
    batch: "Vibe Coding 第 1 班",
    quote:
      "Vista 老師會一個個指導，課前還有準備教材讓我們預習，大大減輕焦慮感。",
  },
  {
    name: "張永錫",
    role: "時間管理講師／作家",
    batch: "Vibe Coding 第 2 班",
    quote:
      "從零開始做出了自己的網頁，現在用 Vibe Coding 製作數位產品，不再需要工程師。",
  },
  {
    name: "陳品蓉",
    role: "律師",
    batch: "Vibe Coding 第 2 班",
    quote:
      "發現 AI 不只能回答問題，還能做出真正的東西，正在規劃法律諮詢頁面。",
  },
  {
    name: "張天豪醫師",
    role: "顯微根管專科",
    batch: "Vibe Coding 第 4 班",
    quote: "克服了對新科技的恐懼，上完課就訂閱了 Claude Pro。",
  },
  {
    name: "林玉菁",
    role: "律師",
    batch: "Vibe Coding 第 5 班",
    quote:
      "完全保有網頁內容調整的自主能力，不用受制於他人。CP 值極高的課程，非常值得推薦。",
  },
  {
    name: "唐嘉偉",
    role: "國立澎湖科技大學行銷與物流管理系副教授",
    batch: "Vibe Coding 第 5 班",
    quote:
      "Vista 老師用淺顯易懂的指導方式，讓初次學習的同學們相當容易上手。不枉費我從高雄搭高鐵到臺北上課！",
  },
  {
    name: "林克威",
    role: "AI 品牌行銷顧問",
    batch: "Vibe Coding 第 6 班",
    quote:
      "Vista 把工具的脈絡解釋得很清楚，讓我能立刻知道接下來要怎麼自己往下走。",
  },
  {
    name: "彭之偉（Allen Peng）",
    role: "Vista 工作坊舊生",
    batch: "AI 內容產製系統工作坊",
    quote:
      "這次學到的是 Claude Cowork（桌面協作）與 Claude Code（終端機），跟原本只會的 Claude Chat（網頁版）完全不同層次。等於養了一個 5 人團隊的助理。",
  },
  {
    name: "馬紹恩",
    role: "Vista 工作坊舊生",
    batch: "AI 內容產製系統工作坊",
    quote:
      "透過 SKILL.md 把自己的 know-how 拆解、固化下來，讓 AI 變成真正能複製專業判斷的工具。重點不是會用幾個工具，而是把專業流程拆解成可被 AI 重複執行的 Skill。",
  },
  {
    name: "藍均屏（Daphne Lan）",
    role: "Vista 工作坊舊生",
    batch: "AI 內容產製系統工作坊",
    quote:
      "不是工程師背景，要看終端機還是驚驚的，但總是起了頭、入了門，也試出成果。我的工作是培訓人，現在再加上要培訓 AI！",
  },
];

const targetAudience = [
  {
    icon: "\u{1F393}",
    text: "上過 Antigravity 版、想升級到 Claude Code 的舊生（直接折 NT$1,000）",
  },
  {
    icon: "\u{1F468}‍\u{1F4BB}",
    text: "已經在用 Claude Pro／Max，但只把它當聊天工具的人",
  },
  {
    icon: "\u{1F4BC}",
    text: "想做副業／indie product，需要長期維護自己程式碼的人",
  },
  {
    icon: "\u{1F4DD}",
    text: "內容創作者、講師、顧問——想把工作流自動化、做出可賣的數位產品",
  },
  {
    icon: "\u{1F9D1}‍\u{1F4BC}",
    text: "PM、行銷、營運——想自己做 prototype 不再求工程師排期",
  },
];

const faqs = [
  {
    q: "我上過 Antigravity 版的，這堂課跟那堂的差異是？",
    a: "Antigravity 版用 Google 託管的瀏覽器 IDE，適合零基礎入門；Claude Code 是在你自己的終端機裡跑、吃整個資料夾、用旗艦級 Claude 模型，能做的專案規模大很多，也能長期維護。舊生報名直接折 NT$1,000。",
  },
  {
    q: "為什麼一定要訂閱 Claude Pro 或 Claude Max？",
    a: "Claude Code CLI 直接吃 Anthropic 官方 API，必須登入有付費的帳號才能使用。Pro 是每月 US$20、Max 是每月 US$100 起，你可以先訂 Pro，課後評估再升級。本課程不代付這筆費用。",
  },
  {
    q: "完全沒寫過 code，可以上嗎？",
    a: "可以，但會比較吃力。Claude Code 雖然不需要你寫 code，但會在終端機裡跑指令，比 Antigravity 版多一層學習曲線。建議完全零基礎的同學先報 Antigravity 版，這堂留給「會打字、敢開終端機」的人。",
  },
  {
    q: "需要帶什麼？課前要準備嗎？",
    a: "Mac 或 Windows 筆電都可以；課前一週會寄送安裝指南（Node.js + Claude Code CLI），請務必先裝好並登入 Pro／Max 帳號。當天只專注在實作，不浪費時間 debug 安裝。",
  },
  {
    q: "舊生憑證怎麼提交？",
    a: "在報名表單的「舊生報名憑證」欄位，填寫你過去上 Antigravity 版的梯次／日期／訂單號／介紹人任一即可，採信任制；課前我會抽查比對名單。",
  },
  {
    q: "3 小時夠學完 Claude Code 嗎？",
    a: "夠你跑通完整心智模型 + 上線一個專案，並學會 Plan Mode、Skills、Hooks、MCP 的基本用法。剩下的就是回家持續用，課後加入專屬 LINE 群有問題可以繼續問。",
  },
  {
    q: "退費政策？",
    a: "開課前 7 天可全額退費；之後可轉讓名額或更換梯次。",
  },
];

export default function VibeCodingClaudeCodePage() {
  return (
    <>
      <JsonLd
        data={{
          ...courseSchema({
            name: "Vibe Coding for Claude Code 實戰工作坊",
            description:
              "在終端機裡用 Claude Code 跟 AI 對話，3 小時打造可上線的個人網站、銷售頁、自動化腳本。第 2 班開課日期尚未公告，開放開課通知登記。",
            url: "https://www.solo.tw/courses/vibe-coding-claude-code",
            instructor: "Vista",
            duration: "PT3H",
            location: "臺北市",
            image:
              "https://www.solo.tw/courses/vibe-coding-claude-code/og",
          }),
          coursePrerequisites:
            "需自行訂閱 Claude Pro（US$20／月）或 Claude Max（US$100 起／月），具基本筆電操作能力",
          teaches:
            "使用 Claude Code CLI 建立個人品牌網站、銷售頁、自動化工作流；掌握 Plan Mode、Skills、Hooks、MCP",
          // 2026-08-18 移除 aggregateRating 與 review，兩者都不是使用者提供的評分：
          //
          // aggregateRating 的 ratingValue 4.9 是從 vibe-coding 頁複製過來的，而
          // reviewCount 填的是 testimonials.length，也就是「頁面上放了幾則見證」，
          // 不是課後問卷的回收份數；兩個數字都沒有這一班自己的資料支撐。
          //
          // review 則把每一則見證硬填成 ratingValue "5"，見證文字本身沒有星等，
          // 這在 Google 的評論摘要政策裡屬於偽造評分。
          //
          // 首發班的學員見證是真的，仍完整呈現在頁面上，只是不再當成結構化評分資料。
          // 若要恢復評分星等，需要這一班真實的問卷平均分與份數，並顯示在頁面上。
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "首頁", href: "/" },
          { name: "課程", href: "/courses" },
          {
            name: "Vibe Coding for Claude Code 實戰工作坊",
            href: "/courses/vibe-coding-claude-code",
          },
        ])}
      />
      <JsonLd
        data={faqSchema(faqs.map((f) => ({ question: f.q, answer: f.a })))}
      />

      <div>
        {/* ====== Hero ====== */}
        <section className="bg-gradient-to-b from-orange-50/60 via-amber-50/30 to-background dark:from-orange-950/20">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-2 text-sm sm:text-base"
            >
              {"\u{1F525}"} Claude Code 第 2 班｜開課日期尚未公告，留信箱通知你
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Vibe Coding for Claude Code 實戰工作坊
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-base text-muted-foreground sm:text-lg">
              在終端機裡跟 AI 對話，3 小時打造你的數位資產
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
              Claude Code 是現在最強的 Vibe Coding 工具，
              <br className="hidden sm:block" />
              <span className="gradient-text">這堂課帶你完整跑通一次。</span>
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Anthropic 官方 CLI、旗艦級 Claude 模型、整個資料夾的上下文。
              <br className="hidden sm:block" />
              <span className="font-semibold text-foreground">
                上過 Antigravity 版的舊生現折 NT$1,000，第一次接觸 Vibe Coding 的進階者也歡迎。
              </span>
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <a href="#register">留信箱・開課通知我</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
                asChild
              >
                <a href="#curriculum">查看課程內容</a>
              </Button>
            </div>

            {/* 課前準備強調 */}
            <div className="mx-auto mt-8 max-w-xl rounded-xl border-2 border-amber-300 bg-amber-50/70 px-5 py-4 text-left text-sm leading-relaxed text-amber-950">
              <p className="font-semibold">⚠️ 報名前請先確認</p>
              <p className="mt-1 text-amber-900/90">
                本課程使用 Claude Code（Anthropic CLI），請於課前自行訂閱{" "}
                <span className="font-semibold">Claude Pro（US$20／月）</span>{" "}
                或 <span className="font-semibold">Claude Max（US$100 起／月）</span>。
                課程費用不含此筆訂閱。
              </p>
            </div>

            {/* Key Stats */}
            <div className="mt-10 flex justify-center gap-8 sm:gap-12">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">3hr</p>
                <p className="mt-1 text-sm text-muted-foreground">實戰工作坊</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">12</p>
                <p className="mt-1 text-sm text-muted-foreground">人小班制</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">−1K</p>
                <p className="mt-1 text-sm text-muted-foreground">舊生折扣</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">1</p>
                <p className="mt-1 text-sm text-muted-foreground">個成品帶走</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* ====== Why Claude Code ====== */}
          <section className="py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              為什麼是 Claude Code？
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              如果你已經會用網頁版 AI、或上過 Antigravity 版工作坊——這就是下一步該升級的工具。
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {whyClaudeCode.map((point, i) => (
                <Card key={i} className="border-muted">
                  <CardContent className="flex items-start gap-3 p-4 sm:p-5">
                    <span className="text-2xl shrink-0">{point.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {point.title}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {point.text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ====== Core Insight ====== */}
          <section className="bg-foreground text-background py-10 sm:py-12 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-lg font-bold leading-relaxed sm:text-xl">
                <span className="text-primary">
                  Claude Code 不是另一個聊天框，
                </span>
                <br />
                <span className="text-primary">而是會跟你一起寫整個專案的 AI 同事。</span>
                <br />
                <span className="font-normal text-background/80">
                  你說人話、它讀整個資料夾、你看計畫、它執行——這就是 Vibe Coding 的下一個階段。
                </span>
              </p>
            </div>
          </section>

          {/* ====== Pain Points ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              你是不是已經卡在這些地方？
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              中了三項以上，這堂課就是為你設計的。
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {painPoints.map((point, i) => (
                <Card key={i} className="border-muted">
                  <CardContent className="flex items-start gap-3 p-4 sm:p-5">
                    <span className="text-2xl shrink-0">{point.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {point.title}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {point.text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ====== Stack ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              這堂課會帶你跑通的工具鏈
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              不是聽概念，而是課堂上一個一個用過。
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {claudeCodeStack.map((item, i) => (
                <Card key={i} className="border-muted">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <h3 className="text-base font-bold">{item.title}</h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ====== Curriculum ====== */}
          <section id="curriculum" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              3 小時課程安排
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              從觀念到上線，每段都有實作。
            </p>
            <div className="mt-8 space-y-4">
              {schedule.map((s, i) => (
                <Card
                  key={i}
                  className={
                    s.time === "收尾"
                      ? "border-primary/20 bg-primary/5"
                      : ""
                  }
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="outline"
                          className="text-xs whitespace-nowrap"
                        >
                          {s.time}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {s.duration}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-foreground">
                          {s.module}
                        </h3>
                        {s.content && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {s.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ====== Comparison Table ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              Claude Code vs 其他 Vibe Coding 工具
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              都很好，但場景不同。
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      比較項目
                    </th>
                    <th className="pb-3 text-left font-medium text-primary">
                      Claude Code
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      網頁版 AI
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      Antigravity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {comparison.map((row) => (
                    <tr key={row.label}>
                      <td className="py-3 font-medium text-foreground">
                        {row.label}
                      </td>
                      <td className="py-3 text-foreground">{row.cc}</td>
                      <td className="py-3 text-muted-foreground">{row.web}</td>
                      <td className="py-3 text-muted-foreground">
                        {row.antigrav}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ====== Instructor ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              關於講師
            </h2>

            <div className="mt-8 grid gap-8 md:grid-cols-5">
              <div className="md:col-span-2 flex flex-col items-center gap-4">
                <div className="w-full overflow-hidden rounded-2xl">
                  <Image
                    src="/images/workshops/instructor-vista.webp"
                    alt="Vista"
                    width={400}
                    height={600}
                    className="w-full object-cover"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <h3 className="text-2xl font-bold">Vista</h3>
                <p className="mt-1 text-base text-muted-foreground">
                  數位內容策略家・Vibe Coding 佈道者・Claude Code 重度使用者
                </p>

                <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    曾任媒體主編與產品總監。
                    2025 年起投入 Vibe Coding 教學，已開設 6 班 Antigravity 版工作坊；
                    自己日常用 Claude Code 維護多個個人產品（vista.tw、solo.tw、content.tw、slides.vista.tw 等），
                    把這套工具的真實工作流帶進課堂。
                  </p>
                </div>

                <div className="mt-6 space-y-2.5 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-primary shrink-0">✓</span>
                    <span className="text-muted-foreground">
                      20+ 年數位內容產業經歷
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary shrink-0">✓</span>
                    <span className="text-muted-foreground">
                      前風傳媒產品總監・前數位時代主編
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary shrink-0">✓</span>
                    <span className="text-muted-foreground">
                      著作《ChatGPT 提問課》《慢讀秒懂》等 20 餘本
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary shrink-0">✓</span>
                    <span className="text-muted-foreground">
                      213 場以上可查證授課
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary shrink-0">✓</span>
                    <span className="text-muted-foreground">
                      日常 Claude Code 重度使用者，自架多個個人產品站
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ====== Student Testimonials ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              學員怎麼說
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              來自 Claude Code 首發班，以及 Vibe Coding 工作坊歷屆學員的真實回饋
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {testimonials.map((t, i) => (
                <Card key={i} className="border-muted">
                  <CardContent className="p-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      「{t.quote}」
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {t.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t.role}・{t.batch}
                      </span>
                    </div>
                    {t.link && (
                      <a
                        href={t.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-primary underline underline-offset-2"
                      >
                        看他在課堂上做出、現已上線的網站 →
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ====== Target Audience ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              這堂課適合誰？
            </h2>
            <div className="mx-auto mt-8 max-w-lg space-y-3">
              {targetAudience.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border p-4"
                >
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <span className="text-base text-muted-foreground">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-6 max-w-lg text-center text-sm text-muted-foreground">
              如果你是<span className="font-semibold text-foreground">完全零基礎</span>、第一次接觸 Vibe Coding，建議先報{" "}
              <Link
                href="/courses/vibe-coding"
                className="text-primary underline underline-offset-2"
              >
                Antigravity 版
              </Link>
              ，門檻較低。
            </p>
          </section>

          {/* ====== Registration ====== */}
          <section id="register" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              開課通知
            </h2>

            <Card className="mt-8 border-primary/20 bg-primary/5">
              <CardContent className="p-6 sm:p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3 text-base">
                    <div className="flex items-center gap-2">
                      <span>{"\u{1F4C5}"}</span>
                      <span className="font-medium">
                        第 2 班｜開課日期尚未公告
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{"\u{1F558}"}</span>
                      <span>9:00–12:00（3 小時）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{"\u{1F4CD}"}</span>
                      <span>
                        臺北市區・捷運站步行可達（報名後告知教室地址）
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{"\u{1F465}"}</span>
                      <span>限 12 名</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{"\u{1F4BB}"}</span>
                      <span>請攜帶筆電（Mac 或 Windows）</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      以下為上梯定價，僅供參考，開課日期公布後可能調整
                    </p>
                    <div className="rounded-lg border border-primary/20 bg-background/80 p-4">
                      <p className="text-sm text-muted-foreground">
                        單人原價
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        NT$4,500
                      </p>
                    </div>
                    <div className="rounded-lg border border-primary/40 bg-primary/10 p-4">
                      <p className="text-sm text-foreground">
                        🎓 Antigravity 版舊生
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        NT$3,500
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        現折 NT$1,000・需在報名表備註欄填寫舊生憑證
                      </p>
                    </div>
                  </div>
                </div>

                {/* 課前準備 */}
                <div className="mt-6 rounded-lg border-2 border-amber-300 bg-amber-50/60 p-4">
                  <p className="text-sm font-semibold text-amber-950">
                    ⚠️ 課前必備（請務必先確認）
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-amber-900/90">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-amber-700">✓</span>
                      <span>
                        自行訂閱 <span className="font-semibold">Claude Pro（US$20／月）</span>
                        或 <span className="font-semibold">Claude Max（US$100 起／月）</span>，本課不代付
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-amber-700">✓</span>
                      <span>
                        筆電裝好 Node.js + Claude Code CLI（課前一週寄安裝指南）
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-amber-700">✓</span>
                      <span>準備你想做的網站／工具的內容素材</span>
                    </li>
                  </ul>
                </div>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  下一梯開課日期尚未公告，留下 E-mail，開課時第一個通知你
                </p>
              </CardContent>
            </Card>
            <CourseNotifyEntry slug="vibe-coding-claude-code" />
          </section>

          {/* ====== Two Choices ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              你有兩種選擇
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Card className="border-muted bg-muted/30">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-muted-foreground">
                    繼續用網頁版聊天
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    每改一次貼一次、每次都重講一次背景、整個專案 context 永遠塞不下、付了 Pro／Max 但只用到三成功能。
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-primary">
                    花 3 小時，把 Claude Code 變成你的 AI 同事
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    在終端機裡跑通整套工作流：Plan Mode、Skills、Hooks、MCP、部署。回家立刻用，副業／產品從這天開始長出來。
                  </p>
                  <Button size="sm" className="mt-5 h-9 px-6" asChild>
                    <a href="#register">留信箱通知我 →</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ====== FAQ ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              常見問題
            </h2>
            <div className="mt-8 space-y-4">
              {faqs.map((faq, i) => (
                <Card key={i}>
                  <CardContent className="p-5 sm:p-6">
                    <h3 className="text-base font-semibold text-foreground">
                      Q：{faq.q}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {faq.a}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-base text-muted-foreground">
                還有其他問題？歡迎來信詢問。
              </p>
              <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <a href="#register">留信箱通知我</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base"
                  asChild
                >
                  <a href="mailto:iamvista@gmail.com?subject=Vibe%20Coding%20for%20Claude%20Code%20%E5%95%8F%E9%A1%8C">
                    寫信給我們
                  </a>
                </Button>
              </div>
            </div>
          </section>

          <CourseNotifyFooter slug="vibe-coding-claude-code" />

          {/* 返回課程列表 */}
          <div className="border-t pt-10 pb-16 text-center sm:pb-20">
            <Button variant="outline" asChild>
              <Link href="/courses">← 回到所有課程</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
