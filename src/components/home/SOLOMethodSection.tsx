"use client";

import Link from "next/link";
import { useState } from "react";

const stages = [
  {
    letter: "S",
    name: "Set up",
    title: "建立根基",
    question: "你是誰？你要服務誰？",
    description:
      "釐清你的定位、目標客群與獨特價值主張。透過事業健檢找出盲點，用診斷報告規劃下一步。",
    features: ["事業健檢診斷", "定位工作坊", "個人品牌模板"],
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-400",
    emoji: "🎯",
  },
  {
    letter: "O",
    name: "Operate",
    title: "系統營運",
    question: "建立你的獲客與交付系統",
    description:
      "用工具建立系統化的客戶獲取流程。從活動報名、名單收集到內容行銷，打造你的事業引擎。",
    features: ["活動報名系統", "名單磁鐵工具", "部落格 & 電子報"],
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400",
    emoji: "⚙️",
  },
  {
    letter: "L",
    name: "Leverage",
    title: "槓桿放大",
    question: "用工具和自動化放大產出",
    description:
      "當基礎系統跑順後，用進階工具和自動化放大你的影響力。一個人也能有十個人的產出。",
    features: ["問卷系統", "自動化流程", "進階數據分析"],
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    textColor: "text-violet-400",
    emoji: "🚀",
  },
  {
    letter: "O",
    name: "Outgrow",
    title: "超越成長",
    question: "從一人忙碌到一人事業體",
    description:
      "突破個人天花板，建立可擴展的事業模式。透過社群、課程和顧問服務，達到真正的時間自由。",
    features: ["進階課程", "Mastermind 社群", "1-on-1 顧問"],
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-400",
    emoji: "👑",
  },
];

export function SOLOMethodSection() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section className="bg-background py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary sm:text-base">
            SOLO 方法論
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            四個階段，從零到自由
          </h2>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            每個一人事業都經歷這四個階段。找到你目前的位置，我們帶你走向下一步。
          </p>
        </div>

        {/* SOLO letters navigation */}
        <div className="mx-auto mt-12 flex max-w-2xl items-center justify-center gap-2 sm:mt-16 sm:gap-4">
          {stages.map((stage, index) => (
            <button
              key={index}
              onClick={() => setActiveStage(index)}
              className={`group relative flex flex-1 flex-col items-center gap-1 rounded-xl p-3 transition-all sm:gap-2 sm:rounded-2xl sm:p-4 ${
                activeStage === index
                  ? `${stage.bgColor} ${stage.borderColor} border-2`
                  : "border-2 border-transparent hover:bg-muted"
              }`}
            >
              <span
                className={`text-3xl font-black sm:text-4xl lg:text-5xl ${
                  activeStage === index
                    ? `bg-gradient-to-r ${stage.color} bg-clip-text text-transparent`
                    : "text-muted-foreground/40"
                }`}
              >
                {stage.letter}
              </span>
              <span
                className={`text-xs font-medium sm:text-sm ${
                  activeStage === index ? stage.textColor : "text-muted-foreground"
                }`}
              >
                {stage.name}
              </span>
              {/* Connector line */}
              {index < stages.length - 1 && (
                <div className="absolute -right-1.5 top-1/2 hidden h-[2px] w-3 -translate-y-1/2 bg-border sm:-right-3 sm:block sm:w-6" />
              )}
            </button>
          ))}
        </div>

        {/* Active stage detail */}
        <div className="mx-auto mt-8 max-w-4xl sm:mt-12">
          {stages.map((stage, index) => (
            <div
              key={index}
              className={`${activeStage === index ? "block" : "hidden"}`}
            >
              <div className={`rounded-2xl border ${stage.borderColor} ${stage.bgColor} p-6 sm:rounded-3xl sm:p-10`}>
                <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
                  {/* Left: Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{stage.emoji}</span>
                      <div>
                        <h3 className="text-2xl font-bold sm:text-3xl">
                          {stage.title}
                        </h3>
                        <p className={`text-sm font-medium ${stage.textColor} sm:text-base`}>
                          {stage.question}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                      {stage.description}
                    </p>
                  </div>

                  {/* Right: Features */}
                  <div className="sm:w-64">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      核心功能
                    </p>
                    <ul className="space-y-2.5">
                      {stage.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2.5 text-base"
                        >
                          <svg
                            className={`h-5 w-5 flex-shrink-0 ${stage.textColor}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center sm:mt-14">
          <Link
            href="/diagnose"
            className="inline-flex items-center gap-2 text-base font-semibold text-primary transition-colors hover:text-primary/80 sm:text-lg"
          >
            做事業健檢，找出你在哪個階段
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
