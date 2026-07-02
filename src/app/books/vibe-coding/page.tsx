import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { VIBE_CODING_BOOK, VIBE_CODING_TOC } from "@/lib/books";

const SUBSTACK_URL = "https://iamvista.substack.com/";
const book = VIBE_CODING_BOOK;

export const metadata: Metadata = {
  title: `${book.title}｜${book.subtitle} | solo.tw`,
  description: `Vista Cheng 2026 年新書《${book.title}》（${book.publisher}）：${book.tagline}全書 14 章，以 vista.tw 與 solo.tw 的真實建置過程為例。`,
  keywords: [
    "Vibe Coding",
    "Vibe Coding 書",
    "AI 寫程式",
    "零基礎程式",
    "Claude Code",
    "Cursor",
    "自然語言開發",
    "Vista Cheng",
    "鄭緯筌",
    "碁峰",
  ],
  alternates: { canonical: "https://www.solo.tw/books/vibe-coding" },
  openGraph: {
    title: `${book.title}｜${book.subtitle}`,
    description: book.tagline,
    url: "https://www.solo.tw/books/vibe-coding",
    siteName: "solo.tw",
    locale: "zh_TW",
    type: "book",
    images: [
      {
        url: "https://www.solo.tw/og",
        width: 1200,
        height: 630,
        alt: `${book.title} — Vista Cheng 新書`,
      },
    ],
  },
};

const FAQ_ITEMS = [
  {
    question: "我完全不會寫程式，看得懂這本書嗎？",
    answer:
      "這本書就是為你寫的。全書不要求任何程式基礎，第 6 章甚至直接告訴你：你需要的是「看懂」而非「會寫」。書中所有案例都從自然語言的需求描述開始。",
  },
  {
    question: "書裡教的工具會不會很快過時？",
    answer:
      "書中比較了 Cursor、Antigravity、Lovable、Claude Code 等主流工具，但重點放在挑選工具的判斷框架與跟 AI 協作的方法。工具會更新，方法不會。出版後的工具異動，會透過電子報與本頁的延伸資源持續補充。",
  },
  {
    question: "讀完這本書我能做出什麼？",
    answer:
      "書中的實戰路線是：第一個待辦清單 App、你自己的網站、名單磁鐵獲客工具、品牌銷售頁、數據分析儀表板。這些都是作者在 vista.tw 與 solo.tw 上真實運行的東西，書中如實還原建置過程。",
  },
  {
    question: "這本書跟 Vibe Coding 工作坊有什麼關係？",
    answer:
      "書給你完整的方法與地圖，工作坊是三小時的實作陪跑：現場做出一個可上線的網站，有人幫你避開所有坑。先讀書再上課、或先上課再用書複習，都可以。",
  },
  {
    question: "什麼時候上市？在哪裡買？",
    answer:
      "2026 年 7 月由碁峰資訊出版。各通路購買連結會在上市後更新於本頁，訂閱電子報可以第一時間收到通知。",
  },
];

export default function VibeCodingBookPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Books", href: "/books" },
          { name: book.title, href: "/books/vibe-coding" },
        ])}
      />
      <JsonLd data={faqSchema(FAQ_ITEMS)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Book",
          name: book.title,
          alternateName: book.subtitle,
          author: {
            "@type": "Person",
            name: "Vista Cheng（鄭緯筌）",
            url: "https://www.solo.tw/about",
          },
          publisher: { "@type": "Organization", name: book.publisher },
          inLanguage: "zh-TW",
          url: "https://www.solo.tw/books/vibe-coding",
        }}
      />

      {/* Hero */}
      <section className="bg-stone-900 py-16 sm:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[280px_1fr]">
          <div
            className={`mx-auto flex aspect-[3/4] w-56 items-center justify-center rounded-xl bg-gradient-to-br ${book.coverGradient} p-6 shadow-2xl lg:w-full`}
          >
            <div className="text-center">
              <BookOpen className="mx-auto mb-4 h-10 w-10 text-white/80" />
              <p className="text-3xl font-bold text-white">{book.title}</p>
              <p className="mt-2 text-sm text-white/90">{book.subtitle}</p>
            </div>
          </div>
          <div className="text-center lg:text-left">
            <span className="inline-block rounded-full bg-amber-400/20 px-4 py-1.5 text-sm font-semibold text-amber-300">
              {book.statusLabel}・{book.publisher}
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {book.title}
            </h1>
            <p className="mt-3 text-xl text-stone-300">{book.subtitle}</p>
            <p className="mx-auto mt-6 max-w-xl text-stone-400 lg:mx-0">
              一個從未寫過程式的行銷經理，兩週內做出了客戶資料分析儀表板；
              一位按摩師，三小時架好自己的服務銷售網頁。
              這不是科幻小說，是 2026 年每天都在發生的事。
              差別只在：他們學會了怎麼跟 AI 說清楚需求。
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-amber-400 to-amber-500 font-semibold text-stone-900 hover:from-amber-500 hover:to-amber-600"
              >
                <a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer">
                  訂閱電子報，上市第一時間通知
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 這本書給誰 */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-stone-900">
            這本書為誰而寫
          </h2>
          <div className="mt-10 space-y-4">
            {book.audience.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white px-5 py-4"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                <span className="text-stone-700">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-stone-600">
            核心精神只有一句：
            <span className="font-semibold text-stone-900">
              重點不是你會不會寫程式，而是你能不能把需求說清楚。
            </span>
          </p>
        </div>
      </section>

      {/* 章節目錄 */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-stone-900">
            全書十四章
          </h2>
          <p className="mt-3 text-center text-stone-500">
            從入門觀念到實戰專案，再到品質把關（章名以出版社最終版為準）
          </p>
          <ol className="mt-10 space-y-3">
            {VIBE_CODING_TOC.map((ch) => (
              <li
                key={ch.no}
                className="flex items-start gap-4 rounded-xl bg-white px-5 py-4 shadow-sm"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                  {ch.no}
                </span>
                <div>
                  <p className="font-semibold text-stone-900">{ch.title}</p>
                  <p className="mt-0.5 text-sm text-stone-500">{ch.hook}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 啟動包預告 */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-8 text-center sm:p-10">
            <Gift className="mx-auto h-10 w-10 text-amber-500" />
            <h2 className="mt-4 text-2xl font-bold text-stone-900">
              隨書資源：Vibe Coding 啟動包
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-stone-600">
              給讀完書、想立刻動手的你：2026 年版工具棧清單、四階段提示詞包、
              一個週末做出並上線個人作品頁的六步實作劇本。
              書上市時同步開放，訂閱電子報搶先取得。
            </p>
            <Button asChild className="mt-6" variant="outline">
              <a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer">
                訂閱電子報，啟動包上線通知我
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 下一步：課程導流 */}
      <section className="bg-stone-900 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-white">
            讀完書之後，想有人帶你做？
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <Link
              href="/courses/vibe-coding"
              className="group rounded-2xl border border-stone-700 bg-stone-800/50 p-6 transition-colors hover:border-amber-400"
            >
              <Sparkles className="h-6 w-6 text-amber-400" />
              <h3 className="mt-3 text-xl font-bold text-white">
                Vibe Coding 實戰工作坊
              </h3>
              <p className="mt-2 text-sm text-stone-400">
                三小時實體小班，現場做出一個可上線的網站。書給你地圖，工作坊陪你走完第一段路。
              </p>
              <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-amber-400">
                看課程
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </p>
            </Link>
            <Link
              href="/consulting"
              className="group rounded-2xl border border-stone-700 bg-stone-800/50 p-6 transition-colors hover:border-amber-400"
            >
              <Sparkles className="h-6 w-6 text-amber-400" />
              <h3 className="mt-3 text-xl font-bold text-white">
                1-on-1 量身陪跑
              </h3>
              <p className="mt-2 text-sm text-stone-400">
                想直接做自己的專案？一對一諮詢從你的實際需求出發，整堂課都在處理你的問題。
              </p>
              <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-amber-400">
                看方案
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-stone-900">
            常見問題
          </h2>
          <div className="mt-10 space-y-6">
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.question}
                className="rounded-xl border border-stone-200 bg-white p-6"
              >
                <h3 className="font-bold text-stone-900">{item.question}</h3>
                <p className="mt-2 text-stone-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
