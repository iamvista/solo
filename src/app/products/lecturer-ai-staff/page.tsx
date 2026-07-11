import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InterestForm } from "./InterestForm";
import { LECTURER_PRODUCT_ID } from "@/lib/lecturer-kit";
import {
  Mic,
  ShieldCheck,
  CheckCircle2,
  Download,
  FileText,
  Layers,
  Compass,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// fallback 到常數而非空字串，避免 env 未設定時結帳按鈕靜默 disable、
// 又與常數檔的 productId 不一致造成雙來源漂移（沿 Codex finding 11）。
const PRODUCT_ID =
  process.env.NEXT_PUBLIC_RECUR_LECTURER_KIT_PRODUCT_ID ?? LECTURER_PRODUCT_ID;

export const metadata: Metadata = {
  title: "講師 AI 幕僚｜職業講師的備課與報價制度檔 | solo.tw",
  description:
    "把十階段備課流程、獨立監察 AI、客戶視角提案報價全部寫成制度檔，鋪進 Claude Code 就能用。給職業講師的 AI 工作流，目前籌備中，搶先登記開放通知。",
  openGraph: {
    title: "講師 AI 幕僚｜職業講師的備課與報價制度檔",
    description:
      "十階段備課＋獨立監察 AI＋客戶視角提案報價，全部鋪進 Claude Code 就能用。目前籌備中，搶先登記通知。",
    images: [
      {
        url: "/products/lecturer-ai-staff/og",
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "https://www.solo.tw/products/lecturer-ai-staff",
  },
};

const painPoints = [
  {
    emoji: "😵",
    title: "每次備課都從零開始",
    text: "課型不同、對象不同，你每次都要重新想一次架構，AI 也不知道你上次做過什麼、犯過什麼錯。",
  },
  {
    emoji: "🤷",
    title: "報價全憑感覺，客戶一問就心虛",
    text: "沒有錨點方法論，價目卡是憑印象喊出來的，遇到議價就不知道底在哪裡。",
  },
  {
    emoji: "📉",
    title: "AI 做的簡報大綱，自己都不敢用",
    text: "丟一句「幫我做簡報」，AI 給的架構鬆散、講稿空洞，還是得自己從頭改一輪。",
  },
  {
    emoji: "🙈",
    title: "備完課沒人把關，上場才發現漏洞",
    text: "沒有獨立驗收機制，備課品質全靠自己抓，時間壓力大時最容易漏掉關鍵環節。",
  },
];

const teachingComponents = [
  {
    icon: Compass,
    title: "十階段備課工作流",
    desc: "從課前定調到收尾覆盤，拆成十個階段逐步推進，AI 每階段都知道自己在整個流程的哪個位置。",
  },
  {
    icon: ShieldCheck,
    title: "獨立監察 AI 驗收",
    desc: "備課 AI 不驗自己的活，另一個獨立角色在每個關鍵產出後檢查缺陷、要證據、判過關與否，不用自己逐項核對。",
  },
  {
    icon: FileText,
    title: "客戶視角提案報價",
    desc: "決策關係人分析、報價錨點方法論、談判要點全部寫成制度檔，報價不再憑感覺，議價時知道自己的底線在哪。",
  },
];

const deliverables = [
  {
    icon: Layers,
    title: "十階段備課流程檔",
    desc: "含六種課型卡（工作坊、企業內訓、大型演講等），照著走就能把一場課從零備到能上場。",
  },
  {
    icon: ShieldCheck,
    title: "獨立監察 AI 角色範本",
    desc: "示範如何設計一個「只挑錯不動手」的驗收角色，每個 Gate 都有明確判準與退件標準。",
  },
  {
    icon: FileText,
    title: "提案與報價制度檔",
    desc: "決策關係人分析、報價錨點方法論、談判要點、提案範本，全套照抄就能用在下一次邀課。",
  },
  {
    icon: Mic,
    title: "逐頁簡報 spec＋講稿產出流程",
    desc: "每頁含頁目的、標題、內容要點、視覺建議、80 至 150 字口播講稿，交給你或你熟悉的簡報工具就能直接動工。",
  },
  {
    icon: Download,
    title: "完整安裝指南",
    desc: "含既有設定備份步驟、佔位符對照表，帶你把備課資產庫接上自己的路徑，30 分鐘內看得懂、鋪得上去。",
  },
];

const faqs = [
  {
    q: "這套會直接幫我做出上線的簡報嗎？",
    a: "v1 版本目前產出的是「逐頁簡報 spec＋口播講稿」，也就是每一頁的目的、標題、內容要點、視覺建議與講稿都幫你想好、寫好，但不含排版完成的成品簡報檔。你可以拿這份 spec 交給美編、或貼進你熟悉的簡報工具（PowerPoint、Keynote、Canva 等）自己排版，也可以貼給其他 AI 簡報工具生成。誠實告知：這不是「一鍵出簡報」的工具。",
  },
  {
    q: "我不會寫程式，真的能用嗎？",
    a: "可以。整套內容都是文件（Markdown），不是程式碼。你只需要把檔案放進指定資料夾，AI 工具就會照著這些規則運作。安裝指南會一步步帶你走完。",
  },
  {
    q: "需要哪些工具才能用？",
    a: "你需要 Claude Code（Anthropic 官方 CLI）。備課資產（課程資料、學員名單、過往簡報等）建議整理在自己的一個資料夾，安裝時會請你指定路徑。",
  },
  {
    q: "適合哪些人使用？",
    a: "設計給有固定備課與報價需求的職業講師：企業內訓講師、工作坊帶領人、公開班講師。如果你一年只講一兩場、不常備課或報價，這套制度檔可能對你來說投資報酬率不高。",
  },
  {
    q: "現在可以買嗎？價格會是多少？",
    a: "目前正在籌備新版本，先開放搶先登記，開賣時會第一時間通知你。定價會採一次買斷，沒有訂閱。",
  },
  {
    q: "可以拿去對外販售或公開重製嗎？",
    a: "不行。這是個人使用授權：你可以自用、修改、套用在自己的備課流程上，但不能轉售、不能整份公開重製。詳細條款附在下載包內。",
  },
];

export default function LecturerAiStaffPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-stone-100/60 to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm sm:text-base">
            講師 AI 幕僚
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
            給職業講師的備課與報價制度檔
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 sm:text-xl leading-relaxed">
            十階段備課流程、獨立監察 AI、客戶視角提案報價，全部寫成文件。
            <br className="hidden sm:block" />
            鋪進 Claude Code 就能用，目前籌備中，搶先登記通知。
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-stone-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              十階段備課流程
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              獨立監察 AI 驗收
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              客戶視角報價方法論
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              搶先登記通知
            </span>
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <a href="#waitlist">搶先登記通知</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base"
              asChild
            >
              <a href="#deliverables">看你會收到什麼</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Pain points */}
        <section className="py-14 sm:py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            如果你遇過這些
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            這份幕僚就是為職業講師做的
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {painPoints.map((point, i) => (
              <Card key={i} className="border-stone-200">
                <CardContent className="flex items-start gap-3 p-5 sm:p-6">
                  <span className="text-2xl shrink-0">{point.emoji}</span>
                  <div>
                    <p className="text-lg font-semibold text-stone-900">
                      {point.title}
                    </p>
                    <p className="mt-1 text-base text-stone-500 leading-relaxed">
                      {point.text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why this exists */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-2xl font-bold sm:text-3xl text-stone-900">
            為什麼做這份
          </h2>
          <p className="mt-2 text-xl text-primary font-semibold">
            因為備課與報價不缺方法，缺的是「每次都能照著走」的制度。
          </p>
          <div className="mt-6 space-y-4 text-base text-stone-600 leading-relaxed">
            <p>
              我用 Claude Code 把自己備課與提案報價的流程拆成一套十階段工作流：課前定調、資料萃取、架構設計、簡報 spec 產出，每個階段都有明確產出與驗收標準，還有一個獨立的監察 AI 負責挑錯，不讓自己蒙混過關。
            </p>
            <p>
              這套制度原本只留給自己用。這份幕僚把個人專屬的路徑與私人課程細節全部移除，留下可複製的骨架與一份虛構範例課，讓你也能照著鋪一套屬於自己的備課與報價系統。
            </p>
          </div>
        </section>

        {/* Three teaching components */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            三個核心教學重點
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            不是一堆設定檔，是三套可以直接套用的思考方法
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {teachingComponents.map((t, i) => {
              const Icon = t.icon;
              return (
                <Card key={i} className="border-stone-200">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-stone-900">
                      {t.title}
                    </p>
                    <p className="mt-2 text-base text-stone-600 leading-relaxed">
                      {t.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Deliverables */}
        <section id="deliverables" className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            你會收到什麼
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {deliverables.map((d, i) => {
              const Icon = d.icon;
              return (
                <Card key={i} className="border-stone-200">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-stone-900">
                      {d.title}
                    </p>
                    <p className="mt-2 text-base text-stone-600 leading-relaxed">
                      {d.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <p className="mt-6 text-center text-sm text-stone-400">
            v1 誠實說明：簡報產出是「逐頁 spec＋講稿」，不是排版完成的成品簡報檔。
          </p>
        </section>

        {/* Waitlist */}
        <section id="waitlist" className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            籌備中，搶先登記通知
          </h2>
          <p className="mt-3 text-center text-base text-stone-500">
            留下 Email，開課或方案就緒時，第一時間通知你。
          </p>

          <div className="mt-8 mx-auto max-w-md">
            <Card className="border-primary border-2 shadow-lg">
              <CardContent className="p-8">
                <p className="text-base font-medium text-stone-500">完整版內容</p>
                <ul className="mt-4 space-y-3 text-base text-stone-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>十階段備課流程檔（含六種課型卡）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>獨立監察 AI 角色範本</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>提案與報價制度檔</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>逐頁簡報 spec＋講稿產出流程</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>完整安裝指南</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <InterestForm productId={PRODUCT_ID} />
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="mt-8 text-center text-xs text-stone-400 max-w-lg mx-auto leading-relaxed">
            免費登記，不會收費 · 開課或方案就緒時通知你
          </p>
        </section>

        {/* FAQ */}
        <section className="py-14 sm:py-16 border-t border-stone-100">
          <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
            常見問題
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="rounded-lg border border-stone-200 bg-white p-5">
                <summary className="cursor-pointer text-base font-semibold text-stone-900 hover:text-primary">
                  {f.q}
                </summary>
                <p className="mt-3 text-base text-stone-600 leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-14 sm:py-20 border-t border-stone-100">
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-stone-100 p-8 text-center sm:p-12">
            <Sparkles className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl text-stone-900">
              下一場備課，你會多一套制度
            </h2>
            <p className="mt-3 text-base text-stone-600 max-w-xl mx-auto">
              十階段備課、獨立監察 AI、客戶視角報價，全部鋪進 Claude Code 就能用。目前籌備中，搶先登記通知。
            </p>
            <div className="mt-6 flex justify-center">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <a href="#waitlist">
                  搶先登記通知{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
