import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "樂齡資產安全與傳承實戰課 | solo.tw",
  description:
    "小班制 10 人限定，3 小時打造你的資產安全藍圖。不是談理論，而是教你如何真正守住資產、守住家人。",
  openGraph: {
    title: "樂齡資產安全與傳承實戰課 | solo.tw",
    description:
      "小班制 10 人限定，3 小時打造你的資產安全藍圖。不是談理論，而是教你如何真正守住資產、守住家人。",
  },
};

const REGISTER_URL = "https://forms.gle/2ckobGmbQWz1iTK58";

const realStories = [
  {
    text: "父親突然中風，兄弟姊妹在醫院門口為醫療決定爭執不下。",
  },
  {
    text: "母親失智後，子女為了「誰可以動用存款」彼此猜疑。",
  },
  {
    text: "明明感情很好的一家人，卻因為資產安排不清楚，最後留下裂痕。",
  },
];

const threePillars = [
  {
    number: "01",
    title: "看清你的現況",
    subtitle: "全面檢視資產、保障與風險",
    image: "/images/workshops/senior-illustration-1.webp",
    points: [
      "未來醫療與照護費用準備好了嗎？",
      "現金流夠支撐多久？",
      "保單保障是否真正完整？",
    ],
    summary: "真正的安心，來自清楚，而不是感覺。",
  },
  {
    number: "02",
    title: "把意願寫下來",
    subtitle: "用法律文件守護你的決定",
    image: "/images/workshops/senior-illustration-2.webp",
    points: ["遺囑", "預立醫療決定", "意定監護"],
    summary: "如果沒有法律文件，再多的愛，也可能變成爭執。",
  },
  {
    number: "03",
    title: "讓計畫真正被執行",
    subtitle: "透過信託制度落實你的安排",
    image: "/images/workshops/senior-illustration-3.webp",
    points: [
      "讓資產不被濫用",
      "讓照顧有制度",
      "讓愛不變成負擔",
    ],
    summary: "信託不是有錢人的專利，而是一種責任。",
  },
];

const targetAudience = [
  "我不想讓孩子為了財產傷感情",
  "我想提早安排，但不知道怎麼開始",
  "我擔心失能後資產被不當處理或遭詐騙",
  "我想讓退休後的生活更安心、更有尊嚴",
];

const faqs = [
  {
    q: "這堂課會很專業聽不懂嗎？",
    a: "完全不會。我們用生活化案例說明，沒有艱深法律條文，每個人都能輕鬆理解。",
  },
  {
    q: "一定要很有錢才需要規劃嗎？",
    a: "不是。資產多寡不是重點，風險才是重點。只要你有家人、有房產、有保單，就需要提前安排。",
  },
  {
    q: "這堂課會推銷商品嗎？",
    a: "不推銷。課程重點在教育與風險認知建立，不會銷售任何金融商品。",
  },
  {
    q: "家人可以一起來嗎？",
    a: "非常建議！資產傳承是家庭議題，家人一起來更能達成共識。我們也提供雙人同行優惠。",
  },
];

const credentials = [
  "CFP® 國際認證理財規劃顧問",
  "法律學士 / 財金碩士 / 財稅研究所進修中",
  "高齡金融規劃顧問師",
  "家族信託規劃顧問師",
  "RFA 退休理財規劃顧問",
];

const instructorHighlights = [
  "超過 20 年保險與財務規劃經驗",
  "長期推動安養信託與高齡資產安全教育",
  "致理科大財金系兼任講師",
  "協助多個家庭完成資產安全與傳承規劃",
];

export default function SeniorAssetSafetyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#1E3A5F]/5 via-[#1E3A5F]/3 to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm sm:text-base">
            🔒 小班制 10 人限定
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            樂齡資產安全與傳承實戰課
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:mt-6 sm:text-xl">
            3 小時打造你的
            <span className="font-semibold text-foreground">資產安全藍圖</span>
          </p>
          <p className="mt-3 text-base text-muted-foreground">
            不是談理論，而是教你如何真正守住資產、守住家人。
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <a href={REGISTER_URL}>
                立即報名
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <a href="#course-content">查看課程內容</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* 情境喚起 */}
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-bold sm:text-2xl">
              有一天，你會希望自己早一點準備
            </h2>
            <div className="mt-8 space-y-6 text-left text-lg leading-relaxed text-muted-foreground">
              <p>
                你是否想過——如果有一天，你突然生病了、失能了，
                <span className="font-medium text-foreground">誰會替你做決定？</span>
              </p>
              <p>他們真的知道，你希望怎麼被照顧嗎？</p>
              <p>
                很多人辛苦一輩子，存下房子、保單、存款，
                卻從來沒有好好想過一件事：
              </p>
              <p className="text-center text-xl font-medium text-foreground">
                「如果有一天我不能說話，我的意願還在嗎？」
              </p>
              <p>
                人生後半場，不只是資產多少的問題，
                而是<span className="font-medium text-foreground">「你希望自己怎麼被對待」</span>的問題。
              </p>
            </div>
          </div>
        </section>

        {/* 真實案例 */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            這些故事，每天都在發生
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            問題從來不是財產，而是——沒有規劃。
          </p>
          <div className="mt-8 space-y-4">
            {realStories.map((story, i) => (
              <Card key={i} className="border-muted">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E3A5F]/10 text-lg font-semibold text-[#1E3A5F]">
                    {i + 1}
                  </div>
                  <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {story.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-base text-muted-foreground">
              很多家庭不是沒有愛，而是沒有說清楚。
              <br />
              很多衝突不是因為貪婪，而是因為沒有安排。
            </p>
          </div>
        </section>

        {/* 課程三大核心 */}
        <section id="course-content" className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            這堂課，不只是談錢
          </h2>
          <p className="mt-3 text-center text-lg text-muted-foreground">
            這是一堂關於<span className="font-medium text-foreground">尊嚴</span>、
            <span className="font-medium text-foreground">選擇</span>、
            <span className="font-medium text-foreground">家庭關係</span>的課。
          </p>
          <p className="mt-1 text-center text-base text-muted-foreground">
            我們會一起梳理三件最重要的事：
          </p>

          {/* Steps overview image */}
          <div className="mt-8 overflow-hidden rounded-xl">
            <Image
              src="/images/workshops/senior-steps-overview.webp"
              alt="課程三大步驟：梳理現況、法律存證、信託執行"
              width={1200}
              height={670}
              className="w-full"
            />
          </div>

          <div className="mt-10 space-y-12">
            {threePillars.map((pillar) => (
              <div
                key={pillar.number}
                className="grid items-center gap-6 sm:grid-cols-2"
              >
                <div className="overflow-hidden rounded-xl">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    width={800}
                    height={600}
                    className="h-auto w-full"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E3A5F] text-sm font-bold text-white">
                      {pillar.number}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold sm:text-xl">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {pillar.subtitle}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {pillar.points.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-base text-muted-foreground"
                      >
                        <span className="text-[#C8953D]">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-base font-medium text-foreground">
                    {pillar.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 你不是為自己而來 */}
        <section className="border-t py-14 sm:py-16">
          <Card className="border-[#1E3A5F]/20 bg-[#1E3A5F]/5">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-center text-xl font-bold sm:text-2xl">
                你其實不是為了自己而來
              </h2>
              <p className="mt-4 text-center text-base text-muted-foreground">
                你是為了——
              </p>
              <div className="mx-auto mt-6 max-w-md space-y-3">
                <div className="flex items-center gap-3 text-base sm:text-lg">
                  <span className="text-[#C8953D]">❤️</span>
                  <span>不讓孩子在醫院裡彼此爭吵</span>
                </div>
                <div className="flex items-center gap-3 text-base sm:text-lg">
                  <span className="text-[#C8953D]">❤️</span>
                  <span>不讓另一半在焦慮中做決定</span>
                </div>
                <div className="flex items-center gap-3 text-base sm:text-lg">
                  <span className="text-[#C8953D]">❤️</span>
                  <span>不讓財產成為家庭裂痕</span>
                </div>
              </div>
              <p className="mt-6 text-center text-lg font-semibold text-foreground">
                你是為了守住關係。
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 3 小時帶走什麼 */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            3 小時，給未來一個答案
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            這堂課不會推銷商品，不會用艱澀法律嚇你。
          </p>
          <p className="mt-1 text-center text-base text-muted-foreground">
            我們會用真實案例、清楚架構，帶你一步一步看清：
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1E3A5F]/10 text-xl">
                  🔍
                </div>
                <p className="mt-3 text-base font-semibold">你的風險在哪</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  盤點盲點與缺口
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1E3A5F]/10 text-xl">
                  📋
                </div>
                <p className="mt-3 text-base font-semibold">你可以怎麼安排</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  具體的工具與方法
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1E3A5F]/10 text-xl">
                  🏠
                </div>
                <p className="mt-3 text-base font-semibold">回家就能開始做什麼</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  今天就能踏出第一步
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 適合誰 */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            這堂課適合你嗎？
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            適合熟齡族、退休族、準退休族，以及關心父母資產安全的子女。
          </p>
          <div className="mx-auto mt-8 max-w-md space-y-3">
            {targetAudience.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1E3A5F]/10">
                  <span className="text-[#1E3A5F]">✓</span>
                </div>
                <span className="text-base">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-base font-medium text-foreground">
            如果你符合其中一項，越早規劃越有主動權。
          </p>
        </section>

        {/* 講師介紹 */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            關於講師
          </h2>
          <Card className="mt-8">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-32">
                  <Image
                    src="/images/workshops/instructor-runsheng.webp"
                    alt="駱潤生老師"
                    width={800}
                    height={695}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">駱潤生</h3>
                  <p className="mt-1 text-sm font-medium text-[#C8953D]">
                    CFP® 國際認證理財規劃顧問
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {credentials.slice(1).map((cred, i) => (
                      <Badge key={i} variant="secondary" className="text-xs font-normal">
                        {cred}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2">
                    {instructorHighlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-base text-muted-foreground"
                      >
                        <span className="text-[#C8953D] shrink-0">✓</span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">專長領域：</span>
                    高齡財務規劃｜信託規劃｜資產保全｜傳承安排
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 報名資訊 */}
        <section id="register" className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            開課資訊
          </h2>

          <Card className="mt-8 border-[#1E3A5F]/20 bg-[#1E3A5F]/5">
            <CardContent className="p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* 左側：課程資訊 */}
                <div className="space-y-3 text-base">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span className="font-medium">
                      第 1 梯次：2026/4/19（日）
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕘</span>
                    <span>14:00 – 17:00（3 小時）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>台北市區（報名後通知地點）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>限額 10 名</span>
                  </div>
                </div>

                {/* 右側：方案與價格 */}
                <div className="space-y-4">
                  <div className="rounded-lg border border-[#C8953D]/30 bg-[#C8953D]/5 p-4">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#C8953D] text-white text-xs">早鳥優惠</Badge>
                      <span className="text-sm text-muted-foreground">
                        開課前 14 天
                      </span>
                    </div>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      NT$2,000
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">
                        👥 雙人同行
                      </p>
                      <p className="mt-0.5 text-lg font-bold">
                        NT$1,800
                        <span className="text-sm font-normal text-muted-foreground">
                          /人
                        </span>
                      </p>
                    </div>
                    <div className="flex-1 rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">
                        📋 一般報名
                      </p>
                      <p className="mt-0.5 text-lg font-bold">NT$2,800</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  size="lg"
                  className="h-12 w-full max-w-sm px-8 text-base"
                  asChild
                >
                  <a href={REGISTER_URL}>
                    立即報名
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            常見問題
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <p className="text-base font-semibold text-foreground">
                    Q：{faq.q}
                  </p>
                  <p className="mt-2 text-base text-muted-foreground">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 最終 CTA */}
        <section className="border-t py-14 sm:py-20">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              退休不是結束，而是角色的轉換。
            </p>
            <p className="mt-2 text-lg text-muted-foreground">
              從「為家庭打拼」轉為「為家庭守護」。
            </p>
            <p className="mt-6 text-xl font-semibold text-foreground sm:text-2xl">
              讓未來，不再是未知。
              <br />
              讓安排，成為溫柔的守護。
            </p>
            <Button size="lg" className="mt-8 h-12 px-8 text-base" asChild>
              <a href={REGISTER_URL}>
                立即報名｜樂齡資產安全與傳承實戰課
              </a>
            </Button>
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
  );
}
