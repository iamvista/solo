import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd, courseSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "AI 賦能學術研究與寫作實戰工作坊｜用 AI Agent 當研究副駕駛 | solo.tw",
  description:
    "Vista 親授・3 小時實體實作。給研究生、教師與研究員：用 AI Agent（Claude Code／Codex）跑通研究與寫作工作流——方法、心態、文獻搜集到改稿。輔助不代寫，含學術倫理與 AI 揭露。",
  openGraph: {
    title: "AI 賦能學術研究與寫作實戰工作坊｜Vista 親授 | solo.tw",
    description:
      "用 AI Agent 當研究副駕駛，加速研究與寫作，但核心思考仍來自你自己。3 小時帶走一套可複用的 AI 學術工作流。",
    images: [
      {
        url: "/images/workshops/cover-ai-academic-writing.webp",
        width: 1024,
        height: 1024,
      },
    ],
  },
  alternates: {
    canonical: "https://www.solo.tw/courses/ai-academic-writing",
  },
};

// Recur 金流：報名導向 /register 流程（表單 + Recur Hosted Checkout）
const REGISTER_URL = "/courses/ai-academic-writing/register";

// 四大支柱：方法論、心態、搜集文獻、改稿
const pillars = [
  {
    number: "01",
    title: "心態與界線",
    desc: "先想清楚 AI 能幫你到哪、哪裡不能越界。把 AI 當副駕駛而不是代筆，是整套方法的地基。",
  },
  {
    number: "02",
    title: "AI 協作方法論",
    desc: "學會怎麼跟 AI Agent 協作：怎麼問、怎麼給脈絡、怎麼一輪輪迭代，讓它真的幫上忙。",
    core: true,
  },
  {
    number: "03",
    title: "文獻搜集與消化",
    desc: "用 AI Agent 搜尋、篩選、摘要、串起幾十篇論文，抓出研究缺口，而不是逐字硬啃。",
  },
  {
    number: "04",
    title: "改稿與精修",
    desc: "用 AI 一起把草稿改得更清楚、更有邏輯、更站得住——你來改，AI 給建議。",
  },
];

// 課程三大模組
const modules = [
  {
    label: "Module 1",
    title: "心態與方法：把 AI 變成研究副駕駛",
    todo: "建立 AI 協作的心態與界線，上手 Claude Code／Codex 這類 Agent 工具的提問與迭代方法。",
    pain: "「我知道 AI 很強，但不知道怎麼用才對、用到哪算過頭。」",
    output: "一套你自己的 AI 協作原則，以及 Agent 操作基本功。",
    core: true,
  },
  {
    label: "Module 2",
    title: "讀得快：文獻搜集與消化",
    todo: "用 AI Agent 搜尋、篩選、摘要文獻，整理成一份回顧矩陣，定位你的研究缺口。",
    pain: "「文獻讀不完，讀完也記不住、串不起來。」",
    output: "一份文獻回顧矩陣，以及你的研究缺口定位。",
  },
  {
    label: "Module 3",
    title: "改得動：從草稿到改稿",
    todo: "用 AI 一起搭架構、把初稿改清楚、改有邏輯，並守住學術倫理與 AI 使用揭露。",
    pain: "「初稿卡住，改稿不知道從何下手。」",
    output: "一段你自己改過的示範，以及一份 AI 使用揭露與倫理自檢清單。",
  },
];

// 輔助 vs 代寫：這堂課的底線
const ethics = [
  {
    tag: "這堂課不教",
    title: "AI 代寫",
    desc: "讓 AI 生出你沒讀過、沒想過的內容，直接掛你的名字。這不只踩學術倫理，也讓你什麼都沒學到。",
    bad: true,
  },
  {
    tag: "這堂課教的",
    title: "AI 輔助",
    desc: "你主導思考與判斷，AI 幫你讀更快、想更清楚、寫更順。核心洞察與研究貢獻，仍然是你的。",
  },
];

// 為什麼用 AI Agent，而不是一般聊天工具
const agentVsChat = [
  {
    dim: "讀你的資料",
    chat: "只看得到你貼進去的片段",
    agent: "直接讀你本機整個資料夾的論文、文獻、草稿",
  },
  {
    dim: "做事方式",
    chat: "你問一句、它答一句",
    agent: "自己連續搜尋、開檔、整理、改寫，跑完整條工作流",
  },
  {
    dim: "記憶長度",
    chat: "聊久會忘前面，要一直重貼",
    agent: "上下文大，整章草稿、幾十篇文獻都接得住",
  },
  {
    dim: "能不能重用",
    chat: "每次都從零重來",
    agent: "流程可存成可重複的步驟，下篇論文直接套",
  },
];

const targetAudience = [
  "碩博士生：文獻讀不完、論文卡住、英文潤稿沒方向",
  "大學教師與研究員：想把 AI 變成穩定的研究生產力，而不是零散試用",
  "要投稿學術期刊或研討會的人：想讓論文更到位、又不失原意",
  "帶學生的老師：想知道怎麼引導學生「用得對」，而不是「用來作弊」",
  "任何想建立一套可重複的 AI 研究工作流、不想每次都從零重來的人",
];

// 帶得走的工具
const takeaways = [
  { name: "AI 協作原則卡", desc: "心態與界線一張卡，下筆前確認自己站在輔助這一邊。" },
  { name: "研究提問與迭代提示包", desc: "怎麼問、怎麼給脈絡、怎麼迭代，讓 AI 真的幫上忙。" },
  { name: "文獻回顧矩陣模板", desc: "把幾十篇論文整理成一張表，一眼看出共識、分歧與缺口。" },
  { name: "改稿提示包", desc: "把初稿改得更清楚、更有邏輯，而不是換一篇。" },
  { name: "Claude Code／Codex 研究工作流 SOP", desc: "把搜文獻、搭架構、改稿串成一條可重複的流程。" },
  { name: "AI 使用揭露範本＋倫理自檢清單", desc: "投稿、論文都適用，符合多數期刊與學校規範。" },
];

const faqs = [
  {
    q: "這堂課會教我用 AI 代寫論文嗎？",
    a: "不會，也不鼓勵。整堂課的底線就是「輔助不代寫」：核心思考、論點與研究洞察必須來自你自己。我們會明確劃出哪些用法合理、哪些踩線。",
  },
  {
    q: "為什麼要先訂閱 Claude Pro？",
    a: "因為這堂課用 AI Agent（Claude Code）實作研究工作流，需要付費訂閱才能完整使用。建議課前至少訂一個月 Claude Pro（US$20／月），課後再自行決定要不要續訂。若你習慣用 Codex，它沒有獨立方案、包含在 ChatGPT 付費帳號中（ChatGPT Plus，US$20／月），已有者可直接使用。課程不代付。",
  },
  {
    q: "我完全不懂 AI、沒寫過 prompt，跟得上嗎？",
    a: "跟得上。課程從零帶起，課堂會手把手帶你操作 Claude Code／Codex。重點不是技術，是把 AI 接進你研究與寫作流程的方法與心態。",
  },
  {
    q: "用 AI 會不會違反學術倫理、被期刊退稿？",
    a: "正是這堂課要解決的焦慮。我們會教合理的用法與正確的 AI 使用揭露，符合多數期刊與學校的規範，讓你用得安心、投稿不踩雷。",
  },
  {
    q: "需要先準備什麼？",
    a: "自備筆電、課前完成 Claude Code 的安裝與登入（用 Codex 者請備妥 ChatGPT 付費帳號），最好帶一個你正在進行的研究題目或一篇要改的草稿，課堂實作會直接拿你的題目練。",
  },
  {
    q: "這跟你其他 AI 課有什麼不同？",
    a: "這堂專為學術研究與寫作場景設計，從文獻一路走到投稿，講的是研究者真正會遇到的卡點，而不是泛用的 AI 操作。",
  },
];

export default function AiAcademicWritingPage() {
  return (
    <>
      <JsonLd
        data={courseSchema({
          name: "AI 賦能學術研究與寫作實戰工作坊",
          description:
            "用 AI Agent 當研究副駕駛，從方法與心態到文獻搜集與改稿，跑通研究與寫作工作流。輔助不代寫，含學術倫理與 AI 揭露原則。",
          url: "https://www.solo.tw/courses/ai-academic-writing",
          instructor: "Vista",
          price: 4500,
          duration: "PT3H",
          startDate: "2026-08-16",
          location: "臺北市",
          image:
            "https://www.solo.tw/images/workshops/cover-ai-academic-writing.webp",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "首頁", href: "/" },
          { name: "課程", href: "/courses" },
          {
            name: "AI 賦能學術研究與寫作實戰工作坊",
            href: "/courses/ai-academic-writing",
          },
        ])}
      />
      <JsonLd
        data={faqSchema(
          faqs.map((faq) => ({ question: faq.q, answer: faq.a }))
        )}
      />
      <div>
        {/* Hero */}
        <section className="relative overflow-hidden border-b">
          {/* 背景主視覺：紙藝風學術元素，右側為主體、左側留白放文案 */}
          <div className="absolute inset-0">
            <Image
              src="/images/workshops/hero-ai-academic-writing.webp"
              alt="AI 賦能學術研究與寫作：用 AI Agent 當研究副駕駛"
              fill
              priority
              sizes="100vw"
              className="object-cover object-right"
            />
            {/* 左側淺色漸層遮罩，確保文案在淺色與深色模式都清楚 */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/30 sm:to-transparent" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="max-w-xl">
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm sm:text-base">
                🎓 AI 學術副駕駛 · Vista 親授
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                AI 賦能學術研究與寫作實戰工作坊
              </h1>
              <p className="mt-4 text-lg text-muted-foreground sm:mt-6 sm:text-xl">
                用 AI Agent 當你的研究副駕駛，
                <span className="font-semibold text-foreground">加速研究與寫作</span>
              </p>
              <p className="mt-3 text-base text-muted-foreground">
                不是讓 AI 代寫。是讓你讀更快、想更清楚、改更好——核心思考，仍然是你的。
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                實作用 AI Agent，課前需自備筆電並建議訂閱 Claude Pro（US$20／月）。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <a href={REGISTER_URL}>立即報名</a>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                  <a href="#course-content">查看課程內容</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* 這堂課要解決的問題 */}
          <section className="py-14 sm:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-xl font-bold sm:text-2xl">
                研究者最缺的不是努力，是時間
              </h2>
              <div className="mt-8 space-y-6 text-left text-lg leading-relaxed text-muted-foreground">
                <p>
                  文獻<span className="font-medium text-foreground">讀不完</span>，
                  讀完也記不住、串不起來。
                </p>
                <p>
                  想法明明有，卻<span className="font-medium text-foreground">卡在第一段</span>；
                  初稿寫完，不知道怎麼改才會更清楚、更有邏輯。
                </p>
                <p>
                  聽說 AI 很強，但<span className="font-medium text-foreground">不敢亂用</span>：
                  會不會違反學術倫理？投稿要不要揭露？
                </p>
                <p className="text-center text-xl font-medium text-foreground">
                  「我不是要 AI 幫我寫，我是想要它幫我走快一點。」
                </p>
                <p>
                  這堂課要給你的，就是這件事：一套讓 AI 當<span className="font-medium text-foreground">副駕駛</span>、
                  而你始終握著方向盤的研究與寫作方法。
                </p>
              </div>
            </div>
          </section>

          {/* 核心定位 */}
          <section className="border-t py-14 sm:py-16">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6 sm:p-8">
                <p className="text-center text-base text-muted-foreground">核心定位</p>
                <p className="mx-auto mt-4 max-w-2xl text-center text-xl font-semibold leading-relaxed text-foreground sm:text-2xl">
                  AI 是副駕駛，不是代筆。它幫你讀更快、想更清楚、寫更順，但研究的核心思考與洞察，永遠來自你自己。
                </p>
              </CardContent>
            </Card>
          </section>

          {/* 輔助 vs 代寫 */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">先把底線講清楚</h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              同樣用 AI，差別在誰主導思考。這堂課只站在「輔助」這一邊。
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {ethics.map((e) => (
                <Card
                  key={e.title}
                  className={e.bad ? "border-muted bg-muted/30" : "border-primary bg-primary/5"}
                >
                  <CardContent className="p-6">
                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-bold ${
                        e.bad
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {e.tag}
                    </span>
                    <p className="mt-3 text-lg font-bold text-foreground">
                      {e.bad ? "✗ " : "✓ "}
                      {e.title}
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      {e.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-6 text-center text-base font-medium text-foreground">
              課程會明確劃出界線，並教你正確的 AI 使用揭露——用得對，比用得多更重要。
            </p>
          </section>

          {/* 為什麼用 AI Agent */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              為什麼用 AI Agent，而不是一般的 AI 聊天工具？
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-base text-muted-foreground">
              同樣是 AI，把研究丟給聊天工具、和交給 Claude Code／Codex 這類 Agent，差的不只是一點點。
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {agentVsChat.map((row) => (
                <Card key={row.dim} className="border-primary/20">
                  <CardContent className="p-5">
                    <p className="text-sm font-bold text-foreground">{row.dim}</p>
                    <div className="mt-3 space-y-2 text-sm leading-relaxed">
                      <p className="text-muted-foreground">
                        <span className="font-medium">💬 聊天工具：</span>
                        {row.chat}
                      </p>
                      <p className="text-foreground">
                        <span className="font-medium text-primary">🤖 Agent：</span>
                        {row.agent}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-base font-medium text-foreground">
              這就是為什麼建議你先訂閱 Claude Pro——這堂課練的是 Agent 工作流，不是貼來貼去的聊天。
            </p>
          </section>

          {/* 四大支柱 */}
          <section id="course-content" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">四個會用一輩子的支柱</h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              從心態到改稿，每一步都讓 AI 當你的副駕駛。
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {pillars.map((p) => (
                <Card
                  key={p.number}
                  className={p.core ? "border-primary bg-primary/5" : "border-muted"}
                >
                  <CardContent className="flex items-start gap-4 p-5">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        p.core ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {p.number}
                    </span>
                    <div>
                      <h3 className="text-base font-bold sm:text-lg">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground sm:text-base">{p.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* 課程架構：三大模組 */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">課程架構</h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              讀得快 → 寫得動 → 走得穩。三個模組，一條研究工作流。
            </p>
            <div className="mt-8 space-y-5">
              {modules.map((m) => (
                <Card key={m.label} className={m.core ? "border-primary bg-primary/5" : ""}>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="bg-primary text-primary-foreground">{m.label}</Badge>
                      <h3 className="text-lg font-bold">{m.title}</h3>
                      {m.core && (
                        <span className="text-xs font-medium text-primary">全課核心模組</span>
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-primary">✓</span>
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
                      src="/images/workshops/instructor-vista.webp"
                      alt="Vista"
                      width={800}
                      height={800}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Vista（鄭緯筌）</h3>
                    <p className="mt-1 text-sm font-medium text-primary">
                      AI 應用培訓師・內容策略顧問
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                      長期在大學、研究機構與學術社群分享 AI 賦能研究與寫作，講題涵蓋
                      「用 Claude Code 打造智慧學術工作系統」「研究者的全套 AI 副駕駛」
                      「AI 賦能學術寫作」等。
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                      他相信 AI 是手段，留下能複利的研究產出與思考能力才是目的——
                      所以這堂課從頭到尾只教一件事：讓 AI 幫你走得更快，而不是替你思考。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 帶得走的工具 */}
          <section className="border-t py-14 sm:py-16">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6 sm:p-8">
                <span className="mx-auto flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground">
                  ✦ {takeaways.length} 套帶得走的工具
                </span>
                <h3 className="mt-4 text-center text-lg font-bold sm:text-xl">
                  你帶走的不是聽懂，是能直接用的工作流
                </h3>
                <p className="mx-auto mt-3 max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
                  上完課，這些模板與清單就是你的研究副駕駛裝備，下一篇論文直接拿來用。
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {takeaways.map((t, i) => (
                    <div
                      key={t.name}
                      className="flex items-start gap-3 rounded-lg border border-primary/20 bg-background p-4"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
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
            <Card className="mt-8 border-primary/20 bg-primary/5">
              <CardContent className="p-6 sm:p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* 左側：課程資訊 */}
                  <div className="space-y-3 text-base">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span className="font-medium">2026/8/16（日）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🕘</span>
                      <span>09:00 – 12:00（3 小時）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>臺北市區・捷運站步行可達（報名後告知教室地址）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>限額 20 人・額滿即止</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💻</span>
                      <span>實作為主，請自備筆電</span>
                    </div>
                  </div>

                  {/* 右側：價格 */}
                  <div className="flex flex-col justify-center">
                    <div className="rounded-lg border border-primary/30 bg-background p-5 text-center">
                      <p className="text-sm text-muted-foreground">早鳥價（8/2 前）</p>
                      <p className="mt-1 text-3xl font-bold text-foreground">NT$4,500</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        原價 <span className="line-through">NT$5,500</span>
                      </p>
                      <p className="mt-1 text-xs font-medium text-primary">含全程實作引導</p>
                    </div>
                  </div>
                </div>

                {/* 報名急迫感 */}
                <div className="mx-auto mt-5 flex max-w-2xl items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-center text-sm font-medium text-foreground">
                  <span>⏳</span>
                  <span>早鳥價只到 8/2，限額 20 人，額滿即止——把握名額。</span>
                </div>

                {/* 課前準備 */}
                <div className="mx-auto mt-4 max-w-2xl rounded-lg border bg-background px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">🧰 課前準備：</span>
                  本課程以 AI Agent 實作為主，請自備筆電，並建議在課前訂閱一個月{" "}
                  <span className="font-medium text-foreground">Claude Pro（US$20／月）</span>，
                  先安裝並登入 Claude Code。若你習慣用 Codex，它沒有獨立方案、包含在 ChatGPT
                  付費帳號中（ChatGPT Plus，US$20／月）。課程不代付訂閱費用。
                </div>

                <div className="mt-6 text-center">
                  <Button size="lg" className="h-12 w-full max-w-sm px-8 text-base" asChild>
                    <a href={REGISTER_URL}>立即報名</a>
                  </Button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    點擊後填寫報名表並線上完成付款即報名成功。教室地址將於課前以 email 通知。
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
                讓 AI 幫你走得更快，
                <br />
                但思考、判斷與洞察，
                <br />
                始終握在你自己手裡。
              </p>
              <Button size="lg" className="mt-8 h-12 px-8 text-base" asChild>
                <a href={REGISTER_URL}>立即報名｜AI 賦能學術研究與寫作工作坊</a>
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
