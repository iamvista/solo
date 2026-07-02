import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { BOOKS, ALL_BOOKS_URL, type Book } from "@/lib/books";

const SUBSTACK_URL = "https://iamvista.substack.com/";

export const metadata: Metadata = {
  title: "著作｜Vista Cheng 的書 | solo.tw",
  description:
    "Vista Cheng（鄭緯筌）的著作專區：2026 年新書《Vibe Coding》零基礎入門書、撰寫中的《無人公司》，以及二十本累積著作。每本書都有專屬頁面、延伸資源與配套課程。",
  keywords: [
    "Vista Cheng",
    "鄭緯筌",
    "Vibe Coding 書",
    "無人公司",
    "AI 書籍",
    "一人公司",
    "solo.tw",
  ],
  alternates: { canonical: "https://www.solo.tw/books" },
  openGraph: {
    title: "著作｜Vista Cheng 的書",
    description:
      "2026 年新書《Vibe Coding》、撰寫中的《無人公司》，以及二十本累積著作。",
    url: "https://www.solo.tw/books",
    siteName: "solo.tw",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "https://www.solo.tw/og",
        width: 1200,
        height: 630,
        alt: "著作 — Vista Cheng × solo.tw",
      },
    ],
  },
};

function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/books/${book.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-shadow hover:shadow-lg sm:flex-row"
    >
      {/* 字體書封（書封定稿前的過渡樣式） */}
      <div
        className={`flex min-h-48 w-full shrink-0 items-center justify-center bg-gradient-to-br ${book.coverGradient} p-8 sm:w-56`}
      >
        <div className="text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-white/80" />
          <p className="text-2xl font-bold text-white">{book.title}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
        <div>
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            {book.statusLabel}
          </span>
          <h2 className="mt-3 text-2xl font-bold text-stone-900">
            {book.title}
          </h2>
          <p className="mt-1 text-base text-stone-500">{book.subtitle}</p>
          <p className="mt-4 text-stone-600">{book.tagline}</p>
        </div>
        <p className="mt-6 flex items-center gap-1 font-semibold text-amber-600 group-hover:text-amber-700">
          看這本書
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </p>
      </div>
    </Link>
  );
}

export default function BooksPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Books", href: "/books" },
        ])}
      />

      {/* Hero */}
      <section className="bg-stone-900 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            著作
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-400">
            寫書三十年，從 1995 年的第一本網路書到現在，出版超過二十本。
            這裡是新書的家：每本書都有專屬頁面、延伸資源，以及讀完之後的下一步。
          </p>
        </div>
      </section>

      {/* 新書列表 */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6">
          {BOOKS.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      </section>

      {/* 完整著作 */}
      <section className="bg-stone-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Library className="mx-auto h-10 w-10 text-stone-400" />
          <h2 className="mt-4 text-2xl font-bold text-stone-900">
            完整著作年表
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-600">
            從《Internet 全球資訊網完全手冊》到《ChatGPT 提問課》，
            二十本著作的完整清單收錄在作者官網。
          </p>
          <Button asChild variant="outline" className="mt-6">
            <a href={ALL_BOOKS_URL} target="_blank" rel="noopener noreferrer">
              看完整書目
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* 電子報 CTA */}
      <section className="bg-stone-900 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            新書出版，第一時間通知你
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-400">
            訂閱免費電子報，新書上市、延伸資源與獨家內容都會先寄到你的信箱。
          </p>
          <Button
            size="lg"
            asChild
            className="mt-8 bg-gradient-to-r from-amber-400 to-amber-500 font-semibold text-stone-900 hover:from-amber-500 hover:to-amber-600"
          >
            <a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer">
              免費訂閱電子報
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
