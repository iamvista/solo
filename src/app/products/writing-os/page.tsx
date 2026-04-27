import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "./CheckoutButton";
import {
  Sparkles,
  Compass,
  Hammer,
  Brush,
  Quote,
  Tag,
  CheckCircle2,
  Download,
  FileText,
  Layers,
  Video,
  ArrowRight,
} from "lucide-react";

const PRODUCT_ID_EARLY = "ikhj9wyjzh930oo3okwe742k";
const PRODUCT_ID_REGULAR = "bfmr94mln0srq7slqfnxpgtt";
const PRODUCT_ID_PRO = "hibqnzhrn02tailjlnhtouoy";

export const metadata: Metadata = {
  title: "Vista 中文寫作 AI 工作流｜30 個寫作關卡的 Prompt 系統 | solo.tw",
  description:
    "不是 100 個 prompt 列表，是 30 個中文寫作場景的完整工作流：構思、開頭、結構、引述、潤稿、標題。每個 prompt 附 Vista 親寫案例 + Notion 模板 + 30 分鐘示範影片。早鳥 NT$499，前 100 名專屬。",
  openGraph: {
    title: "Vista 中文寫作 AI 工作流｜30 個寫作關卡的 Prompt 系統",
    description:
      "30 個中文寫作場景的完整工作流。每個 prompt 附 Vista 親寫案例。早鳥 NT$499。",
  },
  alternates: {
    canonical: "https://www.solo.tw/products/writing-os",
  },
};

const painPoints = [
  {
    emoji: "✍️",
    title: "AI 寫的東西讀起來都很「AI 味」",
    text: "重複句式、空洞抽象、像 ChatGPT 標準輸出，沒有你自己的味道。",
  },
  {
    emoji: "🎯",
    title: "卡在開頭半小時寫不出來",
    text: "明知道要寫什麼，但第一句怎麼下手都覺得不對。",
  },
  {
    emoji: "📚",
    title: "查到一堆資料，組織不起來",
    text: "Google、論文、訪談錄音，素材有了但長文寫不出結構。",
  },
  {
    emoji: "🔁",
    title: "改稿時越改越亂",
    text: "知道哪裡不順，但找不到 prompt 把它改對。",
  },
  {
    emoji: "🌐",
    title: "中文寫作的 prompt 大多是英文翻過來的",
    text: "套用後產出文白夾雜、語感卡卡，根本不像中文寫作該有的樣子。",
  },
  {
    emoji: "💡",
    title: "ChatGPT 自己生 prompt 不夠用",
    text: "你需要的是「在這個寫作場景，Vista 會用哪個 prompt」的場景對照表。",
  },
];

const categories = [
  {
    icon: Compass,
    title: "構思",
    count: 5,
    desc: "從一個雜亂念頭找到值得寫的角度",
    examples: [
      "從一句口語句子展開大綱",
      "從讀者問題反推主題",
      "把雜亂筆記凝結成 3 個寫作角度",
    ],
  },
  {
    icon: Sparkles,
    title: "開頭",
    count: 5,
    desc: "三句話內勾住讀者，不靠老梗",
    examples: [
      "三句話勾住讀者",
      "從反直覺的事實切入",
      "從具體場景開場（不靠抽象描述）",
    ],
  },
  {
    icon: Hammer,
    title: "結構與行文",
    count: 5,
    desc: "讓中段有節奏，結尾有力量",
    examples: [
      "把 1,000 字壓縮到 500 字（不失重點）",
      "把鬆散段落改成有力結尾",
      "把陳述改成提問（讓讀者繼續往下讀）",
    ],
  },
  {
    icon: Quote,
    title: "引述與資料",
    count: 5,
    desc: "把原始素材變成你文章的肌肉",
    examples: [
      "長引述精煉成一句",
      "從訪談錄音抓 3 個金句",
      "把英文文獻轉成中文表達（不是直譯）",
    ],
  },
  {
    icon: Brush,
    title: "改寫與潤稿",
    count: 5,
    desc: "去 AI 味、調風格、改翻譯腔",
    examples: [
      "改掉 AI 味（重複句式、空洞抽象）",
      "改成 Vista 風格（書卷、克制、有節奏）",
      "改掉中翻英直譯腔",
    ],
  },
  {
    icon: Tag,
    title: "標題與 SEO",
    count: 5,
    desc: "標題不是文章的尾巴，是讀者的入口",
    examples: [
      "把陳述標題改成提問標題",
      "寫 3 個變體（情緒型 / 數據型 / 故事型）",
      "從 SEO 關鍵字反推標題",
    ],
  },
];

const deliverables = [
  {
    icon: FileText,
    title: "30 個 Prompt 套件（PDF）",
    desc: "六大寫作場景，每個 prompt 含使用情境、Vista 親寫案例、變體建議。100 頁。",
  },
  {
    icon: Layers,
    title: "Notion / Obsidian 雙模板",
    desc: "整套 prompt 內建在工作站，含 view、tag、自動分類。複製即用。",
  },
  {
    icon: Video,
    title: "30 分鐘 Vista 親自示範影片",
    desc: "示範 5 個最常用 prompt 的實戰流程（含我寫某篇 1,700 篇文章時的真實過程）。",
  },
  {
    icon: Sparkles,
    title: "半年免費更新",
    desc: "AI 模型升級時，Vista 會更新 prompt 並寄給你，買斷一次不會過時。",
  },
];

const differentiators = [
  {
    title: "不是「100 個 prompt 列表」",
    text: "市面上免費 prompt pack 滿地是。我給你的不是清單，是 30 個寫作場景的「整套工作流」——每個 prompt 都嵌在一個完整的 input → AI 輸出 → Vista 修改 → 最終定稿的真實過程裡。",
  },
  {
    title: "每個 prompt 有 Vista 真實案例",
    text: "不是空殼 prompt，是「我寫某篇 1,700 篇之一時用了這個 prompt」的逐字 case study。看到我怎麼問 AI、它怎麼回、我怎麼改，你才能真的學會怎麼用。",
  },
  {
    title: "中文寫作專屬，不是英文翻譯",
    text: "ChatGPT 的中文 prompt 多半是英文模板翻過來的，結果文白夾雜。我這 30 個 prompt 從中文寫作邏輯出發，符合中文段落、節奏、語感。",
  },
  {
    title: "解決免費資源不會教的事",
    text: "「如何把長引述精煉成一句」「如何改掉 AI 味」「如何把陳述改成提問」——這些是寫作經驗者才會知道要做的事，免費資源不會涵蓋。",
  },
];

const faqs = [
  {
    q: "什麼時候可以拿到產品？",
    a: "目前是早鳥預購階段，預計 2026/Q3 完整交付（PDF + Notion 模板 + Obsidian 模板 + 30 分鐘示範影片）。預購買家會收到第一批完整內容；早鳥階段任何半成品 / 樣本 / 章節更新都會免費寄送。Pro 版的 1-on-1 sparring 在完整交付後 2 週內開放預約。",
  },
  {
    q: "為什麼採預購模式？我擔心收不到。",
    a: "預購一是讓我有壓力按時做完（截稿效應），二是讓真心需要的人先以早鳥價鎖定。如果 2026/Q4 仍未交付完整版本，我會主動全額退款並道歉。我寫了 1,700 篇文章、20 本書，從未跳票。",
  },
  {
    q: "我已經用 ChatGPT/Claude 寫文章一陣子了，這份還有用嗎？",
    a: "如果你的痛點是「卡在某個寫作環節，不知道怎麼問 AI」——這就是這份的解。每個 prompt 都對應一個具體寫作場景（如「改掉 AI 味」「把 1,000 字壓 500 字」），是即用工具書。",
  },
  {
    q: "我中文寫作能力一般，這份適合我嗎？",
    a: "適合。這份的設計前提是「會用 AI、想寫得更好」，不是「給寫作大師的進階心法」。每個 prompt 都附範例，照著做就有效。",
  },
  {
    q: "和 AI 內容產製系統工作坊有什麼不同？",
    a: "工作坊（NT$5,000）教你「建一套內容產製系統」，含五層架構、六格式分發、Claude Code skill。這份（NT$499/799）給你「個別寫作場景的 prompt 工具書」，平常打開 Word 卡住時隨手查用。兩者互補：工作坊是蓋工廠，這份是手感工具書。",
  },
  {
    q: "可以給我看 sample 嗎？",
    a: "本頁第三段「30 個 prompt 場景」是完整大綱。早鳥預購買家會在 2026 年 6 月底前收到第一個 prompt 場景的完整 sample（含 Vista 親寫案例），讓你提前體驗品質。完整版 2026/Q3 交付。",
  },
  {
    q: "未來 AI 模型升級了，這份會過時嗎？",
    a: "半年內免費更新。我會持續測試新模型（Claude / GPT / Gemini）的 prompt 表現差異，更新版本免費寄給你。",
  },
  {
    q: "可以用在哪些 AI 工具？",
    a: "Claude（推薦）、ChatGPT、Gemini、Notion AI 都可以。每個 prompt 都標註了「在哪個工具效果最好」。",
  },
];

export default function WritingOSPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-stone-100/60 to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <Badge className="mb-3 bg-amber-500/15 text-amber-700 border-amber-500/30 hover:bg-amber-500/15 px-4 py-1.5 text-xs sm:text-sm">
            🎯 2026/Q3 出貨 · 早鳥預購中
          </Badge>
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm sm:text-base">
            Writing OS · Vista 中文寫作 AI 工作流
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
            為中文寫作者打造的 AI 作業系統
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 sm:text-xl leading-relaxed">
            不是 100 個 prompt 列表。是 6 大寫作場景 × 30 個 prompt × 30+ 真實案例的完整系統。
            <br className="hidden sm:block" />
            一次買斷，永久使用，不訂閱。
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-stone-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              30 個寫作場景 prompt
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              30+ Vista 親寫案例
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Notion / Obsidian 雙模板
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              30 分鐘示範影片
            </span>
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <a href="#pricing">早鳥 NT$499 立即購買</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base"
              asChild
            >
              <a href="#categories">看 30 個場景</a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-stone-500">
            前 100 名早鳥價 NT$499 · 之後恢復原價 NT$799 · 預購預計 2026/Q3 出貨
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Why this exists */}
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold sm:text-3xl text-stone-900">
              為什麼做這份
            </h2>
            <p className="mt-2 text-xl text-primary font-semibold">
              因為免費資源不缺，缺的是「中文寫作場景對照表」。
            </p>
            <div className="mt-6 space-y-4 text-base text-stone-600 leading-relaxed">
              <p>
                我寫了 1,700 多篇文章。這些年我在 Claude、ChatGPT 上養出一套自己的寫作工作流，每個寫作環節都有對應的 prompt，知道哪一個下去就能解卡。
              </p>
              <p>
                市面上免費 prompt pack 滿地是。但你打開 ChatGPT，問它「我要寫一篇開頭」，它給你的還是抽象建議。你需要的不是更多 prompt，是「在這個具體寫作場景，Vista 會怎麼問 AI」的場景對照表。
              </p>
              <p>
                所以我把日常用的 30 個 prompt 整理出來。不是清單，是工作流——每個 prompt 都嵌在一個完整流程，附我親寫的真實案例（哪一篇文章、怎麼問、AI 怎麼回、我怎麼改）。
              </p>
            </div>
          </div>
        </section>

        {/* Pain points */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            這份解決的痛點
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            如果以下任一個你經歷過，這份就是為你做的
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

        {/* 30 categories */}
        <section id="categories" className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            30 個 Prompt 場景｜6 大寫作關卡
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            每個場景 5 個 prompt，附 Vista 親寫案例
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Card key={i} className="border-stone-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-stone-900">
                          {cat.title}
                        </p>
                        <p className="text-sm text-stone-500">
                          {cat.count} 個 prompt
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-base text-stone-600">{cat.desc}</p>
                    <ul className="mt-4 space-y-1 text-sm text-stone-500">
                      {cat.examples.map((ex, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">→</span>
                          <span>{ex}</span>
                        </li>
                      ))}
                      <li className="text-stone-400 pl-4">… 再 2 個</li>
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Differentiators */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            為什麼不買免費 prompt pack 就好
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            這份和免費資源最關鍵的 4 個差別
          </p>
          <div className="mt-8 space-y-5">
            {differentiators.map((d, i) => (
              <div key={i} className="rounded-lg border border-stone-200 bg-white p-6">
                <p className="text-lg font-semibold text-stone-900">
                  {d.title}
                </p>
                <p className="mt-2 text-base text-stone-600 leading-relaxed">
                  {d.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Deliverables */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
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

        {/* Difference vs ai-content */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            和「AI 內容產製系統工作坊」的差別
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            兩個產品互補，不是互打
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Card className="border-stone-200">
              <CardContent className="p-6">
                <Badge variant="outline" className="mb-3">
                  工作坊 NT$5,000
                </Badge>
                <p className="text-lg font-semibold text-stone-900">
                  AI 內容產製系統
                </p>
                <p className="mt-2 text-sm text-primary font-medium">
                  解決「我要建一套內容工廠」
                </p>
                <ul className="mt-4 space-y-2 text-sm text-stone-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">→</span>
                    <span>3 小時 live 工作坊</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">→</span>
                    <span>五層架構 / 六格式分發</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">→</span>
                    <span>Claude Code skill 自動產文</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">→</span>
                    <span>多平臺內容生意的系統建立</span>
                  </li>
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  asChild
                >
                  <Link href="/courses/ai-content">
                    了解工作坊 <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-primary/30 bg-primary/[0.02]">
              <CardContent className="p-6">
                <Badge className="mb-3">本頁 NT$499–799</Badge>
                <p className="text-lg font-semibold text-stone-900">
                  Vista 中文寫作 AI 工作流
                </p>
                <p className="mt-2 text-sm text-primary font-medium">
                  解決「我這篇文章寫不好」
                </p>
                <ul className="mt-4 space-y-2 text-sm text-stone-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">→</span>
                    <span>自學 PDF + Notion 模板</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">→</span>
                    <span>30 個個別寫作場景的 prompt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">→</span>
                    <span>每個 prompt 附 Vista 親寫案例</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">→</span>
                    <span>個別文章寫作的手感工具書</span>
                  </li>
                </ul>
                <p className="mt-4 text-xs text-stone-500">
                  購買後可享工作坊早鳥折抵 NT$500
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="mt-6 text-center text-sm text-stone-500 italic">
            一句話：工作坊教你<strong className="text-stone-700">蓋工廠</strong>，這份給你<strong className="text-stone-700">手感工具書</strong>。
          </p>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            訂價
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            一次買斷，沒有訂閱，永久使用。
          </p>

          <div className="mt-6 mx-auto max-w-3xl rounded-lg bg-amber-50 border border-amber-200 p-4 text-center">
            <p className="text-sm text-amber-900">
              <strong>🎯 早鳥預購中</strong>　預購買家可第一手收到 2026/Q3 完整交付包（PDF + Notion 模板 + 影片），早鳥階段任何更新都會免費寄給你。
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-stretch max-w-3xl mx-auto">
            {/* Standard */}
            <Card className="border-primary border-2 shadow-lg flex flex-col">
              <CardContent className="p-8 flex-1 flex flex-col">
                <Badge className="mb-3 self-start">早鳥 · 限前 100 名</Badge>
                <p className="text-base font-medium text-stone-500">標準版</p>
                <div className="mt-2 flex items-baseline gap-3">
                  <p className="text-4xl font-bold text-primary">NT$499</p>
                  <p className="text-lg text-stone-400 line-through">NT$799</p>
                </div>
                <p className="mt-1 text-sm text-stone-500">
                  早鳥滿 100 名恢復 NT$799
                </p>
                <ul className="mt-6 space-y-3 text-base text-stone-600 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>30 個 Prompt 套件 PDF（100 頁）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>30+ Vista 親寫真實案例</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Notion / Obsidian 雙模板</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>30 分鐘 Vista 親自示範影片</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>半年免費更新</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>AI 內容產製工作坊抵用 NT$500</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <CheckoutButton
                    productId={PRODUCT_ID_EARLY}
                    label="早鳥 NT$499 立即購買"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="border-stone-200 flex flex-col relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-stone-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                含 1:1 寫作 sparring
              </span>
              <CardContent className="p-8 flex-1 flex flex-col">
                <Badge variant="outline" className="mb-3 self-start">
                  Pro 進階版
                </Badge>
                <p className="text-base font-medium text-stone-500">Pro 版</p>
                <div className="mt-2 flex items-baseline gap-3">
                  <p className="text-4xl font-bold text-stone-900">NT$1,299</p>
                </div>
                <p className="mt-1 text-sm text-stone-500">
                  限額每月 5 名
                </p>
                <ul className="mt-6 space-y-3 text-base text-stone-600 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="font-medium text-stone-900">
                      標準版全部內容
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>30 分鐘 Vista 1-on-1 寫作 sparring</strong>
                      ：你提供 1 篇草稿（≤2,500 字），Vista 預讀 + 60 分鐘對話
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>事後寄一份「修改建議」筆記</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>用 Writing OS 工作流現場示範</span>
                  </li>
                </ul>
                <p className="mt-4 text-xs text-stone-400 italic">
                  對標單獨購買 Power Hour 諮詢 NT$5,000，這裡是套餐特價。
                </p>
                <div className="mt-6">
                  <CheckoutButton
                    productId={PRODUCT_ID_PRO}
                    label="Pro NT$1,299 立即購買"
                    variant="outline"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="mt-8 text-center text-xs text-stone-400 max-w-lg mx-auto leading-relaxed">
            支援信用卡付款 · 由 Recur.tw 安全處理 · 一次買斷無訂閱
            <br />
            預購預計 2026/Q3 完整交付 · 若 2026/Q4 仍未交付，全額退款。
          </p>

          <details className="mt-8 mx-auto max-w-md text-sm text-stone-500">
            <summary className="cursor-pointer hover:text-stone-700 text-center">
              錯過早鳥？這裡是標準版正式價
            </summary>
            <div className="mt-4">
              <Card className="border-stone-200">
                <CardContent className="p-6">
                  <p className="text-2xl font-bold text-stone-900">NT$799</p>
                  <p className="mt-1 text-sm text-stone-500">
                    標準版正式價（早鳥 100 名滿後）
                  </p>
                  <div className="mt-4">
                    <CheckoutButton
                      productId={PRODUCT_ID_REGULAR}
                      label="購買標準版正式價"
                      variant="outline"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </details>
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
            <Download className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl text-stone-900">
              下一次卡住，你會多一個工具
            </h2>
            <p className="mt-3 text-base text-stone-600 max-w-xl mx-auto">
              30 個寫作關卡的 AI 解法，永遠在你的 Notion 裡。半年內 AI 升級我都會更新。
            </p>
            <div className="mt-6 flex justify-center">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <a href="#pricing">
                  早鳥 NT$499 立即購買 <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
