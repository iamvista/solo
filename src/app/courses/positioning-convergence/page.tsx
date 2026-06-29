import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd, courseSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "定位收斂工作坊｜什麼都會的人，如何選出那一個能變現的自己 | solo.tw",
  description:
    "Susie Li 親授・3 小時實戰。給「什麼都會、卻選不出一個自己」的人：用六步收斂法狠下心收斂成一個記得住、又能變現的定位。",
  openGraph: {
    title: "定位收斂工作坊｜Susie Li 親授 | solo.tw",
    description:
      "什麼都會的人，如何選出那一個能變現的自己。3 小時，帶走一句話定位與一個主產品方向。",
    images: [{ url: "/images/workshops/cover-positioning-convergence.webp", width: 1024, height: 1024 }],
  },
  alternates: {
    canonical: "https://www.solo.tw/courses/positioning-convergence",
  },
};

// Recur 金流：報名導向 /register 流程（表單 + Recur Hosted Checkout）
const REGISTER_URL = "/courses/positioning-convergence/register";

// 六步收斂法（路徑＝地圖）
const sixSteps = [
  {
    number: "01",
    title: "盤點資產",
    desc: "把過去到現在的經歷、技能、興趣、學過的東西全部攤開。",
  },
  {
    number: "02",
    title: "看市場位置",
    desc: "看清楚哪些資產在市場上有人要、有人付得起錢。",
  },
  {
    number: "03",
    title: "收斂取捨",
    desc: "從眾多面向裡，狠下心選一個。最難，也最值錢。",
    core: true,
  },
  {
    number: "04",
    title: "設計產品",
    desc: "把選定的核心，設計成別人聽得懂、記得住的定位與內容（用五層引擎）。",
  },
  {
    number: "05",
    title: "收集反饋",
    desc: "拿出去給真實的人看，收集反應、修正。",
  },
  {
    number: "06",
    title: "推出變現",
    desc: "把定位與產品正式推出，開始變現。",
  },
];

// 五層內容引擎（引擎＝內容怎麼打動人）
const fiveLayers = [
  {
    number: "1",
    title: "看見",
    ask: "對方現在卡在哪、痛在哪？先讓他覺得「你懂我」。",
    output: "一句說中對方處境的話",
  },
  {
    number: "2",
    title: "渴望",
    ask: "他心裡真正想被理解、想成為的那個樣子是什麼？",
    output: "對方真正想要的那個畫面",
  },
  {
    number: "3",
    title: "翻譯",
    ask: "把對方一團模糊的感受，翻成清楚的語言。這群人最缺、你最強的一步。",
    output: "把混亂講清楚的一段話",
    core: true,
  },
  {
    number: "4",
    title: "方法",
    ask: "你能怎麼陪他、帶他走到那裡？",
    output: "一個聽得懂的方法或路徑",
  },
  {
    number: "5",
    title: "接住",
    ask: "讓他知道下一步可以怎麼開始、怎麼找你。不是逼單，是把門打開。",
    output: "一個自然的邀請",
  },
];

// 課程三大模組
const modules = [
  {
    label: "Module 1",
    title: "攤開：你到底有什麼",
    todo: "盤點資產與市場位置。把所有經歷、技能、學過的東西攤開，並標出哪些有市場。",
    pain: "「我好像什麼都會一點，但又好像什麼都不夠強。」",
    output: "一張個人資產地圖，標出市場有需求的項目。",
  },
  {
    label: "Module 2",
    title: "選一個：狠下心收斂",
    todo: "從眾多面向裡收斂出一個核心定位，處理「捨不得」的心理關卡。",
    pain: "「每一個都是真的我，刪掉哪個都像背叛自己。」",
    output: "一句話定位，以及一個主產品方向。",
    core: true,
  },
  {
    label: "Module 3",
    title: "長出來：變成可被記住、能變現的東西",
    todo: "用五層內容引擎把定位設計成內容與產品，拿去收集真實反饋，調整後推出。",
    pain: "「我選好了，但不知道怎麼讓人記住、怎麼開始收費。」",
    output: "可對外溝通的定位語言、初步產品，以及一條變現路徑。",
  },
];

const targetAudience = [
  "命理師、占卜師、各類教練，或從教育界轉進身心靈的老師",
  "想法很多、學了很多、抬頭一長串，卻說不清楚自己是誰",
  "整天都在輸出內容，卻長不出一個讓人記得住的自己",
  "每一個面向都像「真實的自己」，刪掉哪一個都像背叛自己",
  "年資越深，資歷越厚，反而越選不出那個「主打的自己」",
];

// 真實案例：來找我的人，問題往往不是「不會」，而是「看不清自己」
const cases = [
  {
    tag: "太散",
    problem: "她會感受、文字很美，卻什麼都發，帳號長不出流量。",
    action: "我帶她把模糊的客戶輪廓一格一格描清楚，再把飄在空中的課程拉回地面。",
    result: "她不只不焦慮了，還自己動手設計問卷，去驗證她的客戶。",
  },
  {
    tag: "太謙",
    problem: "她一路都在進步，卻把每一次跨越都當成「剛好」，看不見自己的價值。",
    action: "我從她的人生故事裡，一段一段把被她忽略的轉折點出來、貼上名字。",
    result: "她終於講得出自己是誰——那條線，成了她介紹自己的第一句話。",
  },
  {
    tag: "太急",
    problem: "她想轉型，於是把數十年最厲害的資歷整個丟掉，急著推全新的東西。",
    action: "我把那段她急著丟掉的本事替她撿回來，接到她想去的新方向上。",
    result: "轉型不再是從零開始，而是站在最不可取代的地基上往前走。",
  },
];

// 工具欄：你帶得走的，不只是「想通了」
const takeaways = [
  { name: "客戶輪廓分析", desc: "把「我的客戶是誰」從模糊的感覺，描成具體的一個人。" },
  { name: "顧客旅程地圖", desc: "把客戶從陌生到信任的每一步畫出來，你就知道每篇內容該放哪。" },
  { name: "差異化定位", desc: "用 SEO 關鍵字反推市場真正在搜尋什麼，找出別人沒站、而你站得住的位置。" },
  { name: "五層內容結構", desc: "每一篇貼文都打得中人，從「看見」寫到「接住」。" },
  { name: "市場驗證問卷", desc: "把定位拿去問真實的人，用回饋修正，而不是自己猜。" },
  { name: "六步收斂法", desc: "從一團亂走到一個清楚定位，一步一步有路可循。" },
];

const faqs = [
  {
    q: "這是寫作課嗎？",
    a: "不是。寫作只是工具。這堂課真正交付的，是陪一個什麼都會的人，狠下心收斂成一個記得住、又能變現的定位。",
  },
  {
    q: "我東西很多、很難取捨，這堂課真的能幫我選嗎？",
    a: "可以。整套方法最難、也最值錢的，就是第三步「收斂取捨」。你選不下去，不是不會選，是捨不得，這正是課程裡最需要被陪伴與引導的一步。",
  },
  {
    q: "上完這 3 小時，我會帶走什麼？",
    a: "一句話定位、一個主產品方向，以及一條可以開始測試的變現路徑。離開教室時，你對「自己是誰、要賣什麼」會清楚很多。",
  },
  {
    q: "需要先準備什麼嗎？",
    a: "把你過去到現在的經歷、技能、興趣、學過的東西先想一輪就好。現場我們會帶你一起攤開、盤點、再收斂。",
  },
];

export default function PositioningConvergencePage() {
  return (
    <>
      <JsonLd
        data={courseSchema({
          name: "定位收斂工作坊",
          description:
            "給「什麼都會、卻選不出一個自己」的人，用六步收斂法狠下心收斂成一個記得住、又能變現的定位。",
          url: "https://www.solo.tw/courses/positioning-convergence",
          instructor: "Susie Li",
          price: 4000,
          duration: "PT3H",
          startDate: "2026-07-19",
          location: "線上",
          image: "https://www.solo.tw/images/workshops/cover-positioning-convergence.webp",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "首頁", href: "/" },
          { name: "課程", href: "/courses" },
          { name: "定位收斂工作坊", href: "/courses/positioning-convergence" },
        ])}
      />
      <div>
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#C8953D]/8 via-[#C8953D]/4 to-background">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm sm:text-base">
              🧭 定位收斂 · Susie Li 親授
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              定位收斂工作坊
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:mt-6 sm:text-xl">
              什麼都會的人，如何選出那一個
              <span className="font-semibold text-foreground">能變現的自己</span>
            </p>
            <p className="mt-3 text-base text-muted-foreground">
              這不是寫作課。是陪你狠下心，把一身本事收成一個記得住、又能變現的定位。
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <a href={REGISTER_URL}>立即報名</a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                <a href="#course-content">查看課程內容</a>
              </Button>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* 這堂課要解決的問題 */}
          <section className="py-14 sm:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-xl font-bold sm:text-2xl">
                有一群人，學得很多、做得很雜、頭銜一長串
              </h2>
              <div className="mt-8 space-y-6 text-left text-lg leading-relaxed text-muted-foreground">
                <p>
                  他們<span className="font-medium text-foreground">想法很多，學了很多，抬頭很多</span>，
                  但不知道該選哪一個。
                </p>
                <p>
                  他們不缺內容，整天都在輸出；也不缺真誠，這群人特別會感受、會陪伴。
                </p>
                <p>
                  他們卡在<span className="font-medium text-foreground">「收斂」</span>：
                  東西太多，反而長不出一個讓人記得住的自己。
                </p>
                <p className="text-center text-xl font-medium text-foreground">
                  「每一個面向都像真實的我，刪掉哪一個都像背叛自己。」
                </p>
                <p>
                  所以他們選不下去：不是不會選，
                  <span className="font-medium text-foreground">是捨不得</span>。
                  這堂課要解決的，就是這一件事。
                </p>
              </div>
            </div>
          </section>

          {/* 核心定位 */}
          <section className="border-t py-14 sm:py-16">
            <Card className="border-[#C8953D]/20 bg-[#C8953D]/5">
              <CardContent className="p-6 sm:p-8">
                <p className="text-center text-base text-muted-foreground">核心定位</p>
                <p className="mx-auto mt-4 max-w-2xl text-center text-xl font-semibold leading-relaxed text-foreground sm:text-2xl">
                  我設計的不是寫作課，而是一套幫人從一堆身份裡，選出那一個能被記住、也能變現的自己的方法。
                </p>
              </CardContent>
            </Card>
          </section>

          {/* 方法論兩層次 */}
          <section id="course-content" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">一套方法，兩個層次</h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              不是並列的兩套東西，而是上下嵌套：地圖裝著引擎。
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card className="border-[#C8953D]/20">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-[#C8953D]">你走的路 · 地圖</p>
                  <p className="mt-2 text-lg font-bold">路徑：六步收斂法</p>
                  <p className="mt-2 text-base text-muted-foreground">
                    一個人從一團亂，走到一個清楚定位的先後順序。
                  </p>
                </CardContent>
              </Card>
              <Card className="border-[#C8953D]/20">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-[#C8953D]">內容怎麼打動人 · 引擎</p>
                  <p className="mt-2 text-lg font-bold">引擎：五層內容結構</p>
                  <p className="mt-2 text-base text-muted-foreground">
                    走到第四步要設計內容時，每一篇內容內部該有的結構。
                  </p>
                </CardContent>
              </Card>
            </div>
            <p className="mt-6 text-center text-base font-medium text-foreground">
              六步是地圖，五層是引擎。走到第四步「設計產品」時，把五層引擎裝進去。
            </p>
          </section>

          {/* 六步收斂法 */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">路徑：六步收斂法</h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              別人停在「教你列清單」，我們陪你走過「捨」這一關。
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {sixSteps.map((step) => (
                <Card
                  key={step.number}
                  className={step.core ? "border-[#C8953D] bg-[#C8953D]/5" : "border-muted"}
                >
                  <CardContent className="flex items-start gap-4 p-5">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        step.core ? "bg-[#C8953D] text-white" : "bg-[#C8953D]/10 text-[#C8953D]"
                      }`}
                    >
                      {step.number}
                    </span>
                    <div>
                      <h3 className="text-base font-bold sm:text-lg">
                        {step.title}
                        {step.core && (
                          <span className="ml-2 align-middle text-xs font-medium text-[#C8953D]">
                            這套方法的心臟
                          </span>
                        )}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground sm:text-base">{step.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-8 text-center text-lg font-medium text-foreground">
              這群人選不下去，不是不會選，是捨不得。
              <br className="hidden sm:block" />
              第三步要處理的，不是技巧，是「捨」這一關。
            </p>
          </section>

          {/* 五層內容引擎 */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">引擎：五層內容結構</h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              每一篇內容內部都照這五層走，用這群人聽得進去的說法，
              <br className="hidden sm:block" />
              不講「製造渴望、導向轉換」這種會讓人皺眉的行銷詞。
            </p>
            <div className="mt-8 space-y-3">
              {fiveLayers.map((layer) => (
                <div
                  key={layer.number}
                  className={`grid items-center gap-3 rounded-lg border p-4 sm:grid-cols-[auto_1fr_auto] ${
                    layer.core ? "border-[#C8953D] bg-[#C8953D]/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        layer.core ? "bg-[#C8953D] text-white" : "bg-[#C8953D]/10 text-[#C8953D]"
                      }`}
                    >
                      {layer.number}
                    </span>
                    <span className="text-base font-bold">{layer.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground sm:text-base">{layer.ask}</p>
                  <p className="text-sm font-medium text-foreground sm:text-right">
                    → {layer.output}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-base font-medium text-foreground">
              關鍵在第三層「翻譯」：把感受翻成語言。
              這群人最大的價值是「會感受」，最大的卡點是「講不清楚」。
            </p>
          </section>

          {/* 課程架構：三大模組 */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">課程架構</h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              攤開 → 選一個 → 長出來。三個模組，一條收斂路徑。
            </p>
            <div className="mt-8 space-y-5">
              {modules.map((m) => (
                <Card
                  key={m.label}
                  className={m.core ? "border-[#C8953D] bg-[#C8953D]/5" : ""}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="bg-[#C8953D] text-white">{m.label}</Badge>
                      <h3 className="text-lg font-bold">{m.title}</h3>
                      {m.core && (
                        <span className="text-xs font-medium text-[#C8953D]">全課核心模組</span>
                      )}
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">要做的事</p>
                        <p className="mt-1 text-sm">{m.todo}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">處理的卡點</p>
                        <p className="mt-1 text-sm italic text-muted-foreground">{m.pain}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">輸出成果</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{m.output}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* 適合誰 */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">這堂課適合你嗎？</h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              如果你符合其中一項，這堂課就是為你設計的。
            </p>
            <div className="mx-auto mt-8 max-w-xl space-y-3">
              {targetAudience.map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C8953D]/10">
                    <span className="text-[#C8953D]">✓</span>
                  </div>
                  <span className="text-base">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 講師介紹 */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">關於講師</h2>
            <Card className="mt-8">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-32">
                    <Image
                      src="/images/workshops/instructor-susie-2.webp"
                      alt="Susie Li"
                      width={800}
                      height={1190}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Susie Li</h3>
                    <p className="mt-1 text-sm font-medium text-[#C8953D]">
                      社群內容策略師・心理學碩士・資深媒體人
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                      從臺灣媒體圈出發，移居海外後從零開始經營個人粉專，不靠廣告預算、不靠演算法紅利，
                      純粹用內容的力量建立影響力。
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                      擁有心理學碩士背景與多年主流媒體經驗，深諳內容產製邏輯，
                      更理解人為什麼會想回應、想分享，這正是「定位收斂」最需要的那雙眼睛。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 真實案例 */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">收斂之後，他們長成了誰</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-base text-muted-foreground">
              來找我的人，問題往往不是「不會」，而是「看不清自己」。我遇過三種——
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {cases.map((c) => (
                <Card key={c.tag} className="border-[#C8953D]/20">
                  <CardContent className="flex h-full flex-col p-6">
                    <span className="inline-flex w-fit rounded-full bg-[#C8953D]/10 px-3 py-1 text-sm font-bold text-[#C8953D]">
                      {c.tag}
                    </span>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.problem}</p>
                    <p className="mt-3 text-sm leading-relaxed text-foreground">{c.action}</p>
                    <p className="mt-3 text-base font-medium leading-relaxed text-foreground">
                      {c.result}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 工具欄：帶得走的工具 */}
            <Card className="mt-8 border-[#C8953D]/20 bg-[#C8953D]/5">
              <CardContent className="p-6 sm:p-8">
                <span className="mx-auto flex w-fit items-center gap-2 rounded-full bg-[#C8953D] px-4 py-1.5 text-sm font-bold text-white">
                  ✦ {takeaways.length} 套帶得走的工具
                </span>
                <h3 className="mt-4 text-center text-lg font-bold sm:text-xl">
                  你帶得走的，不只是「想通了」
                </h3>
                <p className="mx-auto mt-3 max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
                  這堂課用的，是我多年行銷實戰提煉出的一整套方法。上完課，你帶走的不是感覺，是能直接用的工具。
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {takeaways.map((t, i) => (
                    <div
                      key={t.name}
                      className="flex items-start gap-3 rounded-lg border border-[#C8953D]/20 bg-background p-4"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C8953D]/10 text-sm font-bold text-[#C8953D]">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-base font-bold text-foreground">{t.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 開課資訊 */}
          <section id="register" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">開課資訊</h2>
            <Card className="mt-8 border-[#C8953D]/20 bg-[#C8953D]/5">
              <CardContent className="p-6 sm:p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* 左側：課程資訊 */}
                  <div className="space-y-3 text-base">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span className="font-medium">2026/7/19（日）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🕘</span>
                      <span>上午 9:00 – 12:00（3 小時）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>線上舉辦（報名後通知會議網址連結）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>限額 40 人・額滿即止</span>
                    </div>
                  </div>

                  {/* 右側：價格 */}
                  <div className="flex flex-col justify-center">
                    <div className="rounded-lg border border-[#C8953D]/30 bg-background p-5 text-center">
                      <p className="text-sm text-muted-foreground">課程費用</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        海外同類定位陪跑 約{" "}
                        <span className="line-through">NT$40,000</span>
                      </p>
                      <p className="mt-1 text-3xl font-bold text-foreground">NT$4,000</p>
                      <p className="mt-1 text-xs font-medium text-[#C8953D]">
                        首期精選價・約十分之一
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">含全程實作引導</p>
                    </div>
                  </div>
                </div>

                {/* 價格錨定說明 */}
                <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
                  海外一對一定位陪跑動輒四萬起跳；我把同一套方法收進 3 小時工作坊，
                  讓你用約十分之一的價格，先拿到結果。
                </p>

                {/* 報名急迫感 */}
                <div className="mx-auto mt-5 flex max-w-2xl items-center justify-center gap-2 rounded-lg border border-[#C8953D]/30 bg-[#C8953D]/10 px-4 py-3 text-center text-sm font-medium text-foreground">
                  <span>⏳</span>
                  <span>首期精選價・限額 40 人，額滿或開課前即截止——把握這一梯。</span>
                </div>

                <div className="mt-6 text-center">
                  <Button size="lg" className="h-12 w-full max-w-sm px-8 text-base" asChild>
                    <a href={REGISTER_URL}>立即報名</a>
                  </Button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    點擊後填寫報名表並線上完成付款即報名成功；過往寫作課學員可在結帳頁輸入專屬優惠碼折抵 NT$300。會議網址連結將於課前以 email 通知。
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* FAQ */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">常見問題</h2>
            <div className="mt-8 space-y-4">
              {faqs.map((faq, i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <p className="text-base font-semibold text-foreground">Q：{faq.q}</p>
                    <p className="mt-2 text-base text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* 最終 CTA */}
          <section className="border-t py-14 sm:py-20">
            <div className="text-center">
              <p className="text-xl font-semibold text-foreground sm:text-2xl">
                我做的不是教人寫作，
                <br />
                是陪一個什麼都會的人，
                <br />
                選出那一個能被記住、也能變現的自己。
              </p>
              <Button size="lg" className="mt-8 h-12 px-8 text-base" asChild>
                <a href={REGISTER_URL}>立即報名｜定位收斂工作坊</a>
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
    </>
  );
}
