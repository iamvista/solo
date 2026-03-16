"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,140,110,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(168,140,110,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-amber-50/60 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-rose-50/40 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="text-center">
          {/* Top badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-stone-600">
              創始會員招募中 · 限 100 位
            </span>
          </div>

          {/* Main headline */}
          <h1 className="mx-auto max-w-5xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl md:text-6xl lg:text-7xl">
            一人事業的
            <br className="sm:hidden" />
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">
                作業系統
              </span>
              <span className="absolute -bottom-1 left-0 -z-0 h-3 w-full bg-primary/10 sm:-bottom-2 sm:h-4" />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-500 sm:mt-8 sm:text-xl lg:text-2xl">
            不只教你怎麼做，
            <span className="font-medium text-stone-800">直接給你工具去做</span>。
            <br />
            活動報名、名單收集、問卷調查——
            <br className="hidden sm:block" />
            一人公司需要的系統，全部幫你搞定。
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row sm:gap-5">
            <Button
              size="lg"
              asChild
              className="h-14 w-full px-8 text-base font-semibold shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/20 sm:w-auto sm:text-lg"
            >
              <Link href="/diagnose">
                免費事業健檢
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 w-full border-stone-300 px-8 text-base text-stone-700 hover:bg-stone-50 sm:w-auto sm:text-lg"
            >
              <Link href="/growth">了解 SOLO 方法論</Link>
            </Button>
          </div>

          {/* Stats row */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-8 border-t border-stone-200 pt-10 sm:mt-20">
            {[
              { number: "1,000+", label: "事業健檢完成" },
              { number: "18,000+", label: "電子報讀者" },
              { number: "50+", label: "場工作坊" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-stone-900 sm:text-3xl lg:text-4xl">{stat.number}</p>
                <p className="mt-1 text-sm text-stone-500 sm:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Value proposition cards */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:mt-20 sm:grid-cols-3 sm:gap-6">
          {[
            {
              icon: "🛠️",
              title: "工具即服務",
              desc: "活動報名、名單磁鐵、問卷系統，幫你的客戶做生意",
            },
            {
              icon: "📈",
              title: "成長路線圖",
              desc: "SOLO 四階段框架，從定位到規模化，步步有指引",
            },
            {
              icon: "🤝",
              title: "同行者社群",
              desc: "和一人創業者交流、互助，不再單打獨鬥",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:border-stone-300 hover:shadow-md"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-3 text-lg font-semibold text-stone-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
