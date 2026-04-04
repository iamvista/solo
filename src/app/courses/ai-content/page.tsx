import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd, courseSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "AI 內容產製系統工作坊｜3 小時實戰工作坊 | solo.tw",
  description:
    "用 Claude Code 建立完整的五層內容產製架構，一份素材自動產出六種格式。3 小時實作，限 16 人小班制。",
  openGraph: {
    title: "AI 內容產製系統工作坊｜3 小時實戰工作坊",
    description:
      "用 Claude Code 建立完整的五層內容產製架構，一份素材自動產出六種格式。3 小時實作，限 16 人小班制。",
    images: [
      {
        url: "/courses/ai-content/og",
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "https://www.solo.tw/courses/ai-content",
  },
};

const REGISTER_URL =
  "https://vista.oen.tw/good/3BsEDb9HN70wF8ZZkq6f6ueOlTW?from=vista&m=cash";

const painPoints = [
  {
    emoji: "😩",
    title: "每換一個平臺就要重寫",
    text: "同一份內容要改成部落格、IG、電子報......每次都從頭來過。",
  },
  {
    emoji: "⏰",
    title: "查資料就花掉大半時間",
    text: "一篇文章光是研究背景、找數據，就要花 1-2 小時。",
  },
  {
    emoji: "🤖",
    title: "AI 寫的東西沒有「你的味道」",
    text: "用 ChatGPT 寫出來的文章，正確但空洞，像在讀維基百科。",
  },
  {
    emoji: "📱",
    title: "一個人要顧好幾個平臺",
    text: "部落格、FB、IG、電子報......每天都在趕內容，但品質越來越差。",
  },
  {
    emoji: "🔧",
    title: "知道 AI 可以幫忙，但不知道怎麼系統化",
    text: "試過各種 AI 工具，但都是片段式使用，沒有串成流程。",
  },
  {
    emoji: "💸",
    title: "付了 AI 訂閱費，卻只用到 10%",
    text: "Claude Pro、ChatGPT Plus 都訂了，但用法還停留在問問題。",
  },
];

const frameworkLayers = [
  {
    icon: "📥",
    name: "輸入層",
    mechanism: "語音記錄靈感 → 自動整理成結構化素材",
    scenario: "日常靈感、會議筆記",
    output: "結構化筆記",
  },
  {
    icon: "🔍",
    name: "研究層",
    mechanism: "自動化網路研究、資料彙整與來源驗證",
    scenario: "趨勢分析、數據佐證",
    output: "研究摘要",
  },
  {
    icon: "✍️",
    name: "產製層",
    mechanism: "AI 輔助起草，套用敘事框架與個人風格",
    scenario: "部落格、長文",
    output: "文章初稿",
  },
  {
    icon: "🎨",
    name: "精修層",
    mechanism: "注入個人故事、語氣微調、去除 AI 味",
    scenario: "品質把關",
    output: "定稿",
  },
  {
    icon: "📤",
    name: "分發層",
    mechanism: "一份內容自動轉換為六種平臺格式",
    scenario: "多平臺經營",
    output: "6 種格式",
  },
];

const deliverables = [
  {
    icon: "🏗️",
    title: "五層架構藍圖",
    desc: "完整的內容產製系統設計圖，回家就能開始建",
  },
  {
    icon: "🔄",
    title: "六格式轉換模板",
    desc: "一份內容自動產出部落格、IG、電子報等六種格式",
  },
  {
    icon: "🎯",
    title: "個人風格檔案",
    desc: "讓 AI 學會你的寫作風格的 prompt 模板",
  },
  {
    icon: "📋",
    title: "研究自動化流程",
    desc: "用 Claude Code 自動完成網路研究的 SOP",
  },
  {
    icon: "⚡",
    title: "MCP 整合指南",
    desc: "串接筆記軟體的實作教學",
  },
  {
    icon: "🗓️",
    title: "內容排程模板",
    desc: "AI 輔助的一週內容規劃表",
  },
];

const schedule = [
  {
    time: "單元一",
    duration: "60 分鐘",
    module: "觀念建構 + 環境設定",
    content:
      "一問一答的天花板在哪裡、Claude Code vs ChatGPT 的差異、五層內容產製架構全覽、環境安裝與設定",
  },
  {
    time: "單元二",
    duration: "50 分鐘",
    module: "實作：從輸入到產出",
    content:
      "研究自動化實作、敘事框架與個人風格注入、用 MCP 串接你的筆記軟體",
  },
  {
    time: "休息",
    duration: "10 分鐘",
    module: "中場休息",
    content: "",
  },
  {
    time: "單元三",
    duration: "50 分鐘",
    module: "實作：精修與分發",
    content:
      "多格式一鍵轉換實作、Skills 系統擴充教學、內容排程與分發策略",
  },
  {
    time: "收尾",
    duration: "10 分鐘",
    module: "Q&A + 成果分享",
    content: "",
  },
];

const targetAudience = [
  {
    icon: "📝",
    text: "經營部落格或自媒體，想提升內容產出效率",
  },
  {
    icon: "🔄",
    text: "每次換平臺就要重寫內容，想要一次搞定",
  },
  {
    icon: "🤖",
    text: "用過 AI 寫文章，但產出缺乏個人風格",
  },
  {
    icon: "💼",
    text: "品牌經營者、顧問、講師，需要穩定產出內容",
  },
  {
    icon: "🔧",
    text: "想學會用 Claude Code 建立自己的工作流",
  },
];

const faqs = [
  {
    q: "需要會寫程式嗎？",
    a: "完全不需要。Claude Code 使用中文自然語言操作，課堂會從零開始帶你設定。",
  },
  {
    q: "需要訂閱 Claude Pro 嗎？",
    a: "建議訂閱 Claude Pro（月費 USD $20），課程中會充分使用。如果還沒訂閱，開課前完成即可。",
  },
  {
    q: "我已經會用 ChatGPT 了，還需要上嗎？",
    a: "這堂課教的不是怎麼問 AI 問題，而是怎麼建立一套系統。即使你已經很熟悉 AI 工具，系統化的方法仍然能大幅提升你的效率。",
  },
  {
    q: "課後有什麼支援？",
    a: "加入專屬學員 LINE 群組，可持續交流與提問。",
  },
  {
    q: "退費政策？",
    a: "開課前 7 天可全額退費；之後可轉讓名額或更換梯次。",
  },
];

const testimonials = [
  {
    name: "Bengo Li",
    headline: "努力，但不費力",
    image: "/images/workshops/testimonial-ai-content.webp",
    imageAlt: "Bengo Li 課程心得",
    highlights: [
      "最讓我印象深刻的，不是那五個自動化流程，而是最一開始的那一步：建立你的風格檔案。",
      "我把自己過去寫的文章丟進去，10 分鐘後它告訴我：你偏好對比結構、你喜歡具體數字、你習慣在最後問讀者一個問題。說實話，比我自己說得還準。",
      "打字只是體力活，思考才是核心價值。",
    ],
  },
  {
    name: "謝克群",
    headline: "如果一篇文章從 11 小時變 30 分鐘，真正改變的是什麼？",
    highlights: [
      "如果這是真的，那未來內容創作者的差距，可能不是努力程度，而是有沒有用對方法。",
      "與其每次叫 AI 重寫文章，不如把你過去寫過的東西全部整理起來，讓 AI 去分析你的風格。",
      "AI 負責流程，人負責觀點。",
    ],
  },
];

export default function AIContentPage() {
  return (
    <>
      <JsonLd data={courseSchema({ name: "AI 內容產製系統工作坊", description: "用 Claude Code 建立完整的五層內容產製架構，一份素材自動產出六種格式", url: "https://www.solo.tw/courses/ai-content", instructor: "Vista", price: 5000, duration: "PT3H", startDate: "2026-05-23", location: "臺北市" })} />
      <JsonLd data={breadcrumbSchema([{ name: "首頁", href: "/" }, { name: "課程", href: "/courses" }, { name: "AI 內容產製系統", href: "/courses/ai-content" }])} />
    <div>
      {/* ====== Hero ====== */}
      <section className="bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/20">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-2 text-sm sm:text-base"
          >
            ✍️ 3 小時實戰工作坊 — 2026 年 5 月 23 日（六）
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            AI 內容產製系統工作坊
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-base text-muted-foreground sm:text-lg">
            一份素材，自動產出六種格式 — 從輸入到多平臺分發一次搞定
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
            你還在用 AI <span className="gradient-text">一問一答</span>嗎？
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            難怪每天都在重複同樣的事。
            <br className="hidden sm:block" />
            <span className="font-semibold text-foreground">
              問題不在 AI 不夠強，而在你沒有建立一套系統，讓 AI 真正為你工作。
            </span>
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <a href="#register">我要報名</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base"
              asChild
            >
              <a href="#curriculum">查看課程內容</a>
            </Button>
          </div>

          {/* Key Stats */}
          <div className="mt-10 flex justify-center gap-8 sm:gap-12">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary sm:text-3xl">3hr</p>
              <p className="mt-1 text-sm text-muted-foreground">實戰工作坊</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary sm:text-3xl">16</p>
              <p className="mt-1 text-sm text-muted-foreground">人小班制</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary sm:text-3xl">5</p>
              <p className="mt-1 text-sm text-muted-foreground">
                層架構
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary sm:text-3xl">6</p>
              <p className="mt-1 text-sm text-muted-foreground">
                種格式
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* ====== Pain Points ====== */}
        <section className="py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            這些情況，是不是每天都在發生？
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            中了三項以上，這堂課就是為你設計的。
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {painPoints.map((point, i) => (
              <Card key={i} className="border-muted">
                <CardContent className="flex items-start gap-3 p-4 sm:p-5">
                  <span className="text-2xl shrink-0">{point.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {point.title}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {point.text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== Core Insight ====== */}
        <section className="bg-foreground text-background py-10 sm:py-12 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-lg font-bold leading-relaxed sm:text-xl">
              <span className="text-primary">
                內容產製的瓶頸，不是寫不出來，而是每次都得從頭開始。
              </span>
              <br />
              <span className="font-normal text-background/80">
                建立一次系統，讓 AI 幫你把一份素材，自動變成六種格式。
              </span>
            </p>
          </div>
        </section>

        {/* ====== 五層內容產製架構 ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            五層內容產製架構
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            這堂課的核心框架——從輸入到分發的完整系統
          </p>

          <div className="mt-8 space-y-3">
            {frameworkLayers.map((layer, i) => (
              <Card key={i} className="border-muted">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3 sm:w-1/4">
                      <span className="text-2xl">{layer.icon}</span>
                      <span className="text-base font-bold text-foreground">
                        {layer.name}
                      </span>
                    </div>
                    <div className="flex-1 grid gap-1 sm:grid-cols-3 text-sm text-muted-foreground">
                      <div>
                        <span className="text-xs font-medium text-foreground/60">
                          做什麼
                        </span>
                        <p>{layer.mechanism}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-foreground/60">
                          適用場景
                        </span>
                        <p>{layer.scenario}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-foreground/60">
                          產出
                        </span>
                        <p>{layer.output}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== What You'll Take Home ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            下課前你會帶走這些
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            不是空有知識，而是下課就能直接上場的工具包。
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((d, i) => (
              <Card key={i} className="border-muted">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{d.icon}</span>
                    <h3 className="text-base font-bold">{d.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{d.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== Curriculum ====== */}
        <section id="curriculum" className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            3 小時課程安排
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            每個單元都有實作，不會空手離開。
          </p>
          <div className="mt-8 space-y-4">
            {schedule.map((s, i) => (
              <Card
                key={i}
                className={
                  s.time === "休息"
                    ? "border-dashed bg-muted/20"
                    : s.time === "收尾"
                      ? "border-primary/20 bg-primary/5"
                      : ""
                }
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className="text-xs whitespace-nowrap"
                      >
                        {s.time}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {s.duration}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-foreground">
                        {s.module}
                      </h3>
                      {s.content && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {s.content}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== Target Audience ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            這堂課適合誰？
          </h2>
          <div className="mx-auto mt-8 max-w-lg space-y-3">
            {targetAudience.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border p-4"
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                <span className="text-base text-muted-foreground">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ====== Instructor ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            關於講師
          </h2>

          <div className="mt-8 grid gap-8 md:grid-cols-5">
            {/* 照片 */}
            <div className="md:col-span-2 flex flex-col items-center gap-4">
              <div className="w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/workshops/instructor-vista.webp"
                  alt="Vista"
                  width={400}
                  height={600}
                  className="w-full object-cover"
                />
              </div>
            </div>

            {/* 簡介 */}
            <div className="md:col-span-3">
              <h3 className="text-2xl font-bold">Vista</h3>
              <p className="mt-1 text-base text-muted-foreground">
                AI 應用培訓師・內容策略顧問
              </p>

              <div className="mt-6 space-y-2.5 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-primary shrink-0">✓</span>
                  <span className="text-muted-foreground">
                    20+ 年數位內容產業經歷
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary shrink-0">✓</span>
                  <span className="text-muted-foreground">
                    前風傳媒產品總監・前數位時代主編
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary shrink-0">✓</span>
                  <span className="text-muted-foreground">
                    著作《ChatGPT 提問課》《慢讀秒懂》等 20 餘本
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary shrink-0">✓</span>
                  <span className="text-muted-foreground">
                    200+ 場 AI 主題演講
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary shrink-0">✓</span>
                  <span className="text-muted-foreground">
                    100+ 場企業內訓
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary shrink-0">✓</span>
                  <span className="text-muted-foreground">
                    18,000+ 電子報訂閱者
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====== Testimonials ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            學員口碑
          </h2>

          <div className="mt-8 space-y-6">
            {/* Testimonial 1 - Bengo Li */}
            <Card className="border-muted">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="md:w-2/5 shrink-0">
                    <Image
                      src="/images/workshops/testimonial-ai-content.webp"
                      alt="Bengo Li 課程心得"
                      width={600}
                      height={400}
                      className="w-full rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-3xl text-primary/30">&ldquo;</span>
                      <div>
                        <p className="text-base font-bold text-foreground">
                          {testimonials[0].name}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-foreground mb-4">
                      {testimonials[0].headline}
                    </p>
                    <div className="space-y-3">
                      {testimonials[0].highlights.map((highlight, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-primary shrink-0 mt-1">&#8226;</span>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {highlight}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 - 謝克群 */}
            <Card className="border-muted">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl text-primary/30">&ldquo;</span>
                  <div>
                    <p className="text-base font-bold text-foreground">
                      {testimonials[1].name}
                    </p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-foreground mb-4">
                  {testimonials[1].headline}
                </p>
                <div className="space-y-3">
                  {testimonials[1].highlights.map((highlight, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-primary shrink-0 mt-1">&#8226;</span>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ====== Difference ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            和傳統 AI 使用方式有什麼不同？
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-medium text-muted-foreground">
                    比較項目
                  </th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">
                    傳統 AI 使用
                  </th>
                  <th className="pb-3 text-left font-medium text-primary">
                    這堂課教的系統
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 font-medium text-foreground">工作方式</td>
                  <td className="py-3 text-muted-foreground">一問一答</td>
                  <td className="py-3 text-foreground">
                    五層架構系統化產出
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-foreground">產出效率</td>
                  <td className="py-3 text-muted-foreground">每篇從頭來過</td>
                  <td className="py-3 text-foreground">一份素材六種格式</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-foreground">內容風格</td>
                  <td className="py-3 text-muted-foreground">AI 味重</td>
                  <td className="py-3 text-foreground">注入個人風格</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-foreground">研究流程</td>
                  <td className="py-3 text-muted-foreground">手動查找</td>
                  <td className="py-3 text-foreground">自動化研究</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-foreground">
                    多平臺分發
                  </td>
                  <td className="py-3 text-muted-foreground">逐一改寫</td>
                  <td className="py-3 text-foreground">一鍵轉換</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ====== Registration ====== */}
        <section id="register" className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            報名資訊
          </h2>

          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3 text-base">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span className="font-medium">2026 年 5 月 23 日（六）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕘</span>
                    <span>9:00–12:00（3 小時，含休息）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>臺北市區（報名後告知地址）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>限 16 名</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💻</span>
                    <span>請攜帶筆電</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">定價</p>
                    <p className="text-lg text-muted-foreground line-through">
                      NT$7,000
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">早鳥優惠</p>
                    <p className="text-2xl font-bold text-primary">NT$5,000</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      省下 NT$2,000
                    </p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      開課前 14 天截止
                    </Badge>
                  </div>
                </div>
              </div>

              {/* 課前準備 */}
              <div className="mt-6 rounded-lg bg-background/80 p-4">
                <p className="text-sm font-medium text-foreground">
                  課前請先準備：
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    Claude Pro 帳號（月費 USD $20）
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    準備 2-3 篇你過去寫的文章
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <Button
                  size="lg"
                  className="h-12 w-full text-base"
                  asChild
                >
                  <a href={REGISTER_URL}>立即報名</a>
                </Button>
              </div>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                點擊報名後將寄送詳細資訊至您的信箱
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ====== Two Choices ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            你有兩種選擇
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Card className="border-muted bg-muted/30">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg font-bold text-muted-foreground">
                  繼續一問一答
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  繼續每次從零開始，每換一個平臺就重寫，花大量時間在重複的事情上。偶爾產出不錯的內容，但無法複製，效率始終上不去。
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg font-bold text-primary">
                  花 3 小時，建立你的內容產製系統
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  讓 AI 學會你的風格，一份素材自動產出六種格式。從此不再從頭開始，把時間留給真正重要的事：思考和創作。
                </p>
                <Button size="sm" className="mt-5 h-9 px-6" asChild>
                  <a href="#register">我要報名 →</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ====== FAQ ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            常見問題
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i}>
                <CardContent className="p-5 sm:p-6">
                  <h3 className="text-base font-semibold text-foreground">
                    Q：{faq.q}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-base text-muted-foreground">
              還有其他問題？歡迎來信詢問。
            </p>
            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <a href="#register">我要報名</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
                asChild
              >
                <a href="mailto:iamvista@gmail.com">寫信給我們</a>
              </Button>
            </div>
          </div>
        </section>

        {/* 返回課程列表 */}
        <div className="border-t pt-10 pb-16 text-center sm:pb-20">
          <Button variant="outline" asChild>
            <Link href="/courses">← 回到所有課程</Link>
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}
