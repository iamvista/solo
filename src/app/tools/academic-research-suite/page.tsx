import type { Metadata } from "next";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "./CheckoutButton";
import {
  ARS_BUNDLE_PRICES,
  type ArsBundle,
} from "@/lib/ars-bundles";
import {
  ShieldCheck,
  BookMarked,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

// ── SEO ───────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "AI 學術研究工作臺｜19 個模組，把研究做得更嚴謹 | solo.tw",
  description:
    "不主打寫得快，主打做得嚴謹。19 個模組覆蓋文獻、寫作、分析、投稿與研究誠信，每一步內建防幻覺與方法學把關。研究生 / 教授 / 醫師三種人物包，NT$1,980 起。",
  openGraph: {
    title: "AI 學術研究工作臺｜把研究做得更嚴謹，不是更快",
    description:
      "19 個模組覆蓋完整研究生命週期，內建防幻覺協定與學科方法學。研究生 / 教授 / 醫師三種人物包，NT$1,980 起。",
  },
  alternates: {
    canonical: "https://www.solo.tw/tools/academic-research-suite",
  },
};

// ── Data ──────────────────────────────────────────────────────────────────────

const painPoints = [
  {
    quote: "文獻整理不要只像堆疊，希望 AI 引導統整的方向",
    who: "John．社會工作領域研究生",
  },
  {
    quote: "撰寫出來的文字 AI 感很重",
    who: "Ryan．研究生",
  },
  {
    quote: "想兼顧研究倫理，不會因 AI 協助而退稿",
    who: "Ben．醫學中心總醫師",
  },
  {
    quote: "讀得快但忘得也快，想記錄已知的發現，並找到尚未解決的問題",
    who: "Jason．國立大學助理教授",
  },
];

const pillars = [
  {
    Icon: ShieldCheck,
    tag: "01．防幻覺",
    title: "不虛構引用",
    desc: "AI 給你檢索策略，不憑空生一份論文清單；嚴禁生成或補全 DOI。找不到，就說找不到。",
  },
  {
    Icon: BookMarked,
    tag: "02．方法學正確",
    title: "照學科規矩來",
    desc: "RoB 2、GRADE、質性信實度、Yin 案例法、可重現性、Bloom 分類，每個垂直都對齊該領域標準。",
  },
  {
    Icon: Users,
    tag: "03．人在迴圈",
    title: "判斷與掛名由你",
    desc: "原創論點、掛名、最終定案一律人做；AI 的產出附可查證來源，經你驗證才算數。",
  },
];

const aiCanDo = [
  "整理與初篩文獻，抽取成可比較的矩陣",
  "順稿、去除 AI 腔、對齊期刊格式",
  "建議統計方法與分析步驟（真實數據你自己跑）",
  "草擬檢索策略、cover letter 與審稿回覆骨架",
];

const alwaysYou = [
  "研究問題與原創論點",
  "對資料的詮釋與判斷",
  "作者掛名與貢獻聲明",
  "每一筆引用的真偽查證與最終定案",
];

interface ModuleLine {
  title: string;
  count: number;
  modules: { name: string; id: string }[];
}

const catalog: ModuleLine[] = [
  {
    title: "文獻線",
    count: 4,
    modules: [
      { name: "找研究缺口", id: "lit-gap-finder" },
      { name: "系統性搜尋與初篩", id: "lit-search-screen" },
      { name: "文獻矩陣表格化", id: "lit-matrix" },
      { name: "深讀批判對話", id: "lit-critical-read" },
    ],
  },
  {
    title: "寫作線",
    count: 4,
    modules: [
      { name: "論文架構", id: "paper-structure" },
      { name: "起草順稿與深化", id: "draft-refine" },
      { name: "期刊級潤飾與去 AI 味", id: "journal-polish" },
      { name: "示意圖與流程圖", id: "figure-diagram" },
    ],
  },
  {
    title: "分析線",
    count: 2,
    modules: [
      { name: "量化統計與製圖", id: "quant-stats" },
      { name: "質性資料編碼", id: "qual-coding" },
    ],
  },
  {
    title: "投稿線",
    count: 3,
    modules: [
      { name: "期刊選擇", id: "journal-selection" },
      { name: "投稿準備與 cover letter", id: "submission-prep" },
      { name: "審稿回覆", id: "reviewer-response" },
    ],
  },
  {
    title: "學科垂直包",
    count: 4,
    modules: [
      { name: "醫學臨床", id: "vertical-medical" },
      { name: "社會科學", id: "vertical-social-science" },
      { name: "商業管理", id: "vertical-business" },
      { name: "理工", id: "vertical-stem" },
    ],
  },
  {
    title: "誠信．教學",
    count: 2,
    modules: [
      { name: "研究誠信自檢", id: "integrity-self-check" },
      { name: "教學備課", id: "teaching-prep" },
    ],
  },
];

function formatPrice(bundle: ArsBundle): string {
  return ARS_BUNDLE_PRICES[bundle].toLocaleString("en-US");
}

interface BundleCard {
  bundle: ArsBundle;
  badge: string;
  title: string;
  aud: string;
  features: string[];
  mutedFeatures?: string[];
  featured?: boolean;
}

const bundleCards: BundleCard[] = [
  {
    bundle: "grad",
    badge: "研究生",
    title: "研究生包",
    aud: "從零學會整套研究流程，論文從找題到投稿。",
    features: ["核心 14 模組（文獻／寫作／分析／投稿／誠信）"],
    mutedFeatures: ["下載頁自選 1 個學科垂直"],
  },
  {
    bundle: "clinician",
    badge: "醫師／臨床．最完整",
    title: "醫師／臨床包",
    aud: "臨床研究專用，PubMed 到 SCI 投稿，符合醫學期刊標準。",
    features: [
      "核心 14 模組",
      "醫學臨床垂直（PubMed／PRISMA／RoB 2／GRADE／臨床數據矩陣）",
    ],
    featured: true,
  },
  {
    bundle: "faculty",
    badge: "教授／學者",
    title: "教授／學者包",
    aud: "研究提速、帶學生、把研究轉成教材。",
    features: ["核心 14 模組", "教學備課模組"],
    mutedFeatures: ["下載頁自選 1 個學科垂直"],
  },
];

const faqs = [
  {
    q: "我要用哪個 AI 工具才能用？",
    a: "網頁版 prompt pack 可直接貼進 Claude.ai、ChatGPT、Gemini、NotebookLM 使用，不必安裝任何東西。若你會用 Claude Code，每個模組另附進階版 skill，可直接掛進你的專案資料夾使用。",
  },
  {
    q: "這樣用 AI，會違反學術倫理嗎？",
    a: "關鍵在界線。學術社群反對的是 AI 代寫、代想、捏造與隱瞞，不是拿 AI 整理資料或潤飾文字。本套件把 AI 限縮在機械與草稿層，研究問題、詮釋、掛名與定案都留給你，並內建符合期刊規範的 AI 使用揭露範本，用得透明，就站得住腳。",
  },
  {
    q: "用了 AI 會不會被期刊退稿？",
    a: "因 AI 協助而退稿，出事的通常不是用了 AI，而是稿裡有查不到的引用、未揭露或揭露不實、以及越界代工。每個模組都內建防幻覺協定與引用查核步驟，投稿線更有一份投稿前的排雷清單，把這些風險攔在送出之前。",
  },
  {
    q: "學科垂直包在做什麼？",
    a: "把通用研究流程落地到你的學科：醫學臨床走 PubMed 與 GRADE、社科走信實度與混合方法、商管走案例法與期刊分級、理工走可重現性與 benchmark 誠實。",
  },
  {
    q: "研究生包／教授包的「自選 1 個學科垂直」怎麼選？",
    a: "付款後下載連結會寄到你的信箱，進入下載頁時再選擇你的學科垂直即可；日後想加購其他垂直，單科垂直包 NT$980。",
  },
  {
    q: "下載連結會不會過期？",
    a: "下載連結有效期 72 小時，依方案不同可下載 8 到 12 次（單科垂直包 4 次）。連結逾時或次數用盡，寫信到 iamvista@gmail.com 我們會協助重寄。",
  },
  {
    q: "可以退款嗎？",
    a: "本套件屬於一經下載即可使用的數位產品，購買後恕不接受退款。若因技術問題無法下載或存取，請於購買後 7 日內來信，我們會協助排除問題；若內容與頁面描述有重大不符，經查證屬實將全額退款。",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AcademicResearchSuitePage() {
  return (
    <div>
      {/* ====== Hero ====== */}
      <section className="bg-gradient-to-b from-stone-100/60 to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm sm:text-base">
            AI 學術研究工作臺・負責任地用 AI 做研究
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
            把專家的研究紀律，
            <br className="hidden sm:block" />
            打包給你
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600 sm:text-xl leading-relaxed">
            一套從找研究缺口到回覆審稿人的方法論工具包。每一步都內建防幻覺、方法學把關與學術倫理界線：
            AI 幫你分擔的是機械勞動的部分，研究問題、詮釋、判斷與最後的掛名，永遠是你必須親力親為的。
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#bundles"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground shadow-sm shadow-primary/15 transition-transform hover:-translate-y-0.5"
            >
              看三種人物包
            </a>
            <a
              href="#catalog"
              className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 px-8 text-base font-semibold text-stone-700 transition-colors hover:bg-stone-50"
            >
              瀏覽 19 個模組
            </a>
          </div>
          <p className="mt-4 text-sm text-stone-500">
            Claude.ai・ChatGPT・Gemini・NotebookLM 皆可用，進階者另附 Claude Code skill
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* ====== 假引用問題與誠信護欄 ====== */}
        <section className="py-14 sm:py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            這些卡點，你熟嗎
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            本套件的每一個模組，都對映一位真實研究者寫下的卡點（姓名已去識別化）。
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {painPoints.map((p, i) => (
              <Card key={i} className="border-stone-200 border-l-4 border-l-primary">
                <CardContent className="p-5 sm:p-6">
                  <p className="font-serif text-lg italic text-stone-800">
                    「{p.quote}」
                  </p>
                  <p className="mt-3 text-sm text-stone-400">{p.who}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-center text-xl font-bold text-stone-900 sm:text-2xl">
              同一個研究任務，自己打 ChatGPT 跟用工作臺，差在哪？
            </h3>
            <p className="mt-2 text-center text-base text-stone-500">
              最大的差別在假引用：ChatGPT 可能整份編給你，工作臺結構性擋掉假引用。
            </p>
            <div className="mx-auto mt-6 max-w-2xl overflow-hidden rounded-xl border border-stone-200 shadow-sm">
              <Image
                src="/images/academic-research-suite/compare-diy-vs-suite.png"
                alt="自己打 ChatGPT 與用 AI 學術研究工作臺的差別對照：工作臺結構性擋掉假引用、輸出可直接用的表格清單、方法學內建"
                width={1200}
                height={1574}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {pillars.map(({ Icon, tag, title, desc }, i) => (
              <Card key={i} className="border-stone-200">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                    <Icon className="h-4 w-4" />
                    {tag}
                  </div>
                  <p className="mt-3 text-lg font-bold text-stone-900">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card className="border-stone-200">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  AI 可以幫你
                </p>
                <ul className="mt-4 space-y-3">
                  {aiCanDo.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-base text-stone-600">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-stone-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  一定是你
                </p>
                <ul className="mt-4 space-y-3">
                  {alwaysYou.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-base text-stone-700">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ====== 19 模組總覽 ====== */}
        <section id="catalog" className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            19 個模組，覆蓋完整研究生命週期
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            每個模組都提供兩種形態：可貼進網頁版 AI 的 prompt pack，以及進階者用的 Claude Code skill。
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {catalog.map((line, i) => (
              <div key={i}>
                <h3 className="flex items-center justify-between border-b border-stone-200 pb-2 text-base font-bold text-stone-900">
                  {line.title}
                  <span className="text-xs font-normal text-stone-400">
                    {line.count} 模組
                  </span>
                </h3>
                <ul className="mt-3 space-y-2">
                  {line.modules.map((m, j) => (
                    <li
                      key={j}
                      className="flex items-baseline justify-between gap-3 text-sm"
                    >
                      <span className="text-stone-700">{m.name}</span>
                      <span className="font-mono text-xs text-stone-400">
                        {m.id}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ====== 定價：三包＋全套＋單科 ====== */}
        <section id="bundles" className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            選一個入口
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            三包都含 14 個通用核心模組（文獻／寫作／分析／投稿／研究誠信），差別在專屬的學科垂直與教學模組。
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {bundleCards.map((card) => (
              <Card
                key={card.bundle}
                className={
                  card.featured
                    ? "flex flex-col border-2 border-primary shadow-lg"
                    : "flex flex-col border-stone-200"
                }
              >
                <CardContent className="flex flex-1 flex-col p-6 sm:p-7">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {card.badge}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-stone-900">
                    {card.title}
                  </h3>
                  <p className="mt-1 min-h-[42px] text-sm text-stone-500">
                    {card.aud}
                  </p>
                  <p className="mt-4 font-serif text-3xl font-bold text-stone-900">
                    <span className="text-base font-sans font-normal text-stone-500">
                      NT${" "}
                    </span>
                    {formatPrice(card.bundle)}
                    <span className="ml-1 font-sans text-sm font-normal text-stone-400">
                      ／一次購買
                    </span>
                  </p>
                  <ul className="mt-5 flex-1 space-y-2 border-t border-stone-100 pt-5">
                    {card.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-stone-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        {f}
                      </li>
                    ))}
                    {card.mutedFeatures?.map((f, i) => (
                      <li
                        key={`muted-${i}`}
                        className="flex items-start gap-2 text-sm text-stone-500"
                      >
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <CheckoutButton
                      bundle={card.bundle}
                      label={`加入購買 NT$${formatPrice(card.bundle)}`}
                      variant={card.featured ? "default" : "outline"}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card className="border-stone-200 bg-stone-50">
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold text-stone-900">
                    全套 All-Access（19 模組全含）
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    核心 14 ＋ 4 個學科垂直 ＋ 教學備課，最超值方案。
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-serif text-2xl font-bold text-stone-900">
                    NT${formatPrice("allaccess")}
                  </p>
                  <div className="mt-2 w-40">
                    <CheckoutButton
                      bundle="allaccess"
                      label="加入購買"
                      variant="outline"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-stone-200 bg-stone-50">
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold text-stone-900">單科垂直 Add-on</p>
                  <p className="mt-1 text-sm text-stone-500">
                    已買研究生包／教授包，想再加購另一個學科垂直。
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-serif text-2xl font-bold text-stone-900">
                    NT${formatPrice("addon-vertical")}
                  </p>
                  <div className="mt-2 w-40">
                    <CheckoutButton
                      bundle="addon-vertical"
                      label="加入購買"
                      variant="outline"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <p className="mt-6 text-center text-sm text-stone-500">
            付款後下載連結會寄到你的信箱；研究生包與教授／學者包在下載頁自選 1 個學科垂直。
          </p>
        </section>

        {/* ====== 創辦人實測範例 ====== */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            模組怎麼運作：一個真實的去 AI 味示範
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base text-stone-500">
            下面這段示範，是「期刊級潤飾與去 AI 味」模組內建的實際運作方式，直接取自模組本體，不是行銷改寫。
          </p>

          <div className="mt-8 space-y-4">
            <Card className="border-stone-200">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  修改前（AI 味示範段落）
                </p>
                <p className="mt-3 font-serif text-base italic leading-relaxed text-stone-700">
                  &ldquo;It is worth noting that the delayed post-test results
                  demonstrate that the experimental group significantly
                  outperformed the control group even after the removal of AI
                  feedback. On the one hand, this finding underscores the
                  crucial role of AI feedback in fostering writing ability;
                  on the other hand, it highlights the importance of
                  internalization. Furthermore, numerous students reported in
                  the interviews that they continued to leverage the checking
                  strategies they had acquired.&rdquo;
                </p>
              </CardContent>
            </Card>

            <Card className="border-stone-200">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  模組抓出的問題與修法
                </p>
                <ul className="mt-3 space-y-3 text-sm text-stone-600">
                  <li>
                    <span className="font-semibold text-stone-800">
                      套語開場（特徵 1）：
                    </span>{" "}
                    「It is worth noting that」整句刪除，直接說事。
                  </li>
                  <li>
                    <span className="font-semibold text-stone-800">
                      虛假精確（特徵 5）：
                    </span>{" "}
                    「significantly outperformed」刪去
                    significantly：本句未附統計檢定，這個詞只保留給真的有檢定的位置。
                  </li>
                  <li>
                    <span className="font-semibold text-stone-800">
                      空泛連接詞與數量模糊（特徵 3、5）：
                    </span>{" "}
                    「Furthermore, numerous students」改為依訪談實情寫「several
                    students described⋯⋯」，不誇大也不縮小。
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-stone-200">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  紅線
                </p>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  去 AI 味只能刪、換、收窄，不得為了「更像人寫的」而添入稿件原本沒有的例子、數據或引用；
                  刪掉 significantly 不代表可以換一個更強的宣稱回去。
                </p>
              </CardContent>
            </Card>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-stone-400">
            誠實揭露：測試包目前只包含 3 支模組的網頁版
            prompt pack 與一份待填的學員回饋表，尚無已完成的學員實測心得。上方示範取自模組本體內建的教學案例；
            正式的學員實測見證會在累積之後於此區塊更新。
          </p>
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
                  <p className="font-semibold text-stone-900 text-lg">
                    Q：{faq.q}
                  </p>
                  <p className="mt-2 text-base text-stone-600 leading-relaxed">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== 學術倫理聲明 ====== */}
        <section className="py-14 sm:py-20 border-t border-stone-100">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <ShieldCheck className="h-6 w-6 text-emerald-700" />
            </div>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl text-stone-900">
              學術倫理聲明
            </h2>
            <div className="mt-6 space-y-4 text-left text-base text-stone-600 leading-relaxed sm:text-center">
              <p>
                本套件的定位是 AI 輔助，而非 AI 代寫。每個模組都把 AI 的角色限縮在資料整理、草稿順稿、方法建議與骨架擬定，研究問題的提出、資料的詮釋判斷、作者掛名與最終定案，一律由使用者本人完成。
              </p>
              <p>
                本套件不會生成或補全任何未經查證的引用、DOI 或書目資訊；找不到真實來源時，模組會明講找不到，而不是用看似合理的格式湊出數字。每個模組也附有可直接用於論文致謝或投稿系統的 AI
                使用揭露範本，讓你用得透明。
              </p>
              <p className="font-semibold text-stone-900">
                我們不主打「用 AI 寫得更快」；我們主打的是，用 AI 把研究做得更嚴謹、更誠實。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
