import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "用 AI 寫出讓人忍不住留言的社群內容｜3 小時實戰工作坊 | solo.tw",
  description:
    "結合心理學 × AI 提問術，3 小時學會設計高互動社群內容。帶走五種心理學模型、AI 提問模板、完整內容工作流，現場產出一篇可直接發布的貼文。",
  openGraph: {
    title: "用 AI 寫出讓人忍不住留言的社群內容｜3 小時實戰工作坊",
    description:
      "結合心理學 × AI 提問術，3 小時學會設計高互動社群內容。帶走五種心理學模型、AI 提問模板、完整內容工作流。",
    images: [
      {
        url: "/images/workshops/instructor-susie.webp",
        width: 1200,
        height: 630,
      },
    ],
  },
};

const REGISTER_URL =
  "https://vista.oen.tw/good/3B9k5KK2dOefHc4CHsLyOtnve1I?from=vista&m=cash";

const painPoints = [
  {
    emoji: "😶",
    title: "按讚掛零、留言沙漠",
    text: "經營社群一段時間了，但互動率始終上不去。每次發文都像丟石頭到深海裡。",
  },
  {
    emoji: "🤖",
    title: "AI 寫的東西「很 AI」",
    text: "用 ChatGPT 產出的貼文，正確但無聊，像在讀說明書。沒有溫度、沒有個性。",
  },
  {
    emoji: "🧊",
    title: "有專業卻寫不出共鳴",
    text: "你有觀點、有乾貨，卻不知道怎麼寫成「別人想轉發」的社群內容。",
  },
  {
    emoji: "📉",
    title: "瀏覽數高但互動低",
    text: "文章有人看，但沒人留言、沒人分享。觸及和互動是兩回事。",
  },
  {
    emoji: "🔄",
    title: "不知道今天要發什麼",
    text: "每天打開社群就焦慮，靈感斷斷續續，內容產出不穩定。",
  },
  {
    emoji: "🎭",
    title: "效率和品質只能選一個？",
    text: "想用 AI 加速產出，但又怕犧牲內容的人味和互動品質。",
  },
];

const psychModels = [
  {
    icon: "🔥",
    name: "立場型",
    mechanism: "認同或反對的表態衝動",
    scenario: "時事評論、價值觀",
    interaction: "留言、分享",
  },
  {
    icon: "💡",
    name: "缺口型",
    mechanism: "好奇心與資訊落差",
    scenario: "知識分享、經驗談",
    interaction: "按讚、收藏",
  },
  {
    icon: "🪞",
    name: "鏡像型",
    mechanism: "「這就是我」的共鳴",
    scenario: "生活觀察、情緒描寫",
    interaction: "留言、tag 朋友",
  },
  {
    icon: "❓",
    name: "邀請型",
    mechanism: "被點名的參與感",
    scenario: "問答、投票、徵求",
    interaction: "留言",
  },
  {
    icon: "📖",
    name: "敘事型",
    mechanism: "追劇般的故事張力",
    scenario: "個人經歷、案例",
    interaction: "分享",
  },
];

const deliverables = [
  {
    icon: "📝",
    title: "一篇完成品",
    desc: "課堂上完成的高互動社群貼文，下課可直接發布",
  },
  {
    icon: "🧠",
    title: "五種心理模型卡",
    desc: "高互動內容的心理學框架 + AI 提問模板",
  },
  {
    icon: "🔄",
    title: "內容產製工作流程圖",
    desc: "從靈感到發布的 AI 社群 SOP",
  },
  {
    icon: "✅",
    title: "互動品質檢查清單",
    desc: "發文前的自我檢核表",
  },
  {
    icon: "🎨",
    title: "社群人格檔案範本",
    desc: "讓 AI 記住你風格的 prompt 模板",
  },
  {
    icon: "📅",
    title: "一週內容排程模板",
    desc: "AI 輔助的內容日曆規劃表",
  },
];

const schedule = [
  {
    time: "單元一",
    duration: "35 分鐘",
    module: "為什麼你的 AI 貼文沒人理？",
    content:
      "高互動內容的底層邏輯、AI 寫社群內容的三大陷阱、現場對比示範：同主題的兩種寫法差異",
  },
  {
    time: "單元二",
    duration: "45 分鐘",
    module: "社群互動心理學 × AI 提問術",
    content:
      "五種高互動內容心理模型、每種模型的 AI 提問模板拆解。實作練習：選一種模型，用自己的主題寫出 prompt",
  },
  {
    time: "休息",
    duration: "10 分鐘",
    module: "中場休息",
    content: "",
  },
  {
    time: "單元三",
    duration: "50 分鐘",
    module: "AI 社群內容工作流",
    content:
      "從靈感蒐集到一稿多用的五步驟流程、建立社群人格檔案、用 AI 規劃一週內容排程。實作練習：走完完整流程，產出一篇 300-500 字的高互動貼文",
  },
  {
    time: "單元四",
    duration: "40 分鐘",
    module: "互動引爆術：從發出去到被討論",
    content:
      "AI 貼文的互動品質檢查清單、發文後的黃金 30 分鐘回覆策略、用 AI 輔助高效回覆。實作練習：用檢查清單優化自己的初稿",
  },
  {
    time: "收尾",
    duration: "15 分鐘",
    module: "Q&A + 作品分享",
    content: "學員分享修改後的成品、個別建議、課後資源包說明",
  },
];

const targetAudience = [
  {
    icon: "📊",
    text: "經營社群一段時間了，但互動率始終上不去",
  },
  {
    icon: "🤖",
    text: "用過 AI 寫貼文，但產出的東西「很 AI」——正確但沒有溫度",
  },
  {
    icon: "💼",
    text: "品牌經營者、行銷人、自媒體創作者，想用 AI 提升產出效率",
  },
  {
    icon: "✍️",
    text: "有專業、有觀點，卻不知道怎麼寫成別人想轉發的內容",
  },
  {
    icon: "🔧",
    text: "對 AI 工具有興趣，但不確定怎麼融入社群經營流程",
  },
];

const faqs = [
  {
    q: "需要會用 AI 工具嗎？",
    a: "不需要有 AI 使用經驗。課堂會從零開始帶你操作，使用 Claude 或 ChatGPT 皆可。",
  },
  {
    q: "我的社群經營經驗很少，適合嗎？",
    a: "適合。這堂課從心理學原理出發，不論你是新手還是老手，都能學到設計互動內容的底層邏輯。",
  },
  {
    q: "課前需要準備什麼？",
    a: "攜帶筆電或手機、準備一個 AI 工具帳號（ChatGPT 或 Claude 都可以，免費版即可開始）。",
  },
  {
    q: "上完課能帶走什麼？",
    a: "一篇可直接發布的社群貼文、五種心理模型卡、AI 提問模板、內容工作流程圖、互動檢查清單，以及一份社群人格檔案範本。",
  },
  {
    q: "和市面上其他 AI 寫作課有什麼不同？",
    a: "一般 AI 寫作課教你怎麼下 prompt 追求產出效率，這堂課教你怎麼結合心理學設計互動，讓 AI 產出的內容有人味、有回應。",
  },
];

export default function AISocialContentPage() {
  return (
    <div>
      {/* ====== Hero ====== */}
      <section className="bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/20">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-2 text-sm sm:text-base"
          >
            💬 3 小時實戰工作坊 — 2026/4/26（六）
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            你還在叫 AI
            <br />
            <span className="gradient-text">「幫我寫一篇貼文」</span>嗎？
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:mt-6 sm:text-xl">
            難怪發出去沒人理。
            <br className="hidden sm:block" />
            <span className="font-semibold text-foreground">
              問題不在 AI 不夠聰明，而在你沒告訴它：什麼樣的內容，人會想回應。
            </span>
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <a href="#register">我要報名</a>
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
              <p className="text-2xl font-bold text-primary sm:text-3xl">3hr</p>
              <p className="mt-1 text-sm text-muted-foreground">實戰工作坊</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary sm:text-3xl">20</p>
              <p className="mt-1 text-sm text-muted-foreground">人小班制</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary sm:text-3xl">5</p>
              <p className="mt-1 text-sm text-muted-foreground">
                種心理模型
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary sm:text-3xl">1</p>
              <p className="mt-1 text-sm text-muted-foreground">
                篇成品帶走
              </p>
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
                社群不缺內容，缺的是讓人想回應的內容。
              </span>
              <br />
              <span className="font-normal text-background/80">
                AI 可以幫你量產，但只有懂互動的人，才能用 AI 量產「有人回的文章」。
              </span>
            </p>
          </div>
        </section>

        {/* ====== Instructor ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            關於講師
          </h2>

          <div className="mt-8 grid gap-8 md:grid-cols-5">
            {/* 照片 */}
            <div className="md:col-span-2 flex flex-col items-center gap-4">
              <div className="w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/workshops/instructor-susie-2.webp"
                  alt="Susie Li"
                  width={400}
                  height={600}
                  className="w-full object-cover"
                />
              </div>
            </div>

            {/* 簡介 */}
            <div className="md:col-span-3">
              <h3 className="text-2xl font-bold">Susie Li</h3>
              <p className="mt-1 text-base text-muted-foreground">
                社群內容策略師・心理學碩士・資深媒體人
              </p>

              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  從臺灣媒體圈出發，移居海外後從零開始經營個人粉專，不靠廣告預算、不靠演算法紅利，純粹用內容的力量建立影響力。
                </p>
                <p>
                  擁有心理學碩士背景與多年主流媒體經驗，深諳內容產製邏輯，更理解人為什麼會想回應、想分享。
                </p>
              </div>

              <div className="mt-6 space-y-2.5 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-primary shrink-0">✓</span>
                  <span className="text-muted-foreground">
                    心理學碩士，理解互動背後的心理機制
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary shrink-0">✓</span>
                  <span className="text-muted-foreground">
                    資深媒體人，深諳內容產製邏輯
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary shrink-0">✓</span>
                  <span className="text-muted-foreground">
                    數位行銷實戰經驗，懂行銷策略與數據分析
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary shrink-0">✓</span>
                  <span className="text-muted-foreground">
                    社群實證：從零開始，不靠廣告建立真實互動
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary shrink-0">✓</span>
                  <span className="text-muted-foreground">
                    日常結合 AI 進行內容產製，正職 + 自媒體雙軌並行
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====== 5 Psychology Models ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            五種讓人忍不住互動的心理模型
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            這堂課的核心框架——每種模型都配有對應的 AI 提問模板
          </p>

          <div className="mt-8 space-y-3">
            {psychModels.map((model, i) => (
              <Card key={i} className="border-muted">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3 sm:w-1/4">
                      <span className="text-2xl">{model.icon}</span>
                      <span className="text-base font-bold text-foreground">
                        {model.name}
                      </span>
                    </div>
                    <div className="flex-1 grid gap-1 sm:grid-cols-3 text-sm text-muted-foreground">
                      <div>
                        <span className="text-xs font-medium text-foreground/60">
                          心理機制
                        </span>
                        <p>{model.mechanism}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-foreground/60">
                          適用場景
                        </span>
                        <p>{model.scenario}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-foreground/60">
                          互動類型
                        </span>
                        <p>{model.interaction}</p>
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
            不是空有知識，而是下課就能直接上場的工具包。
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
            3 小時課程安排
          </h2>
          <p className="mt-3 text-center text-base text-muted-foreground">
            每個單元都有實作，不會空手離開。
          </p>
          <div className="mt-8 space-y-4">
            {schedule.map((s, i) => (
              <Card
                key={i}
                className={
                  s.time === "休息"
                    ? "border-dashed bg-muted/20"
                    : s.time === "收尾"
                      ? "border-primary/20 bg-primary/5"
                      : ""
                }
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className="text-xs whitespace-nowrap"
                      >
                        {s.time}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {s.duration}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-foreground">
                        {s.module}
                      </h3>
                      {s.content && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {s.content}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
        </section>

        {/* ====== Difference ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            和一般 AI 寫作課有什麼不同？
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-medium text-muted-foreground">
                    比較項目
                  </th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">
                    市面常見 AI 寫作課
                  </th>
                  <th className="pb-3 text-left font-medium text-primary">
                    這堂課的不同
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 font-medium text-foreground">教學重點</td>
                  <td className="py-3 text-muted-foreground">
                    教你怎麼下 prompt
                  </td>
                  <td className="py-3 text-foreground">
                    教你怎麼下「會引發互動」的 prompt
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-foreground">追求目標</td>
                  <td className="py-3 text-muted-foreground">追求產出效率</td>
                  <td className="py-3 text-foreground">追求互動品質</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-foreground">內容產出</td>
                  <td className="py-3 text-muted-foreground">
                    正確但無聊的內容
                  </td>
                  <td className="py-3 text-foreground">
                    讓人想按讚、想留言、想分享的內容
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-foreground">講師特色</td>
                  <td className="py-3 text-muted-foreground">懂 AI 工具</td>
                  <td className="py-3 text-foreground">
                    社群實戰高手 + 心理學專業
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-foreground">課堂產出</td>
                  <td className="py-3 text-muted-foreground">練習文</td>
                  <td className="py-3 text-foreground">
                    一篇可直接發布的高互動社群貼文
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ====== Registration ====== */}
        <section id="register" className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            報名資訊
          </h2>

          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardContent className="p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3 text-base">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span className="font-medium">2026/4/26（六）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕘</span>
                    <span>9:00–12:00（3 小時，含休息）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>
                      臺北市區・需有 Wi-Fi（報名後告知地址）
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>限 20 名</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💻</span>
                    <span>請攜帶筆電或手機</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">定價</p>
                    <p className="text-lg text-muted-foreground line-through">
                      NT$4,500
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">早鳥優惠</p>
                    <p className="text-2xl font-bold text-primary">NT$3,500</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      開課前 14 天截止
                    </Badge>
                  </div>
                </div>
              </div>

              {/* 課前準備 */}
              <div className="mt-6 rounded-lg bg-background/80 p-4">
                <p className="text-sm font-medium text-foreground">
                  課前請先準備：
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    AI 工具帳號（ChatGPT 或 Claude，免費版即可）
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    想好一個你平常經營的社群主題
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <Button
                  size="lg"
                  className="h-12 w-full text-base"
                  asChild
                >
                  <a href={REGISTER_URL}>立即報名</a>
                </Button>
              </div>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                點擊報名後將寄送詳細資訊至您的信箱
              </p>
            </CardContent>
          </Card>
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
                  繼續自己摸索
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  繼續叫 AI「幫我寫一篇貼文」，繼續得到正確但無聊的內容。按讚個位數，留言掛零。偶爾有一篇表現不錯，但不知道為什麼，也無法複製。
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg font-bold text-primary">
                  花 3 小時，學會和 AI 一起寫出有互動的內容
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  理解什麼樣的內容讓人忍不住回應，用心理學框架設計互動，讓 AI 成為你的內容協作夥伴。下課帶走一套系統，明天就能用。
                </p>
                <Button size="sm" className="mt-5 h-9 px-6" asChild>
                  <a href="#register">我要報名 →</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ====== FAQ ====== */}
        <section className="border-t py-14 sm:py-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            常見問題
          </h2>
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
                <a href="#register">我要報名</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
                asChild
              >
                <a href="mailto:hi@solo.tw">寫信給我們</a>
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
  );
}
