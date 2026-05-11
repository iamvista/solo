import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowDown, Target, Cog, Rocket, Crown } from "lucide-react";
import { SOCIAL_PROOF } from "@/lib/constants";
import { JsonLd, howToSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "SOLO 成長路徑 — 四階段打造一人事業 | solo.tw",
  description:
    "SOLO 方法論：Set up → Operate → Leverage → Outgrow。從定位到自由，找到你現在的位置，走出下一步。",
  openGraph: {
    title: "SOLO 成長路徑 — 四階段打造一人事業",
    description: "從定位到自由，一人事業的完整成長地圖。",
    url: "https://solo.tw/growth",
  },
  alternates: {
    canonical: "https://www.solo.tw/growth",
  },
};

const stages = [
  {
    letter: "S",
    icon: Target,
    name: "Set up",
    title: "建立根基",
    subtitle: "釐清定位，打好基礎",
    question: "你是誰？你要服務誰？你的獨特價值是什麼？",
    description:
      "每個成功的一人事業，都從清晰的定位開始。在這個階段，你需要回答三個核心問題：你擅長什麼、誰需要你、為什麼選你。",
    keyActions: [
      "完成事業健檢，了解目前的強項與盲點",
      "定義你的專業定位和目標客群",
      "建立個人品牌識別（名稱、簡介、定位語）",
    ],
    cta: { text: "做事業健檢", href: "/diagnose" },
    gradient: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50",
    border: "border-amber-200",
    textAccent: "text-amber-600",
    dotColor: "bg-amber-500",
  },
  {
    letter: "O",
    icon: Cog,
    name: "Operate",
    title: "系統營運",
    subtitle: "建立獲客系統，服務第一批客戶",
    question: "如何讓對的人找到你，並願意付費？",
    description:
      "有了定位之後，你需要跑通從「陌生人 → 讀者 → 潛在客戶 → 付費客戶」的完整流程。工作坊是最快驗證需求的方式。",
    keyActions: [
      "舉辦第一場工作坊或講座",
      "建立電子報，開始累積名單",
      "定期產出內容，建立信任感",
    ],
    cta: { text: "查看工作坊", href: "/courses" },
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    textAccent: "text-blue-600",
    dotColor: "bg-blue-500",
  },
  {
    letter: "L",
    icon: Rocket,
    name: "Leverage",
    title: "槓桿放大",
    subtitle: "用 AI 和系統放大產出",
    question: "如何用一份時間，創造十倍價值？",
    description:
      "當獲客系統跑順後，是時候用槓桿放大影響力。用 AI 工具自動化重複工作、把服務產品化、一個人做出一個團隊的產出。",
    keyActions: [
      "用 AI 工具自動化內容產製流程",
      "將反覆教的內容打包成線上課程",
      "建立可擴展的數位產品（模板、工具包）",
    ],
    cta: { text: "瀏覽線上課程", href: "/courses" },
    gradient: "from-violet-500 to-purple-500",
    bgLight: "bg-violet-50",
    border: "border-violet-200",
    textAccent: "text-violet-600",
    dotColor: "bg-violet-500",
  },
  {
    letter: "O",
    icon: Crown,
    name: "Outgrow",
    title: "超越成長",
    subtitle: "從忙碌的自由工作者，到自由的事業主",
    question: "如何突破個人天花板，達到時間自由？",
    description:
      "最終階段是超越「一個人做所有事」的瓶頸。透過被動收入、高單價顧問服務和社群效應，讓事業系統自己運轉。",
    keyActions: [
      "建立被動收入來源（課程、模板持續銷售）",
      "提供高階 1-on-1 顧問服務",
      "培養同行者社群，互相推薦帶來新客戶",
    ],
    cta: { text: "預約諮詢", href: "/consulting" },
    gradient: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50",
    border: "border-emerald-200",
    textAccent: "text-emerald-600",
    dotColor: "bg-emerald-500",
  },
];

export default function GrowthPage() {
  return (
    <>
    <JsonLd data={howToSchema({
      name: "SOLO 方法論：四階段打造一人事業",
      description: "從定位到自由，一人事業的四階段成長框架",
      steps: [
        { name: "Set up — 建立根基", text: "釐清定位，打好基礎。回答三個核心問題：你擅長什麼、誰需要你、為什麼選你。" },
        { name: "Operate — 系統營運", text: "建立獲客系統，服務第一批客戶。跑通從陌生人到付費客戶的完整流程。" },
        { name: "Leverage — 槓桿放大", text: "用 AI 和系統放大產出。自動化重複工作、把服務產品化。" },
        { name: "Outgrow — 超越成長", text: "從忙碌的自由工作者到自由的事業主。建立被動收入，讓事業系統自己運轉。" },
      ],
    })} />
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,140,110,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(168,140,110,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-amber-50/60 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-emerald-50/40 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            SOLO 方法論
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            四個階段，
            <span className="bg-gradient-to-r from-amber-500 via-blue-500 via-violet-500 to-emerald-500 bg-clip-text text-transparent">
              從零到自由
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-500 sm:text-xl">
            每個一人事業都會經歷這四個階段。
            <br className="hidden sm:block" />
            找到你現在的位置，我幫你走出下一步。
          </p>

          {/* SOLO quick nav */}
          <div className="mx-auto mt-10 flex max-w-lg justify-center gap-3 sm:gap-4">
            {stages.map((stage) => (
              <a
                key={stage.name}
                href={`#${stage.name.toLowerCase().replace(" ", "-")}`}
                className={`flex flex-1 flex-col items-center gap-1.5 rounded-2xl ${stage.bgLight} ${stage.border} border p-4 transition-transform hover:scale-105`}
              >
                <span
                  className={`bg-gradient-to-r ${stage.gradient} bg-clip-text text-3xl font-black text-transparent sm:text-4xl`}
                >
                  {stage.letter}
                </span>
                <span
                  className={`text-xs font-semibold ${stage.textAccent} sm:text-sm`}
                >
                  {stage.name}
                </span>
              </a>
            ))}
          </div>

          <div className="mt-10">
            <Button size="lg" asChild className="h-14 px-8 text-base font-semibold shadow-lg shadow-primary/15 sm:text-lg">
              <Link href="/diagnose">
                做事業健檢，找出你在哪個階段
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stages */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-gradient-to-b from-amber-300 via-blue-300 via-violet-300 to-emerald-300 sm:block lg:left-8" />

            <div className="space-y-16 sm:space-y-24">
              {stages.map((stage, idx) => {
                const Icon = stage.icon;
                const isExternal = stage.cta.href.startsWith("http");
                return (
                  <div
                    key={stage.name}
                    id={stage.name.toLowerCase().replace(" ", "-")}
                    className="scroll-mt-24"
                  >
                    <div className="relative flex items-start gap-6 sm:gap-8 lg:gap-10">
                      {/* Timeline dot */}
                      <div className="hidden sm:flex sm:flex-col sm:items-center">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${stage.dotColor} text-xl font-black text-white shadow-lg ring-4 ring-white lg:h-16 lg:w-16 lg:text-2xl`}
                        >
                          {stage.letter}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        {/* Mobile letter */}
                        <div className="mb-4 flex items-center gap-3 sm:hidden">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${stage.dotColor} text-lg font-black text-white`}
                          >
                            {stage.letter}
                          </div>
                          <div>
                            <span className={`text-sm font-bold ${stage.textAccent}`}>
                              階段 {idx + 1}
                            </span>
                            <span className="mx-2 text-stone-300">·</span>
                            <span className="text-sm font-medium text-stone-500">
                              {stage.name}
                            </span>
                          </div>
                        </div>

                        {/* Header (desktop) */}
                        <div className="hidden items-center gap-3 sm:flex">
                          <span className={`text-sm font-bold ${stage.textAccent}`}>
                            階段 {idx + 1}
                          </span>
                          <span className="text-stone-300">·</span>
                          <span className="text-sm font-medium text-stone-500">
                            {stage.name}
                          </span>
                        </div>

                        <h2 className="mt-1 text-2xl font-bold text-stone-900 sm:mt-2 sm:text-3xl">
                          {stage.title}
                        </h2>
                        <p className={`mt-1 text-base font-medium ${stage.textAccent}`}>
                          {stage.subtitle}
                        </p>

                        {/* Core question */}
                        <div
                          className={`mt-5 rounded-xl ${stage.bgLight} ${stage.border} border p-5`}
                        >
                          <p className="text-sm font-semibold text-stone-500">
                            核心問題
                          </p>
                          <p className="mt-1 text-lg font-semibold text-stone-800">
                            「{stage.question}」
                          </p>
                        </div>

                        <p className="mt-5 text-base leading-relaxed text-stone-600">
                          {stage.description}
                        </p>

                        {/* Key Actions */}
                        <div className="mt-6">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
                            這個階段你該做的事
                          </h3>
                          <ul className="mt-3 space-y-2.5">
                            {stage.keyActions.map((action) => (
                              <li
                                key={action}
                                className="flex items-start gap-2.5 text-sm text-stone-700"
                              >
                                <svg
                                  className={`mt-0.5 h-4 w-4 flex-shrink-0 ${stage.textAccent}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                  />
                                </svg>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA */}
                        <div className="mt-6">
                          <Button variant="outline" size="sm" asChild className={`${stage.border} ${stage.textAccent} hover:${stage.bgLight}`}>
                            {isExternal ? (
                              <a href={stage.cta.href} target="_blank" rel="noopener noreferrer">
                                {stage.cta.text}
                                <ArrowRight className="ml-1.5 h-4 w-4" />
                              </a>
                            ) : (
                              <Link href={stage.cta.href}>
                                {stage.cta.text}
                                <ArrowRight className="ml-1.5 h-4 w-4" />
                              </Link>
                            )}
                          </Button>
                        </div>

                        {/* Divider arrow (mobile) */}
                        {idx < stages.length - 1 && (
                          <div className="mt-10 flex justify-center sm:hidden">
                            <ArrowDown className="h-6 w-6 text-stone-300" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-b from-stone-50 to-stone-100 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            不確定自己在哪個階段？
          </h2>
          <p className="mt-4 text-lg text-stone-500">
            花 3 分鐘做事業健檢，獲得五大維度分析和你的 SOLO 階段判定。
            <br className="hidden sm:block" />
            已有 {SOCIAL_PROOF.diagnoseCount} 位一人事業者完成健檢。
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Button size="lg" asChild className="h-14 px-8 text-base font-semibold shadow-lg shadow-primary/15 sm:text-lg">
              <Link href="/diagnose">
                免費事業健檢
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 border-stone-300 px-8 text-base text-stone-700 hover:bg-white sm:text-lg">
              <Link href="/courses">查看課程與工作坊</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
