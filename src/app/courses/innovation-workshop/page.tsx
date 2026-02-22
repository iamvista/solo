import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "創新實戰工作坊 | solo.tw",
  description:
    "6 小時，把你卡住的問題做成一張「可落地的解法藍圖」。用創新方程式六步驟，從真實工作難題走到可執行方案。",
  openGraph: {
    title: "創新實戰工作坊 | solo.tw",
    description:
      "6 小時，把你卡住的問題做成一張「可落地的解法藍圖」。用創新方程式六步驟，從真實工作難題走到可執行方案。",
  },
};

const painPoints = [
  {
    emoji: "😩",
    text: "事情一直做、一直忙，但成果沒有被放大",
  },
  {
    emoji: "📊",
    text: "明明做得不差，卻總是排在 60～70 分，升遷名單永遠差一點",
  },
  {
    emoji: "💬",
    text: "你其實有想法，可是提案一開口就散、最後變成加班修修補補",
  },
  {
    emoji: "😤",
    text: "客戶／主管一直「比價、挑毛病、要你再快一點」",
  },
];

const outcomes = [
  {
    number: "1",
    title: "核心問題定義",
    description: "把「症狀」拆成真正的問題",
  },
  {
    number: "2",
    title: "關鍵需求與阻力",
    description: "釐清人為什麼不買單／不配合",
  },
  {
    number: "3",
    title: "三個解法方向",
    description: "不再只剩一條路硬幹",
  },
  {
    number: "4",
    title: "最小可行方案（MVP）",
    description: "先做什麼才能最快驗證",
  },
  {
    number: "5",
    title: "下一步行動計畫",
    description: "時程、資源、風險、責任分工",
  },
];

const steps = [
  { number: "01", title: "看見真正的問題" },
  { number: "02", title: "找到關鍵需求" },
  { number: "03", title: "提出新的問題" },
  { number: "04", title: "重組元素" },
  { number: "05", title: "創造清晰畫面" },
  { number: "06", title: "寫出實現計畫" },
];

const experiences = [
  "現場示範拆解真實案例",
  "小組協作優化解法",
  "遊戲化引導思考",
  "現場產出一份解法草圖",
  "收斂成可執行行動計畫",
];

const whyNotBook = [
  {
    title: "問題修正",
    description: "你可能問錯問題。現場會幫你重新定義。",
  },
  {
    title: "當場修整",
    description: "模糊的地方會被拆清楚。不會帶著疑問離開。",
  },
  {
    title: "被迫產出",
    description: "理解不等於完成。現場會讓你完成。",
  },
];

const targetAudience = [
  "很努力，但成果卡在中段",
  "提案常被打回",
  "想從執行者升級成解法設計者",
  "想提升升遷與成交的機率",
];

export default function InnovationWorkshopPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm sm:text-base">
            💡 實戰工作坊
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            創新實戰工作坊
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:mt-6 sm:text-xl">
            6 小時，把你卡住的問題做成一張
            <span className="font-semibold text-foreground">「可落地的解法藍圖」</span>
          </p>
          <p className="mt-3 text-base text-muted-foreground">
            不是來聽課，是現場把你的問題做完。
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <a href="#register">立即報名</a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <a href="#method">查看課程內容</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* 痛點共鳴 */}
        <section className="py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            你可能很熟這種感覺
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {painPoints.map((point, i) => (
              <Card key={i} className="border-muted">
                <CardContent className="flex items-start gap-3 p-5">
                  <span className="text-2xl shrink-0">{point.emoji}</span>
                  <p className="text-base text-muted-foreground">{point.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-lg font-medium text-foreground">
              問題往往不在你不努力。
            </p>
            <p className="mt-1 text-lg text-muted-foreground">
              而在你一直用同一種方式解題。
              <br />
              換工具、換資料來源、換更多工時。但
              <span className="font-medium text-foreground">解法邏輯沒有升級</span>。
            </p>
          </div>
        </section>

        {/* 課程說明 */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            這堂課在做什麼？
          </h2>
          <p className="mt-4 text-center text-lg text-muted-foreground">
            只做一件事：
          </p>
          <p className="mt-1 text-center text-lg font-medium text-foreground">
            帶你用「創新方程式」把你的真實工作難題走完一輪。
          </p>
          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6 text-center sm:p-8">
              <p className="text-lg font-semibold text-foreground">
                最後，你會帶走一份：
              </p>
              <p className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
                《解法設計藍圖》
              </p>
              <p className="mt-2 text-base text-muted-foreground">
                一頁式 ＋ 行動計畫。不是靈感，是可執行方案。
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 5 個成果 */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            你會帶走的 5 個具體成果
          </h2>
          <div className="mt-8 space-y-4">
            {outcomes.map((outcome) => (
              <div
                key={outcome.number}
                className="flex items-start gap-4 rounded-xl border p-4 sm:p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {outcome.number}
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">
                    {outcome.title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {outcome.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-base font-medium text-foreground">
            你不是聽懂創新。你是<span className="text-primary">完成一次創新</span>。
          </p>
        </section>

        {/* 創新方程式 6 步驟 */}
        <section id="method" className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            課程方法｜創新方程式 6 步驟
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/30"
              >
                <span className="text-2xl font-bold text-primary/30">
                  {step.number}
                </span>
                <span className="text-base font-medium">{step.title}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-base text-muted-foreground">
            課堂會完整走完一次流程。
          </p>
        </section>

        {/* 課程體驗 */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            這 6 小時你會經歷什麼？
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            這不是演講型課程。
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card className="bg-primary/5 border-primary/10">
              <CardContent className="p-5 text-center">
                <p className="text-3xl font-bold text-primary">50%</p>
                <p className="mt-1 text-base font-medium">方法拆解</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/10">
              <CardContent className="p-5 text-center">
                <p className="text-3xl font-bold text-primary">50%</p>
                <p className="mt-1 text-base font-medium">現場實作</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <p className="mb-4 text-base font-medium">你會經歷：</p>
            <div className="space-y-2">
              {experiences.map((exp, i) => (
                <div key={i} className="flex items-center gap-2 text-base text-muted-foreground">
                  <span className="text-primary">✓</span>
                  <span>{exp}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-base text-muted-foreground">
            你會卡住。但你<span className="font-medium text-foreground">不會空手離開</span>。
          </p>
        </section>

        {/* 為什麼不是看書 */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            為什麼不是買書或看影片？
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            因為你缺的不是知識，而是：
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {whyNotBook.map((reason, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <p className="mt-3 text-base font-semibold">{reason.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {reason.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 適合誰 */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            課程適合誰？
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            如果你符合其中兩點，就適合來：
          </p>
          <div className="mx-auto mt-8 max-w-md space-y-3">
            {targetAudience.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border p-4"
              >
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
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            關於講師
          </h2>
          <Card className="mt-8">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-4xl">
                  💡
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">陳建銘</h3>
                    <span className="text-base text-muted-foreground">（創新先生）</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    超過 20 年以上職場創新實戰經驗
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-start gap-2 text-base text-muted-foreground">
                      <span className="text-primary shrink-0">✓</span>
                      <span>從維修最慢到部門主管</span>
                    </div>
                    <div className="flex items-start gap-2 text-base text-muted-foreground">
                      <span className="text-primary shrink-0">✓</span>
                      <span>從業績倒數到銷售冠軍</span>
                    </div>
                    <div className="flex items-start gap-2 text-base text-muted-foreground">
                      <span className="text-primary shrink-0">✓</span>
                      <span>從被質疑到媒體爭相報導</span>
                    </div>
                  </div>

                  <p className="mt-4 text-base text-muted-foreground">
                    曾為 Synopsys 新思科技、研華、中華汽車、中華電信等知名企業提供職場創新顧問培訓服務。
                  </p>
                  <p className="mt-2 text-base text-muted-foreground">
                    擁有 20+ 項發明專利與商品化經驗。媒體稱為「生活發明王」。
                  </p>
                  <p className="mt-2 text-base text-muted-foreground">
                    靈感製造機、鳥博士教育桌遊作者。
                  </p>
                  <p className="mt-3 text-base font-medium text-foreground">
                    專長只有一件事：把卡住的問題，設計成能落地的成果。
                  </p>

                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <a
                      href="https://www.innovators.tw"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="flex items-center gap-1.5">
                        了解更多
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </span>
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 報名資訊 */}
        <section id="register" className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            公開班資訊
          </h2>

          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3 text-base">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span className="font-medium">2026/3/14（六）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕘</span>
                    <span>9:00–16:00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>台北市區・捷運站步行可達</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>限 10 名</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">原價</p>
                    <p className="text-lg text-muted-foreground line-through">
                      NT$5,980
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      早鳥價（3/7 前）
                    </p>
                    <p className="text-3xl font-bold text-primary">NT$3,280</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button size="lg" className="h-12 w-full max-w-sm px-8 text-base">
                  立即報名
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 報名前準備 */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            報名後請準備兩件事
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  1
                </div>
                <p className="mt-3 text-base font-semibold">
                  你想升級的核心技能
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  想一想，什麼能力升級後會讓你最有突破？
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  2
                </div>
                <p className="mt-3 text-base font-semibold">
                  你目前最卡的一個工作難題
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  帶一個具體的問題來，課堂上直接拿來實作。
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="mt-6 text-center text-lg font-medium text-foreground">
            你帶問題來。你帶藍圖走。
          </p>
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
