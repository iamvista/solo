"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background grid */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(230,57,70,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(230,57,70,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="text-center">
          {/* Top badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm text-slate-300">
              創始會員招募中 · 限 100 位
            </span>
          </div>

          {/* Main headline */}
          <h1 className="mx-auto max-w-5xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            一人事業的
            <br className="sm:hidden" />
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">
                作業系統
              </span>
              <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-gradient-to-r from-primary to-rose-400 sm:-bottom-2 sm:h-1" />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:mt-8 sm:text-xl lg:text-2xl">
            不只教你怎麼做，
            <span className="text-white font-medium">直接給你工具去做</span>。
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
              className="h-14 w-full bg-gradient-to-r from-primary to-rose-500 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 sm:w-auto sm:text-lg"
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
              className="h-14 w-full border-white/20 bg-white/5 px-8 text-base text-white backdrop-blur-sm hover:bg-white/10 hover:text-white sm:w-auto sm:text-lg"
            >
              <Link href="/growth">了解 SOLO 方法論</Link>
            </Button>
          </div>

          {/* Stats row */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-8 border-t border-white/10 pt-10 sm:mt-20">
            {[
              { number: "1,000+", label: "事業健檢完成" },
              { number: "18,000+", label: "電子報讀者" },
              { number: "50+", label: "場工作坊" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{stat.number}</p>
                <p className="mt-1 text-sm text-slate-400 sm:text-base">{stat.label}</p>
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
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
