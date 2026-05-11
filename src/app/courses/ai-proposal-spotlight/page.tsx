import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd, courseSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "AI 提案成交力：讓主管與客戶點頭的實戰工作坊｜2026/6/13 臺北 | solo.tw",
  description:
    "你的提案其實並不差，而是還沒找到讓對方點頭的那個理由。一天 6 小時用「靈感製造機法則」把「沒亮點」變成「非做不可」，現場做出一份下週可呈交的優化版提案。早鳥 NT$4,980。",
  openGraph: {
    title: "AI 提案成交力：讓主管與客戶點頭的實戰工作坊｜2026/6/13 臺北",
    description:
      "用「靈感製造機法則」找到讓對方點頭的理由，再讓 AI 把亮點放大。陳建銘老師親授・限 16 名・早鳥 NT$4,980（雙人同行 NT$8,888）。",
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

const REGISTER_URL = "/courses/ai-proposal-spotlight/register";

const painPoints = [
  {
    emoji: "💢",
    title: "「這個沒有亮點。」",
    text: "你的內心在淌血：到底什麼叫亮點？你說看不到亮點，卻也沒說要什麼？",
  },
  {
    emoji: "😮‍💨",
    title: "「我們再評估看看。」",
    text: "你的內心在流淚：這已經是第三次了。到底還要評估什麼？",
  },
  {
    emoji: "😶‍🌫️",
    title: "「好像不錯，但沒有非做不可。」",
    text: "你的內心在吶喊：花了兩個月，結果只換來一句「好像還不錯」。",
  },
  {
    emoji: "🤖",
    title: "AI 用了一輪，提案還是很普通",
    text: "你的內心很受傷：以為加了 AI 就會變強，結果只是更快產出一份普通的提案。",
  },
];

const targetRoles = [
  { role: "企劃 / PM", scenario: "每季要寫年度提案、爭取資源與預算" },
  { role: "業務 / 顧問", scenario: "要說服客戶買單、推進長銷售週期" },
  { role: "行銷 / 公關", scenario: "要把活動企劃寫成主管願意買單的案" },
  { role: "中階主管", scenario: "向上爭取資源、向下說服團隊跟著做" },
  { role: "創業者 / 接案者", scenario: "對外提案決定下一筆收入" },
];

const tools = [
  {
    no: "01",
    name: "提案亮點檢核表",
    desc: "送出前先自查 12 個檢核點，不再憑感覺猜對方喜不喜歡",
  },
  {
    no: "02",
    name: "物件元素拆解表",
    desc: "12 維度系統拆解你的提案，看清「要改變什麼」",
  },
  {
    no: "03",
    name: "改變元素設計表",
    desc: "30 種改法庫，找出別人沒想過的差異化切入點",
  },
  {
    no: "04",
    name: "AI Prompt 模板組",
    desc: "痛點探索、標題生成、說服話術，三組可直接複製貼上",
  },
  {
    no: "05",
    name: "優化版提案 ×1",
    desc: "用你自己的真實提案在課堂完成優化，帶回去下週直接交",
  },
];

const flow = [
  { no: "01", title: "需求感受表", sub: "找出對方真正想要什麼" },
  { no: "02", title: "物件元素表", sub: "確認要改變什麼" },
  { no: "03", title: "改變元素表", sub: "決定怎麼改才有亮點" },
];

const beforeAfter = {
  before: {
    label: "普通提案",
    text: "辦一場 AI 工具工作坊，幫助同仁提升效率。",
  },
  after: {
    label: "亮點提案 ★",
    text: "「一天省下 30 分鐘」的 AI 工作流實作課，用同仁自己的任務現場產出——讓主管看到可衡量的成果，而不是模糊的「能力提升」。",
  },
};

const aiDiff = {
  others: {
    label: "其他 AI 課",
    sub: "先給工具，再想問題",
    points: ["教你下 Prompt", "快速產出文案", "結果：內容快，但沒差異"],
  },
  ours: {
    label: "這堂課 ★",
    sub: "先找理由，再讓 AI 放大",
    points: [
      "靈感製造機法則找亮點",
      "AI 把亮點說得更有力",
      "結果：方向對，AI 才有用",
    ],
  },
};

const testimonials = [
  {
    name: "Iris",
    role: "知名電信業 企劃人員",
    quote:
      "做提案最怕聽到「沒有亮點」，改了三版還是不知道問題在哪？上完課第一次有工具可以自己診斷，不用靠感覺猜主管要什麼。隔週把那份提案交出去，主管說「這次方向很清楚」——天啊，我終於等到了這句話。",
  },
  {
    name: "建忠",
    role: "知名汽車品牌 業務人員",
    quote:
      "報價出去之後就是等，客戶不回應也不知道哪裡出問題？上完課以後才明白，客戶沉默不是態度問題，是我沒給他回應的理由。重新整理那份提案後還不到三天，客戶就主動來電，還說這次終於看懂我們跟競品差在哪？",
  },
  {
    name: "Areal",
    role: "科技業 中階主管",
    quote:
      "要同時說服高層和客戶，壓力很大但沒有系統，每次都靠經驗硬撐。課程給了我 12 個自我檢核的角度，交提案前可以自己先把關。用 AI 優化提案這件事，上完課才第一次覺得 AI 真的有在幫我，而不是幫我生一堆廢話。",
  },
];

const stats = [
  { num: "500+", label: "培訓場次" },
  { num: "10,000+", label: "學員人次" },
  { num: "10+", label: "電視臺報導" },
  { num: "20+", label: "國際發明專利" },
];

const credentials = [
  "《靈感製造機：如何找到創新的點子？》作者・博客來實體書",
  "《鳥博士教育桌遊》flyingV 募資 127% 達成",
  "日內瓦國際發明展特別獎・臺北國際發明展金牌獎",
  "法國科學雜誌封面・南一書局國小課本收錄",
  "曾為 Synopsys 新思科技、研華、中華汽車、中華電信提供職場創新顧問培訓",
];

const instructorIntro = [
  "陳建銘老師是台灣少數同時擁有「發明家、銷售冠軍、創新講師」三重身份的實戰型顧問，媒體稱他為「生活發明王」。",
  "代表發明：「會跑的鬧鐘」、「伸縮摺疊電蚊拍」與多項商品化發明專利。靠 10 年以上創新培訓經驗、500+ 場培訓、50+ 家企業合作、10,000+ 學員，把「創新如何系統化」這件事打磨成一套可學、可練、可複製的方法。",
  "他的核心信念：「AI 是放大器，不是方向盤。你輸入什麼，它就放大什麼。方向，永遠由你決定。」這也是這堂課的核心邏輯——當每個人都會用 AI，思維方式才是真正的差異所在。",
];

const fitFor = [
  "下週就有提案要交，現在學是最直接的投資",
  "提案常被退或擱置，找不到問題出在哪裡",
  "已經會用 ChatGPT / Claude，但產出還是「正確但無感」",
  "想從執行者，升級成讓人點頭的解法設計者",
];

const notFitFor = [
  "想學 ChatGPT 基本操作（這堂課假設你會基本提問）",
  "希望有萬用模板、不需要動腦改寫",
  "不打算把方法用在自己接下來的真實提案上",
];

const faqs = [
  {
    q: "我完全不會用 AI，可以來嗎？",
    a: "可以。你不需要是 AI 高手，但你最好會基本的 ChatGPT 或 Claude 提問。重點不是教你操作，而是教你要問什麼問題，AI 才能幫你找出有亮點的方向。",
  },
  {
    q: "課堂上要帶自己的提案嗎？",
    a: "強烈建議帶。最好是下週或下個月就要交的真實提案。課程設計的宗旨是「帶問題進來、帶解法回去」，沒有真實提案會失去 80% 的練習價值。",
  },
  {
    q: "需要訂閱付費版 AI 嗎？",
    a: "建議訂閱（ChatGPT Plus、Claude Pro 或 Gemini Advanced 擇一）。免費版也能完成大部分練習，但部分進階提示效果會打折。",
  },
  {
    q: "雙人同行方案怎麼選？",
    a: "兩位夥伴一起報名 NT$8,888，課堂中可互相扮演提案方與決策方，練習效果更完整。報名時填寫主要聯絡人後，會請你補填同行夥伴的 E-mail 與手機，課前提醒會同時寄給雙方。",
  },
  {
    q: "和「創新實戰工作坊」有什麼不同？",
    a: "創新工作坊解決的是「卡住的問題」，這堂課解決的是「被退的提案」。兩堂可分開上，配合著上效果最好——一堂教你想清楚要做什麼，一堂教你說服別人讓你做。",
  },
  {
    q: "退費與轉讓政策？",
    a: "開課前 7 天（2026/6/6）前可全額退費；7 天內可轉讓名額或更換梯次。",
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
          name: "AI 提案成交力：讓主管與客戶點頭的實戰工作坊",
          description:
            "一天 6 小時用「靈感製造機法則」把「沒亮點」變成「非做不可」，現場做出一份下週可呈交的優化版提案。",
          url: "https://www.solo.tw/courses/ai-proposal-spotlight",
          instructor: "陳建銘",
          price: 4980,
          duration: "PT6H",
          startDate: "2026-06-13",
          location: "臺北市",
          image:
            "https://www.solo.tw/images/workshops/cover-ai-proposal-spotlight.webp",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "首頁", href: "/" },
          { name: "課程", href: "/courses" },
          { name: "AI 提案成交力", href: "/courses/ai-proposal-spotlight" },
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
              ✨ 6 小時實戰工作坊・2026/6/13（六）臺北・限 16 名
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              讓主管與客戶更容易點頭的
              <br />
              <span className="text-primary">AI 提案成交力</span>
              <br className="sm:hidden" />
              <span className="text-base font-medium text-muted-foreground sm:text-lg md:text-xl">
                ｜實戰工作坊
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              你的提案其實並不差，
              <br className="hidden sm:block" />
              <span className="font-semibold text-foreground">
                而是還沒找到讓對方點頭的那個理由。
              </span>
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
              只需一天現場做完，帶走一份下週可以呈交的優化版提案。
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
              早鳥 NT$4,980（5/30 截止）・含精美午餐・含限量《創新的秘密》工具牌
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* ====== 痛點共鳴 ====== */}
          <section className="py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              你是不是也碰過這些軟釘子？
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              退件時最讓人受傷的，是這幾句聽起來很客氣的話。
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
                      <p className="mt-1 text-sm text-muted-foreground italic">
                        {p.text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-lg text-muted-foreground">
                問題不是你不會寫提案，而是還沒找到
                <span className="font-medium text-foreground">
                  讓對方點頭的那個理由
                </span>
                。
              </p>
            </div>
          </section>

          {/* ====== 靈感製造機法則 ====== */}
          <section className="border-t py-14 sm:py-16">
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-primary">
              這堂課的核心方法論
            </p>
            <h2 className="mt-3 text-center text-2xl font-bold sm:text-3xl">
              靈感製造機法則
              <br className="sm:hidden" />
              <span className="text-muted-foreground"> — 創意不是等來的，是設計出來的</span>
            </h2>
            <div className="mx-auto mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                很多人以為創新靠天分、提案靠運氣。但「創新先生」陳建銘老師花了 20 年發明產品、500 場企業培訓驗證了一件事——
                <span className="font-medium text-foreground">
                  靈感不會憑空出現，而是透過結構化流程製造出來的。
                </span>
              </p>
              <p>
                「靈感製造機法則」不是課堂整理出來的工具清單，而是陳老師從真實發明（會跑的鬧鐘、伸縮摺疊電蚊拍、募資成功的教育桌遊）一路走過來，反覆修正後淬煉出的系統。
              </p>
            </div>
            <Card className="mx-auto mt-8 max-w-3xl border-amber-200/60 bg-amber-50/40">
              <CardContent className="p-6 sm:p-8">
                <p className="text-center text-base font-medium text-foreground sm:text-lg">
                  一份好提案，
                  <br className="sm:hidden" />
                  不是從「我要做什麼」開始，
                </p>
                <p className="mt-2 text-center text-base text-foreground sm:text-lg">
                  而是從「我要說服誰、他遇到什麼問題、他真正想要什麼感受、我的方案能創造什麼價值」開始。
                </p>
              </CardContent>
            </Card>
            <div className="mt-8">
              <p className="text-center text-base font-medium text-foreground">
                三表流程
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
            <p className="mx-auto mt-8 max-w-2xl text-center text-base text-muted-foreground">
              這堂課，「創新先生」會帶你走完這套系統的完整流程——用你自己的真實提案，課堂中做出來，帶回去
              <span className="font-medium text-foreground">直接交</span>。
            </p>
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
              </CardContent>
            </Card>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card className="border-stone-200">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {aiDiff.others.label}
                  </p>
                  <p className="mt-2 text-base font-medium text-stone-700">
                    {aiDiff.others.sub}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {aiDiff.others.points.map((p, i) => (
                      <li key={i}>・{p}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/40 bg-gradient-to-br from-amber-50/70 to-orange-50/40 shadow-sm">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                    {aiDiff.ours.label}
                  </p>
                  <p className="mt-2 text-base font-bold text-foreground">
                    {aiDiff.ours.sub}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-foreground">
                    {aiDiff.ours.points.map((p, i) => (
                      <li key={i}>・{p}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <p className="mt-6 text-center text-base font-medium text-foreground">
              當每個人都會用 AI，真正拉開差距的，是
              <span className="text-primary">誰更懂得找到理由</span>。
            </p>
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
          </section>

          {/* ====== 普通 vs 亮點 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              實際效果：普通提案 vs. 亮點提案
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
              差異不在詞藻有多漂亮，而在
              <span className="font-medium text-foreground">
                有沒有說中對方在意的問題
              </span>
              。
            </p>
          </section>

          {/* ====== 學員見證 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              學員見證｜帶著真實提案來，帶著結果走
            </h2>
            <div className="mt-8 space-y-5">
              {testimonials.map((t, i) => (
                <Card key={i} className="border-stone-200">
                  <CardContent className="p-6">
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                      <span className="ml-2 font-normal text-muted-foreground">
                        ｜{t.role}
                      </span>
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground italic">
                      「{t.quote}」
                    </p>
                  </CardContent>
                </Card>
              ))}
              <Card className="border-amber-200/60 bg-amber-50/40">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold text-foreground">
                    學員故事｜2025 年全國農會線上課・145 位夥伴參加
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    幾個月後，其中某位農會夥伴靠一支手機走進田間直播，現採現煮公開種植過程——她上了新聞。她做的事，就是靈感製造機法則的核心：找到消費者和農田之間隔了太多層的痛點，選對改變元素，直接建立連結。
                  </p>
                  <p className="mt-3 text-sm italic text-foreground">
                    「靈感製造機法則只是一把鑰匙。門，是她自己開的。」
                  </p>
                </CardContent>
              </Card>
            </div>
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
              他沒有刻意找媒體，是媒體主動來找他。
              <br className="hidden sm:block" />
              因為發明本身就夠有亮點，這就是陳老師要教你的事。
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
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/images/workshops/instructor-jianming.webp"
                      alt="陳建銘老師（創新先生）"
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">陳建銘</h3>
                      <span className="text-base text-muted-foreground">
                        （創新先生 Mr. Innovation）
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      職場創新顧問・發明家・20+ 項國際發明專利
                    </p>

                    <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                      {instructorIntro.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>

                    <ul className="mt-5 space-y-2">
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

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href="https://www.innovators.tw/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          創新先生官網 ↗
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href="https://ai.innovators.tw/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          AI 創新學院 ↗
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ====== 報名資訊 ====== */}
          <section id="register" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              立即報名｜限 16 名小班制
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              6/13（六）臺北・含精美午餐與咖啡
            </p>

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
                      <span>9:00–16:00（含午餐與咖啡）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>臺北市區・捷運站步行可達（報名後告知）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>限 16 名小班制</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💻</span>
                      <span>請自備筆電（Mac / Windows 皆可）</span>
                    </div>
                  </div>

                  <div className="space-y-4">
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
                    <div className="rounded-lg border border-amber-300 bg-white/60 p-3">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        👫 雙人同行
                      </div>
                      <p className="mt-1.5 text-2xl font-bold text-primary sm:text-3xl">
                        NT$ 8,888
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        兩人同行可在課堂互相扮演提案方與決策方，練習效果更完整。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 工具牌大圖 */}
                <div className="mt-8 rounded-xl border border-amber-200 bg-white/70 p-6">
                  <p className="text-sm font-semibold text-foreground">
                    🎁 早鳥贈品｜限量《創新的秘密》創新發想工具牌
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    市面上買不到的限量版工具牌，僅提供給早鳥學員。包含 30 種改變元素卡・物件元素卡・緣由創新卡，是靈感製造機法則的實體化工具，課後繼續用。
                  </p>
                  <div className="mt-4 overflow-hidden rounded-lg">
                    <Image
                      src="/images/workshops/innovation-cards.png"
                      alt="《創新的秘密》工具牌"
                      width={1280}
                      height={1032}
                      className="w-full h-auto"
                      sizes="(max-width: 768px) 100vw, 720px"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center gap-3">
                  <Button
                    size="lg"
                    className="h-12 w-full max-w-sm px-8 text-base"
                    asChild
                  >
                    <Link href={REGISTER_URL}>
                      立即報名（可選方案）
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    填寫資料 → 跳轉刷卡 → 課前 2 天會收到含教室地址的提醒信
                  </p>
                  <p className="text-xs text-muted-foreground">
                    開課前 2026/6/6（六）前可全額退費・可轉讓名額・可開立公司報帳收據
                  </p>
                </div>
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-base text-muted-foreground">
              下一個提案，不該再靠運氣。
              <br className="hidden sm:block" />
              如果你最近剛好要趕一個提案，
              <span className="font-medium text-foreground">
                現在學是給自己最好的投資
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
