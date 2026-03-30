import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MessageCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { CalEmbed } from "@/components/consulting/CalEmbed";

export const metadata: Metadata = {
  title: "1-on-1 諮詢 & 陪跑 | solo.tw",
  description:
    "不知道下一步該怎麼走？一小時的深度對話，幫你理清方向、制定行動計畫。",
};

/**
 * Cal.com 連結設定
 * 請在 Cal.com 建立對應的事件類型後，將連結填入這裡
 * 格式：username/event-type，例如 "vista/consulting"
 * 設為 null 則顯示「來信預約」的備用方案
 */
const CAL_LINK: string | null = "vista/consulting";

const consultingTypes = [
  {
    icon: MessageCircle,
    title: "免費初談",
    duration: "30 分鐘",
    price: "免費",
    isFree: true,
    desc: "不確定適不適合？先聊 30 分鐘，了解你的狀況，看看我能怎麼幫你。零風險、零壓力。",
    includes: ["了解你目前的事業狀況", "初步方向建議", "推薦適合你的下一步"],
  },
  {
    icon: Calendar,
    title: "事業方向諮詢",
    duration: "60 分鐘",
    price: "NT$3,000",
    isFree: false,
    desc: "適合剛起步或正在轉型的一人事業者，幫你釐清定位、找到切入點。",
    includes: ["現況分析與盲點診斷", "個人化行動計畫", "課後 30 天 Email 追蹤"],
  },
  {
    icon: Clock,
    title: "AI 工具導入",
    duration: "90 分鐘",
    price: "NT$5,000",
    isFree: false,
    desc: "針對你的事業場景，手把手帶你設定 AI 工作流，讓你一個人做到一個團隊的產出。",
    includes: ["客製 AI 工作流設定", "工具選擇與串接建議", "設定完成可立即使用"],
  },
  {
    icon: Calendar,
    title: "陪跑教練",
    duration: "60 分鐘 × 4 次",
    price: "NT$10,000",
    isFree: false,
    desc: "為期一個月的持續陪伴，每週一次深度對話，確保你不只有方向，還能落地執行。",
    includes: ["四次深度對話", "每週進度追蹤", "LINE 即時問答支援"],
  },
];

export default function ConsultingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,140,110,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(168,140,110,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              1-on-1 諮詢 & 陪跑
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              先聊聊，不收費
            </h1>
            <p className="mt-4 text-lg text-stone-500 sm:text-xl">
              30 分鐘免費初談，了解你的狀況、看看我能怎麼幫你。
              <br className="hidden sm:block" />
              覺得適合，再選擇付費方案深入合作。
            </p>
          </div>
        </div>
      </section>

      {/* 方案卡片 */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {consultingTypes.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md sm:p-7 ${
                    item.isFree
                      ? "border-primary/30 ring-1 ring-primary/10"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {item.isFree && (
                    <span className="absolute -top-3 right-5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                      推薦先從這裡開始
                    </span>
                  )}
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-stone-400">{item.duration}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-500">
                    {item.desc}
                  </p>

                  {/* 包含內容 */}
                  <div className="mt-4 space-y-2 border-t border-stone-100 pt-4">
                    {item.includes.map((inc) => (
                      <div
                        key={inc}
                        className="flex items-center gap-2 text-sm text-stone-600"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        {inc}
                      </div>
                    ))}
                  </div>

                  <p className={`mt-5 text-2xl font-bold ${item.isFree ? "text-emerald-600" : "text-stone-900"}`}>
                    {item.price}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 預約區塊 */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              預約諮詢時段
            </h2>
            <p className="mt-2 text-base text-stone-500">
              {CAL_LINK
                ? "選擇你方便的時間，30 分鐘免費初談。覺得適合再聊付費方案。"
                : "目前請透過 Email 預約，回覆後會協調時段。"}
            </p>
          </div>

          {CAL_LINK ? (
            /* Cal.com 嵌入模式 */
            <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div style={{ minHeight: 500 }}>
                <CalEmbed calLink={CAL_LINK} />
              </div>
            </div>
          ) : (
            /* 備用：Email 預約 */
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-primary/20 bg-white p-8 text-center shadow-sm sm:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-stone-900">
                來信預約你的諮詢時段
              </h3>
              <p className="mt-2 text-sm text-stone-500">
                請在信中簡述你目前的狀況和想討論的主題，
                <br className="hidden sm:block" />
                我會在 24 小時內回覆確認時段。
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
                <Button size="lg" asChild>
                  <a href="mailto:vista@solo.tw?subject=諮詢預約">
                    預約諮詢
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/diagnose">先做免費健檢</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 常見問題 */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            常見問題
          </h2>

          <div className="mt-10 space-y-6">
            {[
              {
                q: "諮詢是線上還是線下？",
                a: "以 Google Meet 線上進行為主，也可依需求安排臺北線下面談。",
              },
              {
                q: "我還在很前期，適合預約嗎？",
                a: "完全適合。越早釐清方向，越少走冤枉路。建議先做免費事業健檢，帶著結果來諮詢更有效率。",
              },
              {
                q: "和工作坊有什麼不同？",
                a: "工作坊是小班教學特定主題，諮詢是完全針對你的狀況一對一深入討論。兩者互補——工作坊學方法，諮詢解決你的個別問題。",
              },
              {
                q: "如何付款？",
                a: "確認預約後會提供付款連結，支援信用卡和 ATM 轉帳。",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-stone-100 bg-stone-50/50 p-5"
              >
                <h3 className="text-base font-semibold text-stone-900">
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
