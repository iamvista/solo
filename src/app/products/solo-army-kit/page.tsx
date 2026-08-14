import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InterestForm } from "../lecturer-ai-staff/InterestForm";
import {
  Bot,
  Users,
  ShieldCheck,
  CheckCircle2,
  Download,
  FileText,
  Layers,
  Compass,
  ArrowRight,
  Sparkles,
  Gift,
  Crown,
} from "lucide-react";

const STARTER_URL = "https://www.vista.tw/solo-army";
// 2026-08-14 完整版暫停販售，改走等候名單；沿用 Pro 版既有的 InterestForm ＋
// /api/interest 動線，只換 productId。重新開賣時把 CheckoutButton 接回來即可。
const CORE_INTEREST_ID = "solo-army-kit-core";
const PRO_INTEREST_ID = "solo-army-kit-pro";

export const metadata: Metadata = {
  title: "無人公司 AI 軍團啟動包｜非工程師也能建 AI 團隊 | solo.tw",
  description:
    "一套可直接鋪進 Claude Code 的制度檔軍團：派工原則、角色人設、對抗式驗收流程，全部寫成文件，不用寫程式。免費版可立即下載，完整版重新設計中。",
  openGraph: {
    title: "無人公司 AI 軍團啟動包｜非工程師也能建 AI 團隊",
    description:
      "派工原則、角色人設、對抗式驗收流程，全部寫成文件，鋪進 Claude Code 就能用。免費版可立即下載，完整版重新設計中。",
  },
  alternates: {
    canonical: "https://www.solo.tw/products/solo-army-kit",
  },
};

const painPoints = [
  {
    emoji: "🤯",
    title: "AI 什麼都會做，但你不知道該怎麼分工",
    text: "一個人對著一個聊天視窗，什麼任務都塞進去，結果每件事都做得不上不下。",
  },
  {
    emoji: "🔁",
    title: "同樣的錯誤一直重犯",
    text: "沒有制度化的規則，AI 每次都從零開始，你每次都要重新解釋一樣的事。",
  },
  {
    emoji: "🕳️",
    title: "不會寫程式，不知道從哪裡開始",
    text: "市面上的 AI 工作流教學大多假設你會寫 code，你只是想把事情交出去。",
  },
  {
    emoji: "🙈",
    title: "AI 做完的東西，沒人把關",
    text: "沒有驗收機制，AI 說「完成了」你就只能信，出包才發現。",
  },
];

const teachingComponents = [
  {
    icon: Compass,
    title: "指揮官不下場的派工原則",
    desc: "什麼任務自己做、什麼任務派給 AI 分身處理，一套判準讓你不再事必躬親，也不會亂丟工作。",
  },
  {
    icon: Users,
    title: "AI 團隊的人設設計手法",
    desc: "每個角色有清楚的職責、口吻與邊界，AI 分身之間才不會互踩，也才會讓你覺得「這是一個團隊」而不是一堆指令。",
  },
  {
    icon: ShieldCheck,
    title: "對抗式驗收流程",
    desc: "做事的 AI 不驗自己的活，另一個獨立角色負責挑錯、要證據、判過關與否，你不用逐行核對就能信任產出。",
  },
];

const deliverables = [
  {
    icon: FileText,
    title: "制度檔總綱＋核心規則",
    desc: "派工原則、驗收標準、診斷流程，寫成文件而非程式碼，直接鋪進 Claude Code 就生效。",
  },
  {
    icon: Users,
    title: "秘書團隊全套角色檔",
    desc: "行事曆、任務追蹤、覆盤等日常事務的完整人設分工，照抄就能用。",
  },
  {
    icon: Bot,
    title: "工程協作角色範本",
    desc: "產品經理、技術負責人等角色骨架，帶你把「開發任務」拆成可派工的流程。",
  },
  {
    icon: ShieldCheck,
    title: "獨立驗收角色範本",
    desc: "示範如何設計一個「只挑錯不動手」的角色，杜絕 AI 自己驗自己的盲點。",
  },
  {
    icon: Layers,
    title: "業務規劃與部門範本",
    desc: "跨業務線統籌與自訂通訊錄骨架，帶你搭出屬於自己的分工地圖。",
  },
  {
    icon: Download,
    title: "完整安裝指南",
    desc: "含既有設定備份步驟、佔位符對照表、常見 MCP 申請指引，30 分鐘內看得懂、鋪得上去。",
  },
];

const faqs = [
  {
    q: "我不會寫程式，真的能用嗎？",
    a: "可以。整套內容都是文件（Markdown），不是程式碼。你只需要把檔案放進指定資料夾，AI 工具就會照著這些規則運作。安裝指南會一步步帶你走完。",
  },
  {
    q: "需要哪些工具才能用？",
    a: "你需要 Claude Code（Anthropic 官方 CLI）。部分角色會用到 Google 日曆等外部服務，安裝指南有申請說明；沒有申請也不影響核心的派工與驗收制度。",
  },
  {
    q: "和 Vista 自己在用的是同一套嗎？",
    a: "是同一套派工邏輯與角色設計手法的泛化版，去掉個人專屬的識別碼與私人專案細節，只留下可複製、可重用的制度骨架。目前正在重新整理這道去識別化流程，所以完整版暫停販售。",
  },
  {
    q: "為什麼完整版暫停販售？",
    a: "內部複查時發現交付內容還有需要重做的地方：部分段落引用了沒有一併附上的檔案，另有幾份範本的來源需要重新確認。與其讓你買到半成品，先停售、重新設計完再開賣。留下 email，重新開賣時會通知你。",
  },
  {
    q: "可以拿去對外販售或公開重製嗎？",
    a: "不行。這是個人使用授權：你可以自用、修改、套用在自己的專案上，但不能轉售、不能整份公開重製。詳細條款附在下載包內。",
  },
];

export default function SoloArmyKitPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-stone-100/60 to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm sm:text-base">
            無人公司 AI 軍團啟動包
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
            非工程師也能建一支 AI 軍團
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 sm:text-xl leading-relaxed">
            派工原則、角色人設、對抗式驗收流程，全部寫成文件。
            <br className="hidden sm:block" />
            完整版正在重新設計，暫停販售中。
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-stone-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              不用寫程式
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              完整角色範本
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              對抗式驗收機制
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              免費版可立即下載
            </span>
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <a href="#pricing">登記開賣通知</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base"
              asChild
            >
              <a href="#deliverables">看你會收到什麼</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Pain points */}
        <section className="py-14 sm:py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            如果你遇過這些
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            這份啟動包就是為你做的
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {painPoints.map((point, i) => (
              <Card key={i} className="border-stone-200">
                <CardContent className="flex items-start gap-3 p-5 sm:p-6">
                  <span className="text-2xl shrink-0">{point.emoji}</span>
                  <div>
                    <p className="text-lg font-semibold text-stone-900">
                      {point.title}
                    </p>
                    <p className="mt-1 text-base text-stone-500 leading-relaxed">
                      {point.text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why this exists */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-2xl font-bold sm:text-3xl text-stone-900">
            為什麼做這份
          </h2>
          <p className="mt-2 text-xl text-primary font-semibold">
            因為 AI 工具不缺，缺的是「怎麼分工、怎麼驗收」的制度。
          </p>
          <div className="mt-6 space-y-4 text-base text-stone-600 leading-relaxed">
            <p>
              我用 Claude Code 經營一間無人公司，每天把大量任務派給不同的 AI 分身：有人管行程與郵件、有人管開發、有人專門負責挑錯驗收。這套分工不是憑感覺，而是一整套寫成文件的制度：什麼該自己做、什麼該派工、派工後怎麼驗收。
            </p>
            <p>
              這套制度原本只留給自己用。這份啟動包把個人專屬的帳號識別碼與私人專案細節全部移除，留下可複製的骨架，讓你也能照著鋪一套屬於自己的 AI 軍團。
            </p>
          </div>
        </section>

        {/* Three teaching components */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            三個核心教學重點
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            不是一堆設定檔，是三套可以直接套用的思考方法
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {teachingComponents.map((t, i) => {
              const Icon = t.icon;
              return (
                <Card key={i} className="border-stone-200">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-stone-900">
                      {t.title}
                    </p>
                    <p className="mt-2 text-base text-stone-600 leading-relaxed">
                      {t.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Deliverables */}
        <section id="deliverables" className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            你會收到什麼
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {deliverables.map((d, i) => {
              const Icon = d.icon;
              return (
                <Card key={i} className="border-stone-200">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-stone-900">
                      {d.title}
                    </p>
                    <p className="mt-2 text-base text-stone-600 leading-relaxed">
                      {d.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            選一個適合你的開始
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            免費版可以立刻下載開始跑。完整版與 Pro 陪跑版都在重新設計，開賣時通知你。
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3 md:items-stretch">
            {/* Free */}
            <Card className="flex flex-col border-stone-200">
              <CardContent className="flex flex-1 flex-col p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-stone-500" />
                  <p className="text-base font-medium text-stone-500">免費入門包</p>
                </div>
                <p className="mt-3 text-3xl font-bold text-stone-900">免費</p>
                <p className="mt-2 text-sm text-stone-500 leading-relaxed">
                  先用精選的核心制度檔跑起來，感受 AI 分工是什麼樣子。
                </p>
                <ul className="mt-5 flex-1 space-y-2.5 text-sm text-stone-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-stone-400 shrink-0 mt-0.5" />
                    <span>核心派工原則精選</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-stone-400 shrink-0 mt-0.5" />
                    <span>一個祕書角色（含晨間簡報）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-stone-400 shrink-0 mt-0.5" />
                    <span>工程協作角色骨架</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-12 w-full text-base"
                  >
                    <a href={STARTER_URL}>免費下載</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Core */}
            <Card className="relative flex flex-col border-primary border-2 shadow-lg">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1">
                改版中
              </Badge>
              <CardContent className="flex flex-1 flex-col p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p className="text-base font-medium text-primary">完整版</p>
                </div>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <p className="text-4xl font-bold text-primary">暫停販售</p>
                </div>
                <p className="mt-2 text-sm text-stone-500 leading-relaxed">
                  這套制度檔正在重新設計與整理，暫時停止販售。留下 email，重新開賣時第一時間通知你。
                </p>
                <ul className="mt-5 flex-1 space-y-2.5 text-sm text-stone-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>制度檔總綱＋核心規則</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>秘書團隊全套角色檔</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>工程協作角色範本</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>獨立驗收角色範本</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>業務規劃與部門範本</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>完整安裝指南</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <InterestForm productId={CORE_INTEREST_ID} />
                </div>
              </CardContent>
            </Card>

            {/* Pro（籌備中） */}
            <Card className="flex flex-col border-stone-200">
              <CardContent className="flex flex-1 flex-col p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <p className="text-base font-medium text-stone-500">Pro 陪跑版</p>
                </div>
                <p className="mt-3 text-3xl font-bold text-stone-900">即將推出</p>
                <p className="mt-2 text-sm text-stone-500 leading-relaxed">
                  完整版全部內容，再加上讓你「一定裝得起來、跟得上更新」的陪跑。
                </p>
                <ul className="mt-5 flex-1 space-y-2.5 text-sm text-stone-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>完整版全部內容</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>安裝走查影片（跟著做不卡關）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>制度檔更新權（新版免費拿）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>一次線上 Q&A</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <InterestForm productId={PRO_INTEREST_ID} />
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="mt-8 text-center text-xs text-stone-400 max-w-lg mx-auto leading-relaxed">
            免費版可直接下載 · 完整版與 Pro 版重新設計中 · 登記開賣通知免費、不會收費
          </p>
        </section>

        {/* FAQ */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            常見問題
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="rounded-lg border border-stone-200 bg-white p-5">
                <summary className="cursor-pointer text-base font-semibold text-stone-900 hover:text-primary">
                  {f.q}
                </summary>
                <p className="mt-3 text-base text-stone-600 leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-14 sm:py-20 border-t border-stone-100">
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-stone-100 p-8 text-center sm:p-12">
            <Sparkles className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl text-stone-900">
              重新開賣時，第一個通知你
            </h2>
            <p className="mt-3 text-base text-stone-600 max-w-xl mx-auto">
              免費版現在就能下載開始跑。完整版重新設計完成後，會寄信通知登記過的人。
            </p>
            <div className="mt-6 flex justify-center">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <a href="#pricing">
                  登記開賣通知{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
