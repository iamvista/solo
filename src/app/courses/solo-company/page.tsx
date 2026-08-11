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
  title: "無人公司工作坊｜一日實作工作坊 | solo.tw",
  description:
    "給案子接得到、客戶回得完，卻每一件都得自己碰一次的人。不是 AI 工具課，是用 AI 當執行力的經營課。一整天、八次動手，把重複又消耗你的工作變成一位會上工的 AI 員工。創始梯次限 20 名，開課日期尚未公告。",
  openGraph: {
    title: "無人公司工作坊｜把你自己，一段一段寫成系統",
    description:
      "下課前，你會有一位已經上工的 AI 員工、一條跑過一次的流程，以及一份九十天路線圖。創始梯次限 20 名。",
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
    emoji: "🧠",
    title: "會做，但說不出怎麼做",
    text: "你的判斷都在腦子裡。想交出去，卻寫不出來，所以也請不動人。",
  },
  {
    emoji: "🌀",
    title: "每次用 AI 都要重新交代一遍",
    text: "上次怎麼問的忘了，這次又從頭講。品質好壞看當天心情。",
  },
  {
    emoji: "😬",
    title: "不敢真的放手",
    text: "怕它出錯、怕出事沒人扛，最後還是自己再做一次，等於白交。",
  },
  {
    emoji: "🔥",
    title: "忙到沒空建系統",
    text: "你知道該系統化，但每天都在救火。那個「有空的一天」永遠不會來。",
  },
  {
    emoji: "🕳️",
    title: "訂閱費付了，卻沒省到時間",
    text: "工具開了一整排，但一天結束還是一樣累。",
  },
  {
    emoji: "📉",
    title: "看不到全貌，只能靠感覺決定",
    text: "數字散在五個後臺。等你湊完，一個早上也沒了。",
  },
];

const audience = [
  {
    icon: "🎨",
    who: "接案工作者與自由工作者",
    stuck: "案子接得到，但報價、對帳、交付、跟進全是你一個人在跑。",
  },
  {
    icon: "🎤",
    who: "講師、顧問、教練",
    stuck: "課有人上、案子有人找，可是備課與行政全卡在你身上，接單量被自己的時間綁死。",
  },
  {
    icon: "🛒",
    who: "一人電商與知識產品經營者",
    stuck: "訂單有，但客服、出貨、內容、對帳輪流吃掉你的一天。",
  },
  {
    icon: "🏢",
    who: "二到五人的小團隊主理人",
    stuck: "人少事多，每個人都在救火，同樣的事每個人各做各的。",
  },
  {
    icon: "💼",
    who: "準備轉獨立的上班族",
    stuck: "還不能動公司系統，但想先在自己那份工作上，把方法練起來。",
  },
];

const notFor = [
  "只想聽 AI 趨勢、不打算動手的人：這堂課會一直請你寫東西",
  "想學某一套軟體的操作技巧：課程不綁任何一家工具，這裡不教按鈕在哪",
  "還沒有實際業務在跑的人：沒有真實的工作可以攤開來，這堂課會變成紙上談兵",
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

const outcomes = [
  {
    icon: "🧑‍💼",
    title: "一位已經上工的 AI 員工",
    desc: "不是一張寫完就收起來的卡。下課前它會照你訂的標準，真的交回一次東西給你驗收。",
  },
  {
    icon: "🔗",
    title: "一條跑過一次的流程",
    desc: "八格 AOP 當場交給 AI 跑一輪。它一定會有地方做錯，那正是你帶走的最有價值的資訊。",
  },
  {
    icon: "🗺️",
    title: "一張畫出瓶頸的工作地圖",
    desc: "一週的工作攤在紙上，分出執行與判斷，圈出最吃你時間又最重複的那一個環節。",
  },
  {
    icon: "🛡️",
    title: "一套你敢放手的護欄",
    desc: "資料、權限、決策三道，加一份上線前的檢查表。知道出事它會叫你，你才敢真的踩油門。",
  },
  {
    icon: "📊",
    title: "一頁會自己生出來的報表",
    desc: "七個指標的規格當場定完，並用線上工具算出你現在每個月花多少小時在湊數字。",
  },
  {
    icon: "🗓️",
    title: "一份九十天路線圖",
    desc: "三個三十天，一個月一個主題。回去照著跑，不必再問下一步是什麼。",
  },
];

const acceptance = [
  "你那位 AI 員工，已經照你訂的標準交過至少一次東西，而且你當場驗收過。",
  "你的第一條流程已經真的跑過一輪，你知道它在哪一步會出錯，也知道那一格該怎麼補。",
  "你講得出接下來九十天，每一個月要做完的那一件事是什麼。",
];

const morning = [
  {
    step: "01",
    module: "開場與定錨",
    content: "從一個具體的早晨開始：報表已經整理好在等你，而昨晚你在睡覺。",
    hands: false,
  },
  {
    step: "02",
    module: "先做一次：把一件小事交出去",
    content: "不從理論開始。開場沒多久，你就會真的把一件事交給 AI 跑完一次。",
    hands: true,
  },
  {
    step: "03",
    module: "為什麼是現在",
    content: "三次生產力解放、回不去的缺工結構，以及公司這個詞正在被改寫。",
    hands: false,
  },
  {
    step: "04",
    module: "你在哪一層",
    content: "助手、工作流、代理。給自己一個座標，也看見成長空間在哪。",
    hands: true,
  },
  {
    step: "05",
    module: "把工作攤開",
    content: "執行與判斷這條線，決定你能交出去多少。全日認知負荷最重的一段。",
    hands: true,
  },
  {
    step: "06",
    module: "交到哪一檔",
    content: "五個問題篩一遍，L1 到 L5 選一檔，帶著選定的任務去吃午餐。",
    hands: true,
  },
];

const afternoon = [
  {
    step: "07",
    module: "午後暖機：別人怎麼走的",
    content: "美國、日本、韓國與臺灣的實例。這一段只放故事與數字，不放框架。",
    hands: false,
  },
  {
    step: "08",
    module: "招募第一位 AI 員工",
    content: "六欄設定卡，把工具變成一個有職責、有標準、有禁區的員工，並當場驗收它的第一份產出。",
    hands: true,
  },
  {
    step: "09",
    module: "從一個員工到一條線",
    content: "AOP 八格寫完就交給 AI 跑一輪，把腦子裡的判斷變成別人接得住的流程。",
    hands: true,
  },
  {
    step: "10",
    module: "護欄與看不見的地基",
    content: "五種風險、三道護欄、法律三道裂縫。前面教油門，這一段講煞車。",
    hands: false,
  },
  {
    step: "11",
    module: "讓公司自己回報",
    content: "一頁七個指標，像飛機駕駛艙：正常時讓你放手，異常時把你叫回來。",
    hands: false,
  },
  {
    step: "12",
    module: "九十天，與那個人",
    content: "三個三十天的路線圖，換一把新的尺，以及三件千萬別自動化的事。",
    hands: true,
  },
];

const practices = [
  ["一", "挑一件每週都做的小事，現在就交給 AI 跑一次", "第一次成功的交付經驗"],
  ["二", "把最近用 AI 做的三件事，標到三層座標上", "你目前的位置與成長空間"],
  ["三", "把一週工作攤開，分執行與判斷，圈出瓶頸", "一張個人工作地圖"],
  ["四", "拿你的瓶頸跑一遍五問篩子", "一份可交付任務清單"],
  ["五", "選出第一個戰場，決定先交到哪一檔", "第一個任務與起始檔位"],
  ["六", "寫設定卡，並當場讓它交回第一份產出", "一位驗收過的 AI 員工"],
  ["七", "寫 AOP 八格，並交給 AI 跑一輪", "一條跑過一次的流程"],
  ["八", "把三個三十天填成自己的三句話", "一份九十天路線圖"],
];

const notAToolCourse = [
  {
    dim: "你現在的問題",
    tool: "我不會做這個東西",
    ours: "我什麼都會做，但每一件都得我親自碰一次",
  },
  {
    dim: "下課帶走",
    tool: "一個做出來的作品",
    ours: "一套會替你重複產出的流程",
  },
  {
    dim: "驗收標準",
    tool: "我做出來了",
    ours: "我不在，它照樣跑",
  },
  {
    dim: "跟工具的關係",
    tool: "綁定某一套工具，工具改版就得重學",
    ours: "不綁任何一家，換工具也不會壞掉",
  },
  {
    dim: "有沒有人教煞車",
    tool: "幾乎不談風險",
    ours: "五種風險、三道護欄、法律地基各講一段",
  },
];

const labTools = [
  { name: "提示詞骨架器", use: "四格填完自動組成完整交辦", href: "https://lab.vista.tw/prompt-skeleton/" },
  { name: "你在硬撐，還是公司在運轉", use: "十分鐘測出你的系統成熟度", href: "https://lab.vista.tw/m/system/" },
  { name: "盲點巡查器", use: "把想不到的維度一次盤出來", href: "https://lab.vista.tw/blindspot/" },
  { name: "AI 軍團編制器", use: "排出該先請哪幾位、各自負責什麼", href: "https://lab.vista.tw/m/army/" },
  { name: "拿手絕活食譜卡", use: "把你會做的事寫成一張食譜", href: "https://lab.vista.tw/m/recipe/" },
  { name: "每天早上那一頁", use: "算出你每月花多少小時在湊數字", href: "https://lab.vista.tw/dashboard/" },
  { name: "未來新聞稿產生器", use: "先寫出終點，再倒推路線圖", href: "https://lab.vista.tw/m/future-press/" },
];

const foundingBenefits = [
  {
    icon: "🎟️",
    title: "創始價 NT$8,800",
    desc: "正式開賣後是 NT$12,800。創始梯次只有 20 個位置，這個價格不會再出現。",
  },
  {
    icon: "🔁",
    title: "永久回訓，只收 NT$1,000",
    desc: "日後任何梯次都能回來重聽，只付 NT$1,000 場地與餐飲成本。以現場空位為限，需事先登記。",
  },
  {
    icon: "🗳️",
    title: "第二梯要加強什麼，你有話語權",
    desc: "創始學員專屬的許願區：你說哪裡卡住，我公開回覆進度，想要的人多就先做那個。",
  },
];

const faqs = [
  {
    q: "我怕又是一堂聽完很有感、回去卻沒改變的課。",
    a: "這是我自己最在意的一件事，所以課程結構是照著它設計的：全日八次動手，每一次都要產出一件具體的東西，而不是抄筆記。設定卡寫完當場就要讓 AI 交件、流程寫完當場就要跑一輪。頁面上那三條驗收標準，是我對這堂課的承諾，離開教室時做不到你可以當場跟我說。",
  },
  {
    q: "這跟坊間的 vibe coding 課差在哪？",
    a: "vibe coding 課教你把一個東西做出來：網站、銷售頁、小工具。那很有價值，但沒有人教你那個東西上線之後誰維護、誰回信、出錯誰負責。這堂課處理的是後面那一段：把你腦子裡的判斷寫成流程，讓事情不需要你在場也跑得完。兩者不衝突，順序是先有東西，再有制度。",
  },
  {
    q: "我上過你的 AI 內容產製系統工作坊，這堂還需要嗎？",
    a: "需要，但方向不同。那堂課是把「內容」這一條線做深，給你一套從輸入到分發的內容產製架構。這堂課是把整間公司攤開來，教你判斷哪些工作該交、交到哪一檔、怎麼設護欄、怎麼看儀表板。用一句話說：那堂給你一條做得很好的線，這堂教你怎麼決定要蓋哪些線、以及怎麼管它們。",
  },
  {
    q: "需要會寫程式嗎？我對工具也不算熟。",
    a: "完全不需要。整堂課用中文自然語言操作，也不綁任何一家 AI 工具。你只要曾經用過一次 AI 對話，就跟得上。真正要用到的能力不是技術，是把你自己的判斷講清楚。",
  },
  {
    q: "我的行業很特殊，這套方法適用嗎？",
    a: "課程用的是你自己的工作，不是我準備的案例。第一件實作就請你挑一件「每週都要做、做起來很煩」的事，那件事會是你一整天的主角，後面的設定卡、流程、儀表板全部圍著它做。所以適不適用，取決於你有沒有重複性的工作，跟行業關係不大。",
  },
  {
    q: "課後我一個人卡住怎麼辦？",
    a: "課後有專屬學員群組可持續交流，課堂用到的七支線上工具也都能繼續使用。九十天路線圖裡我特別放了一段「第二個月一定會撞牆」的預告與三種解法，因為那是最多人放棄的時間點。",
  },
  {
    q: "一整天抽得出來嗎？內容會不會太趕？",
    a: "會是完整的一天，上午與下午各一段，中間午休。節奏刻意照注意力曲線編排：最重的動手放在精神最好的時候，午餐後那一段只放故事與案例，最後一段只做收斂，不再增加新概念。時間我會留有餘裕，不會為了趕進度砍掉你動手的時間。",
  },
  {
    q: "要自備什麼？",
    a: "筆記型電腦、一個你日常在用的 AI 帳號（任何一家都可以）、紙筆。另外請先想好一件「每週都要做、做起來很煩」的事，帶著它來。",
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
            "不是 AI 工具課，是用 AI 當執行力的經營課。一整天、八次動手，下課帶走一位已經上工的 AI 員工、一條跑過一次的流程，以及一份九十天路線圖。",
          url: "https://www.solo.tw/courses/solo-company",
          instructor: "Vista",
          duration: "P1D",
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
        {/* ====== 1. Hero ====== */}
        <section className="bg-gradient-to-b from-stone-100/70 to-background dark:from-stone-900/30">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-2 text-sm sm:text-base"
            >
              🏗️ 一日實作工作坊｜創始梯次限 20 名・開課日期尚未公告
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              無人公司工作坊
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-base text-muted-foreground sm:text-lg">
              一個人，如何把自己寫成一套會運轉的系統
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
              貴公司，是<span className="gradient-text">你在硬撐</span>，還是有系統在運轉？
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
              案子接得到、客戶回得完、內容發得出去。
              <br className="hidden sm:block" />
              <span className="font-semibold text-foreground">
                代價是每一件都得你親自碰一次，你成了自己公司的瓶頸。
              </span>
            </p>
            <p className="mx-auto mt-5 max-w-xl rounded-lg border border-dashed bg-muted/40 px-4 py-3 text-sm text-muted-foreground sm:text-base">
              這不是一堂 AI 工具課，
              <span className="font-semibold text-foreground">
                是一堂用 AI 當執行力的經營課。
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
                <p className="text-2xl font-bold text-primary sm:text-3xl">1</p>
                <p className="mt-1 text-sm text-muted-foreground">整天實作</p>
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
                <p className="text-2xl font-bold text-primary sm:text-3xl">7</p>
                <p className="mt-1 text-sm text-muted-foreground">支課堂工具</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* ====== 2. Pain Points ====== */}
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

          {/* ====== 3. 這堂課是為誰設計的 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              這堂課是為誰設計的
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              共同點只有一個：你的收入已經在跑，瓶頸是你自己的時間。
            </p>

            <div className="mt-8 space-y-3">
              {audience.map((a, i) => (
                <Card key={i} className="border-muted">
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className="text-2xl shrink-0">{a.icon}</span>
                    <div>
                      <p className="text-base font-bold text-foreground">
                        {a.who}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {a.stuck}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-dashed bg-muted/30 p-5">
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

          {/* ====== 4. Core Insight ====== */}
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

          {/* ====== 5. 三層座標 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              這堂課要把你從第一層，帶到第二層
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

          {/* ====== 6. 成果 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              下課前，你會有一位已經上工的 AI 員工
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              不是六份寫完就收起來的講義，是六件當天就跑過、驗收過的東西。
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {outcomes.map((d, i) => (
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

            {/* 驗收標準 */}
            <Card className="mt-8 border-primary/30 bg-primary/5">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-base font-bold text-foreground">
                  離開教室時，請拿這三條檢查我
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  這是我對這堂課的驗收標準。三條沒有全部做到，你可以當場跟我說。
                </p>
                <ul className="mt-5 space-y-3">
                  {acceptance.map((t, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground">{t}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* ====== 7. Curriculum ====== */}
          <section id="curriculum" className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              一整天，會怎麼走
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              照學習曲線排，不照書的章節排：先有一次成功，再講道理。
            </p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              下面是內容的順序，不是時刻表。實際節奏會依現場狀況調整，動手的時間我會留足。
            </p>

            <h3 className="mt-10 text-base font-bold text-foreground">
              上半場　看見，然後第一次交出去
            </h3>
            <div className="mt-4 space-y-3">
              {morning.map((s, i) => (
                <Card key={i} className={s.hands ? "border-primary/20" : ""}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 shrink-0 sm:w-28 sm:flex-col sm:items-start sm:gap-1">
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {s.step}
                        </Badge>
                        {s.hands && (
                          <span className="text-xs font-medium text-primary whitespace-nowrap">
                            ✍️ 動手
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
              下半場　從一個工作站，到一條會跑的線
            </h3>
            <div className="mt-4 space-y-3">
              {afternoon.map((s, i) => (
                <Card key={i} className={s.hands ? "border-primary/20" : ""}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 shrink-0 sm:w-28 sm:flex-col sm:items-start sm:gap-1">
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {s.step}
                        </Badge>
                        {s.hands && (
                          <span className="text-xs font-medium text-primary whitespace-nowrap">
                            ✍️ 動手
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

          {/* ====== 8. 八次實作 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              八次動手，八件產出
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              每一次都留下一件東西，串起來就是你自己的方案。
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      實作
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
                      <td className="py-3 text-muted-foreground">{p[1]}</td>
                      <td className="py-3 text-foreground">{p[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ====== 9. 先免費試一個 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              先免費試一個，再決定要不要來
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              課堂上會用到七支線上工具。其中一支現在就能玩，不用註冊。
            </p>

            <Card className="mt-8 border-primary/30 bg-primary/5">
              <CardContent className="p-6 sm:p-8">
                <p className="text-sm font-medium text-primary">
                  LAB 041・每天早上那一頁
                </p>
                <h3 className="mt-2 text-lg font-bold text-foreground">
                  每天開五個後臺湊數字，湊完一個早上就沒了？
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  這支工具會請你把七個該看的指標填一次，然後算一筆你大概沒算過的帳：
                  光是湊這一頁，你一個月花掉多少小時、一年等於幾個工作天，
                  以及七項裡面哪一項最該先交給 AI。填完可以直接複製一份規格書帶走。
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  這就是課程下半場那一段的內容。玩過一次，你大概就知道整堂課是什麼調性。
                </p>
                <Button size="lg" className="mt-6 h-12 px-8 text-base" asChild>
                  <a
                    href="https://lab.vista.tw/dashboard/"
                    target="_blank"
                    rel="noopener"
                  >
                    免費玩玩看 →
                  </a>
                </Button>
              </CardContent>
            </Card>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {labTools.map((t, i) => (
                <a
                  key={i}
                  href={t.href}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-between gap-3 rounded-lg border p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{t.use}</p>
                  </div>
                  <span className="text-muted-foreground">→</span>
                </a>
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              部分工具為會員限定，開課日前會逐一對外開放。
            </p>
          </section>

          {/* ====== 10. 買之前先確認你要的是哪一種課 ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              買之前，先確認你要的是哪一種課
            </h2>
            <p className="mt-3 text-center text-base text-muted-foreground">
              兩種課都有價值，但解決的是不同階段的問題。
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      比較項目
                    </th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">
                      一般 AI 工具課
                    </th>
                    <th className="pb-3 text-left font-medium text-primary">
                      無人公司工作坊
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {notAToolCourse.map((row, i) => (
                    <tr key={i}>
                      <td className="py-3 font-medium text-foreground whitespace-nowrap">
                        {row.dim}
                      </td>
                      <td className="py-3 text-muted-foreground">{row.tool}</td>
                      <td className="py-3 text-foreground">{row.ours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              簡單的判斷法：你缺的是<span className="font-semibold text-foreground">會做</span>
              ，就去上工具課；你缺的是
              <span className="font-semibold text-foreground">不必自己做</span>，這堂才是你要的。
            </p>
          </section>

          {/* ====== 11. Instructor ====== */}
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

          {/* ====== 12. 創始梯次 ====== */}
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
          </section>

          {/* ====== 13. Registration ====== */}
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
                      <span>全日課程，上下半場各一段，中間午休</span>
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
                        NT$12,800
                      </p>
                    </div>
                    <div className="rounded-lg border border-primary/40 bg-primary/10 p-4">
                      <p className="text-sm text-foreground">🎟️ 創始梯次價</p>
                      <p className="text-3xl font-bold text-primary">NT$8,800</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        限 20 名・永久回訓只收 NT$1,000・含創始學員許願區
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

          {/* ====== 14. Two Choices ====== */}
          <section className="border-t py-14 sm:py-16">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              你有兩種選擇
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Card className="border-muted bg-muted/30">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-muted-foreground">
                    繼續每一件都自己碰一次
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
                    花一天，把自己寫成一套系統
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    一位會上工的 AI 員工、一條跑過一次的流程、一頁每天等你的報表。
                    讓那些消耗你的部分自己跑，把時間留給只有你能做的事。
                  </p>
                  <Button size="sm" className="mt-5 h-9 px-6" asChild>
                    <a href="#register">通知我開課 →</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ====== 15. FAQ ====== */}
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
