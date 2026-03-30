import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileDown, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "模板 & 工具包 | solo.tw",
  description: "不用從零開始。下載 Notion 模板、Prompt 工具包，直接套用到你的一人事業。",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          數位產品
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
          模板 & 工具包
        </h1>
        <p className="mt-4 text-lg text-stone-500">
          不用從零開始，下載即用，直接套用到你的一人事業。
        </p>
      </div>

      {/* 即將推出提示 */}
      <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <FileDown className="mx-auto h-12 w-12 text-amber-500" />
        <h2 className="mt-4 text-xl font-bold text-stone-900">
          即將推出
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          Notion 模板、Prompt 工具包、AI 工作流範本……正在準備中。
          <br />
          訂閱電子報，第一時間收到上架通知。
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Button size="lg" asChild>
            <Link href="/#newsletter">
              訂閱電子報
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/events">先看看工作坊</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
