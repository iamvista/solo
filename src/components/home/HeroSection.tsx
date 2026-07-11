import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SOCIAL_PROOF } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,140,110,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(168,140,110,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-amber-50/60 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-rose-50/40 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="text-center">
          {/* Top badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-stone-600">
              AI 工作坊持續開班中
            </span>
          </div>

          {/* Main headline — 個人品牌導向 */}
          <h1 className="mx-auto max-w-5xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl md:text-6xl lg:text-7xl">
            用 AI 放大你的
            <br className="sm:hidden" />
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">一人事業</span>
              <span className="absolute -bottom-1 left-0 -z-0 h-3 w-full bg-primary/10 sm:-bottom-2 sm:h-4" />
            </span>
          </h1>

          {/* Subheadline — 服務導向 */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-500 sm:mt-8 sm:text-xl lg:text-2xl">
            我是 Vista，幫助自由工作者、講師和顧問
            <br className="hidden sm:block" />
            <span className="font-medium text-stone-800">
              用 AI 把一個人做到一個團隊的產出
            </span>
            。
          </p>

          {/* CTA buttons — 諮詢優先 */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row sm:gap-5">
            <Button
              size="lg"
              asChild
              className="h-14 w-full px-8 text-base font-semibold shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/20 sm:w-auto sm:text-lg"
            >
              <Link href="/consulting">
                預約諮詢
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 w-full border-stone-300 px-8 text-base text-stone-700 hover:bg-stone-50 sm:w-auto sm:text-lg"
            >
              <Link href="/diagnose">免費事業健檢</Link>
            </Button>
          </div>

          {/* 講師身分 mini（單行，取代原本佔空間的名片卡） */}
          <p className="mt-8 text-sm text-stone-500 sm:mt-10">
            Vista Cheng・AI 應用講師・一人事業教練・
            <span className="text-amber-600">{SOCIAL_PROOF.newsletterSubscribers}</span> 電子報讀者
          </p>
        </div>
      </div>
    </section>
  );
}
