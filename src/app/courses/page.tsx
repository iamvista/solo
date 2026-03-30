import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { workshops } from "@/lib/workshops";
import CourseFilters from "./CourseFilters";
import { ArrowRight, Users, Sparkles, Target, Mail } from "lucide-react";
import { SOCIAL_PROOF } from "@/lib/constants";

export const metadata: Metadata = {
  title: "課程與工作坊 | solo.tw",
  description:
    "精選實戰課程與工作坊，涵蓋 AI 應用、樂齡理財、創新思維。小班制、重產出、即學即用。",
  openGraph: {
    title: "課程與工作坊 | solo.tw",
    description:
      "精選實戰課程與工作坊，涵蓋 AI 應用、樂齡理財、創新思維。小班制、重產出、即學即用。",
  },
  alternates: {
    canonical: "https://www.solo.tw/courses",
  },
};

/* ─── Page ─── */
export default function CoursesPage() {
  return (
    <div className="relative">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white py-16 sm:py-20 lg:py-24">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,140,110,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(168,140,110,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-amber-50/60 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-rose-50/40 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-stone-600">
                {workshops.filter((w) => w.status === "open").length} 門課程開放報名中
              </span>
            </div>

            <h1 className="mx-auto max-w-4xl text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl md:text-5xl lg:text-6xl">
              小班制實戰課程
              <br />
              <span className="text-primary">即學即用</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-stone-500 sm:text-lg md:text-xl">
              不只教理論，現場動手做。帶著你的問題來，帶著成果走。
            </p>

            {/* Stats */}
            <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-stone-900 sm:text-3xl">
                  {workshops.length}
                </p>
                <p className="mt-1 text-xs text-stone-500 sm:text-sm">
                  門精選課程
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-stone-900 sm:text-3xl">
                  10-20
                </p>
                <p className="mt-1 text-xs text-stone-500 sm:text-sm">
                  人小班制
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-stone-900 sm:text-3xl">
                  {SOCIAL_PROOF.workshopCount}
                </p>
                <p className="mt-1 text-xs text-stone-500 sm:text-sm">
                  場已舉辦
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Course Filters & Grid (Client Component) */}
        <CourseFilters workshops={workshops} />

        {/* ─── Why Choose Us ─── */}
        <section className="mt-20 sm:mt-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              為什麼選這裡
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              我們相信最好的學習，來自實作與互動
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3 sm:gap-8">
            {[
              {
                icon: Users,
                title: "小班制教學",
                desc: "每班限額 10-20 人，確保每位學員都能獲得充分的指導與互動。",
              },
              {
                icon: Target,
                title: "實戰導向",
                desc: "不只教理論，現場動手做。帶著你的問題來，帶著成果走。",
              },
              {
                icon: Sparkles,
                title: "多元講師陣容",
                desc: "匯聚各領域專家，從 AI 應用到創新思維，提供全方位學習體驗。",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:border-stone-300 hover:shadow-md sm:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── Enterprise Training ─── */}
        <section className="my-20 sm:my-24">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-900 to-stone-800">
            <div className="grid items-center gap-8 p-8 sm:p-10 md:grid-cols-2 lg:p-12">
              <div>
                <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-400">
                  企業方案
                </span>
                <h3 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                  企業內訓 / 客製工作坊
                </h3>
                <p className="mt-3 text-base text-stone-400 sm:text-lg">
                  為團隊量身打造的培訓方案，涵蓋 AI 應用、創新思維、內容經營等主題。
                </p>
                <ul className="mt-5 space-y-3 text-sm text-stone-300">
                  {[
                    "根據團隊需求客製內容",
                    "可選擇線上或實體課程",
                    "提供課後追蹤與輔導",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <svg
                        className="h-4 w-4 shrink-0 text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
                <p className="text-sm text-stone-500">有興趣？歡迎聯繫洽談</p>
                <Button
                  size="lg"
                  asChild
                  className="bg-amber-400 text-stone-900 hover:bg-amber-500"
                >
                  <a href="mailto:iamvista@gmail.com?subject=企業內訓洽詢">
                    聯繫洽談
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Newsletter CTA ─── */}
        <div className="mb-20 text-center sm:mb-24">
          <Mail className="mx-auto h-8 w-8 text-stone-300" />
          <p className="mt-3 text-base text-stone-500 sm:text-lg">
            想在新工作坊上線時第一時間收到通知？
          </p>
          <Button
            variant="outline"
            className="mt-4 h-11 border-stone-300 px-6 text-base"
            asChild
          >
            <a
              href="https://iamvista.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              訂閱電子報
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
