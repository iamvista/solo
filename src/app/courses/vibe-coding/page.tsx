import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd, courseSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Vibe Coding 實戰工作坊｜3 小時打造你的第一個銷售頁 | solo.tw",
  description:
    "零基礎、不需要工程師，3 小時學會用 AI 建立個人品牌網站、銷售頁、名單收集頁。限 12 人小班制，現場完成一個可上線的網站。",
  openGraph: {
    title: "Vibe Coding 實戰工作坊｜3 小時打造你的第一個銷售頁",
    description:
      "零基礎、不需要工程師，3 小時學會用 AI 建立個人品牌網站、銷售頁、名單收集頁。限 12 人小班制。",
    images: [
      {
        url: "/courses/vibe-coding/og",
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "https://www.solo.tw/courses/vibe-coding",
  },
};

const REGISTER_URL =
  "https://vista.oen.tw/good/3BsHIWR5mdHHEWQRqx2geNvyv6X?from=vista&m=cash";

const painPoints = [
  {
    emoji: "\u{1F4B0}",
    title: "找人做網站，開口就是 3-5 萬",
    text: "請工程師做一個簡單的個人網站，報價讓你倒退三步。",
  },
  {
    emoji: "\u{1F3A8}",
    title: "Canva、Notion 做不出銷售頁",
    text: "這些工具很好用，但做不出真正能賣東西的頁面。",
  },
  {
    emoji: "\u{1F635}",
    title: "試過 AI 做網站，但搞不定",
    text: "看了教學影片照做，結果卡在一堆錯誤訊息裡。",
  },
  {
    emoji: "\u{1F4A1}",
    title: "有好點子，卻被技術卡住",
    text: "腦中有完整的構想，但不知道怎麼把它變成一個網頁。",
  },
  {
    emoji: "\u{1F9F2}",
    title: "不知道怎麼做名單收集頁",
    text: "想要建立潛在客戶名單，但不知從何下手。",
  },
  {
    emoji: "\u{231B}",
    title: "每次改網站都要等工程師",
    text: "改一個字、換一張圖，都要排隊等，還要額外付費。",
  },
];

const digitalAssets = [
  {
    emoji: "\u{1F310}",
    title: "個人品牌網站",
    price: "NT$50,000-100,000",
  },
  {
    emoji: "\u{1F6D2}",
    title: "課程／服務銷售頁",
    price: "NT$15,000-50,000",
  },
  {
    emoji: "\u{1F9F2}",
    title: "名單收集漏斗",
    price: "NT$10,000-30,000",
  },
  {
    emoji: "\u{1F3AF}",
    title: "互動式測驗",
    price: "NT$20,000-60,000",
  },
  {
    emoji: "\u{1F4CB}",
    title: "活動報名頁",
    price: "NT$8,000-25,000",
  },
  {
    emoji: "\u{1F4BC}",
    title: "作品集／履歷",
    price: "NT$15,000-40,000",
  },
];

const schedule = [
  {
    time: "第一小時",
    duration: "60 分鐘",
    module: "觀念建構 + 環境設定",
    content:
      "AI 開發的邏輯思維、Vibe Coding 工具比較、從想法到雛形的第一個 Prompt",
  },
  {
    time: "第二小時",
    duration: "60 分鐘",
    module: "Vibe Coding 實作",
    content:
      "選擇你的專案（個人網頁／銷售頁／名單收集頁）、即時除錯技巧、設計美感速成",
  },
  {
    time: "第三小時",
    duration: "50 分鐘",
    module: "部署 + 行銷整合",
    content: "一鍵免費部署上線、優化與迭代策略",
  },
  {
    time: "收尾",
    duration: "10 分鐘",
    module: "Q&A + 成果分享",
    content: "",
  },
];

const testimonials = [
  {
    name: "陳建銘",
    role: "創新培訓師",
    batch: "第 1 班",
    quote:
      "Vista 在課堂上用一個多小時就做出一個創新測驗的原型，這個概念非常有趣且市場性十足。",
  },
  {
    name: "Tiffany",
    role: "保險經紀人",
    batch: "第 1 班",
    quote:
      "Vista 老師會一個個指導，課前還有準備教材讓我們預習，大大減輕焦慮感。",
  },
  {
    name: "Serena",
    role: "臺科大博士生",
    batch: "第 1 班",
    quote:
      "身為程式小白，3 小時就做出自己的個人網頁，Vista 老師教學幽默又紮實。",
  },
  {
    name: "張永錫",
    role: "時間管理講師／作家",
    batch: "第 2 班",
    quote:
      "從零開始做出了自己的網頁，現在用 Vibe Coding 製作數位產品，不再需要工程師。",
  },
  {
    name: "JuJu",
    role: "品牌行銷顧問",
    batch: "第 2 班",
    quote:
      "克服了對程式的恐懼，下課後 2 小時就做出品牌介紹頁，還加入了互動功能。",
  },
  {
    name: "陳品蓉",
    role: "律師",
    batch: "第 2 班",
    quote:
      "發現 AI 不只能回答問題，還能做出真正的東西，正在規劃法律諮詢頁面。",
  },
  {
    name: "駱潤生",
    role: "大學講師／保險顧問",
    batch: "第 2 班",
    quote:
      "Vista 的現場 demo 勝過看 100 篇教學文章，正在規劃保險諮詢工具。",
  },
  {
    name: "Cookie",
    role: "音樂老師",
    batch: "第 2 班",
    quote: "完全零基礎，3 小時做出音樂教室網站，CP 值最高的一堂課。",
  },
  {
    name: "Vash",
    role: "按摩師／養生顧問",
    batch: "第 3 班",
    quote: "跟 AI 聊天、把內容放進結構、整理檔案，三步驟就完成了。",
  },
  {
    name: "張天豪醫師",
    role: "顯微根管專科",
    batch: "第 4 班",
    quote: "克服了對新科技的恐懼，上完課就訂閱了 Claude Pro。",
  },
];

const studentWorks = [
  {
    name: "Tiffany 保險網站",
    batch: "第 1 班",
    url: "https://tiffany-insurance.netlify.app",
  },
  {
    name: "Cookie 音樂教室",
    batch: "第 2 班",
    url: "https://hoai.netlify.app",
  },
  {
    name: "陳品蓉律師",
    batch: "第 2 班",
    url: "https://twilightstar.netlify.app",
  },
  {
    name: "Vash 養生顧問",
    batch: "第 3 班",
    url: "https://vash-wellnessadvisor.netlify.app",
  },
  {
    name: "魔法家庭測驗",
    batch: "第 3 班",
    url: "https://magicfamily.netlify.app",
  },
  {
    name: "Miss J 品牌策略",
    batch: "第 3 班",
    url: "https://missj.netlify.app",
  },
  {
    name: "聽力保健",
    batch: "第 3 班",
    url: "https://hearing123.netlify.app",
  },
  {
    name: "Ama 占星",
    batch: "第 3 班",
    url: "https://amayang.netlify.app",
  },
  {
    name: "張天豪顯微根管",
    batch: "第 4 班",
    url: "https://microendo.netlify.app",
  },
  {
    name: "Meiru 個人網站",
    batch: "第 4 班",
    url: "https://2026metropoint.netlify.app",
  },
  {
    name: "鄭立德作家",
    batch: "第 4 班",
    url: "https://2026solider.netlify.app",
  },
  {
    name: "芸如古琴",
    batch: "第 4 班",
    url: "https://guqin20260321.netlify.app",
  },
];

const targetAudience = [
  {
    icon: "\u{1F469}\u200D\u{1F3EB}",
    text: "講師、顧問、教練——需要專業形象網站",
  },
  {
    icon: "\u{1F6CD}\uFE0F",
    text: "品牌主、創業者——需要銷售頁和名單收集",
  },
  {
    icon: "\u270D\uFE0F",
    text: "自媒體創作者——想把內容變成數位產品",
  },
  {
    icon: "\u{1F4BC}",
    text: "上班族——想建立個人品牌或副業",
  },
  {
    icon: "\u{1F393}",
    text: "任何想學會用 AI 建網站的人",
  },
];

const faqs = [
  {
    q: "完全不會寫程式，能上嗎？",
    a: "當然可以！這堂課就是為零基礎的人設計的。你只需要會打字，AI 會幫你寫程式。",
  },
  {
    q: "需要帶什麼？",
    a: "攜帶筆電（Mac 或 Windows 都可以），確保有穩定的網路。課前會提供安裝指南。",
  },
  {
    q: "3 小時真的夠嗎？",
    a: "夠！課堂上會完成一個可上線的網站。課後加入專屬 LINE 社群，有問題可以繼續問。",
  },
  {
    q: "需要訂閱 AI 工具嗎？",
    a: "建議訂閱（Gemini、Claude 或 ChatGPT 擇一），但不是絕對必要。課堂會有示範。",
  },
  {
    q: "退費政策？",
    a: "開課前 7 天可全額退費；之後可轉讓名額或更換梯次。",
  },
];

export default function VibeCodingPage() {
  return (
    <>
      <JsonLd data={courseSchema({ name: "Vibe Coding 實戰工作坊", description: "零基礎，3 小時打造你的第一個銷售頁", url: "https://www.solo.tw/courses/vibe-coding", instructor: "Vista", price: 4000, duration: "PT3H", startDate: "2026-05-09", location: "臺北市" })} />
      <JsonLd data={breadcrumbSchema([{ name: "首頁", href: "/" }, { name: "課程", href: "/courses" }, { name: "Vibe Coding 實戰工作坊", href: "/courses/vibe-coding" }])} />
    <div>
      {/* ====== Hero ====== */}
      <section className="bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/20">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-2 text-sm sm:text-base"
          >
            {"\u{1F4BB}"} 3 小時實戰工作坊 — 第 6 班｜2026 年 5 月 9 日（六）
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            不會寫程式？
            <br />
            <span className="gradient-text">讓 AI 幫你蓋網站</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:mt-6 sm:text-xl">
            不需要工程師、不需要學寫程式——用 AI 把你的想法變成網站。
            <br className="hidden sm:block" />
            <span className="font-semibold text-foreground">
              講師、顧問、品牌主必學的數位資產建置技能。
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
              <p className="text-2xl font-bold text-primary sm:text-3xl">12</p>
              <p className="mt-1 text-sm text-muted-foreground">人小班制</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary sm:text-3xl">6</p>
              <p className="mt-1 text-sm text-muted-foreground">
                種數位資產
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary sm:text-3xl">1</p>
              <p className="mt-1 text-sm text-muted-foreground">
                個成品帶走
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* ====== Pain Points ====== */}
        <section className="py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            這些情況，是不是你的日常？
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
                網站不是工程師的專利，是每個創業者的基本配備。
              </span>
              <br />
              <span className="font-normal text-background/80">
                Vibe Coding 讓你用說話的方式，把想法變成網站。
              </span>
            </p>
          </div>
        </section>

        {/* ====== 什麼是 Vibe Coding？ ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            什麼是 Vibe Coding？
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            由 AI 先驅 Andrej Karpathy 於 2025 年初提出的全新開發方式
          </p>

          <div className="mt-8 mx-auto max-w-2xl space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              核心理念：<span className="font-semibold text-foreground">用自然語言描述需求，AI 自動生成程式碼。</span>你不需要學寫程式，只需要清楚表達你想要什麼。
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Card className="border-muted">
              <CardContent className="p-5 text-center">
                <span className="text-3xl">{"\u{1F6AB}"}</span>
                <h3 className="mt-3 text-base font-bold">不需要寫程式碼</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  會打字就行，用中文告訴 AI 你想要什麼
                </p>
              </CardContent>
            </Card>
            <Card className="border-muted">
              <CardContent className="p-5 text-center">
                <span className="text-3xl">{"\u26A1"}</span>
                <h3 className="mt-3 text-base font-bold">快速迭代</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  3 小時從想法到上線，不用等數週
                </p>
              </CardContent>
            </Card>
            <Card className="border-muted">
              <CardContent className="p-5 text-center">
                <span className="text-3xl">{"\u{1F4BB}"}</span>
                <h3 className="mt-3 text-base font-bold">產出真正的程式碼</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  不是拖拉模板，是 100% 屬於你的網站
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ====== 你能打造的數位資產 ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            你能打造的數位資產
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            學會 Vibe Coding，這些你都能自己做
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {digitalAssets.map((asset, i) => (
              <Card key={i} className="border-muted">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{asset.emoji}</span>
                    <h3 className="text-base font-bold">{asset.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    市場行情{" "}
                    <span className="font-semibold text-foreground">
                      {asset.price}
                    </span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-base font-bold text-primary">
              市場行情合計超過 NT$200,000
            </p>
          </div>
        </section>

        {/* ====== Curriculum ====== */}
        <section id="curriculum" className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            3 小時課程安排
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            從觀念到部署，每個階段都有實作。
          </p>
          <div className="mt-8 space-y-4">
            {schedule.map((s, i) => (
              <Card
                key={i}
                className={
                  s.time === "收尾"
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

        {/* ====== Comparison Table ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            Vibe Coding vs 其他方案
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-medium text-muted-foreground">
                    比較項目
                  </th>
                  <th className="pb-3 text-left font-medium text-primary">
                    Vibe Coding
                  </th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">
                    請工程師
                  </th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">
                    模板工具
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 font-medium text-foreground">費用</td>
                  <td className="py-3 text-foreground">低（AI 訂閱費）</td>
                  <td className="py-3 text-muted-foreground">高（NT$5-10 萬+）</td>
                  <td className="py-3 text-muted-foreground">中等（平臺月費）</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-foreground">速度</td>
                  <td className="py-3 text-foreground">數小時</td>
                  <td className="py-3 text-muted-foreground">數週至數月</td>
                  <td className="py-3 text-muted-foreground">數天</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-foreground">客製化</td>
                  <td className="py-3 text-foreground">高</td>
                  <td className="py-3 text-muted-foreground">最高</td>
                  <td className="py-3 text-muted-foreground">低（受模板限制）</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-foreground">學習門檻</td>
                  <td className="py-3 text-foreground">低（會打字就行）</td>
                  <td className="py-3 text-muted-foreground">無（但溝通成本高）</td>
                  <td className="py-3 text-muted-foreground">中等</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-foreground">維護</td>
                  <td className="py-3 text-foreground">自己能改</td>
                  <td className="py-3 text-muted-foreground">持續付費請人改</td>
                  <td className="py-3 text-muted-foreground">綁定平臺</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-foreground">程式碼所有權</td>
                  <td className="py-3 text-foreground">100% 你的</td>
                  <td className="py-3 text-muted-foreground">看合約</td>
                  <td className="py-3 text-muted-foreground">綁定平臺</td>
                </tr>
              </tbody>
            </table>
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
                數位內容策略家・Vibe Coding 佈道者
              </p>

              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  擁有超過 20 年數位內容產業經歷，從媒體主編到產品總監，長期關注 AI 與內容產業的交匯。2025 年起投入 Vibe Coding 教學，致力於讓非技術背景的人也能用 AI 建立數位資產。
                </p>
              </div>

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
                    Vibe Coding 工作坊已開設 5 班
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====== Student Testimonials ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            學員怎麼說
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            來自前 5 班學員的真實回饋
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-muted">
                <CardContent className="p-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    「{t.quote}」
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {t.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.role}・{t.batch}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== Student Works Gallery ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            學員作品集
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            這些都是學員在工作坊中完成的網站
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {studentWorks.map((work, i) => (
              <Card key={i} className="border-muted">
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {work.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {work.batch}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0" asChild>
                    <a
                      href={work.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      查看 ↗
                    </a>
                  </Button>
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
                    <span>{"\u{1F4C5}"}</span>
                    <span className="font-medium">第 6 班｜2026 年 5 月 9 日（六）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{"\u{1F558}"}</span>
                    <span>9:00–12:00（3 小時）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{"\u{1F4CD}"}</span>
                    <span>
                      臺北市區・捷運站步行可達（報名後告知教室地址）
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{"\u{1F465}"}</span>
                    <span>限 12 名</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{"\u{1F4BB}"}</span>
                    <span>請攜帶筆電（Mac 或 Windows）</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">定價</p>
                    <p className="text-lg text-muted-foreground line-through">
                      NT$6,500
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">早鳥優惠</p>
                    <p className="text-2xl font-bold text-primary">NT$4,000</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      省下 NT$2,500
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
                    建議訂閱 AI 工具（Gemini、Claude 或 ChatGPT）
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    攜帶你想製作的網站內容素材
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
                  繼續等待
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  繼續花錢請人做網站，每次改版都要等、都要付費。好點子一直停在腦中，等到市場被別人搶先。
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg font-bold text-primary">
                  花 3 小時，學會自己蓋網站
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  用 AI 把想法變成網站，從此不再被技術卡住。今天學會，明天就能幫自己、幫客戶做出專業的數位資產。
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
