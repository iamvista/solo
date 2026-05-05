import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd, courseSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "讓主管與客戶更容易點頭的 AI 提案亮點實戰課｜2026/6/13 臺北 | solo.tw",
  description:
    "你的提案不是寫得不夠好，而是還沒找到讓對方點頭的理由。一天 6 小時，用 AI 把『沒亮點』變成『非做不可』，現場完成一份你下週就要交的提案。限 16 名小班制。",
  openGraph: {
    title: "讓主管與客戶更容易點頭的 AI 提案亮點實戰課｜2026/6/13 臺北",
    description:
      "用 AI 找到讓對方點頭的理由，現場完成一份可直接交出去的提案優化草稿。陳建銘老師親授・限 16 名・早鳥 NT$4,980。",
    images: [
      {
        url: "/courses/ai-proposal-spotlight/og",
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "https://www.solo.tw/courses/ai-proposal-spotlight",
  },
};

// recur.tw 付款連結
const REGISTER_URL = "https://buy.recur.tw/9iIwUICrFaEGIXm6"; // 早鳥 NT$4,980（5/30 截止）
const REGISTER_URL_REGULAR = "https://buy.recur.tw/O3305hcrDJn9XBqD"; // 原價 NT$7,800

const painPoints = [
  {
    emoji: "💢",
    title: "「這個沒有亮點。」",
    text: "你內心：到底什麼叫亮點？你說沒有，但你也沒說要什麼。",
  },
  {
    emoji: "😮‍💨",
    title: "「我們再評估看看。」",
    text: "你內心：這已經是第三次了。到底還要評估什麼？",
  },
  {
    emoji: "😶‍🌫️",
    title: "「好像不錯，但沒有非做不可。」",
    text: "你內心：兩個月。就換來一句『好像不錯』。",
  },
  {
    emoji: "🤖",
    title: "AI 用一輪，提案還是很普通",
    text: "你以為加了 AI 就會變強，結果只是更快產出一份普通的提案。",
  },
];

const targetRoles = [
  { role: "企劃 / PM", scenario: "每季要寫年度提案、爭取資源與預算" },
  { role: "業務 / 顧問", scenario: "要說服客戶買單、推進長銷售週期" },
  { role: "行銷 / 公關", scenario: "要把活動寫成主管願意買單的案" },
  { role: "中階主管", scenario: "向上要爭取，向下要說服團隊跟著做" },
  { role: "創業者 / 接案者", scenario: "對外提案決定下一筆收入" },
];

const tools = [
  {
    no: "01",
    name: "提案亮點檢核表",
    desc: "送出前先自查 12 個檢核點，不再憑感覺猜對方愛不愛。",
  },
  {
    no: "02",
    name: "物件元素拆解表",
    desc: "從 12 個維度系統拆解你的提案，看清『要改變什麼』。",
  },
  {
    no: "03",
    name: "改變元素設計表",
    desc: "30 種改法庫，找出別人沒想過的差異化切入點。",
  },
  {
    no: "04",
    name: "AI Prompt 模板組",
    desc: "痛點探索、標題生成、說服話術——三組可立即複製貼上的模板。",
  },
  {
    no: "05",
    name: "提案優化草稿 ×1",
    desc: "課堂中用你自己的真實提案完成優化版，帶回去下週直接交。",
  },
];

const flow = [
  {
    no: "01",
    title: "需求感受表",
    sub: "找出對方真正想要什麼",
  },
  {
    no: "02",
    title: "物件元素表",
    sub: "確認要改變什麼",
  },
  {
    no: "03",
    title: "改變元素表",
    sub: "決定怎麼改有亮點",
  },
];

const beforeAfter = {
  before: {
    label: "普通提案",
    text: "辦一場 AI 工具工作坊，幫助同仁提升效率。",
  },
  after: {
    label: "亮點提案 ★",
    text: "「一天省下 30 分鐘」的 AI 工作流實作課，用同仁自己的任務現場產出，讓主管看到可衡量的成果。",
  },
};

const stats = [
  { num: "500+", label: "培訓場次" },
  { num: "10,000+", label: "學員人次" },
  { num: "10+", label: "電視臺報導" },
  { num: "20+", label: "國際發明專利" },
];

const credentials = [
  "《靈感製造機》作者・博客來實體書",
  "《鳥博士教育桌遊》flyingV 募資 127% 達成",
  "日內瓦國際發明展特別獎・臺北國際發明展金牌獎",
  "法國科學雜誌封面・南一書局國小課本收錄",
  "曾為 Synopsys 新思科技、研華、中華汽車、中華電信提供職場創新顧問培訓",
];

const fitFor = [
  "下週就有提案要交，現在學是最直接的投資",
  "提案常被退、被擱置，找不到問題出在哪",
  "已經會用 ChatGPT / Claude，但寫出來還是『正確但無感』",
  "想從『執行者』升級成『讓人點頭的解法設計者』",
];

const notFitFor = [
  "想學 ChatGPT 基本操作（這堂課假設你已經會基本提問）",
  "希望有一個萬用模板，不需要動腦改寫",
  "不打算把方法用在自己接下來的真實提案上",
];

const faqs = [
  {
    q: "我完全不會用 AI，可以來嗎？",
    a: "可以。課程不假設你是 AI 高手，但你最好會基本的 ChatGPT 或 Claude 提問。重點不是教你按鈕，而是教你『要問什麼問題』，AI 才會吐出有亮點的內容。",
  },
  {
    q: "課堂上要帶自己的提案嗎？",
    a: "強烈建議帶。最好是下週、下個月就要交的真實提案。課程設計就是讓你『帶問題進來、帶解法回去』，沒有真實提案會失去 80% 的價值。",
  },
  {
    q: "需要訂閱付費版的 AI 嗎？",
    a: "建議訂閱（ChatGPT Plus、Claude Pro 或 Gemini Advanced 擇一）。免費版也能完成大部分練習，但部分高階提示效果會打折。",
  },
  {
    q: "需要帶筆電嗎？",
    a: "需要。Mac 或 Windows 都可以，請確保有穩定的網路。課前會發送軟硬體確認清單。",
  },
  {
    q: "和『創新實戰工作坊』有什麼不同？",
    a: "創新工作坊解決的是『卡住的問題』，這堂課解決的是『被退的提案』。兩堂課可以分開上，但配合著上效果最好——一堂教你想清楚要做什麼，一堂教你說服別人讓你做。",
  },
  {
    q: "退費政策？",
    a: "開課前 7 天可全額退費；開課前 7 天內可轉讓名額或更換梯次。",
  },
  {
    q: "可以開立公司報帳收據嗎？",
    a: "可以。報名時填寫公司抬頭與統編即可開立電子發票。",
  },
];

export default function AiProposalSpotlightPage() {
  return (
    <>
      <JsonLd
        data={courseSchema({
          name: "讓主管與客戶更容易點頭的 AI 提案亮點實戰課",
          description:
            "一天 6 小時，用 AI 把『沒亮點』變成『非做不可』。帶走 5 樣實戰工具與一份可立即交出去的提案優化草稿。",
          url: "https://www.solo.tw/courses/ai-proposal-spotlight",
          instructor: "陳建銘",
          price: 4980,
          duration: "PT6H",
          startDate: "2026-06-13",
          location: "臺北市",
          image: "https://www.solo.tw/images/workshops/cover-innovation-workshop.webp",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "首頁", href: "/" },
          { name: "課程", href: "/courses" },
          { name: "AI 提案亮點實戰課", href: "/courses/ai-proposal-spotlight" },
        ])}
      />
      <JsonLd
        data={faqSchema(faqs.map((f) => ({ question: f.q, answer: f.a })))}
      />

      <div>
        {/* ====== Hero ====== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-background">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/3 top-0 h-[400px] w-[400px] rounded-full bg-amber-100/50 blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-orange-100/40 blur-[100px]" />
          </div>
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
            <Badge
              variant="secondary"
              className="mb-4 border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 sm:text-base"
            >
              ✨ 6 小時實戰工作坊・2026/6/13（六）臺北
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              讓主管與客戶
              <br className="sm:hidden" />
              更容易點頭的
              <br />
              <span className="text-primary">AI 提案亮點實戰課</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              你的提案不是寫得不夠好，
              <br className="hidden sm:block" />
              <span className="font-semibold text-foreground">
                而是還沒找到讓對方點頭的理由。
              </span>
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
              一天現場做完，帶走一份你下週就要交的提案優化草稿。
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
                <a href="#tools">查看 5 樣帶走工具</a>
              </Button>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              限 16 名・早鳥 NT$4,980（5/30 截止）・含限量《創新的秘密》工具牌
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* ====== 痛點共鳴 ====== */}
          <section className="py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              你是不是也聽過這些「軟釘子」？
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              退件時最讓人受傷的，不是被罵，是這幾句聽起來很客氣的回應。
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {painPoints.map((p, i) => (
                <Card key={i} className="border-muted">
                  <CardContent className="flex items-start gap-3 p-5">
                    <span className="text-2xl shrink-0">{p.emoji}</span>
                    <div>
                      <p className="text-base font-semibold text-foreground">
                        {p.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {p.text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-lg font-medium text-foreground">
                問題不是你不會寫提案，
              </p>
              <p className="mt-1 text-lg text-muted-foreground">
                而是還沒找到
                <span className="font-medium text-foreground">
                  讓對方點頭的那個理由
                </span>
                。
              </p>
            </div>
          </section>

          {/* ====== 跟一般 AI 課的差異 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              這堂課和一般 AI 課的差異
            </h2>
            <Card className="mx-auto mt-8 max-w-3xl border-amber-200/50 bg-amber-50/40">
              <CardContent className="p-6 sm:p-8">
                <p className="text-center text-2xl font-bold text-foreground sm:text-3xl">
                  AI 是放大器，
                  <br className="sm:hidden" />
                  <span className="text-primary">不是方向盤</span>
                </p>
                <p className="mt-4 text-center text-base text-muted-foreground">
                  方向不清楚，AI 只會更快幫你產出一份
                  <span className="font-medium text-foreground">
                    看似完整、但仍然普通
                  </span>
                  的提案。
                </p>
                <p className="mt-3 text-center text-base text-muted-foreground">
                  這堂課不只教你用 AI，而是先幫你找到讓人點頭的理由，
                  <br className="hidden sm:block" />
                  再讓 AI 把亮點放大。
                </p>
                <p className="mt-6 text-center text-base font-medium text-foreground">
                  當每個人都會用 AI，真正拉開差距的，是
                  <span className="text-primary">誰更懂得找到理由</span>。
                </p>
              </CardContent>
            </Card>
          </section>

          {/* ====== 5 樣工具 ====== */}
          <section id="tools" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              5 樣實戰工具，課堂中直接做出來
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              不只是聽懂——是
              <span className="font-medium text-foreground">當天就完成</span>
              、帶回辦公室直接用。
            </p>
            <div className="mt-8 space-y-4">
              {tools.map((t) => (
                <div
                  key={t.no}
                  className="flex items-start gap-4 rounded-xl border bg-card p-5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-base font-bold text-primary">
                    {t.no}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <p className="text-center text-base font-medium text-foreground">
                三張工具表的使用順序
              </p>
              <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-2">
                {flow.map((f, i) => (
                  <div key={f.no} className="flex flex-1 items-center gap-2">
                    <Card className="flex-1 border-primary/20 bg-primary/5">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs font-bold text-primary">
                          {f.no}
                        </p>
                        <p className="mt-1 text-base font-semibold text-foreground">
                          {f.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {f.sub}
                        </p>
                      </CardContent>
                    </Card>
                    {i < flow.length - 1 && (
                      <span className="hidden text-2xl text-primary/40 sm:inline">
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ====== 普通 vs 亮點 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              實際效果：普通提案 vs 亮點提案
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card className="border-stone-200">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {beforeAfter.before.label}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {beforeAfter.before.text}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/30 bg-gradient-to-br from-amber-50/60 to-orange-50/40 shadow-sm">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                    {beforeAfter.after.label}
                  </p>
                  <p className="mt-3 text-base font-medium leading-relaxed text-foreground">
                    {beforeAfter.after.text}
                  </p>
                </CardContent>
              </Card>
            </div>
            <p className="mt-6 text-center text-base text-muted-foreground">
              差異不在文字多漂亮，而在
              <span className="font-medium text-foreground">
                有沒有說中對方在意的問題
              </span>
              。
            </p>
          </section>

          {/* ====== 適合誰 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              這堂課特別適合這幾種職場角色
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {targetRoles.map((r) => (
                <div
                  key={r.role}
                  className="flex items-start gap-3 rounded-lg border bg-card p-4"
                >
                  <span className="text-primary">✓</span>
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {r.role}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {r.scenario}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Card className="border-emerald-200/60 bg-emerald-50/40">
                <CardContent className="p-5">
                  <p className="text-sm font-semibold text-emerald-900">
                    ✅ 你會帶很多走
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-stone-700">
                    {fitFor.map((f, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-emerald-600 shrink-0">・</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-stone-200 bg-stone-50">
                <CardContent className="p-5">
                  <p className="text-sm font-semibold text-stone-700">
                    ⚠️ 不太適合你
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-stone-600">
                    {notFitFor.map((f, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-stone-400 shrink-0">・</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ====== 講師 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              為什麼跟陳建銘老師學？
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              他沒有找媒體——是媒體來找他。
              <br className="hidden sm:block" />
              因為他的發明本身就夠有亮點。
            </p>

            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border bg-card p-4 text-center"
                >
                  <p className="text-2xl font-bold text-primary sm:text-3xl">
                    {s.num}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <Card className="mt-8">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/images/workshops/instructor-jianming.webp"
                      alt="陳建銘老師"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">陳建銘</h3>
                      <span className="text-base text-muted-foreground">
                        （創新先生）
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      職場創新顧問・20+ 項國際發明專利
                    </p>
                    <ul className="mt-4 space-y-2">
                      {credentials.map((c, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="text-primary shrink-0">✓</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 rounded-lg border-l-4 border-primary/40 bg-primary/5 p-5">
                  <p className="text-sm font-semibold text-foreground">
                    學員故事
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    2025 年全國農會線上課，145 位夥伴參加。幾個月後，其中一位農會夥伴靠一支手機走進田間直播，現採現煮公開種植過程——她上了新聞。
                  </p>
                  <p className="mt-3 text-sm italic text-foreground">
                    「靈感製造機法則只是一把鑰匙。門，是她自己開的。」
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ====== 報名資訊 ====== */}
          <section id="register" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              立即報名｜限 16 名小班制
            </h2>

            <Card className="mt-8 border-2 border-primary/30 bg-gradient-to-br from-amber-50/60 to-orange-50/30 shadow-md">
              <CardContent className="p-6 sm:p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3 text-base">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span className="font-medium">2026 年 6 月 13 日（六）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🕘</span>
                      <span>9:00–16:00（含午休）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>臺北市區・捷運站附近（報名後告知）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>限 16 名</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💻</span>
                      <span>請自備筆電（Mac / Windows 皆可）</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">原價</p>
                      <p className="text-lg text-muted-foreground line-through">
                        NT$ 7,800
                      </p>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        ⚡ 早鳥優惠
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        2026/5/30（五）截止
                      </p>
                      <p className="text-3xl font-bold text-primary sm:text-4xl">
                        NT$ 4,980
                      </p>
                      <p className="text-sm text-emerald-700">
                        省下 NT$ 2,820
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg border border-amber-200 bg-white/60 p-5">
                  <p className="text-sm font-semibold text-foreground">
                    🎁 早鳥贈品｜限量《創新的秘密》發想工具牌
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    市面上買不到的限量版工具牌，僅提供早鳥學員。
                    陳建銘老師多年顧問實戰整理出來的 30 種改變元素，課後也能繼續用。
                  </p>
                </div>

                <div className="mt-6 flex flex-col items-center gap-3">
                  <Button
                    size="lg"
                    className="h-12 w-full max-w-sm px-8 text-base"
                    asChild
                  >
                    <a
                      href={REGISTER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      立即以早鳥價 NT$4,980 報名
                    </a>
                  </Button>
                  <a
                    href={REGISTER_URL_REGULAR}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground underline-offset-2 hover:underline"
                  >
                    錯過早鳥？以原價 NT$7,800 報名
                  </a>
                  <p className="text-xs text-muted-foreground">
                    開課前 7 天可全額退費・可開立公司報帳收據
                  </p>
                </div>
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-base text-muted-foreground">
              下一個提案，不該再靠運氣。
              <br className="hidden sm:block" />
              如果你最近剛好有一個提案要交，
              <span className="font-medium text-foreground">
                現在學是最直接的投資
              </span>
              。
            </p>
          </section>

          {/* ====== FAQ ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              常見問題
            </h2>
            <div className="mx-auto mt-8 max-w-3xl space-y-3">
              {faqs.map((f, i) => (
                <details
                  key={i}
                  className="group rounded-xl border bg-card p-5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-start justify-between gap-3">
                    <span className="text-base font-semibold text-foreground">
                      Q{i + 1}. {f.q}
                    </span>
                    <span className="mt-1 shrink-0 text-primary transition-transform group-open:rotate-45">
                      ＋
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* 返回 */}
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
