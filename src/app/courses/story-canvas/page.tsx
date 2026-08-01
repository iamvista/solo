import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd, courseSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { CourseNotifyEntry } from "@/components/course/CourseNotifyEntry";
import { CourseNotifyFooter } from "@/components/course/CourseNotifyFooter";
import { getWorkshopBySlug } from "@/lib/workshops";
import { notFound } from "next/navigation";

const SLUG = "story-canvas";

export const metadata: Metadata = {
  title: "一人公司的故事骨架工作坊｜3 小時實體工作坊 | solo.tw",
  description:
    "把一串沒人記得的服務項目，收斂成一則別人願意替你轉述的故事。三小時實體工作坊，現場唸給陌生人聽、由對方複述驗收，限額 20 人。",
  openGraph: {
    title: "一人公司的故事骨架工作坊｜3 小時實體工作坊",
    description:
      "把一串沒人記得的服務項目，收斂成一則別人願意替你轉述的故事。現場做轉述測試，限額 20 人。",
    images: [{ url: "/courses/story-canvas/og", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://www.solo.tw/courses/story-canvas",
  },
};

/* 頁面所有梯次數值一律取自 workshops.ts，換梯只改那一處 */

const painPoints = [
  {
    emoji: "🤝",
    title: "隔週再遇到，他想不起來你在做什麼",
    text: "當下他點頭、也覺得你很專業，但那份印象撐不過一個星期。",
  },
  {
    emoji: "📇",
    title: "有人想介紹你，卻只講得出你的職稱",
    text: "最可惜的不是沒人幫你，是有人想幫你，手上卻沒有一句可以複述的話。",
  },
  {
    emoji: "📋",
    title: "自我介紹愈講愈長，愈長愈沒有形狀",
    text: "服務項目、年資、服務過幾家企業，資訊量很大，聽的人卻抓不到把手。",
  },
  {
    emoji: "🌫️",
    title: "定位句換一個同行來唸也成立",
    text: "寫得四平八穩，卻沒有一個字只屬於你。",
  },
  {
    emoji: "✍️",
    title: "自己改稿改到天花板",
    text: "你太熟悉自己的故事，熟到看不出哪裡跳掉了一段。",
  },
  {
    emoji: "🔁",
    title: "每一次都得自己在場才講得清楚",
    text: "故事不會自己走路，你就得一場一場親自解釋。",
  },
];

const takeaways = [
  {
    title: "一則寫完的故事",
    text: "不是筆記、不是待辦清單，是一則當天就能拿去用的完整敘事。",
  },
  {
    title: "一句過得了轉述測試的定位句",
    text: "判準不是你唸得順，是陌生人願不願意用自己的話再講一次。",
  },
  {
    title: "一套可以重跑的修改路徑",
    text: "下次換了受眾、換了服務，你知道該回頭改哪一欄，不必從零再想一遍。",
  },
];

/* 課綱五段對應《一人公司的故事骨架卡》的五欄，順序即現場動線 */
const curriculum = [
  {
    no: "01",
    title: "對象切片",
    goal: "把所有人收斂成一個具體的人",
    text: "先決定講給誰聽，連他此刻卡在哪一步都寫下來。對象一模糊，後面四欄跟著失焦。現場你會寫下最近三位真的付錢給你的人有什麼共同點，以及他來找你的前一晚最煩的那件事。",
    output: "現場產出：一段寫死的對象描述，含他此刻卡住的那一步",
  },
  {
    no: "02",
    title: "轉折點",
    goal: "找出你的專業從哪一次經驗長出來",
    text: "那件事是別人記得住你的鉤子，也是誰都抄不走的部分。講不出年份與地點就代表還不夠具體，現場會逼你再往下挖一層，挖到那件想起來還有點不舒服的事。",
    output: "現場產出：一件講得出時間、地點與在場者的具體經歷",
  },
  {
    no: "03",
    title: "定位句骨架",
    goal: "一句話講清楚幫誰、解決什麼、換來什麼改變",
    text: "先把服務、協助、賦能這類詞刪掉，看剩下的動詞是什麼。沒有動詞就還沒寫到重點。骨架對了，用字才有得修。",
    output: "現場產出：一句填進骨架、動詞明確的定位句初稿",
  },
  {
    no: "04",
    title: "證據欄",
    goal: "把成果寫成可以被轉述的具體事實",
    text: "誰、多久、變成什麼樣子。不用豐富經驗這種撐場面的詞，改用一個數字，或一個對方做得出來的動作。轉述的人抓得住的把手，通常就藏在這一欄。",
    output: "現場產出：一則含行業、規模與時間跨度的具體佐證",
  },
  {
    no: "05",
    title: "轉述測試",
    goal: "整堂課唯一的驗收判準",
    text: "這一欄不是最後一個步驟，是整堂課的過關條件。你會把寫好的故事唸給現場素不相識的人聽，也會替別人複述一次。他複述得出來，這則故事才算成立；複述不出來，回頭改前面四欄，不要改他。",
    output: "現場產出：一次真人轉述的結果，以及據此改過的定稿",
  },
];

const forWhom = [
  "講師、顧問、教練、設計師、接案者，靠專業接案而不是靠公司名片的人",
  "服務項目講得出來，但講完對方沒有畫面的人",
  "換過賽道或轉過行，過去經歷一時串不成一條線的人",
  "打算今年開始認真經營個人品牌，想先把那一句話定下來的人",
];

const notForWhom = [
  "只想拿一份定位句範本回去填空，不打算現場動筆的人",
  "不願意在陌生人面前把自己的故事唸出來的人",
  "希望老師直接幫你寫好一句話交件的人",
  "想學社群經營、投放與流量成長的人，這堂課只處理故事本身",
];

const faqs = [
  {
    q: "還沒填完骨架卡，可以來嗎？",
    a: "可以，而且最適合。現場本來就是拿來卡的，帶著空白或半成品進來，一句一句問到寫得出來為止。真的準備好的人反而不需要來。",
  },
  {
    q: "這件事我自己在家做不行嗎？",
    a: "可以，只是慢。你會反覆卡在同一個地方：太熟悉自己的故事，熟到看不出哪裡跳掉了一段，身邊也很難找到願意誠實說他聽不懂的人。工作坊真正給你的不是方法，是一群當場願意誠實複述的陌生人。",
  },
  {
    q: "需要先準備什麼嗎？",
    a: "先下載《一人公司的故事骨架卡》，能填多少算多少，填不出來也沒關係。另外想三位最近真的付錢給你的人，現場第一欄就會用到。",
  },
  {
    q: "要帶電腦嗎？",
    a: "帶紙筆就好。手寫速度慢，會逼你刪掉撐場面的形容詞，這是刻意的。想打字也可以，但第一輪建議手寫。",
  },
  {
    q: "這堂課會教 AI 工具嗎？",
    a: "不會。這堂課處理的是故事本身，AI 幫不了你決定哪一件事值得講。你可以在課後用任何工具改寫，但骨架得先是你自己的。",
  },
  {
    q: "本梯額滿怎麼辦？",
    a: "名額不會加，現場要一個一個聽你唸完再改，人一多就顧不到。額滿時可以在頁面下方留下 E-mail，下一梯開課會第一批通知你。",
  },
  {
    q: "報名之後不能來，可以退費嗎？",
    a: "開課前 14 天以前可全額退費，開課前 7 天以前退八成，7 天內恕不退費，但可以轉讓給他人或改期至下一梯。",
  },
];

export default function StoryCanvasPage() {
  const workshop = getWorkshopBySlug(SLUG);
  if (!workshop) notFound();

  const { title, subtitle, date, time, duration, location, capacity, price } =
    workshop;

  return (
    <>
      <JsonLd
        data={courseSchema({
          name: title,
          description: workshop.description,
          url: "https://www.solo.tw/courses/story-canvas",
          instructor: workshop.instructor.name,
          duration,
          startDate: workshop.sortDate,
          location,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "首頁", href: "/" },
          { name: "課程", href: "/courses" },
          { name: title, href: "/courses/story-canvas" },
        ])}
      />
      <JsonLd
        data={faqSchema(faqs.map((faq) => ({ question: faq.q, answer: faq.a })))}
      />

      <div>
        {/* ====== Hero ====== */}
        <section className="bg-gradient-to-b from-amber-50/60 to-background dark:from-amber-950/20">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-2 text-sm sm:text-base"
            >
              📖 3 小時實體工作坊｜{date}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
              你講完自我介紹，對方點頭。
              <br className="hidden sm:block" />
              隔週再遇到，他<span className="gradient-text">想不起來</span>
              你在做什麼。
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
              問題不出在你講得不夠多。
              <br className="hidden sm:block" />
              <span className="font-semibold text-foreground">
                清單的資訊量很大卻沒有形狀，聽的人抓不到把手，抓不到就記不住。
              </span>
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <a href="#register">留 E-mail 卡位</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
                asChild
              >
                <a href="#curriculum">看課綱</a>
              </Button>
            </div>

            <div className="mt-10 flex justify-center gap-8 sm:gap-12">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">
                  3hr
                </p>
                <p className="mt-1 text-sm text-muted-foreground">實體工作坊</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">
                  {capacity}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">人小班制</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">5</p>
                <p className="mt-1 text-sm text-muted-foreground">欄骨架</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">1</p>
                <p className="mt-1 text-sm text-muted-foreground">條判準</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* ====== 問題 ====== */}
          <section className="py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              這些情況，是不是一直在發生？
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              中了三項以上，這堂課就是為你設計的。
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {painPoints.map((p) => (
                <Card key={p.title}>
                  <CardContent className="p-5">
                    <p className="text-lg">{p.emoji}</p>
                    <p className="mt-2 font-semibold text-foreground">
                      {p.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {p.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ====== 判準 ====== */}
          <section className="-mx-4 bg-foreground px-4 py-10 text-background sm:-mx-6 sm:px-6 sm:py-12 lg:-mx-8 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm opacity-80">這堂課只有一條判準</p>
              <p className="mt-3 text-xl font-bold sm:text-2xl">
                別人願不願意用自己的話，再講一次給第三個人聽。
              </p>
              <p className="mt-3 text-sm opacity-80">
                過得了這關的故事會自己走路，過不了的，你講幾次都得自己在場。
              </p>
            </div>
          </section>

          {/* ====== 帶走什麼 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              三小時後，你帶走什麼
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {takeaways.map((t) => (
                <Card key={t.title}>
                  <CardContent className="p-5">
                    <p className="font-semibold text-foreground">{t.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ====== 課綱 ====== */}
          <section id="curriculum" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              課綱：五欄骨架，一次走完
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              五欄不跳著寫。第三欄卡住，多半是第一欄還太寬。
            </p>
            <div className="mt-8 space-y-4">
              {curriculum.map((c) => (
                <Card key={c.no}>
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-sm text-primary">
                        {c.no}
                      </span>
                      <p className="text-lg font-bold text-foreground">
                        {c.title}
                      </p>
                    </div>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                      {c.goal}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-foreground">
                      {c.text}
                    </p>
                    <p className="mt-3 text-sm font-medium text-primary">
                      {c.output}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ====== 適合與不適合 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              誰適合來，誰先別來
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="p-5">
                  <p className="font-semibold text-foreground">適合這堂課</p>
                  <ul className="mt-3 space-y-2">
                    {forWhom.map((f) => (
                      <li
                        key={f}
                        className="flex gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-primary">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="font-semibold text-foreground">
                    這堂課幫不上你
                  </p>
                  <ul className="mt-3 space-y-2">
                    {notForWhom.map((f) => (
                      <li
                        key={f}
                        className="flex gap-2 text-sm text-muted-foreground"
                      >
                        <span className="opacity-60">✕</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ====== 講師 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">講師</h2>
            <Card className="mt-8">
              <CardContent className="p-5 sm:p-6">
                <p className="text-lg font-bold text-foreground">
                  {workshop.instructor.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {workshop.instructor.title}
                </p>
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground">
                  {workshop.instructor.longBio}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* ====== 梯次與報名 ====== */}
          <section id="register" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              本梯資訊
            </h2>
            <Card className="mx-auto mt-8 max-w-xl">
              <CardContent className="p-5 sm:p-6">
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">日期</dt>
                    <dd className="font-medium text-foreground">{date}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">時間</dt>
                    <dd className="font-medium text-foreground">
                      {time}（{duration}）
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">地點</dt>
                    <dd className="text-right font-medium text-foreground">
                      {location}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">名額</dt>
                    <dd className="font-medium text-foreground">
                      限額 {capacity} 人
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">原價</dt>
                    <dd className="font-medium text-foreground">
                      NT${price.original.toLocaleString()}
                    </dd>
                  </div>
                  {price.earlyBird && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">早鳥價</dt>
                      <dd className="font-medium text-primary">
                        NT${price.earlyBird.toLocaleString()}
                        {price.earlyBirdDeadline
                          ? `（${price.earlyBirdDeadline} 前）`
                          : null}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-6 rounded-xl border border-dashed p-4 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    報名尚未開放
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    留下 E-mail，開放報名時我會從這份名單開始通知，早鳥名額也從這裡先給。
                  </p>
                </div>
              </CardContent>
            </Card>

            <CourseNotifyEntry slug={SLUG} />
          </section>

          {/* ====== FAQ ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              常見問題
            </h2>
            <div className="mt-8 space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.q}>
                  <CardContent className="p-5">
                    <p className="font-semibold text-foreground">{faq.q}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <CourseNotifyFooter slug={SLUG} />
        </div>
      </div>
    </>
  );
}
