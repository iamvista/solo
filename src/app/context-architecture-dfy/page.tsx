import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "./CheckoutButton";
import { CONTEXT_ARCH_DFY } from "@/config/products";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Compass,
  FileText,
  PackageCheck,
  Video,
  Calendar,
  RefreshCw,
  FolderTree,
  Users,
  Mic,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { JsonLd, serviceSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";

// ── SEO ───────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "個人 Context Architecture：Done-For-You｜Vista",
  description:
    "Vista 親自訪談你 90 分鐘，產出 10 份個人脈絡文件，灌進你的 Claude Project。適合知識工作者、Solo creator、教學者、研究者。",
  openGraph: {
    title: "個人 Context Architecture：Done-For-You｜Vista",
    description:
      "90 分鐘訪談、10 份文件、灌進 Claude。讓你的 AI 真正認識你。",
  },
  alternates: {
    canonical: "https://www.solo.tw/context-architecture-dfy",
  },
};

// ── Data ──────────────────────────────────────────────────────────────────────

const painPoints = [
  {
    title: "你看完電子報想做，但沒時間",
    text: "免費模板擺在那裡，你知道值得做。可是要訪自己、整理 10 份文件、再灌進 Claude，整套流程一個下午根本走不完，又沒有人盯，最後就擱著。",
  },
  {
    title: "自己訪自己很難，需要外部視角",
    text: "你在自己的脈絡裡面太久，很多預設你根本看不見。別人問一句「你為什麼這樣做」，你才會說出真正的答案。Solo 自助時，這個關鍵的反問環節最容易被跳過。",
  },
  {
    title: "跑 /context-pack 容易跳過難題",
    text: "AI 訪談你的時候，你卡住、你含糊、你打哈哈，AI 不會逼你。結果產出的 10 份文件看起來完整，但讀起來空——因為最關鍵的那幾題，你從沒誠實面對過。",
  },
];

const deliverables = [
  {
    Icon: Video,
    title: "90 分鐘 1-on-1 視訊訪談（Vista 親自）",
    desc: "Vista 帶著一份預備好的訪綱跟你對話。會逼你講清楚那些「平常不會去講」的事：你真正在賣什麼、你的讀者是誰、你怕被誰看穿。整段錄影你可以下載回看。",
  },
  {
    Icon: FileText,
    title: "10 份結構化 markdown 文件",
    desc: "定位、讀者、思想、內容、風格、知識資產、工具棧、標竿作品、研究脈絡、受眾語料。每一份都是可貼進 Claude Project 即用的格式，不是抽象框架。",
  },
  {
    Icon: PackageCheck,
    title: "安裝到你的 Claude Project（協助設定）",
    desc: "訪談後 7 天內交付，附一場 30 分鐘協助安裝視訊：把 10 份文件灌進你指定的 Claude Project（或多個 Project），確認 AI 真的吃進這些脈絡才算完成。",
  },
  {
    Icon: RefreshCw,
    title: "30 天後一次免費 review + 校準",
    desc: "用了一個月之後，你會發現某幾份文件不夠準。這時候我們再開一次 60 分鐘視訊，根據你實際使用 AI 的對話片段，把不準的部分校正回來。",
  },
  {
    Icon: FolderTree,
    title: "完整 _context/ 資料夾（Obsidian 相容）",
    desc: "10 份文件以乾淨的資料夾結構交付，檔名與資料夾命名與 Vista 自己用的版本一致，可以直接放進你的 Obsidian vault 或 git repo 管理。",
  },
];

const process = [
  {
    Icon: BookOpen,
    week: "第 1 週",
    title: "填預備問卷 → 預約訪談",
    desc: "付款後你會收到一份 30 題的預備問卷與預約連結。問卷不是隨便填，它會逼你先想過一輪——這樣訪談當天我們才能直接進深水區。",
  },
  {
    Icon: Mic,
    week: "訪談當天",
    title: "90 分鐘訪談（錄影回放可下載）",
    desc: "Google Meet 或 Zoom 視訊，全程錄影，你可以下載原檔。訪談會分三段：你是誰、你寫給誰、你怎麼想。中間我會反覆追問，逼你說出最精準的版本。",
  },
  {
    Icon: PackageCheck,
    week: "訪談後 7 天",
    title: "交付 10 份文件 + 安裝指引",
    desc: "我會根據訪談錄音與問卷，產出 10 份結構化 markdown 文件，附一場 30 分鐘 Zoom 協助你灌進 Claude Project，確認 AI 真的能引用這些脈絡。",
  },
  {
    Icon: RefreshCw,
    week: "第 30 天後",
    title: "1 次校準 review",
    desc: "你用一個月之後再開一次 60 分鐘視訊。這時候你會知道哪幾份文件「不夠準」、哪幾份「沒在用」、哪幾份「想加什麼」。我們現場一起改。",
  },
];

const fitYou = [
  "已經有讀者或客戶基礎，不是從零開始",
  "想用 AI 放大產出，不是想取代 AI 思考",
  "願意誠實面對自己，包括還沒想清楚的那幾題",
  "知識工作者、Solo creator、教學者、研究者",
];

const notFitYou = [
  "完全 0 受眾、還在找方向的階段",
  "想要一份速成 prompt、複製貼上就能用的人",
  "預期付錢之後不需要花 2-3 小時參與訪談的人",
  "希望 AI 完全代替你思考、產出、決策的人",
];

const faqs = [
  {
    q: "跟 vista.tw 的免費模板差在哪？",
    a: "免費模板是「自助版」：你下載 10 份 markdown 範本，自己填、自己訪自己、自己灌進 Claude Project。這個 DFY 服務是「客製版」：Vista 親自訪談你 90 分鐘，根據你的真實情境產出 10 份個人化文件，再協助你安裝到 Claude。如果你時間多、願意自己跑流程，免費模板就夠了；如果你想要外部視角逼出真實答案、又不想花 2-3 個下午自己摸，DFY 比較適合。",
  },
  {
    q: "我的資料會外洩嗎？",
    a: "訪談錄影檔只存在 Vista 的私有雲端（Google Drive 限本人存取），交付給你之後 90 天我會永久刪除。10 份產出文件只寄給你本人 email，不會放進公開資料庫、不會用來訓練模型、不會在我的內容裡引述（除非事先取得你同意）。如果你要簽 NDA，可以提前告訴我。",
  },
  {
    q: "沒有完整 10 份能用嗎？",
    a: "可以。10 份文件是一個完整框架，但不是強制全套。實際上有些人只用得到 5-6 份（例如研究者通常不需要「受眾語料」），訪談時我們會評估哪幾份對你最關鍵，把時間花在那幾份上。但交付一定還是會給滿 10 份，因為其他幾份未來你可能用得到。",
  },
  {
    q: "訪談是中文還英文？",
    a: "預設是繁體中文。如果你需要英文訪談我也可以，但建議先告訴我，我會準備不同的訪綱（中英文使用者的卡點不一樣）。產出的 10 份文件會用你訪談時使用的語言。",
  },
  {
    q: "退費政策？",
    a: "訪談前 48 小時取消可全額退費。訪談已開始或已交付任一份文件之後，因為這是高度客製化人工服務，恕不退費。如果你交付後對任何一份文件有意見，我會免費修一輪——這比退費更能解決你的問題。",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContextArchitectureDFYPage() {
  const product = CONTEXT_ARCH_DFY.regular;
  const earlyProduct = CONTEXT_ARCH_DFY.earlyBird;

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: "個人 Context Architecture：Done-For-You",
          description:
            "Vista 親自訪談 90 分鐘，產出 10 份個人脈絡文件，灌進你的 Claude Project。",
          url: "https://www.solo.tw/context-architecture-dfy",
          price: 12000,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "首頁", href: "/" },
          { name: "Context Architecture DFY", href: "/context-architecture-dfy" },
        ])}
      />
      <JsonLd data={faqSchema(faqs.map((f) => ({ question: f.q, answer: f.a })))} />

      <main className="min-h-screen">
        {/* ====== Hero ====== */}
        <section className="bg-gradient-to-b from-stone-100/60 to-background">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
            <Badge className="mb-3 bg-amber-500/15 text-amber-700 border-amber-500/30 hover:bg-amber-500/15 px-4 py-1.5 text-xs sm:text-sm">
              Done-For-You 客製化服務
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
              個人 Context Architecture：Done-For-You
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 sm:text-xl leading-relaxed">
              Vista 親自訪談你 90 分鐘，產出 10 份個人脈絡文件，
              <br className="hidden sm:block" />
              灌進你的 Claude Project。
            </p>
            <p className="mx-auto mt-3 max-w-xl text-base text-stone-500">
              適合知識工作者、Solo creator、教學者、研究者。
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-stone-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                90 分鐘 Vista 親自訪談
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                10 份結構化 markdown 文件
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                協助灌進 Claude Project
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                30 天後免費校準
              </span>
            </div>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <a href="#pricing">預約訪談 NT$ 12,000</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
                asChild
              >
                <a
                  href="https://vista.tw/context-architecture"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  先看免費模板
                </a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-stone-500">
              早鳥前 10 位 NT$ 8,800 · 額滿恢復原價 NT$ 12,000
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* ====== Pain Points ====== */}
          <section className="py-14 sm:py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold sm:text-3xl text-stone-900">
                你看完電子報，知道值得做。
              </h2>
              <p className="mt-2 text-xl text-primary font-semibold">
                可是真要動手，總會卡在三件事。
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {painPoints.map((point, i) => (
                  <Card key={i} className="border-stone-200">
                    <CardContent className="p-5 sm:p-6">
                      <p className="text-lg font-semibold text-stone-900">
                        {point.title}
                      </p>
                      <p className="mt-2 text-base text-stone-500 leading-relaxed">
                        {point.text}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* ====== Deliverables ====== */}
          <section className="py-14 sm:py-16 border-t border-stone-100">
            <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
              你會收到什麼
            </h2>
            <p className="mt-3 text-center text-base text-stone-500">
              不是模板、不是錄好的課，是 Vista 親手陪你產出的客製成果。
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {deliverables.map(({ Icon, title, desc }, i) => (
                <Card key={i} className="border-stone-200">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-stone-900">
                      {title}
                    </p>
                    <p className="mt-2 text-base text-stone-600 leading-relaxed">
                      {desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ====== Fit / Not Fit ====== */}
          <section className="py-14 sm:py-16 border-t border-stone-100">
            <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
              適合你嗎？
            </h2>
            <p className="mt-3 text-center text-base text-stone-500">
              這份服務不是給每個人的。先看你在不在這個輪廓裡。
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Card className="border-2 border-primary shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg text-stone-900">
                      適合
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {fitYou.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-base text-stone-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-stone-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="h-5 w-5 text-stone-400" />
                    <h3 className="font-semibold text-lg text-stone-700">
                      不適合
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {notFitYou.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-base text-stone-500"
                      >
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-stone-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ====== Process ====== */}
          <section className="py-14 sm:py-16 border-t border-stone-100">
            <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
              流程
            </h2>
            <p className="mt-3 text-center text-base text-stone-500">
              從付款到完整交付，大約 5 週。
            </p>
            <div className="mt-10 space-y-5 max-w-3xl mx-auto">
              {process.map(({ Icon, week, title, desc }, i) => (
                <Card key={i} className="border-stone-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
                      <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 sm:w-32">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-sm font-semibold text-primary">
                          {week}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-stone-900">
                          {title}
                        </p>
                        <p className="mt-2 text-base text-stone-600 leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ====== Pricing ====== */}
          <section
            id="pricing"
            className="py-14 sm:py-16 border-t border-stone-100"
          >
            <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
              定價
            </h2>
            <p className="mt-3 text-center text-base text-stone-500">
              一次付清，含全部交付項目。
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-stretch max-w-3xl mx-auto">
              {/* 早鳥 */}
              <Card className="border-2 border-primary shadow-lg flex flex-col relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  早鳥前 10 位
                </span>
                <CardContent className="p-8 flex-1 flex flex-col">
                  <Badge className="mb-3 self-start">限額 10 名</Badge>
                  <p className="text-base font-medium text-stone-500">
                    早鳥價
                  </p>
                  <div className="mt-2 flex items-baseline gap-3">
                    <p className="text-4xl font-bold text-primary">
                      NT$ 8,800
                    </p>
                    <p className="text-lg text-stone-400 line-through">
                      NT$ 12,000
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-stone-500">
                    額滿恢復原價 NT$ 12,000
                  </p>
                  <ul className="mt-6 space-y-3 text-base text-stone-600 flex-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>90 分鐘 Vista 親自訪談</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>10 份結構化 markdown 文件</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>協助安裝到你的 Claude Project</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>30 天後 1 次免費校準</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>完整 _context/ 資料夾（Obsidian 相容）</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>訪談錄影回放可下載</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <CheckoutButton
                      productId={earlyProduct.productId}
                      ready={earlyProduct.ready}
                      label="早鳥 NT$ 8,800 預約訪談"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 正式價 */}
              <Card className="border-stone-200 flex flex-col">
                <CardContent className="p-8 flex-1 flex flex-col">
                  <Badge variant="outline" className="mb-3 self-start">
                    正式價
                  </Badge>
                  <p className="text-base font-medium text-stone-500">
                    一般方案
                  </p>
                  <div className="mt-2 flex items-baseline gap-3">
                    <p className="text-4xl font-bold text-stone-900">
                      NT$ 12,000
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-stone-500">
                    早鳥額滿後適用
                  </p>
                  <ul className="mt-6 space-y-3 text-base text-stone-600 flex-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="font-medium text-stone-900">
                        早鳥版全部內容
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>訪談檔案永久保留（不刪除限制）</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>可指定客製訪綱主題（如「研究者版」）</span>
                    </li>
                  </ul>
                  <div className="mt-6">
                    <CheckoutButton
                      productId={product.productId}
                      ready={product.ready}
                      label="正式價 NT$ 12,000 預約訪談"
                      variant="outline"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="mt-8 text-center text-xs text-stone-400 max-w-lg mx-auto leading-relaxed">
              支援信用卡付款 · 由 Recur.tw 安全處理
              <br />
              訪談前 48 小時取消可全額退費；訪談已開始或交付任一份文件後恕不退費。
            </p>
          </section>

          {/* ====== Use Cases ====== */}
          <section className="py-14 sm:py-16 border-t border-stone-100">
            <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
              這 10 份文件能怎麼用？
            </h2>
            <p className="mt-3 text-center text-base text-stone-500">
              灌進 Claude Project 之後，你的 AI 才是真的「認識你」。
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card className="border-stone-200">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Mic className="h-5 w-5 text-primary shrink-0" />
                    <h3 className="font-semibold text-stone-900 text-lg">
                      內容創作者
                    </h3>
                  </div>
                  <p className="text-base text-stone-600 leading-relaxed">
                    寫文章前不用每次重新交代背景。AI 知道你的讀者長什麼樣、你的禁區在哪、你慣用的句法節奏。產出的草稿少改 60%。
                  </p>
                </CardContent>
              </Card>
              <Card className="border-stone-200">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="h-5 w-5 text-primary shrink-0" />
                    <h3 className="font-semibold text-stone-900 text-lg">
                      教學者／講師
                    </h3>
                  </div>
                  <p className="text-base text-stone-600 leading-relaxed">
                    設計新課綱、改寫講義、生成案例時，AI 會自動沿用你的教學風格與舉例邏輯，不會冒出你不會講的話。
                  </p>
                </CardContent>
              </Card>
              <Card className="border-stone-200">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Compass className="h-5 w-5 text-primary shrink-0" />
                    <h3 className="font-semibold text-stone-900 text-lg">
                      Solo Creator
                    </h3>
                  </div>
                  <p className="text-base text-stone-600 leading-relaxed">
                    產品文案、社群貼文、電子報、Q&A 回覆，全部交給 AI 起草，但口吻是你的、立場是你的、邏輯是你的。
                  </p>
                </CardContent>
              </Card>
              <Card className="border-stone-200">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-5 w-5 text-primary shrink-0" />
                    <h3 className="font-semibold text-stone-900 text-lg">
                      研究者／顧問
                    </h3>
                  </div>
                  <p className="text-base text-stone-600 leading-relaxed">
                    AI 知道你的研究脈絡、引用偏好、概念體系，幫你整理文獻、寫論文段落、回 reviewer 時不會偏離你的學術風格。
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ====== FAQ ====== */}
          <section className="py-14 sm:py-16 border-t border-stone-100">
            <h2 className="text-center text-2xl font-bold sm:text-3xl text-stone-900">
              常見問題
            </h2>
            <div className="mt-8 space-y-4">
              {faqs.map((f, i) => (
                <details
                  key={i}
                  className="rounded-lg border border-stone-200 bg-white p-5"
                >
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

          {/* ====== Final CTA ====== */}
          <section className="py-14 sm:py-20 border-t border-stone-100">
            <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-stone-100 p-8 text-center sm:p-12">
              <Calendar className="mx-auto h-10 w-10 text-primary" />
              <h2 className="mt-4 text-2xl font-bold sm:text-3xl text-stone-900">
                花一個下午的時間，把你之後一年要做的事情交給 AI
              </h2>
              <p className="mt-3 text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
                Vista 親自訪談你 90 分鐘，產出 10 份個人脈絡文件，灌進你的 Claude Project。30 天之後再校準一次，整套服務跑完，你的 AI 就真的認識你了。
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <a href="#pricing">
                    預約訪談 NT$ 12,000
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base"
                  asChild
                >
                  <a
                    href="https://vista.tw/context-architecture"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    先看免費模板
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-stone-500">
                早鳥前 10 位 NT$ 8,800
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
