import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "副腦計畫｜Brain+1 Lab：35 天 AI 副腦陪跑營｜Vista Cheng",
  description:
    "35 天，把你累積多年的素材變成可問答的副腦。NotebookLM + Obsidian + Claude Skills 三個利器，6/1 開營。",
  metadataBase: new URL("https://brain.solo.tw"),
  alternates: { canonical: "https://brain.solo.tw" },
  openGraph: {
    title: "副腦計畫｜Brain+1 Lab：35 天，給你的大腦 +1 個 AI 副駕。",
    description:
      "把你五年的素材變成可問答的副腦。6/1 開營，限 100 人。",
    type: "website",
    url: "https://brain.solo.tw",
  },
};

const curriculum = [
  {
    week: "W1",
    date: "6/1–6/7",
    title: "知識庫地基 + Notebook #1：書與論文",
    output: "第一個會回話的筆記本",
  },
  {
    week: "W2",
    date: "6/8–6/14",
    title: "Notebook #2：podcast / 影音 / 長內容",
    output: "把音訊變成可問答的素材",
  },
  {
    week: "W3",
    date: "6/15–6/21",
    title: "Notebook #3：你自己的工作經驗",
    output: "信件、會議、LINE 變知識資產",
  },
  {
    week: "W4",
    date: "6/22–6/28",
    title: "整合 + 跨資料庫查詢 + 個人 AI 助理 v0.1",
    output: "你的個人 GPT",
  },
  {
    week: "鞏固週",
    date: "6/29–7/5",
    title: "自由實作 + Demo Day",
    output: "上臺示範你的 AI 副腦怎麼回話",
  },
];

const offerItems = [
  { item: "3 個專題 Notebook 建置實作", value: "9,000" },
  { item: "6 個 Claude Skills 授權使用", value: "8,000" },
  { item: "4 場線上直播 + 結營 Demo Day", value: "7,500" },
  { item: "每週限 5 名作品批改", value: "4,000" },
  { item: "Obsidian 個人知識庫範本", value: "2,500" },
  { item: "LINE 社群", value: "2,000" },
];

const faqs = [
  {
    q: "我已經是重度 Obsidian / Heptabase / Notion 使用者了！",
    a: "那太好了，可以跳過工具設定與學習，直接開始使用。",
  },
  {
    q: "我已經有寫日記、覆盤的習慣了，這個訓練營對我有用嗎？",
    a: "非常適合。寫日記是把你的經驗整理出來，這個訓練營是把你接觸到的外部素材整理成可問答的系統。兩件事互補，不衝突。",
  },
  {
    q: "直播時間無法配合？",
    a: "全程錄影回放。但 Demo Day（7/4 週六）建議上線觀摩。",
  },
  {
    q: "NotebookLM 改版怎麼辦？",
    a: "我主要教的是素材分類，我會分享跨資料庫查詢的方法。",
  },
  {
    q: "退費政策？",
    a: "14 天前全額（扣 2.8% 手續費）／8–13 天 50%／開營後 0%。",
  },
];

export default function BrainLandingPage() {
  return (
    <div className="bg-stone-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-stone-50">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-rose-500/10 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-900/60 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>
              <span className="text-sm font-medium text-stone-300">
                6/1 開營｜限 100 人｜首梯
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              35 天，
              <br className="sm:hidden" />
              給你的大腦
              <br />
              <span className="text-amber-400">+1</span> 個 AI 副駕。
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-stone-300 sm:text-xl">
              <span className="font-semibold text-stone-100">副腦計畫｜Brain+1 Lab</span>
              ：把你五年的素材，變成可問答的副腦。
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <Button size="lg" asChild className="bg-amber-500 text-stone-900 hover:bg-amber-400">
                <Link href="#enroll">
                  立即報名 NT$ 6,800（早鳥）
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild className="text-stone-200 hover:bg-stone-800 hover:text-stone-50">
                <Link href="#curriculum">先看訓練營內容</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-stone-400">
              5/24 早鳥截止
            </p>
          </div>
        </div>
      </section>

      {/* Pain */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            你硬碟裡的那些鬼魂
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-stone-500">
            你不是不認真，你是在囤積資料，不是在建立系統。
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card className="border-stone-200 p-8">
              <div className="text-sm font-semibold text-amber-600">鬼魂 1</div>
              <h3 className="mt-2 text-xl font-bold text-stone-900">
                你存了，但找不到
              </h3>
              <p className="mt-4 leading-relaxed text-stone-600">
                Readwise Reader 裡的 800 篇文章、Notion 裡的 200 筆紀錄、Google Drive 裡的 50 GB 文件。每次要寫東西、做簡報，你還是回去 Google。
              </p>
            </Card>

            <Card className="border-stone-200 p-8">
              <div className="text-sm font-semibold text-amber-600">鬼魂 2</div>
              <h3 className="mt-2 text-xl font-bold text-stone-900">
                你聽了，但想不起來
              </h3>
              <p className="mt-4 leading-relaxed text-stone-600">
                一週聽 5 集 podcast、讀 1 本書或看 3 封電子報。三個月後，你只記得有一集講了什麼很棒的東西，但說不出來是什麼？
              </p>
            </Card>

            <Card className="border-stone-200 p-8">
              <div className="text-sm font-semibold text-amber-600">鬼魂 3</div>
              <h3 className="mt-2 text-xl font-bold text-stone-900">
                你有筆記，但生不出洞見
              </h3>
              <p className="mt-4 leading-relaxed text-stone-600">
                你已經用 Notion、Obsidian 或 Heptabase。但你的筆記只是更整齊的墳場。AI 工具一直更新，你不知道從哪裡開始整合？
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="curriculum" className="bg-stone-50 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            35 天，把鬼魂叫醒
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-relaxed text-stone-600">
            結營那天，你會有一個能回答以下問題的個人 AI 助理：
          </p>

          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {[
              "我去年讀的那本《XXX》，作者對 OO 主題的核心論點是什麼？",
              "我這 5 年聽過的 podcast 裡，誰提過 OO 的概念？",
              "我半年前的那份會議記錄，當時客戶的真正擔憂是什麼？",
            ].map((q) => (
              <div
                key={q}
                className="flex items-start gap-3 rounded-lg border border-stone-200 bg-white p-4"
              >
                <Check className="mt-1 h-5 w-5 flex-shrink-0 text-amber-500" />
                <span className="text-stone-700">{q}</span>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-3xl text-center text-stone-600">
            <span className="font-semibold text-stone-900">怎麼做到</span>
            ：每天 15 分鐘 × 3 個專題筆記 × NotebookLM + Obsidian + Claude Skills 三個利器。
          </p>

          <div className="mt-12 overflow-hidden rounded-xl border border-stone-200 bg-white">
            <table className="w-full">
              <thead className="bg-stone-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700">
                    週次
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700">
                    主題
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-stone-700">
                    你會做出來
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {curriculum.map((row) => (
                  <tr key={row.week}>
                    <td className="px-4 py-4 align-top">
                      <div className="font-bold text-stone-900">{row.week}</div>
                      <div className="text-xs text-stone-500">{row.date}</div>
                    </td>
                    <td className="px-4 py-4 align-top text-stone-700">
                      {row.title}
                    </td>
                    <td className="px-4 py-4 align-top text-stone-600">
                      {row.output}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Free Primer */}
      <section className="bg-gradient-to-b from-amber-50 to-stone-50 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-4 py-1.5">
              <span className="text-xs font-semibold text-amber-700">
                免費前導教材
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              還沒準備好報名？
              <br className="sm:hidden" />
              <span className="text-amber-700">先用這份簡報暖身。</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-600">
              我把 NotebookLM 的入門全貌做成一份免費簡報——
              <span className="font-semibold text-stone-900">34 張投影片、約 50 分鐘可以看完</span>
              ，從註冊、Steven Johnson 的專家建議，到學生與職場人士的實戰場景，全部為你引路。
            </p>
          </div>

          <Card className="mx-auto mt-12 max-w-3xl overflow-hidden border-amber-200 bg-white p-0">
            <div className="grid gap-0 sm:grid-cols-5">
              <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 p-8 sm:col-span-2 sm:p-10">
                <div className="text-5xl">📓</div>
                <h3 className="mt-4 text-xl font-bold text-stone-900">
                  Google NotebookLM
                  <br />
                  新手入門
                </h3>
                <p className="mt-2 text-sm text-stone-600">
                  只讀你給的資料，回答都附原文引註
                </p>
                <div className="mt-6 space-y-1 text-xs text-stone-500">
                  <div>📊 34 張投影片</div>
                  <div>⏱️ 約 50 分鐘</div>
                  <div>🆓 免費觀看，免註冊</div>
                </div>
              </div>
              <div className="p-8 sm:col-span-3 sm:p-10">
                <div className="text-sm font-semibold text-amber-700">你會學到</div>
                <ul className="mt-4 space-y-3 text-stone-700">
                  {[
                    "NotebookLM 是什麼、和 ChatGPT 差別在哪",
                    "註冊到第一份筆記本的最短路徑（5 步驟）",
                    "Steven Johnson 親授的官方建議（中文版）",
                    "學生 × 職場人士分眾用法 + 即學即用練習",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-1 h-4 w-4 flex-shrink-0 text-amber-600" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    className="bg-amber-600 text-white hover:bg-amber-700"
                  >
                    <a
                      href="https://slides.vista.tw/notebooklm-beginner-guide/"
                      target="_blank"
                      rel="noopener"
                    >
                      立即觀看簡報
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="ghost" className="text-stone-700">
                    <a
                      href="https://slides.vista.tw/notebooklm-beginner-guide/notebooklm-beginner-guide.pdf"
                      target="_blank"
                      rel="noopener"
                    >
                      下載 PDF
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-stone-500">
            看完這份簡報，你已經能獨立建第一個筆記本。
            <br className="sm:hidden" />
            想把它變成可長期累積的系統，就是副腦計畫要陪你走的 35 天。
          </p>
        </div>
      </section>

      {/* Proof */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            為什麼是我
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-stone-600">
            我不是教 NotebookLM 的人，我是每天用 NotebookLM 工作的人。
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {[
              "vista.tw 多語站營運者（中／英／日）",
              "iamvista.substack.com 電子報主筆",
              "自架 wiki-ask 系統，每天在用",
              "開源 ai-content-skills 倉庫（10+ Claude Skills）",
              "一人公司作業系統 solo.tw 已驗證金流／部署／內容飛輪",
              "學術實踐：TSSCI 期刊投稿被接受",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-600" />
                <span className="text-stone-700">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-xl border border-stone-200 bg-stone-50 p-8">
            <h3 className="text-xl font-bold text-stone-900">
              我跟其他 AI 講師的差異
            </h3>
            <ul className="mt-6 space-y-4 text-stone-700">
              <li>
                <span className="font-semibold text-stone-900">不只是研究 AI 工具的人</span>
                ，是靠 AI 工具經營一人公司的人
              </li>
              <li>
                <span className="font-semibold text-stone-900">不只是教知識管理的人</span>
                ，是自己建構了知識管理系統再公開的人
              </li>
              <li>
                <span className="font-semibold text-stone-900">不只是介紹新工具的人</span>
                ，是教你從工具思維進階到系統思維的人
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Offer */}
      <section id="enroll" className="bg-stone-900 py-20 text-stone-50 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            你可以得到什麼
          </h2>

          <div className="mt-12 overflow-hidden rounded-xl border border-stone-700 bg-stone-800">
            <table className="w-full">
              <tbody className="divide-y divide-stone-700">
                {offerItems.map((row) => (
                  <tr key={row.item}>
                    <td className="px-6 py-4 text-stone-200">{row.item}</td>
                    <td className="px-6 py-4 text-right font-mono text-stone-400">
                      NT$ {row.value}
                    </td>
                  </tr>
                ))}
                <tr className="bg-stone-700/50">
                  <td className="px-6 py-4 font-bold text-stone-50">總計</td>
                  <td className="px-6 py-4 text-right font-mono text-lg font-bold text-amber-400">
                    NT$ 34,500
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-rose-500/10 p-8 text-center">
            <div className="text-stone-400 line-through">原價 NT$ 8,800</div>
            <div className="mt-2 text-5xl font-bold text-amber-400">
              NT$ 6,800
            </div>
            <div className="mt-2 text-sm text-stone-300">
              早鳥優惠於 5/24 截止
            </div>
            <div className="mt-6">
              <Button size="lg" asChild className="bg-amber-500 text-stone-900 hover:bg-amber-400">
                <Link href="https://buy.recur.tw/Kfcg1iHhdRWU18rq" target="_blank" rel="noopener">
                  立即報名
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-4 text-xs text-stone-400">
              信用卡 / Apple Pay / Google Pay｜14 天前全額退費
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            常見問題
          </h2>

          <div className="mt-12 space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-lg border border-stone-200 bg-stone-50 p-6"
              >
                <h3 className="font-semibold text-stone-900">{faq.q}</h3>
                <p className="mt-3 leading-relaxed text-stone-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 py-20 text-center text-stone-50 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">
            6/1 開營，35 天從這裡開始。
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-stone-300">
            限 100 人。早鳥優惠至 5/24。
          </p>
          <div className="mt-10">
            <Button size="lg" asChild className="bg-amber-500 text-stone-900 hover:bg-amber-400">
              <Link href="https://buy.recur.tw/Kfcg1iHhdRWU18rq" target="_blank" rel="noopener">
                立即報名｜為我的腦 +1
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
