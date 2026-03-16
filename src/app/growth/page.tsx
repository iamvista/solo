import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SOLO 成長路徑 — 四階段打造一人事業 | solo.tw",
  description:
    "SOLO 方法論：Set up → Operate → Leverage → Outgrow。從定位到自由，每個階段都有對應的工具、課程和社群支持，幫助你系統化地打造一人事業。",
  openGraph: {
    title: "SOLO 成長路徑 — 四階段打造一人事業",
    description: "從定位到自由，一人事業的完整成長地圖。",
    url: "https://solo.tw/growth",
  },
};

const stages = [
  {
    letter: "S",
    name: "Set up",
    title: "建立根基",
    subtitle: "釐清定位，打好基礎",
    question: "你是誰？你要服務誰？你的獨特價值是什麼？",
    description:
      "每個成功的一人事業，都從清晰的定位開始。在這個階段，你需要回答三個核心問題：你擅長什麼、誰需要你、為什麼選你。透過事業健檢和定位工具，找出你的競爭力和盲點。",
    keyActions: [
      "完成事業健檢，了解目前競爭力",
      "定義你的專業定位和目標客群",
      "建立個人品牌識別（名稱、簡介、頭像）",
      "設定你的 solo.tw/@username 個人主頁",
    ],
    tools: [
      { name: "事業健檢", href: "/diagnose", status: "live" },
      { name: "個人主頁", href: "/settings", status: "live" },
      { name: "定位工作坊", href: "/events", status: "upcoming" },
    ],
    gradient: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50",
    border: "border-amber-200",
    textAccent: "text-amber-600",
    dotColor: "bg-amber-500",
    iconBg: "bg-amber-100",
  },
  {
    letter: "O",
    name: "Operate",
    title: "系統營運",
    subtitle: "建立獲客系統，服務第一批客戶",
    question: "如何讓對的人找到你，並願意付費？",
    description:
      "有了定位之後，你需要一套系統化的流程來獲取客戶。透過活動、內容和名單磁鐵，建立你的客戶獲取漏斗。這個階段的目標是：跑通從「陌生人→讀者→潛在客戶→付費客戶」的完整流程。",
    keyActions: [
      "舉辦第一場工作坊或講座",
      "建立名單磁鐵，開始收集潛在客戶",
      "定期產出內容（文章、電子報）",
      "設計你的核心產品/服務",
    ],
    tools: [
      { name: "活動報名系統", href: "/events", status: "live" },
      { name: "名單磁鐵系統", href: "/tools", status: "upcoming" },
      { name: "部落格 & 電子報", href: "/blog", status: "upcoming" },
    ],
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    textAccent: "text-blue-600",
    dotColor: "bg-blue-500",
    iconBg: "bg-blue-100",
  },
  {
    letter: "L",
    name: "Leverage",
    title: "槓桿放大",
    subtitle: "用工具和自動化放大產出",
    question: "如何用一份時間，創造十倍價值？",
    description:
      "當獲客系統跑順後，是時候用槓桿放大你的影響力。透過問卷了解市場需求、用自動化流程節省時間、用數據分析優化轉換率。一個人也能有一個團隊的產出。",
    keyActions: [
      "用問卷調查深入了解客戶需求",
      "建立自動化的客戶旅程",
      "分析數據，優化轉換率",
      "將服務產品化，建立可擴展模式",
    ],
    tools: [
      { name: "問卷調查系統", href: "/tools", status: "upcoming" },
      { name: "自動化流程", href: "/tools", status: "upcoming" },
      { name: "進階數據分析", href: "/tools", status: "upcoming" },
    ],
    gradient: "from-violet-500 to-purple-500",
    bgLight: "bg-violet-50",
    border: "border-violet-200",
    textAccent: "text-violet-600",
    dotColor: "bg-violet-500",
    iconBg: "bg-violet-100",
  },
  {
    letter: "O",
    name: "Outgrow",
    title: "超越成長",
    subtitle: "從忙碌的自由工作者到自由的事業主",
    question: "如何突破個人天花板，達到時間自由？",
    description:
      "最終階段是超越「一個人做所有事」的瓶頸。透過線上課程建立被動收入、透過社群創造網絡效應、透過顧問服務提供高價值產出。你的目標是讓事業系統自己運轉。",
    keyActions: [
      "將知識打包成線上課程",
      "建立同行者社群（Mastermind）",
      "提供高階 1-on-1 顧問服務",
      "讓系統自動化運轉，享受時間自由",
    ],
    tools: [
      { name: "課程平臺", href: "/courses", status: "live" },
      { name: "Mastermind 社群", href: "/community", status: "upcoming" },
      { name: "1-on-1 顧問", href: "/pricing", status: "upcoming" },
    ],
    gradient: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50",
    border: "border-emerald-200",
    textAccent: "text-emerald-600",
    dotColor: "bg-emerald-500",
    iconBg: "bg-emerald-100",
  },
];

export default function GrowthPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-emerald-50/50" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary sm:text-base">
            SOLO 方法論
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            四個階段，
            <span className="bg-gradient-to-r from-amber-500 via-blue-500 via-violet-500 to-emerald-500 bg-clip-text text-transparent">
              從零到自由
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-600 sm:text-xl">
            每個一人事業都經歷這四個階段。不管你現在在哪裡，
            SOLO 方法論和配套工具都能幫你走向下一步。
          </p>

          {/* SOLO acronym bar */}
          <div className="mx-auto mt-10 flex max-w-lg justify-center gap-3 sm:gap-4">
            {stages.map((stage) => (
              <a
                key={stage.name}
                href={`#${stage.name.toLowerCase().replace(" ", "-")}`}
                className={`flex flex-1 flex-col items-center gap-1.5 rounded-2xl ${stage.bgLight} ${stage.border} border p-4 transition-transform hover:scale-105`}
              >
                <span className={`text-3xl font-black bg-gradient-to-r ${stage.gradient} bg-clip-text text-transparent sm:text-4xl`}>
                  {stage.letter}
                </span>
                <span className={`text-xs font-semibold ${stage.textAccent} sm:text-sm`}>
                  {stage.name}
                </span>
              </a>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/diagnose"
              className="inline-flex h-12 items-center rounded-xl bg-primary px-8 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
            >
              做事業健檢，找出你在哪個階段
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex h-12 items-center rounded-xl border border-stone-300 bg-white px-8 text-base font-semibold text-stone-700 transition-colors hover:bg-stone-50"
            >
              免費註冊開始
            </Link>
          </div>
        </div>
      </section>

      {/* Stages */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Vertical timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-gradient-to-b from-amber-300 via-blue-300 via-violet-300 to-emerald-300 sm:block lg:left-8" />

            <div className="space-y-16 sm:space-y-24">
              {stages.map((stage, idx) => (
                <div
                  key={stage.name}
                  id={stage.name.toLowerCase().replace(" ", "-")}
                  className="scroll-mt-24"
                >
                  {/* Stage number + dot */}
                  <div className="relative flex items-start gap-6 sm:gap-8 lg:gap-10">
                    {/* Timeline dot */}
                    <div className="hidden sm:flex sm:flex-col sm:items-center">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stage.dotColor} text-xl font-black text-white shadow-lg ring-4 ring-white lg:h-16 lg:w-16 lg:text-2xl`}>
                        {stage.letter}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Mobile letter */}
                      <div className="mb-4 flex items-center gap-3 sm:hidden">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${stage.dotColor} text-lg font-black text-white`}>
                          {stage.letter}
                        </div>
                        <div>
                          <span className={`text-sm font-bold ${stage.textAccent}`}>階段 {idx + 1}</span>
                          <span className="mx-2 text-stone-300">·</span>
                          <span className="text-sm font-medium text-stone-500">{stage.name}</span>
                        </div>
                      </div>

                      {/* Header */}
                      <div className="hidden items-center gap-3 sm:flex">
                        <span className={`text-sm font-bold ${stage.textAccent}`}>階段 {idx + 1}</span>
                        <span className="text-stone-300">·</span>
                        <span className="text-sm font-medium text-stone-500">{stage.name}</span>
                      </div>

                      <h2 className="mt-1 text-2xl font-bold text-stone-900 sm:mt-2 sm:text-3xl">
                        {stage.title}
                      </h2>
                      <p className={`mt-1 text-base font-medium ${stage.textAccent}`}>
                        {stage.subtitle}
                      </p>

                      {/* Core question */}
                      <div className={`mt-5 rounded-xl ${stage.bgLight} ${stage.border} border p-5`}>
                        <p className="text-sm font-semibold text-stone-500">核心問題</p>
                        <p className="mt-1 text-lg font-semibold text-stone-800">
                          「{stage.question}」
                        </p>
                      </div>

                      <p className="mt-5 text-base leading-relaxed text-stone-600">
                        {stage.description}
                      </p>

                      {/* Two columns: Actions + Tools */}
                      <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        {/* Key Actions */}
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                            關鍵行動
                          </h3>
                          <ul className="mt-3 space-y-2.5">
                            {stage.keyActions.map((action) => (
                              <li key={action} className="flex items-start gap-2.5 text-sm text-stone-700">
                                <svg className={`mt-0.5 h-4 w-4 flex-shrink-0 ${stage.textAccent}`} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tools */}
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                            對應工具
                          </h3>
                          <div className="mt-3 space-y-2">
                            {stage.tools.map((tool) => (
                              <Link
                                key={tool.name}
                                href={tool.href}
                                className={`flex items-center justify-between rounded-lg border ${stage.border} bg-white px-4 py-2.5 transition-colors hover:${stage.bgLight}`}
                              >
                                <span className="text-sm font-medium text-stone-800">{tool.name}</span>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  tool.status === "live"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-stone-100 text-stone-500"
                                }`}>
                                  {tool.status === "live" ? "已上線" : "即將推出"}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Divider arrow to next */}
                      {idx < stages.length - 1 && (
                        <div className="mt-10 flex justify-center sm:hidden">
                          <svg className="h-8 w-8 text-stone-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            準備好開始你的 SOLO 旅程了嗎？
          </h2>
          <p className="mt-4 text-lg text-stone-600">
            不管你在哪個階段，第一步都是了解自己。花 3 分鐘做事業健檢，
            獲得你的個人化成長建議。
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/diagnose"
              className="inline-flex h-12 items-center rounded-xl bg-primary px-8 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
            >
              免費事業健檢
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex h-12 items-center rounded-xl border border-stone-300 bg-white px-8 text-base font-semibold text-stone-700 transition-colors hover:bg-stone-50"
            >
              免費註冊帳號
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
