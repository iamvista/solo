import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd, courseSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { CourseNotifyEntry } from "@/components/course/CourseNotifyEntry";
import { CourseNotifyFooter } from "@/components/course/CourseNotifyFooter";

export const metadata: Metadata = {
  title: "無人公司工作坊｜6 小時實作工作坊 | solo.tw",
  description:
    "給已經在用 AI、卻沒有因此變輕鬆的人。六小時、八次實作，把重複又消耗你的工作寫成一位 AI 員工、一條會自己走完的線。創始梯次限 20 名，開課日期尚未公告，留信箱優先通知。",
  openGraph: {
    title: "無人公司工作坊｜把你自己，一段一段寫成系統",
    description:
      "六小時、八次實作，帶走一張設定卡、一條 AOP 流程、一頁儀表板與一份九十天路線圖。創始梯次限 20 名。",
    images: [
      {
        url: "/courses/solo-company/og",
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "https://www.solo.tw/courses/solo-company",
  },
};

const painPoints = [
  {
    emoji: "🌀",
    title: "每次用 AI 都要重新交代一遍",
    text: "上次怎麼問的忘了，這次又從頭講。品質好壞看當天心情。",
  },
  {
    emoji: "🕳️",
    title: "訂閱費付了，卻沒省到時間",
    text: "工具開了一整排，但一天結束還是一樣累。",
  },
  {
    emoji: "🧠",
    title: "會做，但說不出怎麼做",
    text: "你的判斷都在腦子裡，想交出去卻寫不出來。",
  },
  {
    emoji: "🔥",
    title: "所有事都卡在你身上",
    text: "你一請假，公司就停擺。這不叫自由，叫自雇。",
  },
  {
    emoji: "🧩",
    title: "片段自動化，沒有串成線",
    text: "這裡一個小技巧、那裡一個外掛，中間永遠得你手動接。",
  },
  {
    emoji: "😬",
    title: "不敢真的放手",
    text: "怕它出錯、怕出事沒人扛，最後還是自己再做一次。",
  },
];

const layers = [
  {
    icon: "💬",
    name: "第一層　助手",
    mechanism: "你問一句它答一句，你不問就什麼都不會發生",
    who: "多數人停在這裡",
    cost: "省了打字，沒省下判斷",
  },
  {
    icon: "🔁",
    name: "第二層　工作流",
    mechanism: "固定的事固定地跑，你從執行者變成設計者",
    who: "這堂課帶你走到這裡",
    cost: "一次設計，長期複利",
  },
  {
    icon: "🤖",
    name: "第三層　代理",
    mechanism: "它自己判斷下一步，你只驗收結果與例外",
    who: "第二層跑穩之後的下一步",
    cost: "要先有護欄才敢開",
  },
];

const deliverables = [
  {
    icon: "📇",
    title: "一張六欄設定卡",
    desc: "角色、禁區、品質標準、格式、例外、驗收。你的第一位 AI 員工。",
  },
  {
    icon: "🧩",
    title: "一份 AOP 八格",
    desc: "不只寫做什麼，還有誰觸發、哪一步要你點頭、出錯怎麼辦。",
  },
  {
    icon: "🗺️",
    title: "一張個人工作地圖",
    desc: "一週的工作攤開來，分出執行與判斷，圈出真正的瓶頸。",
  },
  {
    icon: "🛡️",
    title: "三道護欄與檢查表",
    desc: "資料、權限、決策各防一種風險，附一份上線前五題檢查表。",
  },
  {
    icon: "📊",
    title: "一頁七指標儀表板",
    desc: "每天早上等你的那一頁，正常時放手、異常時叫你。",
  },
  {
    icon: "🗓️",
    title: "一份九十天路線圖",
    desc: "三個三十天，一個月一個主題，回去照著跑就好。",
  },
];

const morning = [
  {
    time: "09:00",
    module: "開場與定錨",
    content: "從一個具體的早晨開始：報表已經整理好在等你，而昨晚你在睡覺。",
    practice: "",
  },
  {
    time: "09:15",
    module: "先做一次：把一件小事交出去",
    content: "不從理論開始。三十分鐘內，你會真的把一件事交給 AI 跑完一次。",
    practice: "實作一　10 分",
  },
  {
    time: "09:40",
    module: "為什麼是現在",
    content: "三次生產力解放、回不去的缺工結構，以及公司這個詞正在被改寫。",
    practice: "",
  },
  {
    time: "10:05",
    module: "你在哪一層",
    content: "助手、工作流、代理。給自己一個座標，也看見成長空間在哪。",
    practice: "實作二　8 分",
  },
  {
    time: "10:50",
    module: "把工作攤開",
    content: "執行與判斷這條線，決定你能交出去多少。全日認知負荷最重的一段。",
    practice: "實作三　15 分",
  },
  {
    time: "11:30",
    module: "交到哪一檔",
    content: "五個問題篩一遍，L1 到 L5 選一檔，帶著選定的任務去吃午餐。",
    practice: "實作四、五　16 分",
  },
];

const afternoon = [
  {
    time: "13:00",
    module: "午後暖機：別人怎麼走的",
    content: "美國、日本、韓國與臺灣的實例。低谷時段只放故事與數字，不放框架。",
    practice: "",
  },
  {
    time: "13:22",
    module: "招募第一位 AI 員工",
    content: "六欄設定卡，把工具變成一個有職責、有標準、有禁區的員工。",
    practice: "實作六　20 分",
  },
  {
    time: "14:02",
    module: "從一個員工到一條線",
    content: "AOP 八格。把腦子裡的判斷，寫成別人接得住、AI 也跑得動的流程。",
    practice: "實作七　15 分",
  },
  {
    time: "14:52",
    module: "護欄與看不見的地基",
    content: "五種風險、三道護欄、法律三道裂縫。前面教油門，這一段講煞車。",
    practice: "",
  },
  {
    time: "15:20",
    module: "讓公司自己回報",
    content: "一頁七個指標，像飛機駕駛艙：正常時讓你放手，異常時把你叫回來。",
    practice: "",
  },
  {
    time: "15:37",
    module: "九十天，與那個人",
    content: "三個三十天的路線圖，換一把新的尺，以及三件千萬別自動化的事。",
    practice: "實作八　10 分",
  },
];

const practices = [
  ["一", "10 分", "挑一件每週都做的小事，現在就交給 AI 跑一次", "第一次成功的交付經驗"],
  ["二", "8 分", "把最近用 AI 做的三件事，標到三層座標上", "你目前的位置與成長空間"],
  ["三", "15 分", "把一週工作攤開，分執行與判斷，圈出瓶頸", "一張個人工作地圖"],
  ["四", "8 分", "拿你的瓶頸跑一遍五問篩子", "一份可交付任務清單"],
  ["五", "8 分", "選出第一個戰場，決定先交到哪一檔", "第一個任務與起始檔位"],
  ["六", "20 分", "替第一位 AI 員工寫一張六欄設定卡", "一張可以直接用的設定卡"],
  ["七", "15 分", "把那位員工做的事寫成 AOP 八格", "一份會自己走完的流程"],
  ["八", "10 分", "把三個三十天填成自己的三句話", "一份九十天路線圖"],
];

const targetAudience = [
  { icon: "🎨", text: "一人公司、自由工作者：行政與交付雜事吃掉了創作時間" },
  { icon: "🏢", text: "小團隊主理人：人少事多，想把重複的事變成共用流程" },
  { icon: "💼", text: "上班族：不能動公司系統，但想從自己那一份工作開始練" },
  { icon: "🎤", text: "講師、顧問、教練：專業都在腦子裡，說不清楚也交不出去" },
  { icon: "🤔", text: "已經在用 AI，卻覺得好像有用又好像沒省到時間的人" },
];

const notFor = [
  "只想聽 AI 趨勢、不打算動手：這堂課有八次實作，會一直請你寫東西",
  "期待上完就能全自動賺錢：這堂課教的是把系統蓋起來，不是速成",
  "想學特定軟體的操作技巧：課程不綁任何一家工具",
];

const foundingBenefits = [
  {
    icon: "💰",
    title: "創始價，而且終身鎖定",
    desc: "NT$5,800 不只是這一梯的優惠。日後任何梯次要回訓，你永遠用這個數字。",
  },
  {
    icon: "🗳️",
    title: "第二梯要加強什麼，你有話語權",
    desc: "創始學員專屬的許願區：你說哪裡卡住，我公開回覆進度，想要的人多就先做那個。",
  },
  {
    icon: "📚",
    title: "教材更新版本一路拿到",
    desc: "課程依教學回饋持續修訂，之後的新版簡報與工具，創始學員都收得到。",
  },
];

const faqs = [
  {
    q: "需要會寫程式嗎？",
    a: "完全不需要。整堂課用中文自然語言操作，也不綁任何一家 AI 工具。你只要曾經用過一次 AI 對話，就跟得上。",
  },
  {
    q: "我已經很會用 ChatGPT 或 Claude 了，還需要上嗎？",
    a: "這堂課教的不是怎麼問 AI 問題，而是怎麼把你自己的判斷寫成一套會運轉的東西。韓國企業的調查裡，導入率 61% 但真正內化只有 6.7%，差別就在這裡。你愈熟工具，這堂課的投報率愈高。",
  },
  {
    q: "跟坊間的 AI 工具課差在哪？",
    a: "工具課教你按哪個鈕，這堂課教你設計制度。工具會換，但把工作拆成執行與判斷、寫成設定卡與流程、加上護欄與儀表板，這套方法換了工具也不會壞掉。",
  },
  {
    q: "六小時會不會太趕？",
    a: "全日八次實作、共約 86 分鐘，其餘時間是講解與案例。課程刻意照注意力曲線編排：最重的實作放在認知高峰，最後半小時只做收斂，不再增加新概念。",
  },
  {
    q: "要自備什麼？",
    a: "筆記型電腦、一個你日常在用的 AI 帳號（任何一家都可以）、紙筆。另外請先想好一件「每週都要做、做起來很煩」的事，帶著它來。",
  },
  {
    q: "課後有什麼支援？",
    a: "上下午，各有豐富的簡報教材。另有專屬學員群組可持續交流。",
  },
  {
    q: "開課日期什麼時候公布？",
    a: "創始梯次的日期尚未拍板。留下 E-mail，公布時第一個通知你，創始席次也會依登記順序優先開放。",
  },
  {
    q: "退費政策？",
    a: "開課前可全額退費（需扣除金流手續費）；開課後恕不退費，但可轉讓名額或更換梯次。",
  },
];

export default function SoloCompanyPage() {
  return (
    <>
      <JsonLd
        data={courseSchema({
          name: "無人公司工作坊",
          description:
            "六小時、八次實作，把重複又消耗你的工作寫成一位 AI 員工、一條會自己走完的線、一頁每天等你的儀表板，最後帶走一份九十天路線圖。",
          url: "https://www.solo.tw/courses/solo-company",
          instructor: "Vista",
          duration: "PT6H",
          location: "臺北市",
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "首頁", href: "/" },
          { name: "課程", href: "/courses" },
          { name: "無人公司工作坊", href: "/courses/solo-company" },
        ])}
      />
      <JsonLd data={faqSchema(faqs.map((faq) => ({ question: faq.q, answer: faq.a })))} />
      <div>
        {/* ====== Hero ====== */}
        <section className="bg-gradient-to-b from-stone-100/70 to-background dark:from-stone-900/30">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-2 text-sm sm:text-base"
            >
              🏗️ 6 小時實作工作坊｜創始梯次・開課日期尚未公告
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              無人公司工作坊
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-base text-muted-foreground sm:text-lg">
              一個人，如何把自己寫成一套會運轉的系統
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
              你的公司，是<span className="gradient-text">你在硬撐</span>，還是它在運轉？
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
              你一請假，所有事就停擺。
              <br className="hidden sm:block" />
              <span className="font-semibold text-foreground">
                那不是自由，那是換一種方式的自雇。
              </span>
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <a href="#register">留信箱・開課通知我</a>
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
                <p className="mt-1 text-sm text-muted-foreground">實作工作坊</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">8</p>
                <p className="mt-1 text-sm text-muted-foreground">次動手</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">20</p>
                <p className="mt-1 text-sm text-muted-foreground">人小班制</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary sm:text-3xl">6</p>
                <p className="mt-1 text-sm text-muted-foreground">支課堂工具</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* ====== Pain Points ====== */}
          <section className="py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              這些情況，是不是每天都在發生？
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              中了三項以上，這堂課就是為你設計的。
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

          {/* ====== Core Insight ====== */}
          <section className="bg-foreground text-background py-10 sm:py-12 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-lg font-bold leading-relaxed sm:text-xl">
                <span className="text-primary">
                  問題從來不是 AI 不夠強，是你沒有把它變成會固定運轉的東西。
                </span>
                <br />
                <span className="font-normal text-background/80">
                  韓國企業導入生成式 AI 的比例是 61%，真正在組織內部穩定運作的只有 6.7%。
                  中間那五十幾個百分點，就是「有工具」與「有系統」的距離。
                </span>
              </p>
            </div>
          </section>

          {/* ====== 三層座標 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              先搞清楚你站在哪一層
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              三層的差別不是工具，是誰在推。多數人卡在第一層。
            </p>

            <div className="mt-8 space-y-3">
              {layers.map((layer, i) => (
                <Card key={i} className="border-muted">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3 sm:w-1/4">
                        <span className="text-2xl">{layer.icon}</span>
                        <span className="text-base font-bold text-foreground">
                          {layer.name}
                        </span>
                      </div>
                      <div className="flex-1 grid gap-1 sm:grid-cols-3 text-sm text-muted-foreground">
                        <div className="sm:col-span-1">
                          <span className="text-xs font-medium text-foreground/60">
                            怎麼運作
                          </span>
                          <p>{layer.mechanism}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-foreground/60">
                            誰在這裡
                          </span>
                          <p>{layer.who}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-foreground/60">
                            實際差別
                          </span>
                          <p>{layer.cost}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ====== What You'll Take Home ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              下課前你會帶走這些
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              不是筆記，是六件回去就能直接用的東西。
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {deliverables.map((d, i) => (
                <Card key={i} className="border-muted">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{d.icon}</span>
                      <h3 className="text-base font-bold">{d.title}</h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{d.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ====== Curriculum ====== */}
          <section id="curriculum" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              一整天的安排
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              照學習曲線排，不照書的章節排：先有一次成功，再講道理。
            </p>

            <h3 className="mt-10 text-base font-bold text-foreground">
              上午 09:00 至 12:00　看見，然後第一次交出去
            </h3>
            <div className="mt-4 space-y-3">
              {morning.map((s, i) => (
                <Card key={i} className={s.practice ? "border-primary/20" : ""}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 shrink-0 sm:w-36 sm:flex-col sm:items-start sm:gap-1">
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {s.time}
                        </Badge>
                        {s.practice && (
                          <span className="text-xs font-medium text-primary whitespace-nowrap">
                            {s.practice}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-foreground">
                          {s.module}
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {s.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h3 className="mt-10 text-base font-bold text-foreground">
              下午 13:00 至 16:00　從一個工作站，到一條會跑的線
            </h3>
            <div className="mt-4 space-y-3">
              {afternoon.map((s, i) => (
                <Card key={i} className={s.practice ? "border-primary/20" : ""}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 shrink-0 sm:w-36 sm:flex-col sm:items-start sm:gap-1">
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {s.time}
                        </Badge>
                        {s.practice && (
                          <span className="text-xs font-medium text-primary whitespace-nowrap">
                            {s.practice}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-foreground">
                          {s.module}
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {s.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ====== 八次實作 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              八次動手，八件產出
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              全日約四分之一的時間在動手。每一次都留下一件東西，串起來就是你的方案。
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      實作
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      時間
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      做什麼
                    </th>
                    <th className="pb-3 text-left font-medium text-primary">
                      帶走什麼
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {practices.map((p, i) => (
                    <tr key={i}>
                      <td className="py-3 font-medium text-foreground whitespace-nowrap">
                        {p[0]}
                      </td>
                      <td className="py-3 text-muted-foreground whitespace-nowrap">
                        {p[1]}
                      </td>
                      <td className="py-3 text-muted-foreground">{p[2]}</td>
                      <td className="py-3 text-foreground">{p[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ====== Target Audience ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              這堂課適合誰？
            </h2>
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

            <div className="mx-auto mt-8 max-w-lg rounded-lg border border-dashed bg-muted/30 p-5">
              <p className="text-sm font-semibold text-foreground">
                但這堂課不適合：
              </p>
              <ul className="mt-3 space-y-2">
                {notFor.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-muted-foreground">
                      ✗
                    </span>
                    <span className="text-sm text-muted-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ====== Instructor ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">關於講師</h2>

            <div className="mt-8 grid gap-8 md:grid-cols-5">
              <div className="md:col-span-2 flex flex-col items-center gap-4">
                <div className="w-full overflow-hidden rounded-2xl">
                  <Image
                    src="/images/workshops/instructor-vista.webp"
                    alt="Vista"
                    width={400}
                    height={600}
                    className="w-full object-cover"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <h3 className="text-2xl font-bold">Vista</h3>
                <p className="mt-1 text-base text-muted-foreground">
                  AI 應用培訓師・內容策略顧問
                </p>

                <div className="mt-6 space-y-2.5 text-sm">
                  {[
                    "20 年以上數位內容產業經歷",
                    "前風傳媒產品總監・前數位時代主編",
                    "著有《ChatGPT 提問課》《慢讀秒懂》等 20 餘本",
                    "200 場以上 AI 主題演講・100 場以上企業內訓",
                    "18,500 位以上電子報訂閱者",
                    "經營十個站臺與一整套線上工具",
                  ].map((t, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-primary shrink-0">✓</span>
                      <span className="text-muted-foreground">{t}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    這堂課的內容不是整理自二手資料。課堂上示範的設定卡、流程與儀表板，
                    都是他自己每天在跑的版本，包含那些踩過的坑與後來補上的護欄。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ====== 創始梯次 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              關於創始梯次
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              第一梯只收 20 位。你買到的不只是比較低的價格，是一個位置。
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {foundingBenefits.map((b, i) => (
                <Card key={i} className="border-primary/20 bg-primary/5">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{b.icon}</span>
                      <h3 className="text-base font-bold">{b.title}</h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              創始梯次結束後，這堂課會以正式價 NT$8,800 開放。創始學員的回訓價永遠是 NT$5,800。
            </p>
          </section>

          {/* ====== Registration ====== */}
          <section id="register" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">開課通知</h2>

            <Card className="mt-8 border-primary/20 bg-primary/5">
              <CardContent className="p-6 sm:p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3 text-base">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span className="font-medium">創始梯次｜開課日期尚未公告</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🕘</span>
                      <span>9:00–12:00、13:00–16:00（6 小時，含休息與午休）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>臺北市區・捷運站步行可達（報名後告知教室地址）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>限 20 名</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💻</span>
                      <span>請攜帶筆電</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      以下為創始梯次規劃定價，日期公布後以正式公告為準
                    </p>
                    <div className="rounded-lg border border-primary/20 bg-background/80 p-4">
                      <p className="text-sm text-muted-foreground">正式價</p>
                      <p className="text-2xl font-bold text-muted-foreground line-through">
                        NT$8,800
                      </p>
                    </div>
                    <div className="rounded-lg border border-primary/40 bg-primary/10 p-4">
                      <p className="text-sm text-foreground">🏅 創始梯次價</p>
                      <p className="text-3xl font-bold text-primary">NT$5,800</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        限 20 名・回訓終身鎖定此價・含創始學員許願區
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
                    {[
                      "一個你日常在用的 AI 帳號，任何一家都可以",
                      "筆記型電腦，另備紙筆（有幾次實作刻意用手寫）",
                      "先想好一件「每週都要做、做起來很煩」的事，帶著它來",
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 text-primary">✓</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  留下 E-mail，開課日期公布時第一個通知你，創始席次依登記順序優先開放
                </p>
              </CardContent>
            </Card>
            <CourseNotifyEntry slug="solo-company" />
          </section>

          {/* ====== Two Choices ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              你有兩種選擇
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Card className="border-muted bg-muted/30">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-muted-foreground">
                    繼續每次重新交代一遍
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    工具愈訂愈多，時間卻沒有變多。所有判斷還是卡在你身上，
                    你一請假公司就停擺。偶爾有一次做得漂亮，但下次還是得從頭開始。
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-primary">
                    花六小時，把自己寫成一套系統
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    一張設定卡、一條會自己走完的線、一頁每天等你的儀表板。
                    讓那些消耗你的部分自己跑，把時間留給只有你能做的事。
                  </p>
                  <Button size="sm" className="mt-5 h-9 px-6" asChild>
                    <a href="#register">通知我開課 →</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
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
                    <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-base text-muted-foreground">
                還有其他問題？歡迎來信詢問。
              </p>
              <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <a href="#register">留信箱通知我</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base"
                  asChild
                >
                  <a href="mailto:iamvista@gmail.com">寫信給我們</a>
                </Button>
              </div>
            </div>
          </section>

          <CourseNotifyFooter slug="solo-company" />

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
