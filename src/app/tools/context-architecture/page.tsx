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
} from "lucide-react";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "AI 個人脈絡庫：兩份免費模板｜solo.tw",
  description:
    "兩份免費模板，讓 AI 更懂你的定位、受眾與寫作風格。可放進 Claude Project、ChatGPT Project 或其他 AI 工作區使用。",
  openGraph: {
    title: "AI 個人脈絡庫：兩份免費模板",
    description:
      "讓 AI 從泛用助理變成真正理解你的協作夥伴。純 Markdown 檔，不留 Email。",
  },
  alternates: {
    canonical: "https://www.solo.tw/tools/context-architecture",
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
    badge: "模板 2 ／ 5 個維度",
    title: "寫作風格 Profile（簡版）",
    desc: "這是一份寫給 AI 看的「寫作指紋」。如果少了這份文件，AI 很容易用華語自媒體的平均語氣替你寫作：看似流暢，卻不像你。",
    bullets: [
      "語氣調性",
      "用詞偏好",
      "句式結構",
      "修辭習慣",
      "排版方式",
    ],
    href: "/templates/voice-profile-template.md",
    filename: "voice-profile-template.md",
    hint: "每個欄位都附有範例，可以照著填或重新檢視自己的風格",
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
      "AI 個人脈絡庫是一套灌進 AI 工作區的長期上下文文件，內容涵蓋你的定位、受眾、思想、內容、風格、知識資產等十個維度。它解決的不是 prompt 問題，而是 AI 不認識你這個人的問題。完整版有 10 份文件，這頁免費提供其中兩份門檻最高的入門模板。",
  },
  {
    question: "這兩份模板適合誰下載？",
    answer:
      "適合知識工作者、講師、顧問、作者、研究者，以及靠觀點與寫作變現的 Solo Creator。只要你常用 Claude、ChatGPT、Gemini、NotebookLM 之類的 AI 工具寫作或思考，這兩份模板就能幫你大幅提升輸出可用率。",
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
      "「上下文比 prompt 重要」這個方向，近年在海外 AI Operator 社群已是趨勢。但海外案例多半服務於 SaaS、電商或銷售漏斗型的 internet business owner。對華語世界的知識工作者、講師、顧問、作者與 Solo Creator 來說，真正需要的不是更重的 funnel，而是能保存思想脈絡、研究積累、寫作風格與內容資產的個人脈絡庫。AI 個人脈絡庫的 10 份文件設計、訪談方法與產出格式都是 Vista 為這個族群原創設計。",
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
            href: "/tools/context-architecture",
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
              兩份免費模板，讓 AI 更懂你的定位、受眾與寫作風格
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
                近年海外 AI Operator 社群很流行一種 context-first 的工作法：與其每次都重新修 prompt，不如先把自己的商業定位、產品、受眾、語氣、知識資產與工作流程，整理成一套 AI 可以長期讀取的脈絡文件。
              </p>
              <p>
                我很認同這個方向。但我也發現，許多海外案例主要服務於 SaaS、電商或強銷售漏斗型的 internet business owner；對華語世界的{" "}
                <span className="font-bold text-stone-900">
                  知識工作者、講師、顧問、作者與 Solo Creator
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
                這兩份不是寫給人看的自我介紹，而是寫給 AI 讀的工作底稿。當 AI 讀懂這兩份文件，它才有可能從「泛用助理」變成真正理解你的協作夥伴。
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
              <Link href="/context-architecture-dfy">
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
