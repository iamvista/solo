import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "用 AI 建你的個人指揮中心｜一日實作工作坊 | solo.tw",
  description:
    "6 小時實作工作坊 — 用 Claude Code + Obsidian 打造目標管理、知識管理、AI 自動化工作流。帶著能跑的系統回家。",
  openGraph: {
    title: "用 AI 建你的個人指揮中心｜一日實作工作坊 | solo.tw",
    description:
      "6 小時實作工作坊 — 用 Claude Code + Obsidian 打造目標管理、知識管理、AI 自動化工作流。帶著能跑的系統回家。",
  },
};

const REGISTER_URL =
  "https://vista.oen.tw/good/3AnmvRTr81l3LbH0J3UWYvqmwuO?from=vista_good";
const DUO_REGISTER_URL =
  "https://vista.oen.tw/good/3ApCF3xTnBrWxLSSoEiFtbhYYHo?from=vista&m=cash";

const painPoints = [
  {
    emoji: "🎯",
    title: "目標健忘症",
    text: "一月訂的目標，三月就忘了。每天忙到爆，但方向越來越模糊。",
  },
  {
    emoji: "🔍",
    title: "知識失蹤",
    text: "讀過的文章、做過的筆記，要用的時候永遠找不到。",
  },
  {
    emoji: "⏰",
    title: "開工儀式太久",
    text: "每天早上花一小時整理待辦事項，才能開始真正的工作。",
  },
  {
    emoji: "🤖",
    title: "AI 只會聊天",
    text: "ChatGPT 問答很好用，但始終沒有融入你的實際工作流。",
  },
  {
    emoji: "📱",
    title: "工具碎片化",
    text: "Notion、Trello、Google Keep、Apple 提醒事項⋯⋯資料散落各處。",
  },
  {
    emoji: "📝",
    title: "產出不穩定",
    text: "靈感來的時候寫得很好，沒靈感就停更。找不到從輸入到產出的節奏。",
  },
  {
    emoji: "🧩",
    title: "缺一套系統",
    text: "目標、知識、任務、產出⋯⋯沒有一個地方能把它們串起來。",
  },
];

const deliverables = [
  {
    icon: "🎯",
    title: "12 週目標追蹤表",
    items: [
      "3 個核心目標拆解為每週行動",
      "AI 自動產生每日進度提醒",
      "每週方向校準檢查點",
    ],
  },
  {
    icon: "📚",
    title: "個人知識庫",
    items: [
      "完整的 Obsidian 資料庫結構",
      "3 篇互相連結的筆記示範",
      "兩秒內搜到任何一則筆記",
    ],
  },
  {
    icon: "🤖",
    title: "Claude Code AI 助理",
    items: ["完成安裝與個人化設定", "AI 懂你的工作習慣與偏好", "課後立即可用"],
  },
  {
    icon: "⚡",
    title: "2 個自動化腳本",
    items: [
      "課堂完成 1 個 + 課後再送 1 個",
      "打字「開工」就自動整理今日任務",
      "可自行擴充更多自動化",
    ],
  },
];

const schedule = [
  {
    time: "09:00–10:30",
    module: "AI 助理建置",
    content: "安裝 Claude Code，建立個人化 AI 助理設定檔",
    deliverable: "完成安裝 + 個人化設定檔",
  },
  {
    time: "10:45–12:00",
    module: "目標管理系統",
    content: "用 AI 釐清 3 個核心目標，拆解為每週可執行行動",
    deliverable: "12 週目標追蹤表",
  },
  {
    time: "13:00–14:15",
    module: "知識管理系統",
    content: "在 Obsidian 建立可搜尋的個人知識庫，串連筆記脈絡",
    deliverable: "個人知識庫（完整結構 + 3 篇互連筆記）",
  },
  {
    time: "14:30–15:30",
    module: "自動化工作流",
    content: "從三種情境任選一個自動化：每日任務整理 / 會議準備 / 內容主題推薦",
    deliverable: "1 個可運行的自動化腳本",
  },
  {
    time: "15:30–16:00",
    module: "系統整合",
    content: "四個模組串接，跑通完整工作流，現場驗證",
    deliverable: "完整的個人指揮中心，即刻可用",
  },
];

const targetAudience = [
  { icon: "💼", text: "自由工作者 — 同時管理多個客戶、財務、接案開發" },
  { icon: "✍️", text: "內容創作者 — 想穩定產出，不再靠靈感吃飯" },
  { icon: "📊", text: "知識工作者 — 大量資訊、頻繁會議、資料散落各處" },
  { icon: "🤖", text: "AI 使用者 — 覺得「AI 不就這樣？」缺少工作流整合" },
  { icon: "📱", text: "工具收集者 — 裝了一堆 App，工作還是一團亂" },
  { icon: "🔰", text: "程式零基礎 — Claude Code 看得懂中文，不需要會寫程式" },
];

const faqs = [
  {
    q: "需要會寫程式嗎？",
    a: "完全不需要。Claude Code 看得懂中文指令，你只需要打字就能操作。",
  },
  {
    q: "課前需要準備什麼？",
    a: "攜帶筆電（Mac 或 Windows）、事先安裝 Obsidian（免費）、準備 Claude 帳號（建議 Pro 方案，月費約 $20 美元）。",
  },
  {
    q: "上完課帶走的是什麼？",
    a: "不是筆記或講義，而是一套「能跑的系統」— 目標追蹤表、知識庫、AI 助理設定、自動化腳本，全部在你的電腦上可以立即使用。",
  },
  {
    q: "課後每月要花多少錢維持？",
    a: "Obsidian 免費，Claude Pro 月費約 $20 美元。整套系統的維持成本每月不到 700 元台幣。",
  },
  {
    q: "和線上 AI 教學有什麼不同？",
    a: "線上教學通常教你單一工具怎麼用，這堂課教你如何把不同工具串成一套系統。你帶走的不是知識，是一個能跑的工作流。",
  },
];

const beliefs = [
  {
    myth: "AI 不就是聊天機器人？",
    answer:
      "ChatGPT 是對話框，問完還是要自己動手。Claude Code 完全不同——它直接讀你電腦裡的檔案，幫你執行任務、管理專案。",
    quote: "它不只是我的策略夥伴，也是我的執行秘書。",
    quoter: "林鼎倫，品牌策略總監",
  },
  {
    myth: "我不是工程師，學得會嗎？",
    answer:
      "Claude Code 看得懂中文，你只需要打字。工作坊全程手把手帶著做，不需要任何程式背景。",
    quote:
      "我是臨床心理師，從覺得「不可能學得會」，到現在用一成的時間完成拖了大半年的雜事。",
    quoter: "劉子維，臨床心理師",
  },
  {
    myth: "6 小時真的學得會嗎？",
    answer:
      "這不是講座，是實作工作坊。每個模組都有明確產出——你帶走的是能跑的系統，不是筆記。",
    quote: null,
    quoter: null,
  },
];

const valueStack = [
  {
    item: "AI 工作流顧問 1 對 1 諮詢 6 小時",
    reference: "市場行情 NT$3,000–5,000/hr",
    value: "NT$18,000–30,000",
  },
  {
    item: "知識管理系統建置（參考 Ideaverse Pro 定價）",
    reference: "Nick Milo 課程售價 US$299",
    value: "≈ NT$9,700",
  },
  {
    item: "Obsidian 模板 + 2 個自動化腳本",
    reference: "市場模板包價格",
    value: "NT$3,000–5,000",
  },
  {
    item: "課後社群 + 電子報持續更新",
    reference: "",
    value: "持續價值",
  },
];

export default function AICommandCenterPage() {
  return (
    <div>
      {/* ====== 1. Hero — Hook ====== */}
      <section className="bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-2 text-sm sm:text-base"
          >
            🚀 一日實作工作坊 — 2026/5/16（六）
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            你每天花多少時間
            <br />
            才真正
            <span className="gradient-text">開始工作</span>？
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:mt-6 sm:text-xl">
            整理待辦、翻找資料、回覆訊息⋯⋯一小時就過去了。
            <br className="hidden sm:block" />
            <span className="font-semibold text-foreground">
              如果 AI 能在 3 分鐘內幫你搞定這些呢？
            </span>
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <a href="#register">立即報名</a>
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
              <p className="text-2xl font-bold text-primary sm:text-3xl">6hr</p>
              <p className="mt-1 text-sm text-muted-foreground">全天實作</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary sm:text-3xl">20</p>
              <p className="mt-1 text-sm text-muted-foreground">人限額</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary sm:text-3xl">4</p>
              <p className="mt-1 text-sm text-muted-foreground">套系統帶回家</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary sm:text-3xl">0</p>
              <p className="mt-1 text-sm text-muted-foreground">程式基礎要求</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* ====== 2. Pain Points — 痛點 ====== */}
        <section className="py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            這些場景，是不是每天都在上演？
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            如果你中了三項以上，這堂課就是為你設計的。
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

        {/* ====== 3. Amplify Pain — 放大痛感 ====== */}
        <section className="border-t py-14 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-bold sm:text-2xl">
              更痛的是——你已經試過很多方法了
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                你裝過 Notion、試過 Trello、研究過各種生產力 App。
                <br className="hidden sm:block" />
                你看過 YouTube 教學，甚至問過 ChatGPT 要怎麼安排一天的工作。
              </p>
              <p>
                但工具越裝越多，資料越來越散。
                <br className="hidden sm:block" />
                問題從來沒有真正被解決——因為
                <span className="font-semibold text-foreground">
                  工具不會自己變成系統
                </span>
                。
              </p>
            </div>
            <p className="mt-6 text-lg font-semibold text-foreground">
              你缺的不是另一個工具，是
              <span className="text-primary">一套能串起來的系統</span>。
            </p>
          </div>
        </section>

        {/* ====== 4. Origin Story ====== */}
        <section className="border-t py-14 sm:py-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              我搬了五次家，才學會打包
            </h2>
            <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                我搬過五次家。前四次，都是把東西一件件搬上車，到了新家再一件件擺好。每次都累得半死，每次都覺得「下次會更快」——但從來沒有。
              </p>
              <p>
                直到第五次，我才學會：
                <span className="font-semibold text-foreground">
                  先分類、先打包、先建立系統，搬起來才會快。
                </span>
              </p>
              <p>
                經營生產力工具也是一樣。一個個裝、一個個學，但從來沒有人教你怎麼把它們「串成一套系統」。
              </p>
              <p>
                直到我遇見余文皓。他用 Claude Code + Obsidian 同時管理 5
                個產品線，從目標規劃、知識整理到任務執行，全部串在一起。我看到的時候心想：
                <span className="font-semibold text-foreground">
                  原來有人已經跑通了。
                </span>
              </p>
              <p>
                我們花了三個月反覆測試、踩坑、優化，把這套方法濃縮成
                <span className="font-semibold text-foreground">
                  {" "}
                  6 小時的實作工作坊
                </span>
                ——讓你不用像我們一樣走冤枉路。
              </p>
            </div>

            {/* Epiphany Bridge — 劉子維見證 */}
            <Card className="mt-8 border-primary/20 bg-primary/5">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4 text-2xl leading-none text-primary/30">
                  &ldquo;
                </div>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  我是臨床心理師，聽到「你也可以用 Claude Code
                  建自己的工作流系統」的時候，心裡想你在開我玩笑吧？結果在余老師手把手的引導下，我從覺得「這種東西我不可能學得會」，到現在
                  <span className="font-semibold text-foreground">
                    用一成的時間完成拖了大半年的雜事，剩下九成拿來思考品牌和產品
                  </span>
                  。
                </p>
                <div className="mt-5 flex items-center gap-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/images/workshops/testimonial-jack.webp"
                      alt="劉子維"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">劉子維</p>
                    <p className="text-xs text-muted-foreground">
                      臨床心理師・暖流人心規劃顧問 執行長
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ====== 5. Break 3 Beliefs — 解除疑慮 ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            你可能還在猶豫⋯⋯
          </h2>
          <div className="mt-8 space-y-5">
            {beliefs.map((b, i) => (
              <Card key={i}>
                <CardContent className="p-5 sm:p-6">
                  <p className="text-base font-semibold text-foreground">
                    ❓「{b.myth}」
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                    {b.answer}
                  </p>
                  {b.quote && (
                    <div className="mt-3 rounded-lg bg-muted/50 px-4 py-3">
                      <p className="text-sm italic text-muted-foreground">
                        「{b.quote}」
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground/70">
                        — {b.quoter}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== 6. Solution + Vision — 解法願景 ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            上完課後，你的早晨會變成這樣
          </h2>
          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-4 text-base">
                <p className="text-lg font-medium text-foreground text-center">
                  打開電腦 → 輸入「開工」→ AI 自動幫你：
                </p>
                <div className="mx-auto max-w-md space-y-2.5 mt-6">
                  {[
                    "回顧昨天的進度",
                    "拉出本週的目標",
                    "掃描收件匣",
                    "查看行事曆",
                    "整理今天的工作清單",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-muted-foreground"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {i + 1}
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-lg font-semibold text-primary mt-6">
                  全部在 3 分鐘內完成。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 四大帶走成果 */}
          <h3 className="mt-12 text-center text-lg font-bold sm:text-xl">
            你會帶走的 4 套系統
          </h3>
          <p className="mt-3 text-center text-base text-muted-foreground">
            不是筆記、不是講義，是能在你電腦上跑的完整系統。
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {deliverables.map((d, i) => (
              <Card key={i} className="border-muted">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{d.icon}</span>
                    <h3 className="text-lg font-bold">{d.title}</h3>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {d.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-0.5 text-primary shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ====== 7. Curriculum — 課程時間表 ====== */}
        <section id="curriculum" className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            6 小時課程安排
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            每個模組都有明確產出，不會空手離開。
          </p>
          <div className="mt-8 space-y-4">
            {schedule.map((s, i) => (
              <Card
                key={i}
                className={
                  i === schedule.length - 1
                    ? "border-primary/20 bg-primary/5"
                    : ""
                }
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="shrink-0">
                      <Badge
                        variant="outline"
                        className="font-mono text-xs whitespace-nowrap"
                      >
                        {s.time}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-foreground">
                        {s.module}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {s.content}
                      </p>
                      <div className="mt-2 flex items-start gap-1.5">
                        <span className="text-primary text-sm shrink-0">→</span>
                        <span className="text-sm font-medium text-foreground">
                          {s.deliverable}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>10:30–10:45 上午茶歇｜12:00–13:00 午餐｜14:15–14:30 下午茶歇</p>
          </div>
        </section>

        {/* ====== 8. Target Audience — 適合誰 ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            這堂課適合誰？
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            不需要任何程式基礎。符合以下任一項就適合參加。
          </p>
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

        {/* ====== 9. Instructors — 講師 ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            兩位講師聯手授課
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            一位懂內容策略，一位懂 AI 工作流。你兩個都學到。
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {/* Vista */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/images/workshops/instructor-vista.webp"
                      alt="Vista"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Vista</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      內容策略｜個人品牌經營
                    </p>
                  </div>
                </div>
                <div className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-primary shrink-0">✓</span>
                    <span>vista.tw 創辦人</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary shrink-0">✓</span>
                    <span>電子報訂閱者超過 16,000 人</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary shrink-0">✓</span>
                    <span>出版超過 20 本書</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary shrink-0">✓</span>
                    <span>200+ 場培訓與演講</span>
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">
                  擅長把知識轉化為有影響力的內容與行動方案。
                </p>
              </CardContent>
            </Card>

            {/* 余文皓 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/images/workshops/instructor-wenhao.webp"
                      alt="余文皓"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">余文皓</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      AI 工作流設計｜全端開發
                    </p>
                  </div>
                </div>
                <div className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-primary shrink-0">✓</span>
                    <span>15 年科技業經驗（工程師→PM→數據分析）</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary shrink-0">✓</span>
                    <span>Minerva University 碩士</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary shrink-0">✓</span>
                    <span>目前同時經營 5 個產品，全靠這套系統</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary shrink-0">✓</span>
                    <span>多個專案月流量超過 60,000，Google 排名前三</span>
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">
                  每天用這套系統管理多產品線的工作流。
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ====== 10. Value Stack — 價值堆疊 ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            這些東西加起來值多少？
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            用可查證的市場行情算給你看
          </p>

          <div className="mt-8 space-y-3">
            {valueStack.map((v, i) => (
              <div
                key={i}
                className="flex flex-col gap-1 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {v.item}
                  </p>
                  {v.reference && (
                    <p className="text-xs text-muted-foreground">
                      {v.reference}
                    </p>
                  )}
                </div>
                <p className="text-base font-semibold text-foreground sm:text-right">
                  {v.value}
                </p>
              </div>
            ))}
            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">合計市場價值</p>
              <p className="text-2xl font-bold text-primary">超過 NT$30,000</p>
            </div>
          </div>

          <p className="mt-6 text-center text-lg font-semibold text-foreground">
            我們不打算收你四萬。
            <br />
            <span className="text-muted-foreground text-base font-normal">
              往下看報名方案 ↓
            </span>
          </p>
        </section>

        {/* ====== 11. Testimonials — 見證 ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            學員怎麼說
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            來自不同領域的真實回饋
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {/* 林鼎倫 */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-5 text-3xl leading-none text-primary/20">
                  &ldquo;
                </div>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  做品牌策略，手上永遠同時跑好幾個專案，以前進度散在不同工具裡，靠自己搬來搬去，常常漏掉東西。我用過
                  ChatGPT，但它就是另一個聊天視窗，問完還是要自己動手。Claude
                  Code 完全不同 ——
                  它直接讀我電腦裡的檔案，跟我討論策略、規劃排程，然後直接幫我執行。
                </p>
                <p className="mt-3 text-[15px] font-medium text-foreground">
                  它不只是我的策略夥伴，也是我的執行秘書。這才是 AI 該有的樣子。
                </p>
                <div className="mt-6 flex items-center gap-4 border-t pt-5">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/images/workshops/testimonial-dinglun.webp"
                      alt="林鼎倫"
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">林鼎倫</p>
                    <p className="text-xs text-muted-foreground">
                      卡佶特品牌策略有限公司 品牌總監
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 劉子維 — 精華版 */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-5 text-3xl leading-none text-primary/20">
                  &ldquo;
                </div>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  我從覺得「這種東西我不可能學得會」，到現在用一成的時間完成拖了大半年的雜事，剩下九成拿來思考品牌和產品。
                </p>
                <p className="mt-3 text-[15px] font-medium text-foreground">
                  用 AI 打造自己的工作流，才是真正的改變。
                </p>
                <div className="mt-6 flex items-center gap-4 border-t pt-5">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/images/workshops/testimonial-jack.webp"
                      alt="劉子維"
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">劉子維</p>
                    <p className="text-xs text-muted-foreground">
                      臨床心理師・暖流人心規劃顧問 執行長
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ====== 12. FAQ ====== */}
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
        </section>

        {/* ====== 13. Registration — 報名資訊 ====== */}
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
                    <span className="font-medium">2026/5/16（六）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕘</span>
                    <span>9:00–16:00（含休息與午餐）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>臺北市區・捷運站步行可達（報名後告知地址）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>限 20 名</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💻</span>
                    <span>請攜帶筆電（Mac 或 Windows）</span>
                  </div>
                  <p className="pl-7 text-sm text-muted-foreground">
                    含午餐餐盒與咖啡
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">原價</p>
                    <p className="text-lg text-muted-foreground line-through">
                      NT$12,800
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">定價</p>
                    <p className="text-xl font-semibold text-foreground">
                      NT$9,800
                    </p>
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
                    安裝 Obsidian（免費）
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    準備 Claude 帳號（建議 Pro 方案，月費 $20 USD）
                  </li>
                </ul>
              </div>

              {/* 方案選擇 */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* 早鳥方案 */}
                <div className="flex flex-col rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-primary">
                      🔥 早鳥優惠（4 月 10 日前）
                    </p>
                    <p className="mt-1 text-3xl font-bold text-primary">
                      NT$6,000
                    </p>
                    <Badge variant="outline" className="mt-1.5 text-xs">
                      省下 NT$6,800
                    </Badge>
                    <p className="mt-2 text-sm text-muted-foreground">
                      單人報名
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="mt-auto h-11 w-full text-base"
                    asChild
                  >
                    <a href={REGISTER_URL}>立即報名</a>
                  </Button>
                </div>

                {/* 雙人同行方案 */}
                <div className="flex flex-col rounded-xl border-2 border-amber-500/30 bg-amber-50/50 p-5 dark:bg-amber-950/20">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                      👥 雙人同行
                    </p>
                    <p className="mt-1 text-3xl font-bold text-amber-700 dark:text-amber-400">
                      NT$10,800
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-1.5 border-amber-300 text-xs text-amber-700 dark:text-amber-400"
                    >
                      平均每人 NT$5,400
                    </Badge>
                    <p className="mt-2 text-sm text-muted-foreground">
                      兩人一起報名更划算
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="mt-auto h-11 w-full border-amber-500/30 bg-amber-600 text-base text-white hover:bg-amber-700"
                    asChild
                  >
                    <a href={DUO_REGISTER_URL}>雙人報名</a>
                  </Button>
                </div>
              </div>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                點擊報名後將寄送詳細資訊至您的信箱
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 返回課程列表 */}
        <div className="border-t pt-10 pb-16 text-center sm:pb-20">
          <Button variant="outline" asChild>
            <Link href="/courses">← 回到所有課程</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
