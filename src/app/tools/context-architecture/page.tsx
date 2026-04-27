import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Download,
  FileText,
  Sparkles,
  Mail,
} from "lucide-react";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "個人 Context Architecture：把一人公司寫進 Claude｜solo.tw",
  description:
    "AI 輸出爛不是 prompt 問題，是上下文架構問題。免費下載兩份模板：個人定位卡、寫作風格 Profile，幫你把一人公司寫進 Claude。",
  openGraph: {
    title: "個人 Context Architecture：把一人公司寫進 Claude",
    description:
      "免費下載兩份模板：個人定位卡、寫作風格 Profile。純 Markdown 檔，不留 Email。",
  },
  alternates: {
    canonical: "https://www.solo.tw/tools/context-architecture",
  },
};

const templates = [
  {
    badge: "模板 1 ／ 6 題填空",
    title: "個人定位卡",
    desc: "一張 A4 寫滿的自我介紹，但不是給人類讀的，是給 AI 讀的。最重要的一欄叫做「不賣什麼」：當 AI 看到一個邊緣請求時，它知道這不在你的射程裡。",
    bullets: [
      "一句話定位（30 字內）",
      "商業形式：你「賣」什麼",
      "拒絕領域：你「不賣」什麼",
      "與最像你的競品最大差異",
      "個人標誌",
      "五年後想被記得的事",
    ],
    href: "/templates/personal-brand-template.md",
    filename: "personal-brand-template.md",
    hint: "右鍵另存新檔即可下載",
  },
  {
    badge: "模板 2 ／ 5 個維度",
    title: "寫作風格 Profile（簡版）",
    desc: "你寫作的指紋。少了這一份，AI 永遠用它預訓練的華語自媒體中位數寫法寫你；灌進去之後，AI 會用你的詞、你的句法、你的拒絕清單思考。",
    bullets: [
      "語氣調性（Tone）",
      "用詞偏好（Vocabulary）",
      "句式結構（Sentence Structure）",
      "修辭手法（Rhetoric）",
      "排版習慣（Formatting）",
    ],
    href: "/templates/voice-profile-template.md",
    filename: "voice-profile-template.md",
    hint: "每個維度都附範例答案，直接照填",
  },
];

const dfyBullets = [
  "個人定位卡、讀者畫像、思想地圖",
  "內容矩陣、寫作風格 Profile、知識資產盤點",
  "工具棧、標竿作品庫、研究脈絡卡",
  "真實對話／受眾語料庫",
];

const faqItems = [
  {
    question: "什麼是個人 Context Architecture？",
    answer:
      "個人 Context Architecture（個人脈絡基礎建設）是一套灌進 AI 工作環境的長期上下文文件。它解決的不是 prompt 問題，而是 AI 不認識你這個人的問題。完整版有 10 份文件，這裡免費提供其中兩份門檻最高的模板。",
  },
  {
    question: "這兩份模板適合誰下載？",
    answer:
      "適合一人公司、知識工作者、自由講師、寫作教練、研究生與獨立顧問。只要你常用 Claude、ChatGPT 之類的 AI 工具寫作或思考，這兩份模板就能幫你大幅提升輸出可用率。",
  },
  {
    question: "下載要付費或留 Email 嗎？",
    answer:
      "兩份模板都是純 Markdown 檔案、完全免費、不需要留 Email、不會綁訂閱。直接點下載按鈕、存到本機、灌進你的 Claude Project 即可。",
  },
  {
    question: "為什麼只有兩份，剩下八份在哪裡？",
    answer:
      "個人定位卡和寫作風格 Profile 是 10 份文件中門檻最高、最多人不知道怎麼開頭的。給你開頭，剩下 8 份你自己能跑。如果你想要全套 10 份 + 由 Vista 親自陪你跑一輪訪談的 Done-For-You 服務，請看 solo.tw/context-architecture-dfy。",
  },
  {
    question: "用了這兩份模板，AI 輸出真的會變好嗎？",
    answer:
      "差別最大的是「像不像你」。少了這兩份，AI 永遠用它預訓練的華語自媒體中位數寫法寫你；灌進去之後，AI 會用你的詞、你的句法、你的拒絕清單來思考。第一稿可用率從 20% 拉到 80% 是真實可達的範圍。",
  },
  {
    question: "這個概念跟英文圈的《AI Operator》電子報是什麼關係？",
    answer:
      "「上下文文件比 prompt 重要」這個方向啟發自一份英文電子報《AI Operator》（作者 Dickie，aioperatornewsletter.substack.com）。他的版本設計給 internet business owner，Vista 在閱讀後重新設計了適合 Solo creator、知識工作者、教學者與研究者的版本，拿掉純行銷漏斗導向、加入思想脈絡、研究脈絡、知識資產等層次，整套擴增為 10 份。本頁面提供的兩份模板（個人定位卡、寫作風格 Profile）以及 Vista 的訪談方法、產出格式都是 Vista 原創，與原作並無從屬關係。",
  },
];

export default function ContextArchitecturePage() {
  return (
    <div className="min-h-screen">
      <JsonLd
        data={breadcrumbSchema([
          { name: "首頁", href: "/" },
          { name: "工具與資源", href: "/tools" },
          {
            name: "個人 Context Architecture",
            href: "/tools/context-architecture",
          },
        ])}
      />
      <JsonLd data={faqSchema(faqItems)} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-white py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,140,110,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(168,140,110,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              免費模板下載 ✦ 不留 Email
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              個人 Context Architecture
            </h1>
            <p className="mt-4 text-lg font-semibold text-stone-700 sm:text-xl">
              兩份免費模板，幫你把一人公司寫進 Claude
            </p>
            <p className="mt-6 text-base leading-relaxed text-stone-500 sm:text-lg">
              AI 寫得不像你、AI 不知道你的受眾是誰、AI 把你當成一個泛用的「知識工作者」而不是「你」這個具體的人。
              <br className="hidden sm:block" />
              這不是 prompt 的問題，是上下文架構的問題。
            </p>
          </div>
        </div>
      </section>

      {/* Concept */}
      <section className="bg-white pb-16 sm:pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-primary bg-stone-50 p-8 sm:p-10">
            <h2 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
              核心命題：AI 輸出爛不是 prompt 問題，是上下文架構問題
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-600">
              <p>
                我看過太多人在 Threads、Substack、YouTube 教 AI 應用，9 成的內容都在教你怎麼下指令、怎麼用 Chain of Thought、怎麼角色扮演。這些有用，但只解決最後 10% 的問題。
              </p>
              <p>
                前面 90% 的痛苦：AI 寫得不像你、不知道你的受眾、不認得你的拒絕清單，全是上下文的問題。解法不是更精緻的 prompt，是把「你這個人」和「你這間一人公司」寫成一整套長期文件，灌進 Claude 的記憶裡。
              </p>
              <p>
                我第一次接觸這個方向，是讀到一份英文電子報《AI Operator》（作者 Dickie），他主張的核心精神是：與其反覆改 prompt，不如一次寫好一整套上下文文件灌進 AI。我認同這個精神，但他的版本設計給「賣課、賣 SaaS、做 e-commerce」的 internet business owner，對{" "}
                <span className="font-bold text-stone-900">
                  Solo creator 賣的是思考本身
                </span>
                這個族群並不適用。
              </p>
              <p>
                我花了兩週重新設計：拿掉純行銷漏斗導向的部分，加入給知識工作者更需要的層次（思想脈絡、研究脈絡、寫作風格、知識資產等），整理成 10 份文件，命名為{" "}
                <span className="font-bold text-stone-900">
                  個人 Context Architecture
                </span>
                。這頁放其中兩份免費模板：個人定位卡、寫作風格 Profile，這是 10 份裡面門檻最高、最多人不知道怎麼開頭的。給你開頭，剩下 8 份你自己能跑。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="bg-gradient-to-b from-white to-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              兩份免費模板
            </h2>
            <p className="mt-2 text-base text-stone-500">
              純 Markdown 檔，下載後直接填、丟進 Claude Project 即可。
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:mt-12 md:grid-cols-2 lg:gap-8">
            {templates.map((tpl) => (
              <article
                key={tpl.title}
                className="flex flex-col rounded-2xl border border-stone-200 border-t-4 border-t-primary bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-8"
              >
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {tpl.badge}
                </div>
                <h3 className="mt-3 text-xl font-bold text-stone-900">
                  {tpl.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  {tpl.desc}
                </p>
                <ul className="mt-5 flex-1 space-y-1.5 text-sm leading-relaxed text-stone-500">
                  {tpl.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button
                    asChild
                    className="w-full shadow-sm shadow-primary/15"
                  >
                    <a
                      href={tpl.href}
                      download={tpl.filename}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      下載{tpl.title}（.md）
                    </a>
                  </Button>
                  <p className="mt-3 text-center text-xs text-stone-400">
                    {tpl.hint}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Upsell */}
      <section className="bg-stone-900 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/20">
            進階版
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            想要全套 10 份 + Done-For-You 訪談服務？
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-300">
            自己填這兩份是基本款。如果你不想自己填，想要由我親自陪你跑一輪訪談、把 10 份文件全部寫好、調好、灌進你的 Claude，這個服務以單次顧問形式提供。
          </p>
          <ul className="mx-auto mt-8 max-w-md space-y-2 text-left text-sm leading-relaxed text-stone-200">
            {dfyBullets.map((b) => (
              <li key={b} className="flex gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button
              size="lg"
              asChild
              className="h-12 px-8 shadow-sm shadow-primary/15"
            >
              <Link href="/context-architecture-dfy">
                查看進階版服務
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            想看更多 AI 工作流的長文？
          </h2>
          <p className="mt-4 text-base text-stone-500">
            每週一封《Vista 電子報》，分享一人公司怎麼用 AI 把寫作變成複利資產。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild className="h-12 px-6 shadow-sm shadow-primary/15">
              <a
                href="https://iamvista.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="mr-2 h-4 w-4" />
                免費訂閱電子報
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 border-stone-300 px-6 text-stone-700 hover:bg-stone-50"
            >
              <Link href="/tools">回到工具與資源</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
