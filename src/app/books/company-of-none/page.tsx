import type { Metadata } from "next";
import { ArrowRight, BookOpen, Compass, Eye, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { COMPANY_OF_NONE_BOOK } from "@/lib/books";

const SUBSTACK_URL = "https://iamvista.substack.com/";
const book = COMPANY_OF_NONE_BOOK;

export const metadata: Metadata = {
  title: `${book.title}｜${book.subtitle} | solo.tw`,
  description: `Vista Cheng 撰寫中的新書《${book.title}》：${book.tagline}當 AI 能承擔執行，「公司一定要有人」這個前提就崩了。訂閱電子報，搶先讀草稿。`,
  keywords: [
    "無人公司",
    "一人公司",
    "AI 軍團",
    "AI agent",
    "solopreneur",
    "Vista Cheng",
    "鄭緯筌",
  ],
  alternates: { canonical: "https://www.solo.tw/books/company-of-none" },
  openGraph: {
    title: `${book.title}｜${book.subtitle}`,
    description: book.tagline,
    url: "https://www.solo.tw/books/company-of-none",
    siteName: "solo.tw",
    locale: "zh_TW",
    type: "book",
    images: [
      {
        url: "https://www.solo.tw/og",
        width: 1200,
        height: 630,
        alt: `${book.title} — Vista Cheng 撰寫中的新書`,
      },
    ],
  },
};

const THREE_PARTS = [
  {
    icon: Eye,
    label: "WHY",
    title: "「公司一定要有人」是個過時的假設",
    body: "公司的本質是協調工作，不是雇用人。AI 讓「一個人協調大量工作」的成本崩跌之後，傳統公司（雇人擴張）、一人公司（極簡求生）之外，出現了第三種選擇。",
  },
  {
    icon: Compass,
    label: "WHAT",
    title: "解剖一家真實運轉的無人公司",
    body: "行銷、業務、客服、內容、財務、營運，逐一攤開看 AI 怎麼補上每個傳統部門。作者不是在描述想像，是把自己每天實際營運的 AI 員工組織圖攤給你看。",
  },
  {
    icon: Map,
    label: "HOW",
    title: "從「做事的人」變成「指揮 AI 的人」",
    body: "最難的不是工具，是放手。怎麼設計 AI 團隊的編制與指揮鏈、怎麼把你腦中的判斷變成可委派的系統，以及當人人都有 AI 軍團，你靠什麼贏。",
  },
];

export default function CompanyOfNoneBookPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Books", href: "/books" },
          { name: book.title, href: "/books/company-of-none" },
        ])}
      />
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
          inLanguage: "zh-TW",
          url: "https://www.solo.tw/books/company-of-none",
        }}
      />

      {/* Hero */}
      <section className="bg-stone-950 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="inline-block rounded-full bg-stone-800 px-4 py-1.5 text-sm font-semibold text-stone-300">
            {book.statusLabel}・{book.publishDate}
          </span>
          <h1 className="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl">
            {book.title}
          </h1>
          <p className="mt-4 text-lg text-stone-400">{book.subtitle}</p>
          <p className="mx-auto mt-10 max-w-xl text-2xl font-semibold leading-relaxed text-amber-300">
            公司只有你一個人，
            <br />
            卻運作得像有一百個人。
          </p>
          <p className="mx-auto mt-8 max-w-xl text-stone-400">
            無人公司，指的是無「員工」之人：公司裡沒有別人，只有你，
            加上一支聽你指揮的 AI 軍團。
            當 AI 能承擔執行，「公司一定要有人」這個前提就崩了。
          </p>
        </div>
      </section>

      {/* 三段式預覽 */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-stone-900">
            這本書要回答的三個問題
          </h2>
          <div className="mt-12 space-y-6">
            {THREE_PARTS.map((part) => (
              <div
                key={part.label}
                className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 sm:flex-row sm:items-start sm:p-8"
              >
                <div className="flex shrink-0 items-center gap-3 sm:w-32 sm:flex-col sm:items-start">
                  <part.icon className="h-7 w-7 text-amber-500" />
                  <span className="text-sm font-bold tracking-widest text-stone-400">
                    {part.label}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900">
                    {part.title}
                  </h3>
                  <p className="mt-2 text-stone-600">{part.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 作者活證明 */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <BookOpen className="mx-auto h-10 w-10 text-stone-400" />
          <h2 className="mt-4 text-3xl font-bold text-stone-900">
            這不是理論，是每天的日常
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-stone-600">
            作者本人就是這本書的第一個案例：一個人，指揮由 AI
            秘書團隊與工程角色組成的軍團，同時營運網站、電子報、課程與顧問服務。
            書裡寫的每個編制與流程，都在真實事業裡運轉。
          </p>
        </div>
      </section>

      {/* 搶先讀 CTA */}
      <section className="bg-stone-950 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">搶先讀《{book.title}》</h2>
          <p className="mx-auto mt-4 max-w-xl text-stone-400">
            這本書正在撰寫中。寫作過程的思考、章節草稿的先行版本，
            會透過電子報與訂閱讀者分享。想第一批讀到，現在就訂閱。
          </p>
          <Button
            size="lg"
            asChild
            className="mt-8 bg-gradient-to-r from-amber-400 to-amber-500 font-semibold text-stone-900 hover:from-amber-500 hover:to-amber-600"
          >
            <a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer">
              免費訂閱，搶先讀草稿
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
