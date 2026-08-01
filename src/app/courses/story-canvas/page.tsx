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
  title: "故事力就是你的成交力｜3 小時實體工作坊 | solo.tw",
  description:
    "會說故事跟靠故事賣東西是兩回事。三小時找出客戶掏錢那一刻的成交故事，放進開場、見證、報價與追單四個位置，現場驗收兩件事：他複述得出來嗎，他會不會想問價格。限額 20 人。",
  openGraph: {
    title: "故事力就是你的成交力｜3 小時實體工作坊",
    description:
      "把一則沒人記得的產品介紹，改成別人聽完會想問多少錢的故事。現場做雙層轉述測試，限額 20 人。",
    images: [{ url: "/courses/story-canvas/og", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://www.solo.tw/courses/story-canvas",
  },
};

/* 頁面所有梯次數值一律取自 workshops.ts，換梯只改那一處 */

const painPoints = [
  {
    emoji: "🙂",
    title: "對方說你很厲害，然後就沒有然後",
    text: "當下氣氛很好，結束後沒有下一步，也沒有人問價格。",
  },
  {
    emoji: "📄",
    title: "見證擺滿一整頁，讀者一則也沒讀完",
    text: "每一則都在說很專業很用心，換掉名字也成立，於是全部被跳過。",
  },
  {
    emoji: "💸",
    title: "報價一講出口，對話就冷掉",
    text: "問題通常不在數字，在數字前面那一段話沒有把價值墊起來。",
  },
  {
    emoji: "👍",
    title: "貼文有人按讚，沒有人私訊問你怎麼合作",
    text: "互動看起來不錯，但那些讚沒有一個走到詢價。",
  },
  {
    emoji: "🎤",
    title: "說明會講得很順，回去就沒下文",
    text: "現場聽懂了，可是回家後他複述不出來，也就說服不了要一起決定的人。",
  },
  {
    emoji: "📇",
    title: "有人想介紹你，卻只講得出你的職稱",
    text: "最可惜的不是沒人幫你，是有人想幫你，手上卻沒有一句可以轉述的話。",
  },
];

const takeaways = [
  {
    title: "一則成交故事",
    text: "不是創業歷程，也不是品牌故事，是某一位客戶決定付錢的那一刻，寫到有時間、有地點、有數字。",
  },
  {
    title: "四個位置各一段可直接用的文字",
    text: "開場鉤子、見證改寫、報價說明、售後追單。當天離開就能貼進你的頁面與貼文。",
  },
  {
    title: "一套下次還能重跑的檢查法",
    text: "換了受眾、換了產品，你知道回頭改哪一段，不必每次從零再想一遍。",
  },
];

/* 課綱四模組：模組一收納《一人公司的故事骨架卡》的五欄作為工作表，
   主軸不再是定位句，而是這則故事能不能帶來詢價 */
const curriculum = [
  {
    no: "01",
    title: "找出你的成交故事",
    goal: "從客戶掏錢的那一刻往回推",
    text: "多數人挑錯故事：講創業歷程、講理念、講自己有多努力。真正會賣的是另一種，某一位客戶原本猶豫、後來決定付錢，中間發生了什麼。現場用《一人公司的故事骨架卡》的五欄當工作表，把對象、轉折點、一句話、證據與驗收一次走完，但目標從自我介紹換成成交。",
    output: "現場產出：一則寫得出時間、地點與人物的成交故事",
  },
  {
    no: "02",
    title: "故事的四個賣點位置",
    goal: "同一則故事放錯位置就不會賣",
    text: "開場鉤子決定他要不要繼續聽，前三句就見真章。見證改寫是把客戶那句很專業很用心，換成他自己的話與具體數字。報價說明是價格前面那一段，決定他覺得貴還是值得。售後追單則決定他會不會再買、會不會介紹別人。四個位置要的敘事長度與情緒都不同，現場逐一改。",
    output: "現場產出：四個位置各一段成稿",
  },
  {
    no: "03",
    title: "讓人有感的敘事結構",
    goal: "有感不是形容詞堆出來的",
    text: "有感只有三種材料：具體、畫面、代價。現場練的是刪，把豐富經驗換成年份與件數，把顯著提升換成對方做得出來的動作，把很用心換成你當時放棄了什麼。這一段濃縮的是我在《內容感動行銷》與《文案力就是你的鈔能力》裡反覆講的同一件事：內容要先有感，業績才跟得上。",
    output: "現場產出：改過的版本與原稿並排，看得出差在哪裡",
  },
  {
    no: "04",
    title: "雙層轉述測試",
    goal: "整堂課唯一的過關條件",
    text: "你會把改好的故事唸給現場素不相識的人聽，也會替別人複述一次。第一層看他能不能用自己的話再講一次；第二層更狠，看他聽完會不會想問多少錢。第一層過了只算及格，第二層過了才算這則故事會替你工作。過不了就回頭改前面三個模組，不要改聽的人。",
    output: "現場產出：真人測試結果，以及據此改定的定稿",
  },
];

const forWhom = [
  "手上有東西要賣的人：接案者、講師、顧問、教練、工作室、小型品牌",
  "服務講得出來，但對方聽完不會主動問價格的人",
  "見證與案例累積了一堆，卻不知道怎麼用才有效的人",
  "每次報價都覺得要多解釋幾句才敢把數字說出口的人",
];

const notForWhom = [
  "只想拿一套模板回去套用，不打算現場動筆的人",
  "不願意在陌生人面前把自己的故事唸出來的人",
  "手上還沒有任何客戶或作品，沒有素材可以拆的人",
  "想學廣告投放、SEO 與流量成長的人，這堂課只處理故事本身",
];

const faqs = [
  {
    q: "我的定位還沒想清楚，可以來嗎？",
    a: "可以，而且順序反過來反而更快。這堂課不從定位句開始，是從一位真實客戶決定付錢的那一刻往回推。你講得出那一刻，定位通常就浮出來了。",
  },
  {
    q: "我賣的是實體商品，不是服務，也適用嗎？",
    a: "適用。四個賣點位置與商品形態無關：開場鉤子、見證改寫、報價說明、售後追單，實體商品同樣需要，甚至更需要，因為顧客沒辦法先試用你這個人。",
  },
  {
    q: "我還沒有客戶見證怎麼辦？",
    a: "帶最近一次別人願意付錢給你的經驗就好，哪怕只有一位。沒有客戶的話，帶一次你說服別人採納你意見的經驗，那也是同一種結構。",
  },
  {
    q: "這堂課會教 AI 或文案工具嗎？",
    a: "不會。工具幫不了你決定哪一件事值得講，那是這堂課要解決的。骨架先是你自己的，之後你用任何工具改寫都行。",
  },
  {
    q: "要帶電腦嗎？",
    a: "帶紙筆就好。手寫速度慢，會逼你刪掉撐場面的形容詞，這是刻意的。想打字也可以，但第一輪建議手寫。",
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
              {workshop.emoji} 3 小時實體工作坊｜{date}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
              你講完，對方說「你很厲害」。
              <br className="hidden sm:block" />
              然後就<span className="gradient-text">沒有然後</span>了。
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
              問題不是你的故事不好聽。
              <br className="hidden sm:block" />
              <span className="font-semibold text-foreground">
                是它沒有被放在會讓人掏錢的位置，也沒有留下一句他複述得出來的話。
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
                <p className="text-2xl font-bold text-primary sm:text-3xl">4</p>
                <p className="mt-1 text-sm text-muted-foreground">個賣點位置</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">2</p>
                <p className="mt-1 text-sm text-muted-foreground">層判準</p>
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

          {/* ====== 兩層判準 ====== */}
          <section className="-mx-4 bg-foreground px-4 py-10 text-background sm:-mx-6 sm:px-6 sm:py-12 lg:-mx-8 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm opacity-80">這堂課的驗收只有兩層</p>
              <p className="mt-3 text-xl font-bold sm:text-2xl">
                他能不能用自己的話再講一次？
                <br />
                他聽完會不會想問多少錢？
              </p>
              <p className="mt-3 text-sm opacity-80">
                第一層過了只算及格。第二層過了，這則故事才開始替你工作。
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
              課綱：四個模組，一條成交路徑
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              從挑對故事開始，到有人想問價格為止。
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
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  這堂課教的東西，寫在我的幾本書裡：《內容感動行銷》談內容如何帶動業績，《文案力就是你的鈔能力》談文字怎麼直接連到錢，《慢讀秒懂》拆解好文案為什麼好。三十年寫作年資、十年科技媒體編輯經驗，這三小時是把那些書濃縮成你當天就改得完的四段文字。
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
