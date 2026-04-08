import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Zap,
  BookOpen,
  Users,
  Download,
  Bot,
  Target,
  BarChart3,
  Palette,
  Mic,
  Briefcase,
  Heart,
} from "lucide-react";

// ── SEO ───────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "AI 教練工坊｜打造你的 AI 實踐教練 | solo.tw",
  description:
    "不是只陪你聊天，而是主動 check-in、追蹤進度、陪你把想法真正落地。早鳥價 NT$2,499，一次買斷。",
  openGraph: {
    title: "AI 教練工坊｜打造你的 AI 實踐教練",
    description:
      "不是只陪你聊天，而是主動 check-in、追蹤進度、陪你把想法真正落地。早鳥價 NT$2,499。",
    images: [
      {
        url: "/products/ai-coach-kit/og",
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "https://www.solo.tw/products/ai-coach-kit",
  },
};

// ── Data ──────────────────────────────────────────────────────────────────────

const painPoints = [
  {
    emoji: "📚",
    title: "買了課程卻沒讀完",
    text: "花錢買了教材，收藏了很多內容，卻總是忙著忙著就擱著。不是你不想學，而是沒有一套機制，幫你把學習變成持續行動。",
  },
  {
    emoji: "😶",
    title: "一個人學習很孤單",
    text: "沒有回饋、沒有人追進度，也沒有固定的節奏。三天熱度過後，很多原本想做的事，就慢慢沉下去了。",
  },
  {
    emoji: "🤖",
    title: "ChatGPT 很方便，但總是接不上你",
    text: "每次都要重新交代背景。你知道它很厲害，但它不認識你的脈絡，不理解你的目標，更不會一路追蹤你做到哪裡。",
  },
  {
    emoji: "💸",
    title: "想找真人教練，但成本太高",
    text: "一對一教練確實有幫助，但每次幾千元起跳，不是每個人都能長期負擔。更現實的是，你需要的不是偶爾被點醒一次，而是有人能持續陪你走。",
  },
];

const genericBotFeatures = [
  "被動等你發問",
  "不記得你上次做到哪裡",
  "常給通用建議，卻不貼近你的處境",
  "沒有節奏，沒有追蹤，也沒有真正的推進感",
];

const practiceCoachFeatures = [
  "主動 check-in，定期問你進度",
  "依照你的知識背景與目標陪你思考",
  "幫你把抽象想法拆成小實驗、小步驟",
  "持續追蹤、封存回顧，讓成長留下痕跡",
];

const whatYouGet = [
  {
    Icon: Zap,
    title: "4 個 Coach Skills",
    desc: "晨間覆盤、下午 check-in、週報總結、每日自由寫作。你不需要從零設計互動流程，直接就能把 AI 教練跑起來。",
  },
  {
    Icon: Download,
    title: "模板系統",
    desc: "結構化的對話模板，幫助你的 AI 每次都知道該怎麼問、怎麼追、怎麼帶你往前走。這不是隨機對話，而是有節奏的教練設計。",
  },
  {
    Icon: BookOpen,
    title: "Vista Coach 知識庫（130+ 篇素材）",
    desc: "涵蓋一人事業、內容創作、AI 工具應用、思考整理與個人成長等主題。讓你的 AI 教練不是只給泛用回答，而是帶著更有脈絡、更有深度的思考方式陪你工作。",
  },
  {
    Icon: Target,
    title: "6 份零基礎指南",
    desc: "從安裝 Claude Desktop、設定流程，到第一次 check-in 的完整教學。就算你對這些工具不熟，也能一步步完成。",
  },
  {
    Icon: BarChart3,
    title: "實驗框架",
    desc: "把「我想改變」轉化成可追蹤、可驗證的小實驗。很多人不是沒有目標，而是不知道怎麼把目標變成可以實做的步驟。",
  },
  {
    Icon: CheckCircle2,
    title: "3 份範例檔案",
    desc: "真實的 check-in 對話、週報範本與進度追蹤表。不是只有抽象說明，而是直接讓你看到一套實際可用的樣子。",
  },
];

const useCases = [
  {
    Icon: Mic,
    title: "內容創作者",
    desc: "把自己的文章、電子報、Podcast 逐字稿變成教練背景知識。每天追蹤創作進度，設計內容實驗，整理卡關與突破。",
  },
  {
    Icon: Users,
    title: "企業講師／培訓師",
    desc: "用講義、案例與學員回饋建立專屬教練。每週覆盤授課成效，設計下一輪優化方向。",
  },
  {
    Icon: Palette,
    title: "設計師／自由工作者",
    desc: "用作品集筆記、客戶反饋與工作紀錄，建立自己的回顧系統。不再只是忙完一個案子又接下一個，而是逐步優化工作流與收入結構。",
  },
  {
    Icon: Briefcase,
    title: "顧問／教練",
    desc: "把案例、洞察、諮詢問題集整理進系統。每週回顧服務品質、提案表現與客戶回饋，讓專業持續進化。",
  },
  {
    Icon: Heart,
    title: "任何想把想法變成行動的人",
    desc: "只要你常常有很多念頭、很多計畫，卻苦於沒有人陪你推進，這套工具包就能成為你每天的外部支點。",
  },
];

const faqs = [
  {
    q: "需要技術底子嗎？",
    a: "完全不需要。工具包附有 6 份零基礎指南，從安裝 Claude Desktop 到第一次 check-in，一步步帶你完成。沒有任何程式碼門檻。",
  },
  {
    q: "除了購買費用，還有其他成本嗎？",
    a: "需要訂閱 Claude（建議 Pro 方案，月費 USD $20）或使用 Claude API（依用量計費）。工具包本身是一次買斷，沒有月費。",
  },
  {
    q: "Vista Coach 是什麼？",
    a: "Vista Coach 是由 Vista 過去 130+ 篇精選文章整理而成的知識庫。內容涵蓋一人事業、內容創作、AI 工具應用、個人成長等主題。它的作用，是讓你的 AI 教練更理解你的工作型態與思考脈絡，給出更有深度的建議。",
  },
  {
    q: "適用哪些行業？",
    a: "任何以知識、內容與經驗為核心的工作都適用。包括講師、顧問、創作者、設計師、自由工作者、行銷人員等。只要你有自己的知識素材，就能打造專屬教練。",
  },
  {
    q: "支援哪些平臺？",
    a: "支援 macOS 和 Windows。建議使用 Claude Desktop 搭配本工具包，體驗最完整。",
  },
  {
    q: "和 AI 工具工作坊有什麼不同？",
    a: "兩者完全獨立。工作坊是現場小班授課，這個工具包是數位產品，隨買隨用。不需要先上過工作坊也能使用；如果兩者搭配，效果會更完整。",
  },
  {
    q: "購買後如何取得更新？",
    a: "工具包如有新增 Skills、更新指南或其他優化內容，我們會透過 Email 通知，提供最新版本下載方式。",
  },
  {
    q: "可以退款嗎？",
    a: "由於這是數位產品，一經購買即可下載，恕不提供退款。若購買前有疑問，歡迎先透過 Email 詢問。",
  },
];

const pricingItems = [
  "4 個 Coach Skills（晨間 / 下午 / 週報 / 寫作）",
  "模板系統 + 實驗框架",
  "Vista Coach 130+ 篇知識庫",
  "6 份零基礎安裝 & 使用指南",
  "3 份真實對話範例檔案",
  "終身使用 + 免費版本更新",
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AICoachKitPage() {
  return (
    <div>
      {/* ====== Hero ====== */}
      <section className="bg-gradient-to-b from-stone-100/60 to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm sm:text-base">
            數位產品・一次買斷
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
            AI 教練工坊
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600 sm:text-xl">
            打造屬於你的 AI 實踐教練
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-base text-stone-500">
            不是只陪你聊天，而是主動 check-in、追蹤進度、陪你把想法真正落地
          </p>
          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-base text-stone-400 line-through">原價 NT$3,999</p>
            <p className="text-3xl font-bold text-primary sm:text-4xl">早鳥價 NT$2,499</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* ====== Opening ====== */}
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold sm:text-3xl text-stone-900">
              你缺的，也許不是更多工具
            </h2>
            <p className="mt-2 text-xl text-primary font-semibold">
              而是一個能陪你持續前進的系統
            </p>
            <div className="mt-6 space-y-4 text-base text-stone-600 leading-relaxed">
              <p>
                你可能已經買過課、存過一堆教學、開過無數個新計畫。
                你不是沒想法，也不是不夠努力。
              </p>
              <p>真正困難的，往往不是「開始」，而是：</p>
              <ul className="space-y-2 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">→</span>
                  開始之後，怎麼持續？
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">→</span>
                  卡住的時候，誰來幫你整理？
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">→</span>
                  進度亂掉的時候，誰來提醒你回到正軌？
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">→</span>
                  腦中有很多想法的時候，誰能陪你把它一步步變成可執行的行動？
                </li>
              </ul>
              <p>
                很多人以為自己缺的是效率工具。
                但走到最後才發現，真正稀缺的是一個會陪你思考、陪你追進度、陪你把事做完的「實踐教練」。
              </p>
            </div>
          </div>
        </section>

        {/* ====== What It Is ====== */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold sm:text-3xl text-stone-900">
              AI 教練工坊，就是為這件事而設計的
            </h2>
            <div className="mt-6 space-y-4 text-base text-stone-600 leading-relaxed">
              <p>
                它不是一套冷冰冰的模板，也不是單純幫你生成文字的聊天工具。
                它是一套幫你打造「AI 實踐教練」的完整系統。
              </p>
              <p>
                你可以把自己的知識、文章、講義、逐字稿、工作經驗餵給它，
                再透過設計好的 Coach Skills、模板系統與引導機制，讓 AI 不只是回答問題，而是開始主動陪你前進。
              </p>
            </div>
          </div>
        </section>

        {/* ====== Pain Points ====== */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            你有沒有過這樣的經驗？
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            如果中了兩項以上，這套工具包就是為你設計的。
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {painPoints.map((point, i) => (
              <Card key={i} className="border-stone-200">
                <CardContent className="flex items-start gap-3 p-5 sm:p-6">
                  <span className="text-2xl shrink-0">{point.emoji}</span>
                  <div>
                    <p className="text-lg font-semibold text-stone-900">{point.title}</p>
                    <p className="mt-1 text-base text-stone-500 leading-relaxed">{point.text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== Compare ====== */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            AI 聊天機器人 vs AI 實踐教練
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            差別不在 AI 有多聰明，而在於：你有沒有把它設計成一個會陪你行動的系統
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card className="border-stone-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="h-5 w-5 text-stone-400" />
                  <h3 className="font-semibold text-lg text-stone-700">一般 AI 聊天機器人</h3>
                </div>
                <ul className="space-y-3">
                  {genericBotFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-base text-stone-500">
                      <span className="mt-0.5 shrink-0 text-red-400">✗</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg text-stone-900">AI 實踐教練</h3>
                  <Badge className="ml-auto text-xs">AI 教練工坊</Badge>
                </div>
                <ul className="space-y-3">
                  {practiceCoachFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-base text-stone-700">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <p className="mt-6 text-center text-base text-stone-600">
            你買的不是一個會講話的 AI。你買的是一套把 AI 變成「陪你做事的人」的方法。
          </p>
        </section>

        {/* ====== What It Does ====== */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold sm:text-3xl text-stone-900">
              這套工具包，會幫你做到什麼？
            </h2>
            <p className="mt-3 text-base text-stone-500">
              它會幫你把 AI 從「偶爾用一下的工具」變成一位真正能參與你日常節奏的實踐教練。
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "每天 check-in，拉回自己的執行節奏",
                "追蹤學習、創作、工作或專案進度",
                "設計小實驗，把大目標拆成能落地的行動",
                "每週回顧，整理突破、盲點與下一步",
                "把你過去寫過的內容、教學經驗、思考方法，變成 AI 能真正使用的背景知識",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-base text-stone-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-base text-stone-600 leading-relaxed">
              換句話說，這套產品不只是幫你「用 AI 做事」，而是幫你建立一套能長期推進自己的個人系統。
            </p>
          </div>
        </section>

        {/* ====== What You Get ====== */}
        <section id="what-you-get" className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            工具包包含什麼？
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            六大模組，一次買斷，即買即用。不需要技術背景，也不需要會寫程式。
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whatYouGet.map(({ Icon, title, desc }, i) => (
              <Card key={i} className="border-stone-200">
                <CardContent className="p-5 sm:p-6">
                  <Icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-stone-900 text-lg">{title}</h3>
                  <p className="mt-2 text-base text-stone-500 leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== Not Just Materials ====== */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold sm:text-3xl text-stone-900">
              你得到的，不只是素材
            </h2>
            <p className="mt-2 text-xl text-primary font-semibold">
              而是一套可立即部署的 AI 教練系統
            </p>
            <div className="mt-6 space-y-4 text-base text-stone-600 leading-relaxed">
              <p>市面上很多產品賣的是幾個 prompt、一些模板、一堂錄好的教學課、一堆資訊讓你自己回去消化。</p>
              <p>但這套產品真正想給你的，不只是「更多內容」。而是讓你今天就能開始建立：</p>
              <ul className="space-y-2 pl-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  屬於自己的 AI 教練
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  屬於自己的成長追蹤節奏
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  屬於自己的知識陪跑系統
                </li>
              </ul>
              <p>
                這也是為什麼它更像是一套「個人運作系統」，而不是一份下載後就容易被遺忘的數位檔案。
              </p>
            </div>
          </div>
        </section>

        {/* ====== Use Cases ====== */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            誰適合用這個工具包？
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            任何以知識、內容、經驗與思考為核心工作的人，都很適合。
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {useCases.map(({ Icon, title, desc }, i) => (
              <Card key={i} className="border-stone-200">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="h-5 w-5 text-primary shrink-0" />
                    <h3 className="font-semibold text-stone-900 text-lg">{title}</h3>
                  </div>
                  <p className="text-base text-stone-600 leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== Why Now ====== */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold sm:text-3xl text-stone-900">
              為什麼現在就適合開始？
            </h2>
            <div className="mt-6 space-y-4 text-base text-stone-600 leading-relaxed">
              <p>
                因為很多人的問題，不是沒資源，而是資源太多，卻缺少一個能把自己帶動起來的系統。
              </p>
              <p>
                你可以再買下一堂課，也可以再收藏另一篇教學。
                但如果沒有一套機制，讓你持續回到行動本身，很多東西最後還是只會停在「知道」。
              </p>
              <p className="text-stone-900 font-semibold">
                AI 教練工坊的重點，不是讓你知道更多。而是幫你把「知道」慢慢變成「做到」。
              </p>
            </div>
          </div>
        </section>

        {/* ====== Pricing ====== */}
        <section id="pricing" className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            價格方案
          </h2>
          <div className="mt-8 mx-auto max-w-md">
            <Card className="border-2 border-primary shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <p className="text-lg text-stone-400 line-through">原價 NT$3,999</p>
                  <p className="text-5xl font-bold text-stone-900 mt-1">NT$2,499</p>
                  <p className="mt-2 text-base text-primary font-semibold">早鳥價・一次買斷・無月費</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {pricingItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-base text-stone-700">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="rounded-lg bg-stone-50 p-4 text-sm text-stone-500 space-y-2">
                  <p>你額外需要的，只是：</p>
                  <p>・Claude Pro 方案（建議，月費約 USD $20）</p>
                  <p>・或 Claude API（依用量計費）</p>
                  <p className="mt-3 text-stone-600">
                    也就是說，你買的不是另一個訂閱負擔，而是一套可以長期持有、反覆使用、持續升級的個人系統。
                  </p>
                </div>

                <div className="mt-6 rounded-lg bg-primary/5 border border-primary/20 p-4 text-sm text-stone-600 space-y-2">
                  <p className="font-semibold text-stone-900">這樣算，其實很划算</p>
                  <p>
                    如果你曾經考慮真人教練、顧問陪跑、或一對一諮詢，
                    一次幾十分鐘到一小時，費用可能就超過這個價格。
                  </p>
                  <p>
                    只要這套系統幫你少拖延幾次、少卡關幾回、多完成一個作品、多跑完一輪學習計畫——它就已經回本。
                  </p>
                </div>

                {/* 購買連結暫時隱藏 */}
                {/* <PurchaseForm /> */}
                <p className="mt-6 text-center text-base text-stone-500">
                  即將開放購買，敬請期待
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ====== FAQ ====== */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            常見問題
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="border-stone-200">
                <CardContent className="p-5 sm:p-6">
                  <p className="font-semibold text-stone-900 text-lg">Q：{faq.q}</p>
                  <p className="mt-2 text-base text-stone-600 leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== Closing ====== */}
        <section className="py-14 sm:py-20 border-t border-stone-100">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl text-stone-900">
              你不是不夠努力
            </h2>
            <p className="mt-2 text-xl text-primary font-semibold">
              你只是需要一個能陪你走下去的系統
            </p>
            <div className="mt-6 space-y-4 text-base text-stone-600 leading-relaxed">
              <p>
                很多時候，真正讓人停滯不前的，不是能力不夠，也不是想法不夠。
                而是少了一個能幫你穩定前進、持續回來、把混亂變清楚的節奏。
              </p>
              <p>
                AI 教練工坊想做的，就是幫你把這個節奏建起來。
                讓 AI 不再只是偶爾聊幾句的工具，而成為一位真正能陪你前進的實踐教練。
              </p>
            </div>
            <div className="mt-8 flex flex-col items-center gap-2">
              <p className="text-base text-stone-400 line-through">原價 NT$3,999</p>
              <p className="text-3xl font-bold text-primary sm:text-4xl">早鳥價 NT$2,499</p>
              <p className="mt-2 text-base text-stone-500">即將開放購買，敬請期待</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
