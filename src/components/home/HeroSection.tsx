"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <div className="h-[300px] w-[300px] rounded-full bg-primary/10 blur-3xl" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm sm:text-base">
            🚀 專為自由工作者打造的成長平臺
          </Badge>

          {/* Main Headline */}
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            把專業
            <span className="relative">
              <span className="relative z-10 text-primary">變成事業</span>
              <span className="absolute bottom-2 left-0 -z-0 h-3 w-full bg-primary/20 sm:h-4" />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:mt-8 sm:text-xl md:text-2xl">
            你是講師、顧問或教練等自由工作者嗎？
            <br className="sm:hidden" />
            別再單打獨鬥。
            <br />
            用我們的診斷工具找出盲點，用實用資源加速變現。
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row sm:gap-6">
            <Button size="lg" asChild className="h-14 w-full px-8 text-base sm:w-auto sm:text-lg">
              <Link href="/diagnose">
                <svg
                  className="mr-2 h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                  />
                </svg>
                免費診斷我的事業
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 w-full px-8 text-base sm:w-auto sm:text-lg">
              <Link href="/courses">
                探索課程資源
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-col items-center gap-4 sm:mt-16">
            <p className="text-base text-muted-foreground sm:text-lg">
              已有超過 <span className="font-semibold text-foreground">1,000+</span> 位自由工作者使用
            </p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="h-5 w-5 text-yellow-500 sm:h-6 sm:w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-base text-muted-foreground">4.9/5 好評推薦</span>
            </div>
          </div>
        </div>

        {/* Solo Types Preview */}
        <div className="mt-16 sm:mt-24">
          <p className="mb-6 text-center text-base font-medium text-muted-foreground sm:mb-8 sm:text-lg">
            你是哪種類型的 Solo？
          </p>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            {[
              { emoji: "🦁", name: "獅子型", desc: "市場領袖" },
              { emoji: "🦊", name: "狐狸型", desc: "策略高手" },
              { emoji: "🐘", name: "大象型", desc: "穩健專家" },
              { emoji: "🦅", name: "老鷹型", desc: "獨行俠" },
              { emoji: "🐢", name: "烏龜型", desc: "蓄勢待發" },
              { emoji: "🐣", name: "小雞型", desc: "新手起步" },
            ].map((type) => (
              <div
                key={type.name}
                className="flex items-center gap-2 rounded-full border bg-background px-3 py-2.5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md sm:gap-3 sm:px-5 sm:py-3"
              >
                <span className="text-2xl sm:text-3xl">{type.emoji}</span>
                <div className="text-left">
                  <p className="text-sm font-medium sm:text-base">{type.name}</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">{type.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
