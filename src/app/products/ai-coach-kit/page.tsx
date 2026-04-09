import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "./CheckoutButton";
import {
  CheckCircle2,
  Zap,
  BookOpen,
  Users,
  ArrowRight,
  Download,
  Bot,
  Target,
  BarChart3,
  Palette,
  Mic,
  Briefcase,
} from "lucide-react";

// ── SEO ───────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "AI 教練工坊｜打造你的 AI 實踐教練 | solo.tw",
  description:
    "一次買斷 NT$2,499。4 個 Coach Skills + Vista Coach 150 篇知識庫 + 6 份零基礎指南，讓 AI 主動 check-in、追蹤你的進度，把想法真正落地。",
  openGraph: {
    title: "AI 教練工坊｜打造你的 AI 實踐教練",
    description:
      "一次買斷 NT$2,499。4 個 Coach Skills + Vista Coach 150 篇知識庫 + 6 份零基礎指南，讓 AI 主動 check-in、追蹤你的進度。",
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
    text: "花錢買了教材，放著積灰，總說「忙完這陣子再看」。",
  },
  {
    emoji: "😶",
    title: "沒有人督促你",
    text: "一個人學習很孤單，沒有回饋、沒有進度追蹤，三天熱度就消失。",
  },
  {
    emoji: "🤖",
    title: "ChatGPT 總是忘記對話",
    text: "每次都要重新解釋背景，AI 根本不認識你，更別說追蹤你的進展。",
  },
  {
    emoji: "💸",
    title: "真人教練費用太高",
    text: "一小時上千元的教練費，不是每個人都負擔得起，更難持續。",
  },
];

const genericBotFeatures = [
  "被動回答問題，不主動追蹤",
  "不記得上次你說了什麼",
  "給的是通用建議，不針對你",
  "沒有進度管理，三分鐘熱度",
];

const practiceCoachFeatures = [
  "主動 check-in，定期問你的進度",
  "設計實驗，幫你把想法付諸行動",
  "追蹤進展，記錄你的成長軌跡",
  "每週封存，讓你隨時回顧突破",
];

const whatYouGet = [
  {
    Icon: Zap,
    title: "4 個 Coach Skills",
    desc: "晨間覆盤、下午 check-in、週報總結、每日自由寫作。拆裝即用的教練技能組。",
  },
  {
    Icon: Download,
    title: "模板系統",
    desc: "結構化的對話模板，讓你的 AI 教練每次都知道怎麼問、怎麼追進度。",
  },
  {
    Icon: BookOpen,
    title: "Vista Coach（150 篇素材）",
    desc: "Vista 150 篇精選文章整理為知識庫，讓你的 AI 教練帶著深厚背景知識陪你思考。",
  },
  {
    Icon: Target,
    title: "6 份零基礎指南",
    desc: "從安裝到第一次 check-in，手把手帶你完成設定，不需要任何技術底子。",
  },
  {
    Icon: BarChart3,
    title: "實驗框架",
    desc: "把「我想改變」轉化為可追蹤的小實驗，配合 AI 教練每日記錄與回顧。",
  },
  {
    Icon: ArrowRight,
    title: "3 份範例檔案",
    desc: "真實的 check-in 對話、週報範本、進度追蹤表——直接看懂、直接套用。",
  },
];

const useCases = [
  {
    Icon: Mic,
    title: "內容創作者",
    knowledgeSource: "自己的文章、電子報、Podcast 逐字稿",
    coachUse: "每天 check-in 創作進度，設計內容實驗，追蹤靈感與卡關點",
  },
  {
    Icon: Users,
    title: "企業講師 / 培訓師",
    knowledgeSource: "課程講義、學員回饋、教學案例庫",
    coachUse: "覆盤每場授課，設計下一週的教學改善實驗，追蹤學員成效",
  },
  {
    Icon: Palette,
    title: "設計師 / 自由工作者",
    knowledgeSource: "作品集筆記、客戶反饋、設計靈感資料",
    coachUse: "定期回顧接案節奏，設計工作流改善實驗，追蹤收入與時間分配",
  },
  {
    Icon: Briefcase,
    title: "顧問 / 教練",
    knowledgeSource: "諮詢案例、客戶問題集、行業洞察",
    coachUse: "每週覆盤服務品質，設計提案改善實驗，追蹤客戶轉介紹成效",
  },
];

const faqs = [
  {
    q: "需要技術底子嗎？",
    a: "完全不需要。工具包附有 6 份零基礎指南，從安裝 Claude Desktop 到第一次 check-in，一步步帶你完成，沒有任何程式碼。",
  },
  {
    q: "除了購買費用，還有其他成本嗎？",
    a: "需要訂閱 Claude（建議 Pro 方案，月費 USD $20）或使用 Claude API（依用量計費）。工具包本身是一次買斷，沒有月費。",
  },
  {
    q: "Vista Coach 是什麼？包含哪些內容？",
    a: "Vista Coach 是將 Vista 過去 150 篇精選文章整理成的知識庫，涵蓋一人事業、內容創作、AI 工具應用、個人成長等主題。當作 AI 教練的背景知識，讓它的建議更有深度。",
  },
  {
    q: "適用哪些行業？",
    a: "任何以文字知識為核心的工作都適用——包括講師、顧問、設計師、創作者、行銷人員等。只要你有自己的知識素材，就能打造專屬教練。",
  },
  {
    q: "支援哪些平臺？",
    a: "支援 macOS 和 Windows。建議使用 Claude Desktop 搭配本工具包，體驗最完整。",
  },
  {
    q: "和 AI 工具工作坊是什麼關係？",
    a: "兩者完全獨立。工作坊是現場小班授課，這個工具包是數位產品，隨買隨用。不需要上過工作坊也能使用，但如果兩者都有，效果更好。",
  },
  {
    q: "購買後如何取得更新？",
    a: "工具包有任何更新（新增 Skills、更新指南等），我們會透過 Email 通知你，提供最新版本下載連結。",
  },
  {
    q: "可以退款嗎？",
    a: "由於這是數位產品，一經購買即可下載，恕不提供退款。購買前如有疑問，歡迎先透過 Email 詢問。",
  },
];

const pricingItems = [
  "4 個 Coach Skills（晨間 / 下午 / 週報 / 寫作）",
  "模板系統 + 實驗框架",
  "Vista Coach 150 篇知識庫",
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
          <p className="mx-auto mt-4 max-w-2xl text-base text-stone-500 sm:text-lg">
            打造屬於你的 AI 實踐教練——主動 check-in、追蹤進度、陪你把想法真正落地
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <a href="#pricing">立即購買 NT$2,499</a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <a href="#what-you-get">查看包含內容</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* ====== Pain Points ====== */}
        <section className="py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl text-stone-900">
            你有沒有過這樣的經驗？
          </h2>
          <p className="mt-3 text-center text-sm text-stone-500">
            中了兩項以上，這個工具包就是為你設計的。
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {painPoints.map((point, i) => (
              <Card key={i} className="border-stone-200">
                <CardContent className="flex items-start gap-3 p-4 sm:p-5">
                  <span className="text-2xl shrink-0">{point.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{point.title}</p>
                    <p className="mt-0.5 text-sm text-stone-500">{point.text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== Compare ====== */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-xl font-bold sm:text-2xl text-stone-900">
            AI 聊天機器人 vs AI 實踐教練
          </h2>
          <p className="mt-3 text-center text-sm text-stone-500">
            差別不在 AI 有多聰明，而在你怎麼設定它
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {/* Generic Bot */}
            <Card className="border-stone-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="h-5 w-5 text-stone-400" />
                  <h3 className="font-semibold text-stone-700">AI 聊天機器人</h3>
                </div>
                <ul className="space-y-3">
                  {genericBotFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-stone-500">
                      <span className="mt-0.5 shrink-0 text-red-400">✗</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Practice Coach */}
            <Card className="border-2 border-primary shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-stone-900">AI 實踐教練</h3>
                  <Badge className="ml-auto text-xs">AI 教練工坊</Badge>
                </div>
                <ul className="space-y-3">
                  {practiceCoachFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ====== What You Get ====== */}
        <section id="what-you-get" className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-xl font-bold sm:text-2xl text-stone-900">
            工具包包含什麼？
          </h2>
          <p className="mt-3 text-center text-sm text-stone-500">
            六大模組，買斷即用，不需要任何技術背景
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whatYouGet.map(({ Icon, title, desc }, i) => (
              <Card key={i} className="border-stone-200">
                <CardContent className="p-5">
                  <Icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-stone-900 text-sm">{title}</h3>
                  <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== Use Cases ====== */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-xl font-bold sm:text-2xl text-stone-900">
            誰適合用這個工具包？
          </h2>
          <p className="mt-3 text-center text-sm text-stone-500">
            任何以知識為核心的工作者，都能打造專屬 AI 教練
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {useCases.map(({ Icon, title, knowledgeSource, coachUse }, i) => (
              <Card key={i} className="border-stone-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="h-5 w-5 text-primary shrink-0" />
                    <h3 className="font-semibold text-stone-900 text-sm">{title}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                        知識來源
                      </span>
                      <p className="mt-0.5 text-stone-600">{knowledgeSource}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                        教練用途
                      </span>
                      <p className="mt-0.5 text-stone-600">{coachUse}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== FAQ ====== */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-xl font-bold sm:text-2xl text-stone-900">
            常見問題
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="border-stone-200">
                <CardContent className="p-5">
                  <p className="font-semibold text-stone-900 text-sm">Q：{faq.q}</p>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== Pricing ====== */}
        <section id="pricing" className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-xl font-bold sm:text-2xl text-stone-900">
            立即開始打造你的 AI 教練
          </h2>
          <p className="mt-3 text-center text-sm text-stone-500">
            一次買斷，不需要月費訂閱
          </p>
          <div className="mt-8 mx-auto max-w-md">
            <Card className="border-2 border-primary shadow-lg">
              <CardContent className="p-6 sm:p-8">
                {/* Price */}
                <div className="text-center mb-6">
                  <p className="text-5xl font-bold text-stone-900">NT$2,499</p>
                  <p className="mt-1 text-sm text-stone-500">一次買斷 · 終身使用</p>
                </div>

                {/* Checklist */}
                <ul className="space-y-3 mb-2">
                  {pricingItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Recur 結帳（需登入） */}
                <CheckoutButton />
              </CardContent>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
}
