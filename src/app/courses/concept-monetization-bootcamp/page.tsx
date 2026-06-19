import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd, courseSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title:
    "概念變現陪跑營｜6 週，用 AI 把你的專業變成一個會賣的知識產品 2026/8 線上 | solo.tw",
  description:
    "給已有專業、卻卡在「想很久卻沒做成產品」的講師、顧問、教練。6 週線上直播陪跑，用 AI 盤點專業、校準市場痛點、設計最小可賣產品，並真的發出第一波市場測試，結業帶走一頁式概念變現地圖。2026/8/6 起連續 6 週（週四晚上）線上小班，限 12 名。創辦梯次價 NT$9,999（原價 16,800）。",
  keywords: [
    "知識變現",
    "知識產品化",
    "概念變現",
    "線上課程設計",
    "個人品牌變現",
    "AI 變現",
    "陪跑營",
    "Vista 鄭緯筌",
    "solo.tw",
  ],
  openGraph: {
    title: "概念變現陪跑營｜6 週，把你的專業變成一個會賣的知識產品",
    description:
      "你不是缺創意，你是缺一個市場買單的產品形式。6 週直播陪跑，帶你做出可測試的知識產品雛形並真的發出去。2026/8 線上・創辦梯次價 NT$9,999。",
    images: [{ url: "/courses/concept-monetization-bootcamp/og" }],
  },
  alternates: {
    canonical: "https://www.solo.tw/courses/concept-monetization-bootcamp",
  },
};

const REGISTER_URL = "/courses/concept-monetization-bootcamp/register";
const VIP_URL = "https://buy.recur.tw/4iFhwjmPKwqGu8Jm";

const weeks = [
  {
    w: "Week 1",
    title: "定位與專業資產盤點",
    desc: "用 AI 盤點你會什麼、做過什麼、幫別人解決過什麼，從中選出 1 個最適合第一版測試的主題。",
  },
  {
    w: "Week 2",
    title: "找出市場願意付費的痛點 + AI 概念壓力測試",
    desc: "用五種付費動機檢查主題，再用 AI 市場感校準提示詞：誰會買、為什麼現在不買、有哪些替代方案、哪個角度最有付費動機。",
  },
  {
    w: "Week 3",
    title: "設計最小可賣產品（MVP）",
    desc: "比較直播／工作坊／模板／電子書／諮詢／陪跑等形式，依你的主題選第一版形式，完成產品大綱與定價假設。",
  },
  {
    w: "Week 4",
    title: "寫出第一版銷售訊息並發出市場測試",
    desc: "完成產品主標、痛點、成果與第一則市場測試貼文，當週就真的發出去——逼出真實動作，這是陪跑營跟一般課最大的差別。",
  },
  {
    w: "Week 5",
    title: "市場回饋解讀 + 訪談 + 依回饋迭代",
    desc: "解讀第一波市場訊號、訪談 3 位潛在客戶挖出購買阻力，依回饋迭代你的產品承諾、主標與形式。",
  },
  {
    w: "Week 6",
    title: "開賣計畫 + Capstone 發表",
    desc: "把迭代後的版本收斂成第一波開賣計畫，上臺發表你的一頁式概念變現地圖。想一路做到開賣的人可升級 3 個月實戰營。",
  },
];

const forWho = [
  "已有專業經驗，但還沒產品化的講師、顧問、教練、資深自由工作者",
  "經營內容一段時間、卻還沒有穩定變現路徑的人",
  "想發展第二曲線、已有可教的東西，卻卡在第一個產品做不出來的上班族",
];

const notForWho = [
  "只想學提示詞技巧、工具操作的人",
  "完全沒有任何專業、經驗或可服務對象的人",
  "不願意在過程中實作、被檢視與修改的人",
];

const takeaways = [
  "你的核心概念與目標客群",
  "他們真正願意付費的痛點與你的產品承諾",
  "你的最小可賣產品形式與大綱",
  "你的定價假設與銷售頁主標",
  "已真的發出去的第一則市場測試貼文與收回的回饋",
  "迭代後的產品 v2 與第一波開賣計畫",
];

const faqs = [
  {
    q: "我還沒有很明確的產品主題，可以報名嗎？",
    a: "可以，只要你已有一塊專業或經驗想產品化。這堂課的第一週就是用 AI 幫你盤點專業資產、選定主題。但如果你完全沒有任何專業、經驗或想服務的對象，這堂課會比較吃力——它是把「已會的東西」做成產品，不是從零找靈感。",
  },
  {
    q: "我需要很熟 AI 工具嗎？",
    a: "不需要。只要你有基本的 ChatGPT 或 Claude 帳號、會輸入問題即可。課堂會提供現成的提示詞模板，帶你一步一步操作。AI 在這裡是方法、不是門檻。",
  },
  {
    q: "這跟一般 AI 課有什麼不同？",
    a: "一般 AI 課教你怎麼下提示詞、怎麼生成內容。這堂課關心的是你要用 AI 做出什麼商業成果——不是叫你再多想一百個點子，而是陪你挑出一個值得做的想法，整理成市場看得懂、願意付費測試的產品，並真的發出去。",
  },
  {
    q: "為什麼是 6 週，不是一次上完的工作坊？",
    a: "因為「真的把產品做出來、發到市場、收到回饋」這件事，需要時間。6 週的設計刻意把市場測試的發出（第 4 週）、回饋回流（第 5 週）、依回饋迭代（第 5–6 週）留出 2–3 週的真實時間。單次工作坊做不出這個結果。",
  },
  {
    q: "課程會錄影嗎？",
    a: "會。全程錄影，提供回放。但因為有大量實作、社群互評與即時回饋，仍強烈建議你參加每週的直播現場。",
  },
  {
    q: "VIP 診斷席跟標準票差在哪？",
    a: "VIP 診斷席（限 4 名）含 6 週直播陪跑全部內容，另加課前概念診斷、課後 30 分鐘一對一產品診斷，以及你的產品主題與銷售角度的個人化修改建議。適合想要更貼身回饋、加速做出成果的人。",
  },
  {
    q: "退費政策？",
    a: "開課前 7 天可全額退費（需扣除金流手續費）；之後可轉讓名額。報名與繳費相關問題，歡迎來信 iamvista@gmail.com。",
  },
];

export default function ConceptMonetizationBootcampPage() {
  return (
    <>
      <JsonLd
        data={{
          ...courseSchema({
            name: "概念變現陪跑營",
            description:
              "6 週線上直播陪跑，把你已有的專業變成可測試、會賣的知識產品。用 AI 盤點專業、校準市場痛點、設計最小可賣產品並發出第一波市場測試，結業帶走一頁式概念變現地圖。",
            url: "https://www.solo.tw/courses/concept-monetization-bootcamp",
            instructor: "鄭緯筌（Vista）",
            price: 9999,
            duration: "PT9H",
            startDate: "2026-08-06",
            location: "線上 Zoom",
          }),
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "首頁", href: "/" },
          { name: "課程", href: "/courses" },
          {
            name: "概念變現陪跑營",
            href: "/courses/concept-monetization-bootcamp",
          },
        ])}
      />
      <JsonLd data={faqSchema(faqs.map((f) => ({ question: f.q, answer: f.a })))} />

      <div>
        {/* ====== Hero ====== */}
        <section className="bg-gradient-to-b from-[#0a1a2e] via-[#0d2038] to-background">
          <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
            <Badge
              variant="secondary"
              className="mb-5 px-4 py-2 text-sm sm:text-base"
            >
              {"\u{1F3AF}"} 概念變現陪跑營｜2026/8/6 起連續 6 週（週四晚上）・線上小班・創辦梯次
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              那個放在心裡很久的產品，
              <br className="hidden sm:block" />
              為什麼一直沒做出來？
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              你不是缺創意，
              <span className="font-semibold text-amber-300">
                你是缺一個能被市場理解、相信、購買的產品形式。
              </span>
              <br className="hidden sm:block" />
              6 週陪跑，帶你用 AI 把已有的專業，做成一個可以拿去測試市場的知識產品雛形。
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <a href="#register">我要報名・把想法做成產品</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/30 bg-white/5 px-8 text-base text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <a href="#curriculum">看 6 週課綱</a>
              </Button>
            </div>
            <p className="mt-6 text-sm text-white/60">
              創辦梯次價 NT$9,999（原價 16,800）・限 12 名
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* ====== Core Insight ====== */}
          <section className="py-14 sm:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-xl font-bold sm:text-2xl">
                AI 時代，最不缺的是點子，最缺的是判斷
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                打開 ChatGPT 或 Claude，幾秒鐘就能生成一百個課程主題、一百個產品點子。
                真正困難的，從來不是想出更多點子——而是哪一個值得做？哪一個有人願意付費？哪一種產品形式最適合第一版測試？
              </p>
              <p className="mt-6 text-lg font-bold text-foreground sm:text-xl">
                這堂陪跑營不是叫你再多想一百個點子。
                <br />
                而是陪你挑出其中一個，整理成市場看得懂、願意付費測試的產品，並真的發出去。
              </p>
            </div>
          </section>

          {/* ====== Curriculum ====== */}
          <section id="curriculum" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              6 週，把一個模糊想法做成可測試的產品
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              每週固定節奏：直播教學（90 分鐘）＋ 當週實作作業 ＋ 社群互評 ＋ QA。
            </p>
            <div className="mt-10 space-y-4">
              {weeks.map((wk) => (
                <Card key={wk.w} className="border-muted">
                  <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:gap-6">
                    <div className="shrink-0">
                      <Badge variant="outline" className="whitespace-nowrap text-sm">
                        {wk.w}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {wk.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {wk.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ====== For / Not For ====== */}
          <section className="border-t py-14 sm:py-16">
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="border-emerald-200 bg-emerald-50/40">
                <CardContent className="p-6">
                  <h3 className="text-base font-bold text-foreground">
                    ✅ 這堂課適合你，如果
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {forWho.map((t, i) => (
                      <li
                        key={i}
                        className="text-sm leading-relaxed text-foreground"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-stone-200 bg-stone-50/60">
                <CardContent className="p-6">
                  <h3 className="text-base font-bold text-foreground">
                    🚫 這堂課不適合
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {notForWho.map((t, i) => (
                      <li
                        key={i}
                        className="text-sm leading-relaxed text-muted-foreground"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ====== Takeaways ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              6 週後，你會帶走一份「一頁式概念變現地圖」
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              你帶一個專業進來，帶一個已經在市場測試中的產品出去。
            </p>
            <div className="mx-auto mt-8 max-w-2xl space-y-3">
              {takeaways.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-base text-foreground">{t}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ====== Course Info ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">課程資訊</h2>
            <Card className="mt-8 border-muted">
              <CardContent className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                <div className="flex items-start gap-2 text-sm">
                  <span>{"\u{1F4C5}"}</span>
                  <span>
                    <span className="font-medium text-foreground">上課日期：</span>
                    2026/8/6 起連續 6 週（週四）
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span>{"\u{1F558}"}</span>
                  <span>
                    <span className="font-medium text-foreground">上課時間：</span>
                    20:00–21:30（21:30–22:00 QA）
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span>{"\u{1F4CD}"}</span>
                  <span>
                    <span className="font-medium text-foreground">上課形式：</span>
                    線上 Zoom，全程錄影、提供回放
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span>{"\u{1F465}"}</span>
                  <span>
                    <span className="font-medium text-foreground">名額：</span>
                    限 12 名小班，含社群互評與每週作業
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ====== Pricing / Register ====== */}
          <section id="register" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">報名方案</h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              創辦梯次價僅此一梯，下一梯起調回原價 NT$16,800。
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {/* 標準票 */}
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="flex h-full flex-col p-6">
                  <p className="text-base font-bold text-foreground">標準票</p>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-primary">
                      NT$9,999
                    </span>
                    <span className="ml-2 text-sm text-muted-foreground line-through">
                      NT$16,800
                    </span>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    6 週直播陪跑＋社群＋全套模板＋回放＋每週實作與互評。
                  </p>
                  <Button className="mt-5 w-full" asChild>
                    <Link href={REGISTER_URL}>報名標準票</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* VIP 診斷席 */}
              <Card className="border-amber-300 bg-amber-50/50">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-foreground">
                      VIP 診斷席
                    </p>
                    <Badge variant="outline" className="text-xs">
                      限 4 名
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-primary">
                      NT$16,800
                    </span>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    標準票全含，另加課前概念診斷、課後 30 分鐘一對一產品診斷、銷售角度個人化修改建議。
                  </p>
                  <Button className="mt-5 w-full" variant="secondary" asChild>
                    <a href={VIP_URL} target="_blank" rel="noopener noreferrer">
                      報名 VIP 診斷席
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* 雙人同行 */}
              <Card className="border-muted">
                <CardContent className="flex h-full flex-col p-6">
                  <p className="text-base font-bold text-foreground">雙人同行</p>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-primary">
                      NT$18,000
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">／2 人</span>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    兩人合報，可在課堂互相當對方產品的第一個市場測試對象，回饋更真實。
                  </p>
                  <Button className="mt-5 w-full" variant="outline" asChild>
                    <Link href={REGISTER_URL}>報名雙人同行</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              標準票與雙人同行於下一頁填寫報名資料後，前往 PAYUNi 信用卡刷卡頁完成付款。
            </p>
          </section>

          {/* ====== Instructor ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">講師</h2>
            <Card className="mt-8 border-muted">
              <CardContent className="p-6 sm:p-8">
                <p className="text-base font-bold text-foreground">
                  Vista 鄭緯筌
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  內容策略顧問・企業講師・作家
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  長期陪伴講師、顧問、創作者與知識工作者，把專業經驗整理成可以被市場理解的內容、課程與產品。
                  Vista 擅長的不是教你多用幾個工具，而是協助你把模糊想法拆解成清楚主張、可執行流程與可測試產品——
                  跨過「一直想、卻沒做成產品」的那道門檻。
                </p>
              </CardContent>
            </Card>
          </section>

          {/* ====== FAQ ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">常見問題</h2>
            <div className="mt-8 space-y-4">
              {faqs.map((faq, i) => (
                <Card key={i}>
                  <CardContent className="p-5 sm:p-6">
                    <h3 className="text-base font-semibold text-foreground">
                      Q：{faq.q}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 text-center">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <a href="#register">我要報名</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base"
                  asChild
                >
                  <a href="mailto:iamvista@gmail.com?subject=%E6%A6%82%E5%BF%B5%E8%AE%8A%E7%8F%BE%E9%99%AA%E8%B7%91%E7%87%9F%E5%95%8F%E9%A1%8C">
                    寫信給我們
                  </a>
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
