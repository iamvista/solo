import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Brain,
  Workflow,
  FileText,
  Users,
  Layers,
  Wand2,
  ShieldCheck,
  Mail,
} from "lucide-react";
import type { Metadata } from "next";
import {
  JsonLd,
  serviceSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/schema";

const CONTACT_EMAIL = "iamvista@gmail.com";
const CONTACT_SUBJECT = "AI 研究系統建構洽詢";
const CONTACT_BODY =
  "Hi Vista，\n\n我看到 solo.tw 上「AI 研究與寫作引擎」的方案，想進一步了解。\n\n我目前的狀況／研究領域：\n（簡單描述）\n\n我想解決的核心問題：\n（例如：研究做完就忘、工具串不起來、想把研究變成內容資產⋯⋯）\n\n期待的合作時程：\n\n感謝！";
const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  CONTACT_SUBJECT
)}&body=${encodeURIComponent(CONTACT_BODY)}`;

export const metadata: Metadata = {
  title: "個人 AI 研究與寫作引擎｜1-on-1 系統建構 | solo.tw",
  description:
    "不是教你工具，是幫你建好屬於自己的 AI 研究與寫作系統。NotebookLM、Obsidian、自動化工作流，4 週交付一套能長期使用的個人系統。",
  alternates: {
    canonical: "https://www.solo.tw/consulting/ai-research-system",
  },
};

const painPoints = [
  {
    icon: Brain,
    title: "研究做完就忘",
    desc: "每次研究都從零開始，看完 AI 摘要隔天就還給工具。知識沒有累積，每月都在重做相同的功課。",
  },
  {
    icon: Layers,
    title: "工具一堆，串不起來",
    desc: "NotebookLM、Obsidian、Notion、Google Drive 各自為政。資料散在不同地方，要用的時候永遠找不到。",
  },
  {
    icon: Workflow,
    title: "從研究到內容的橋斷掉",
    desc: "讀了大量資料，但要寫成文章、講稿、報告時還是只能慢慢手動整理。研究的價值沒有變成可累積的內容資產。",
  },
];

const plans = [
  {
    id: "blueprint",
    name: "AI 研究系統設計藍圖",
    duration: "1 週內交付｜入門首選",
    desc: "用一次深度訪談，幫你規劃個人 AI 研究系統的整體架構，並把可立即使用的 Prompt、Skill、結構藍圖與 SOP 一次給你。適合想先試水溫、自己動手、預算友善的研究者與創作者。",
    promoPrice: "NT$ 8,800",
    originalPrice: "NT$ 12,800",
    saving: "開站優惠約 7 折",
    badge: "最多人選",
    available: true,
    icon: Brain,
    includes: [
      "90 分鐘 1:1 設計訪談：盤點現況、釐清目標",
      "個人系統架構圖（PDF）：工具串接設計與資料流",
      "客製 Prompt 庫 12–15 條：依你的研究／寫作領域量身寫",
      "NotebookLM 主題模板 × 2：資料夾結構、source 分類、命名規範",
      "個人知識庫結構藍圖：含 Notion 實作步驟（亦可套用其他工具）",
      "Vista 私房 Skill 1 份（例：研究主題探勘 / 文獻摘要工作流）",
      "工具棧建議書：付費 / 免費替代方案對照",
      "自學 SOP 文件：每日、每週、每月循環指引",
      "30 分鐘交付 review session（含陪建第一個資料庫）",
      "14 天 LINE 文字支援",
    ],
  },
  {
    id: "engine",
    name: "AI 研究與寫作引擎",
    duration: "4 週交付｜深度建構",
    desc: "我直接幫你把整套系統建好。從訪談、架構、建構、自動化到陪跑，4 週交付一套可以長期使用的個人 AI 工作流。",
    promoPrice: "NT$ 24,800",
    originalPrice: "NT$ 39,800",
    saving: "開站優惠 6 折",
    badge: "深度建構",
    available: true,
    icon: Sparkles,
    includes: [
      "啟動訪談 90 分鐘 + 個人系統架構圖",
      "建構 2–3 個主題 NotebookLM（含 source 規範與命名）",
      "MCP 自動化模組（基本款）：自動同步、跨 notebook 查詢",
      "客製 Prompt 庫 30+ 條 + 多份 Skill / 模板",
      "工作流 SOP 文件：每日 / 每週使用步驟",
      "1:1 諮詢 4 次（共 6 小時）",
      "30 天 LINE 即時支援",
      "30 天後 review session 一次",
    ],
  },
  {
    id: "system",
    name: "完整知識作業系統",
    duration: "8 週交付｜限額 2 名",
    desc: "適合年收百萬以上的創作者、顧問、企業主。把研究、寫作、內容生產整合成一條完整的內容資產生產線。",
    promoPrice: "NT$ 49,800",
    originalPrice: "NT$ 79,800",
    saving: "開站優惠 6 折",
    badge: "首批限額 2 名",
    available: true,
    icon: Wand2,
    includes: [
      "包含「AI 研究與寫作引擎」全部內容",
      "三向整合：NotebookLM × Obsidian × Anytype",
      "進階自動化 pipeline：研究 → 草稿 → 多平臺發佈",
      "整合 Newsletter / Podcast 內容生產流",
      "1:1 諮詢 6 次（共 10 小時）",
      "90 天 LINE 即時支援",
      "季度 review × 2（簽約後 90 天 + 180 天）",
    ],
  },
];

const deliveryFlow = [
  {
    week: "Week 1",
    title: "盤點與設計",
    desc: "啟動訪談 90 分鐘，了解你的研究習慣、現有工具、目標產出。我會交付一份個人系統架構圖。",
  },
  {
    week: "Week 2",
    title: "主題建構",
    desc: "為你建好 2–3 個主題 NotebookLM，含 source 整理、命名規範、跨 notebook 串接邏輯。",
  },
  {
    week: "Week 3",
    title: "自動化串接",
    desc: "MCP 自動化模組設定。讓 AI 主動同步資料、跨 notebook 查詢。第二次 1:1 諮詢確認運作。",
  },
  {
    week: "Week 4",
    title: "工作流交付",
    desc: "客製 Prompt 庫 50+、SOP 文件、收尾培訓。30 天 LINE 支援開始，30 天後一次 review session。",
  },
];

const fitFor = [
  "已有大量研究、寫作需求的知識工作者",
  "要把研究變成內容資產的創作者、Podcaster",
  "需要長期累積專業知識庫的顧問、教練",
  "進階研究生、博士候選人、學術研究員",
  "願意投入時間建構長期系統，而非追工具熱潮",
];

const notFitFor = [
  "只想學單一工具操作（建議從免費內容或 NT$ 3,990 AI 工具導入開始）",
  "希望立刻見效、不願意參與訪談與設定流程",
  "沒有具體研究 / 寫作場景，純粹好奇 AI",
  "希望用 AI 代寫論文或繞過學術審查（本服務不涉及任何違反學術倫理之事宜）",
];

const faqs = [
  {
    q: "我不會寫程式，可以買嗎？",
    a: "可以。MCP 自動化模組會由我幫你設定好，你只需要會用 Claude / ChatGPT 介面。設定後使用上不需要寫任何程式。",
  },
  {
    q: "我手邊資料還很亂，先整理好再買比較好嗎？",
    a: "不用。我反而希望在資料還沒整理時就介入：第一週的訪談會幫你決定該怎麼整理。你自己整理可能用了錯的結構，反而要重來。",
  },
  {
    q: "和現有的「AI 工具導入 NT$ 3,990」有什麼不同？",
    a: "AI 工具導入是 90 分鐘單次設定，幫你跑通一個工具。本服務（藍圖 / 引擎 / 完整系統）是個人 AI 研究系統的整體規劃與建構：藍圖給你架構與模板自己動手，引擎與完整系統由我直接幫你建好整套工作流。",
  },
  {
    q: "「設計藍圖」和「研究與寫作引擎」差在哪？我該怎麼選？",
    a: "藍圖（NT$ 8,800）是 1 週交付：90 分鐘訪談 + 個人架構圖 + 客製 Prompt 12–15 條 + NotebookLM 模板 + 知識庫結構藍圖 + Skill + SOP 文件，並含 30 分鐘陪建 review。你拿到後可以自己動手建。引擎（NT$ 24,800）是 4 週交付：我直接幫你把 NotebookLM、自動化、Prompt 30+ 全部建好，含 4 次 1:1 諮詢與 30 天 LINE 支援。建議從藍圖開始試水溫，覺得對盤再升級到引擎，已付的藍圖費用可折抵。",
  },
  {
    q: "成果能帶走嗎？離開合作後還能用嗎？",
    a: "完全可以。所有 NotebookLM、Obsidian 設定都在你自己的帳號下，MCP 設定文件、Prompt 庫、SOP 都會交付給你。我離開後你可以獨立運作，也可以隨時回來找我升級。",
  },
  {
    q: "交付期可以縮短或延長嗎？",
    a: "標準 4 週交付。如果你時間緊（例如要趕一個寫作 deadline），可壓縮到 2–3 週但需確認檔期；如果你工作忙無法配合，可拉長到 6–8 週。",
  },
  {
    q: "完整知識作業系統的限額怎麼計算？",
    a: "完整版需要 8 週深度合作，為確保交付品質首批僅開放 2 個名額。建議先從藍圖或引擎方案開始，待我把交付流程跑穩，再正式承接完整版。歡迎來信加入候補，鎖定開站優惠價。",
  },
  {
    q: "這套系統會幫我用 AI 代寫論文嗎？",
    a: "不會。本服務聚焦於文獻管理、知識整理、研究資料的系統化建構，以及輔助你梳理思路與工作流。論文、報告、文章的實質撰寫應由你親自完成。使用 AI 工具時，請務必遵循你所屬學術機構（學校、系所、期刊、學會）的相關規範，並在必要時揭露 AI 的使用方式。我會在交付過程中，協助你設定符合學術倫理的使用邊界。",
  },
  {
    q: "如何付款？",
    a: "來信洽詢、確認方案後，會提供付款連結，支援信用卡和 ATM 轉帳。",
  },
];

export default function AIResearchSystemPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "AI 研究系統設計藍圖",
          description:
            "用一次深度訪談，幫你規劃個人 AI 研究系統的整體架構，並交付可立即使用的 Prompt、Skill、結構藍圖與 SOP。1 週內完成。",
          url: "https://www.solo.tw/consulting/ai-research-system",
          price: 8800,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "首頁", href: "/" },
          { name: "諮詢", href: "/consulting" },
          { name: "AI 研究與寫作引擎", href: "/consulting/ai-research-system" },
        ])}
      />
      <JsonLd data={faqSchema(faqs.map((f) => ({ question: f.q, answer: f.a })))} />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white py-16 sm:py-20 lg:py-28">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,140,110,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(168,140,110,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                1-on-1 系統建構
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
                把研究與寫作，
                <br className="sm:hidden" />
                串成你自己的 AI 系統
              </h1>
              <p className="mt-5 text-lg text-stone-500 sm:text-xl">
                不只是教你工具，
                <br className="hidden sm:block" />
                是幫你規劃並建好一套可以長期使用、會累積、能持續產生價值的個人 AI 系統。
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href="#plans">
                    NT$ 8,800 起，查看方案
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <a href={mailtoHref}>來信洽詢</a>
                </Button>
              </div>

              <p className="mt-6 text-xs text-stone-400">
                從 1 週藍圖到 8 週完整建構｜含 1:1 諮詢、Prompt 庫、Skill 與模板
              </p>
            </div>
          </div>
        </section>

        {/* 痛點 */}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                你是不是也卡在這三個地方？
              </h2>
              <p className="mt-3 text-base text-stone-500">
                會想做研究的人，幾乎都會撞到這三個牆。我們從這裡開始。
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {painPoints.map((pp) => {
                const Icon = pp.icon;
                return (
                  <div
                    key={pp.title}
                    className="rounded-2xl border border-stone-200 bg-stone-50/50 p-7"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-stone-900">
                      {pp.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-500">
                      {pp.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 方案卡片 */}
        <section id="plans" className="bg-stone-50 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                從藍圖到完整建構，三種深度任你選
              </h2>
              <p className="mt-3 text-base text-stone-500">
                建議從「設計藍圖」開始，先拿到實用的 Prompt、模板與 SOP。
                <br className="hidden sm:block" />
                想要我直接幫你建好，可選 4 週引擎或 8 週完整系統。
              </p>
            </div>

            <div className="mx-auto mt-10 mb-6 max-w-2xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-center">
              <p className="text-sm font-medium text-amber-800">
                🎉 <span className="font-bold">開站限定優惠</span> ：所有方案皆享開站特惠價，名額有限，額滿恢復原價
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const isMain = plan.id === "blueprint";
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-2xl border bg-white p-7 shadow-sm transition-all hover:shadow-md sm:p-8 ${
                      isMain
                        ? "border-primary/30 ring-2 ring-primary/10"
                        : "border-stone-200"
                    }`}
                  >
                    {plan.badge && (
                      <span
                        className={`absolute -top-3 right-6 rounded-full px-3 py-1 text-xs font-semibold text-white ${
                          isMain ? "bg-primary" : "bg-stone-700"
                        }`}
                      >
                        {plan.badge}
                      </span>
                    )}

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        isMain ? "bg-primary text-white" : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 text-2xl font-bold text-stone-900">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-sm text-stone-400">{plan.duration}</p>
                    <p className="mt-3 text-sm leading-relaxed text-stone-500">
                      {plan.desc}
                    </p>

                    <div className="mt-6 space-y-2.5 border-t border-stone-100 pt-5">
                      {plan.includes.map((inc) => (
                        <div
                          key={inc}
                          className="flex items-start gap-2 text-sm text-stone-600"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 border-t border-stone-100 pt-5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-stone-900">
                          {plan.promoPrice}
                        </span>
                        <span className="text-sm text-stone-400 line-through">
                          {plan.originalPrice}
                        </span>
                      </div>
                      <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        {plan.saving}
                      </span>

                      <Button
                        asChild
                        size="lg"
                        className="mt-5 w-full"
                        variant={isMain ? "default" : "outline"}
                      >
                        <a href={mailtoHref}>
                          {isMain ? "來信洽詢、討論細節" : "來信加入候補名單"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4 週交付流程 */}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                深度建構：4 週交付流程
              </h2>
              <p className="mt-3 text-base text-stone-500">
                以「AI 研究與寫作引擎」方案為例。
                <br className="hidden sm:block" />
                若選「設計藍圖」入門包，1 週內完成訪談與交付。
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-4xl">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {deliveryFlow.map((step, idx) => (
                  <div
                    key={step.week}
                    className="relative rounded-2xl border border-stone-200 bg-white p-6"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {step.week}
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-stone-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-500">
                      {step.desc}
                    </p>
                    {idx < deliveryFlow.length - 1 && (
                      <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-stone-300 lg:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 適合誰 / 不適合誰 */}
        <section className="bg-stone-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-white p-7">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Users className="h-5 w-5" />
                  <h3 className="text-lg font-bold">適合這些人</h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {fitFor.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-stone-600"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-7">
                <div className="flex items-center gap-2 text-stone-600">
                  <ShieldCheck className="h-5 w-5" />
                  <h3 className="text-lg font-bold">不太適合這些情況</h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {notFitFor.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-stone-600"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-stone-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs text-stone-400">
                  如果你只想專注學會單一工具，建議從{" "}
                  <Link
                    href="/consulting"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    NT$ 3,990 AI 工具導入
                  </Link>{" "}
                  開始。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 信任元素：關於 Vista */}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-8 sm:p-10">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900">
                關於 Vista
              </h2>
              <p className="mt-4 text-base leading-relaxed text-stone-600">
                我長期經營{" "}
                <Link
                  href="https://vista.tw"
                  target="_blank"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  vista.tw
                </Link>{" "}
                與《Vista 一人公司》電子報，深度文章累積超過 200 篇。日常用 NotebookLM、Obsidian、Anytype
                整套工具進行學術研究、內容生產、課程設計。
              </p>
              <p className="mt-3 text-base leading-relaxed text-stone-600">
                從事商業寫作與學術研究多年，學術論文獲 TSSCI 期刊接受刊登，並維護{" "}
                <Link
                  href="https://solo.tw"
                  target="_blank"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  solo.tw
                </Link>{" "}
                一人公司方法論。我會把自己每天在用的研究系統，幫你客製成你自己的版本。
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-white px-3 py-1 text-stone-600 ring-1 ring-stone-200">
                  vista.tw 200+ 篇深度文章
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-stone-600 ring-1 ring-stone-200">
                  《Vista 一人公司》電子報
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-stone-600 ring-1 ring-stone-200">
                  論文獲 TSSCI 期刊接受
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-stone-600 ring-1 ring-stone-200">
                  自建 NotebookLM × MCP 工具鏈
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 來信洽詢 */}
        <section id="book" className="bg-stone-50 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                  來信洽詢
                </h2>
                <p className="mt-3 text-base leading-relaxed text-stone-500">
                  目前每月可承接的客戶數有限，先以信件了解你的情境再安排會比較精準。
                  <br className="hidden sm:block" />
                  寫信告訴我下面三件事，我會在 2 個工作天內回覆。
                </p>
              </div>

              <div className="mx-auto mt-8 max-w-xl">
                <ul className="space-y-3 text-sm text-stone-600">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-700">
                      1
                    </span>
                    <span>
                      <strong className="text-stone-800">你目前的研究／寫作情境：</strong>
                      研究領域、常用工具、產出類型
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-700">
                      2
                    </span>
                    <span>
                      <strong className="text-stone-800">最想解決的核心問題：</strong>
                      例如資料散落、研究做完就忘、寫作從零開始⋯⋯
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-700">
                      3
                    </span>
                    <span>
                      <strong className="text-stone-800">期待的合作時程：</strong>
                      想在什麼時間前看到成果
                    </span>
                  </li>
                </ul>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <a href={mailtoHref}>
                      <Mail className="mr-2 h-4 w-4" />
                      寫信給 Vista
                    </a>
                  </Button>
                  <span className="text-sm text-stone-400 sm:ml-2">
                    或直接寄到{" "}
                    <a
                      href={mailtoHref}
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              常見問題
            </h2>

            <div className="mt-10 space-y-5">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-xl border border-stone-100 bg-stone-50/50 p-6"
                >
                  <h3 className="text-base font-semibold text-stone-900">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            {/* 學術倫理聲明 */}
            <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <h3 className="text-base font-bold text-amber-900">
                    學術倫理聲明
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-amber-900/80">
                    本服務聚焦於協助你建構研究、寫作、知識管理的個人 AI 工作流，
                    <strong className="font-semibold">
                      不涉及代寫論文、代辦作業、繞過學術審查、或任何違反學術倫理的事宜
                    </strong>
                    。使用 AI 工具進行研究與寫作時，請務必尊重並遵循你所屬學術機構（學校、系所、期刊、學會）的相關規範，並在必要時揭露 AI 的使用方式。
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-stone-200 bg-stone-50/50 p-7 text-center">
              <FileText className="mx-auto h-6 w-6 text-stone-400" />
              <h3 className="mt-3 text-lg font-bold text-stone-900">
                還有其他疑問？
              </h3>
              <p className="mt-2 text-sm text-stone-500">
                寫信描述你的情境，我會親自回覆。
              </p>
              <Button asChild className="mt-5">
                <a href="#book">
                  來信洽詢
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
