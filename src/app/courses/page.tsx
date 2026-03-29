import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { workshops } from "@/lib/workshops";
import CourseFilters from "./CourseFilters";

export const metadata: Metadata = {
  title: "課程與工作坊 | solo.tw",
  description:
    "精選實戰課程與工作坊，涵蓋 AI 應用、樂齡理財、創新思維。小班制、重產出、即學即用。",
  openGraph: {
    title: "課程與工作坊 | solo.tw",
    description:
      "精選實戰課程與工作坊，涵蓋 AI 應用、樂齡理財、創新思維。小班制、重產出、即學即用。",
  },
};

/* ─── Page ─── */
export default function CoursesPage() {
  return (
    <div className="relative">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-[#1E3A5F] py-20 sm:py-28">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(200,149,61,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,149,61,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#C8953D]/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#C8953D]/3 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C8953D]/20 bg-[#C8953D]/10 px-4 py-1.5 text-sm font-medium text-[#C8953D]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
              </svg>
              課程與工作坊
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              與頂尖講師一起
              <br />
              <span className="text-[#C8953D]">升級你的專業能力</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-white/60 sm:text-lg md:text-xl">
              精選實戰課程，涵蓋 AI 應用、樂齡理財、創新思維
              <br className="hidden sm:block" />
              小班制、重產出、即學即用
            </p>

            {/* Stats */}
            <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-4 sm:gap-8">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-[#C8953D] sm:text-3xl">
                  {workshops.length}
                </p>
                <p className="mt-1 text-xs text-white/50 sm:text-sm">門精選課程</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-[#C8953D] sm:text-3xl">10</p>
                <p className="mt-1 text-xs text-white/50 sm:text-sm">人小班制</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-[#C8953D] sm:text-3xl">100%</p>
                <p className="mt-1 text-xs text-white/50 sm:text-sm">實戰導向</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Course Filters & Grid (Client Component) */}
        <CourseFilters workshops={workshops} />

        {/* ─── Features Section ─── */}
        <section className="mt-20 sm:mt-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              為什麼選擇 solo.tw
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              我們相信最好的學習，來自實作與互動
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="group rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-[#C8953D]/30 hover:shadow-md sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E3A5F]/10">
                <svg className="h-6 w-6 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold">小班制教學</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                每班限額 10 人，確保每位學員都能獲得充分的指導與互動
              </p>
            </div>

            <div className="group rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-[#C8953D]/30 hover:shadow-md sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E3A5F]/10">
                <svg className="h-6 w-6 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.197-3.03A2.03 2.03 0 016 10.218V6.144a1 1 0 01.862-.99 48.108 48.108 0 0113.688.37 1 1 0 01.862.99v4.074a2.03 2.03 0 01-.223 1.922l-5.197 3.03a3 3 0 01-2.985 0zM14.563 18.343l3.484 2.034a1 1 0 001.49-.856V17.43" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold">實戰導向</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                不只教理論，現場動手做。帶著你的問題來，帶著成果走
              </p>
            </div>

            <div className="group rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-[#C8953D]/30 hover:shadow-md sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E3A5F]/10">
                <svg className="h-6 w-6 text-[#1E3A5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold">多元講師陣容</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                匯聚各領域專家，從 AI 應用到創新思維，提供全方位學習體驗
              </p>
            </div>
          </div>
        </section>

        {/* ─── Enterprise Training ─── */}
        <section className="my-20 sm:my-24">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#1E3A5F]/90">
            <div className="grid items-center gap-8 p-8 sm:p-10 md:grid-cols-2 lg:p-12">
              <div>
                <span className="inline-flex items-center rounded-full border border-[#C8953D]/20 bg-[#C8953D]/10 px-3 py-1 text-xs font-medium text-[#C8953D]">
                  企業方案
                </span>
                <h3 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                  企業內訓 / 客製工作坊
                </h3>
                <p className="mt-3 text-base text-white/60 sm:text-lg">
                  為團隊量身打造的培訓方案，涵蓋 AI 應用、創新思維、內容經營等主題
                </p>
                <ul className="mt-5 space-y-3 text-sm text-white/70">
                  <li className="flex items-center gap-2.5">
                    <svg className="h-4 w-4 shrink-0 text-[#C8953D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    根據團隊需求客製內容
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="h-4 w-4 shrink-0 text-[#C8953D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    可選擇線上或實體課程
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="h-4 w-4 shrink-0 text-[#C8953D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    提供課後追蹤與輔導
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
                <p className="text-sm text-white/40">有興趣？歡迎聯繫洽談</p>
                <Button
                  size="lg"
                  className="bg-[#C8953D] text-white hover:bg-[#B8852D]"
                  asChild
                >
                  <a href="mailto:iamvista@gmail.com">聯繫洽談</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Newsletter CTA ─── */}
        <div className="mb-20 text-center sm:mb-24">
          <p className="text-base text-muted-foreground sm:text-lg">
            想在新工作坊上線時第一時間收到通知？
          </p>
          <Button variant="outline" className="mt-4 h-11 px-6 text-base" asChild>
            <Link href="/#newsletter">訂閱電子報</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
