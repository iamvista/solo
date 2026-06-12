import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd, courseSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title:
    "AI 變現研究院｜學 AI，不如學會用 AI 賺錢・三位專家聯手 2026/7 臺北 | solo.tw",
  description:
    "從「會用 AI」走到「用 AI 賺錢」，中間隔著定位、效率、變現三道關卡。Joyce 李文娟、Claire 張可佳、Vista 鄭緯筌三位專家各鎮守一關。2026 年 7/19、7/25、7/26 臺北實體小班。三課全修 NT$16,800，7/5 前早鳥 NT$15,800。",
  keywords: [
    "AI 變現",
    "AI 賺錢",
    "個人品牌",
    "AI 生產力",
    "內容變現",
    "李文娟",
    "張可佳",
    "Vista 鄭緯筌",
    "solo.tw",
  ],
  openGraph: {
    title: "AI 變現研究院｜學 AI，不如學會用 AI 賺錢",
    description:
      "個人品牌 × AI 生產力 × 內容變現，三位專家陪你打造一條屬於自己的收入管道。2026/7 臺北・三課全修 NT$16,800。",
    images: [
      {
        url: "/images/courses/ai-monetization-institute/hero.webp",
        width: 1400,
        height: 788,
      },
    ],
  },
  alternates: {
    canonical: "https://www.solo.tw/courses/ai-monetization-institute",
  },
};

// 串接外部報名表單：拿到正式報名表單網址後換掉下方連結即可。
// 在表單連結就緒前，報名按鈕會自動 fallback 到 email，避免上線後連到無效連結。
const REGISTER_URL = "https://forms.gle/REPLACE_ME";
const FORM_READY = !REGISTER_URL.includes("REPLACE_ME");
const REGISTER_FALLBACK =
  "mailto:iamvista@gmail.com?subject=AI%20%E8%AE%8A%E7%8F%BE%E7%A0%94%E7%A9%B6%E9%99%A2%E5%A0%B1%E5%90%8D";

const courses = [
  {
    no: "第一課",
    axis: "個人品牌 × 影響力",
    name: "Joyce 李文娟",
    photo: "/images/courses/ai-monetization-institute/instructor-joyce.webp",
    date: "7/19（日）",
    accent: "rose" as const,
    bio: "真正的媒體天后：從聯合報財經記者、臺視主播，到非凡電視臺新聞部經理、TVBS 新聞周刊與《女人我最大》總編輯，三十年媒體資歷，採訪過無數企業家與意見領袖，更親手打造過無數品牌故事。",
    points: [
      "主播級表達力：讓人三分鐘記住你",
      "個人品牌定位與包裝：找到你獨一無二的市場位置",
      "影響力內容策略：讓專業被看見，而不是被埋沒",
    ],
    fit: "想建立個人品牌卻不知從何開始的專業工作者、講師、顧問、創業者。",
    single: 10000,
  },
  {
    no: "第二課",
    axis: "AI 落地 × 生產力",
    name: "Claire 張可佳",
    photo: "/images/courses/ai-monetization-institute/instructor-claire.webp",
    date: "7/25（六）",
    accent: "blue" as const,
    bio: "十七年資歷的資深工程師、《AI 職場超神助手》作者、Google Women Techmakers Ambassador，也是眾多企業 AI 導入的首選講師。她最擅長的，就是把看似艱深的 AI 技術，變成你明天就能用的工作流程。",
    points: [
      "AI 工具實戰應用：選對工具，而不是被工具淹沒",
      "工作流程自動化：把重複的事交給 AI，把時間留給值錢的事",
      "提升效率與決策力：讓 AI 成為你的全天候特助",
      "企業 AI 導入實務：從個人效率到團隊戰力",
    ],
    fit: "想大幅提升工作效率的上班族、自由工作者、中小企業主與團隊主管。",
    single: 5000,
  },
  {
    no: "第三課",
    axis: "內容變現 × 流量力",
    name: "Vista 鄭緯筌",
    photo: "/images/courses/ai-monetization-institute/instructor-vista.webp",
    date: "7/26（日）",
    accent: "amber" as const,
    bio: "出版二十餘本著作的作家、「內容駭客」創辦人、企業顧問與大學講師，十多年來陪伴無數素人從零開始寫作、經營社群，進而建立自己的知識事業。",
    points: [
      "從零開始的內容企劃與寫作：沒靈感、不會寫，都有方法可解",
      "社群經營與流量策略：讓對的人主動找到你",
      "文案銷售力與說故事力：把專業說成讓人想買單的故事",
      "多元變現模式設計：課程、訂閱、顧問、聯盟——打造不只一條收入管道",
    ],
    fit: "想把知識與經驗變成收入的創作者、講師、專業人士與斜槓工作者。",
    single: 5000,
  },
];

const accentRing: Record<string, string> = {
  rose: "ring-rose-300/60",
  blue: "ring-sky-300/60",
  amber: "ring-amber-300/60",
};

const stages = [
  { n: "1", title: "定位", desc: "找到你的價值，明確定位與市場" },
  { n: "2", title: "工具", desc: "掌握 AI 工具，提升效率與產能" },
  { n: "3", title: "內容", desc: "打造有價值內容，建立專業與影響力" },
  { n: "4", title: "流量", desc: "吸引精準流量，擴大你的影響力" },
  { n: "5", title: "變現", desc: "多元變現模式，打造持續收入來源" },
];

const trust = [
  { stat: "30 年＋", label: "媒體與教學經驗實戰累積" },
  { stat: "500＋", label: "企業內訓與課程合作經驗" },
  { stat: "10 萬＋", label: "社群訂閱與學員的信任支持" },
];

const pricingRows = [
  { plan: "個人品牌 × 影響力（Joyce）", detail: "單堂", price: "NT$10,000" },
  { plan: "AI 落地 × 生產力（Claire）", detail: "單堂", price: "NT$5,000" },
  { plan: "內容變現 × 流量力（Vista）", detail: "單堂", price: "NT$5,000" },
];

const takeaways = [
  "一份清晰的個人品牌定位",
  "一套立刻可用的 AI 工作流程",
  "一張屬於你自己的內容變現藍圖",
];

const faqs = [
  {
    q: "可以只報其中一堂課嗎？",
    a: "可以。三堂課皆可單堂報名：個人品牌 × 影響力（Joyce）NT$10,000、AI 落地 × 生產力（Claire）NT$5,000、內容變現 × 流量力（Vista）NT$5,000。但三堂是設計過的完整路徑（定位 → 工具 → 內容 → 流量 → 變現），全修方案 NT$16,800 等於現省 NT$3,200，最划算。",
  },
  {
    q: "三課全修方案有什麼加碼優惠？",
    a: "全修原價合計 NT$20,000，全修方案 NT$16,800（現省 NT$3,200）。7/5（日）前完成報名並繳費，再折至 NT$15,800；兩人同時報名全修方案，每人再折 NT$500。早鳥與雙人同行可疊加。",
  },
  {
    q: "完全沒有 AI 基礎，適合來上嗎？",
    a: "適合。三位老師都從觀念與實作帶起，重點是把專業變成可變現的收入管道，而不是堆工具。帶著你想解決的問題與題材來，會更有收穫。",
  },
  {
    q: "上課地點與形式？",
    a: "臺北市中山區松江路 64 巷 6 號（捷運松江南京站步行可達），小班實體教學，現場實作與問答。三堂皆為上午 9:00 至 12:00。",
  },
  {
    q: "退費政策？",
    a: "開課前 7 天可全額退費；之後可轉讓名額。報名與繳費相關問題，歡迎來信 iamvista@gmail.com。",
  },
];

export default function AiMonetizationInstitutePage() {
  return (
    <>
      <JsonLd
        data={{
          ...courseSchema({
            name: "AI 變現研究院",
            description:
              "個人品牌 × AI 生產力 × 內容變現，三位專家聯手，陪你打造一條屬於自己的收入管道。三堂完整學習路徑，2026/7 臺北實體小班。",
            url: "https://www.solo.tw/courses/ai-monetization-institute",
            instructor: "李文娟、張可佳、鄭緯筌",
            price: 16800,
            duration: "PT9H",
            startDate: "2026-07-19",
            location: "臺北市中山區松江路 64 巷 6 號",
            image:
              "https://www.solo.tw/images/courses/ai-monetization-institute/hero.webp",
          }),
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "首頁", href: "/" },
          { name: "課程", href: "/courses" },
          { name: "AI 變現研究院", href: "/courses/ai-monetization-institute" },
        ])}
      />
      <JsonLd
        data={faqSchema(faqs.map((f) => ({ question: f.q, answer: f.a })))}
      />

      <div>
        {/* ====== Hero ====== */}
        <section className="bg-gradient-to-b from-[#0a1a2e] via-[#0d2038] to-background">
          <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
            <Badge
              variant="secondary"
              className="mb-5 px-4 py-2 text-sm sm:text-base"
            >
              {"\u{1F4B0}"} AI 變現研究院｜2026 年 7/19、7/25、7/26 臺北
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              學了一堆 AI 工具，
              <br className="hidden sm:block" />
              收入卻一毛錢都沒變多？
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              問題從來不在於你學得不夠多，而在於你缺少一條完整的路徑：
              <span className="font-semibold text-amber-300">
                從「會用 AI」走到「用 AI 賺錢」，中間隔著三道關卡——定位、效率、變現。
              </span>
            </p>

            <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-amber-400/20 shadow-2xl">
              <Image
                src="/images/courses/ai-monetization-institute/hero.webp"
                alt="AI 變現研究院｜三位專家 × 三大主軸 × 一個目標"
                width={1400}
                height={788}
                className="w-full"
                priority
              />
            </div>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <a href="#register">我要報名</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/30 bg-white/5 px-8 text-base text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <a href="#courses">查看三堂課</a>
              </Button>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* ====== Why ====== */}
          <section className="py-14 sm:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-base leading-relaxed text-muted-foreground">
                追完一場又一場的 AI 講座，收藏了幾十支教學影片，手機裡裝滿各種 AI 應用程式——
                然後呢？工作好像快了一點，但收入沒有變多；內容好像產得快了，但沒有人因此付錢給你。
              </p>
              <p className="mt-6 text-lg font-bold text-foreground sm:text-xl">
                這正是我們創辦「AI 變現研究院」的原因。
                <br />
                我們不教你追逐最新的工具，我們陪你打造一條屬於自己的收入管道。
              </p>
            </div>
          </section>

          {/* ====== Three Courses ====== */}
          <section id="courses" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              三位專家 × 三大主軸 × 一個目標
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              三位老師，各自鎮守變現路上最關鍵的一道關卡。
            </p>

            <div className="mt-10 space-y-6">
              {courses.map((c) => (
                <Card key={c.name} className="overflow-hidden border-muted">
                  <CardContent className="p-6 sm:p-8">
                    <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
                      <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-center sm:gap-3">
                        <div
                          className={`h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ${accentRing[c.accent]} sm:h-28 sm:w-28`}
                        >
                          <Image
                            src={c.photo}
                            alt={c.name}
                            width={140}
                            height={140}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="text-left sm:text-center">
                          <p className="text-xs font-medium text-muted-foreground">
                            {c.no}
                          </p>
                          <p className="text-base font-bold text-foreground">
                            {c.name}
                          </p>
                          <Badge
                            variant="outline"
                            className="mt-1.5 whitespace-nowrap text-xs"
                          >
                            {"\u{1F4C5}"} {c.date}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-foreground sm:text-xl">
                          {c.axis}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {c.bio}
                        </p>
                        <ul className="mt-4 space-y-2">
                          {c.points.map((p, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-foreground"
                            >
                              <svg
                                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">
                              適合：
                            </span>
                            {c.fit}
                          </span>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-foreground">
                          單堂 NT${c.single.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ====== Five Stages ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              五大學習階段，打造完整的 AI 變現力
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              三門課不是三場零散的講座，而是一條設計過的路徑。
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-5">
              {stages.map((s, i) => (
                <div key={s.n} className="relative">
                  <Card className="h-full border-muted">
                    <CardContent className="p-4 text-center">
                      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                        {s.n}
                      </div>
                      <p className="mt-2 text-base font-bold text-foreground">
                        {s.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {s.desc}
                      </p>
                    </CardContent>
                  </Card>
                  {i < stages.length - 1 && (
                    <span className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-muted-foreground/40 sm:block">
                      ›
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              先找到你的價值與市場位置，再用 AI 放大你的產能，接著打造有價值的內容、吸引精準流量，最後設計出可持續的收入模式。
            </p>
          </section>

          {/* ====== Trust ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              為什麼是這三位老師？
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {trust.map((t) => (
                <Card key={t.stat} className="border-muted">
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold text-primary">{t.stat}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-6 text-center text-base font-medium text-foreground">
              我們不談理論，只談你回家就能動手做的事。
            </p>
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
                    7/19（日）、7/25（六）、7/26（日）
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span>{"\u{1F558}"}</span>
                  <span>
                    <span className="font-medium text-foreground">上課時間：</span>
                    上午 9:00 至 12:00
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm sm:col-span-2">
                  <span>{"\u{1F4CD}"}</span>
                  <span>
                    <span className="font-medium text-foreground">上課地點：</span>
                    臺北市中山區松江路 64 巷 6 號（捷運松江南京站步行可達）
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm sm:col-span-2">
                  <span>{"\u{1F465}"}</span>
                  <span>
                    <span className="font-medium text-foreground">授課形式：</span>
                    小班實體教學，現場實作與問答
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ====== Pricing / Register ====== */}
          <section id="register" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">課程費用</h2>

            <Card className="mt-8 border-primary/20 bg-primary/5">
              <CardContent className="p-6 sm:p-8">
                {/* Single-course rows */}
                <div className="divide-y divide-border/60">
                  {pricingRows.map((r) => (
                    <div
                      key={r.plan}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {r.plan}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {r.detail}
                        </p>
                      </div>
                      <p className="shrink-0 text-base font-semibold text-foreground">
                        {r.price}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bundle highlight */}
                <div className="mt-5 rounded-xl border-2 border-primary/40 bg-background/80 p-5">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        🎯 三課全修方案
                      </p>
                      <p className="text-xs text-muted-foreground">
                        三堂完整學習路徑（定位 → 工具 → 內容 → 流量 → 變現）
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">
                        NT$16,800
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        NT$20,000
                      </span>
                      <p className="text-xs text-emerald-600">現省 NT$3,200</p>
                    </div>
                  </div>
                </div>

                {/* Add-on offers */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-amber-300 bg-amber-50/60 p-4 text-sm dark:bg-amber-950/20">
                    <p className="font-semibold text-amber-900 dark:text-amber-200">
                      🐦 早鳥價 NT$15,800
                    </p>
                    <p className="mt-1 text-amber-800/90 dark:text-amber-200/80">
                      7/5（日）前完成報名並繳費，三課全修再折 NT$1,000。
                    </p>
                  </div>
                  <div className="rounded-lg border border-sky-300 bg-sky-50/60 p-4 text-sm dark:bg-sky-950/20">
                    <p className="font-semibold text-sky-900 dark:text-sky-200">
                      👥 雙人同行 每人再折 NT$500
                    </p>
                    <p className="mt-1 text-sky-800/90 dark:text-sky-200/80">
                      兩人同時報名全修方案，可與早鳥優惠疊加。
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-center text-sm text-muted-foreground">
                  換算下來，早鳥全修等於用不到八折的價格，一次補齊「品牌、效率、變現」三塊拼圖。
                </p>

                <div className="mt-6">
                  <Button size="lg" className="h-12 w-full text-base" asChild>
                    {FORM_READY ? (
                      <a
                        href={REGISTER_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        立即報名
                      </a>
                    ) : (
                      <a href={REGISTER_FALLBACK}>立即報名（來信報名）</a>
                    )}
                  </Button>
                  <p className="mt-3 text-center text-sm text-muted-foreground">
                    名額有限。報名或繳費有任何問題，歡迎來信{" "}
                    <a
                      href="mailto:iamvista@gmail.com?subject=AI%20%E8%AE%8A%E7%8F%BE%E7%A0%94%E7%A9%B6%E9%99%A2%E5%A0%B1%E5%90%8D"
                      className="text-primary underline underline-offset-2"
                    >
                      iamvista@gmail.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ====== Takeaways ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              你會帶走什麼？
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              上完三堂課，你將擁有：
            </p>
            <div className="mx-auto mt-8 max-w-lg space-y-3">
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
            <p className="mx-auto mt-8 max-w-lg text-center text-base font-bold text-foreground">
              這不只是一堂課，而是改變你收入的開始。
            </p>
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
                  <a href="mailto:iamvista@gmail.com?subject=AI%20%E8%AE%8A%E7%8F%BE%E7%A0%94%E7%A9%B6%E9%99%A2%E5%95%8F%E9%A1%8C">
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
