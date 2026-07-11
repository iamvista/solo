import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Circle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "開發藍圖 | solo.tw",
  description:
    "solo.tw 的功能開發計畫與進度。已完成、進行中和規劃中的功能一覽。",
  alternates: { canonical: "https://www.solo.tw/roadmap" },
};

type ItemStatus = "done" | "in-progress" | "planned";

interface RoadmapItem {
  title: string;
  desc: string;
  status: ItemStatus;
}

interface RoadmapPhase {
  quarter: string;
  title: string;
  items: RoadmapItem[];
}

const statusConfig: Record<
  ItemStatus,
  { icon: typeof CheckCircle2; label: string; color: string }
> = {
  done: { icon: CheckCircle2, label: "已完成", color: "text-emerald-500" },
  "in-progress": { icon: Clock, label: "進行中", color: "text-amber-500" },
  planned: { icon: Circle, label: "規劃中", color: "text-stone-300" },
};

const roadmap: RoadmapPhase[] = [
  {
    quarter: "2026 Q1",
    title: "基礎建設",
    items: [
      { title: "SOLO 事業健檢診斷工具", desc: "7 題快速版 + 18 題完整版，五大維度分析", status: "done" },
      { title: "部落格 & 電子報系統", desc: "Markdown 文章、標籤篩選、Substack 同步", status: "done" },
      { title: "活動報名管理系統", desc: "多票種、候補、確認信、CSV 匯出", status: "done" },
      { title: "課程頁面 & 工作坊列表", desc: "分類篩選、精選課程、講師資訊", status: "done" },
      { title: "會員系統 & 遊戲化等級", desc: "註冊登入、經驗值、SOLO 四階段", status: "done" },
      { title: "名單磁鐵系統", desc: "建立落地頁、收集 Email、自動寄送", status: "done" },
    ],
  },
  {
    quarter: "2026 Q2",
    title: "商業化 & 服務上線",
    items: [
      { title: "首頁改版（服務導向）", desc: "從平臺展示轉為個人品牌服務入口", status: "done" },
      { title: "PAYUNi 金流串接", desc: "信用卡、ATM、超商付款，訂單管理", status: "done" },
      { title: "Cal.com 諮詢預約嵌入", desc: "諮詢預約、Google Meet 整合", status: "done" },
      { title: "定價頁 & 諮詢頁", desc: "開站優惠定價、FAQ、服務方案完整呈現", status: "done" },
      { title: "SEO & AEO 基礎建設", desc: "Sitemap、robots.txt、JSON-LD、Person schema", status: "done" },
      { title: "全站安全強化", desc: "付款驗證、rate limiting、CSP headers", status: "done" },
      { title: "線上課程平臺上架", desc: "Vibe Coding 實戰課程，評估第三方平臺與自建", status: "in-progress" },
      { title: "數位產品販售", desc: "Notion 模板、Prompt 工具包、PAYUNi 付款", status: "in-progress" },
    ],
  },
  {
    quarter: "2026 Q3",
    title: "規模化 & 社群",
    items: [
      { title: "付費社群 / 會員訂閱", desc: "月費制社群、專屬內容、Mastermind 小組", status: "planned" },
      { title: "企業內訓專頁", desc: "客製方案、案例展示、線上報價", status: "planned" },
      { title: "課程進度追蹤", desc: "學員儀表板、完成率、證書", status: "planned" },
      { title: "問卷調查系統", desc: "課後問卷、市場調查、NPS 評分", status: "planned" },
    ],
  },
  {
    quarter: "2026 Q4",
    title: "自動化 & 被動收入",
    items: [
      { title: "自動化銷售漏斗", desc: "從訂閱 → 免費資源 → 付費課程的自動化流程", status: "planned" },
      { title: "聯盟行銷系統", desc: "推薦分潤、追蹤連結", status: "planned" },
      { title: "AI 個人化推薦", desc: "根據健檢結果推薦適合的課程和服務", status: "planned" },
      { title: "多語言支援（英文）", desc: "核心頁面英文化，拓展國際市場", status: "planned" },
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white py-14 sm:py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,140,110,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(168,140,110,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Roadmap
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              開發藍圖
            </h1>
            <p className="mt-4 text-lg text-stone-500">
              solo.tw 正在持續進化。這是我們的功能開發計畫與目前進度。
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative space-y-12 pl-8 before:absolute before:left-3 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-stone-200 sm:space-y-16">
            {roadmap.map((phase) => {
              const doneCount = phase.items.filter(
                (i) => i.status === "done"
              ).length;
              const progress = Math.round(
                (doneCount / phase.items.length) * 100
              );
              return (
                <div key={phase.quarter} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-8 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-white">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>

                  {/* Phase header */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                      {phase.quarter}
                    </span>
                    <h2 className="text-xl font-bold text-stone-900">
                      {phase.title}
                    </h2>
                    <span className="text-sm text-stone-400">
                      {progress}% 完成
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Items */}
                  <div className="mt-5 space-y-3">
                    {phase.items.map((item) => {
                      const config = statusConfig[item.status];
                      const Icon = config.icon;
                      return (
                        <div
                          key={item.title}
                          className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
                            item.status === "done"
                              ? "border-emerald-100 bg-emerald-50/30"
                              : item.status === "in-progress"
                                ? "border-amber-100 bg-amber-50/30"
                                : "border-stone-100 bg-stone-50/30"
                          }`}
                        >
                          <Icon
                            className={`mt-0.5 h-5 w-5 shrink-0 ${config.color}`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-stone-900">
                                {item.title}
                              </p>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  item.status === "done"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : item.status === "in-progress"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-stone-100 text-stone-500"
                                }`}
                              >
                                {config.label}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-stone-500">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-stone-50 to-stone-100 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-stone-900">
            想要什麼功能？
          </h2>
          <p className="mt-3 text-base text-stone-500">
            訂閱電子報第一時間收到新功能上線通知，或直接告訴我你的需求。
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <a
                href="https://iamvista.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                訂閱電子報
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-stone-300">
              <a href="mailto:iamvista@gmail.com?subject=solo.tw 功能建議">
                提交功能建議
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
