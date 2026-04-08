import Link from "next/link";
import { Bot, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "模板 & 工具包 | solo.tw",
  description: "不用從零開始，下載即用的 AI 工具包和模板。",
  alternates: {
    canonical: "https://www.solo.tw/products",
  },
};

export default function ProductsPage() {
  return (
    <main className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            模板 & 工具包
          </h1>
          <p className="mt-3 text-lg text-stone-500">
            不用從零開始，下載即用
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/products/ai-coach-kit"
            className="group rounded-xl border border-stone-200 bg-white p-6 transition hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-stone-900">
              AI 教練工坊
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              教你用 AI 建一個每天陪你執行的實踐教練。框架 + 模板 + 150 篇知識庫。
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-primary">NT$1,499</span>
              <ArrowRight className="h-4 w-4 text-stone-400 transition group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
