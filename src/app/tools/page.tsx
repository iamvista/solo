import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Activity,
  BookOpen,
  Calendar,
  FileText,
  Mail,
  Sparkles,
  Users,
  Video,
  Wrench,
} from "lucide-react";
import { SOCIAL_PROOF } from "@/lib/constants";

export const metadata: Metadata = {
  title: "工具與資源 | solo.tw",
  description:
    "一人事業者的實用工具箱：免費事業健檢、AI 工作坊、線上課程、諮詢，以及下載即用的模板與工具包。",
  alternates: {
    canonical: "https://www.solo.tw/tools",
  },
};

/* ─── 立即可用的服務 ─── */
const liveServices = [
  {
    icon: Activity,
    title: "SOLO 事業健檢",
    desc: "回答 7 個問題，AI 幫你分析五大維度，找出強項和突破點。3 分鐘完成。",
    stats: `${SOCIAL_PROOF.diagnoseCount} 人已完成`,
    href: "/diagnose",
    cta: "開始免費健檢",
    highlight: true,
  },
  {
    icon: FileText,
    title: "AI 個人脈絡庫 模板",
    desc: "兩份免費 Markdown 模板：個人定位卡、寫作風格檔案，給 AI 一份可參照的風格底稿。",
    stats: "免費下載 ✦ 不留 Email",
    href: "/tools/ai-context-library",
    cta: "下載模板",
    highlight: false,
  },
  {
    icon: Calendar,
    title: "AI 工作坊",
    desc: "小班制實戰課程，手把手帶你用 AI 打造個人事業的武器庫。即學即用。",
    stats: `${SOCIAL_PROOF.workshopCount} 場已舉辦`,
    href: "/courses",
    cta: "查看近期場次",
    highlight: false,
  },
  {
    icon: BookOpen,
    title: "線上課程",
    desc: "Vibe Coding、AI 內容產製⋯⋯把工作坊精華濃縮成隨時都能看的線上課程。",
    stats: "即將推出",
    href: "/courses",
    cta: "瀏覽課程",
    highlight: false,
  },
  {
    icon: Video,
    title: "諮詢",
    desc: "不知道下一步該怎麼走？一小時深度對話，幫你理清方向、制定行動計畫。",
    stats: `${SOCIAL_PROOF.consultingHours} 小時累計`,
    href: "/consulting",
    cta: "了解更多",
    highlight: false,
  },
];

/* ─── 數位產品（模板 & 工具包） ─── */
const digitalProducts = [
  {
    icon: Users,
    title: "無人公司 AI 軍團啟動包",
    desc: "把派工原則、角色人設、對抗式驗收流程寫成制度檔，鋪進 Claude Code 就能用。不用寫程式，也能建一支 AI 團隊。",
    price: "NT$990",
    originalPrice: null,
    href: "/products/solo-army-kit",
    badge: "新品",
  },
];

/* ─── 免費資源 ─── */
const freeResources = [
  {
    icon: Mail,
    title: "Vista 電子報",
    desc: "每週一封，AI 工具箱、經營心得、開課通知。",
    href: "https://iamvista.substack.com/",
    cta: "免費訂閱",
  },
  {
    icon: BookOpen,
    title: "部落格文章",
    desc: "一人事業的實戰知識庫，從定位到 AI 應用。",
    href: "/blog",
    cta: "閱讀文章",
  },
  {
    icon: Activity,
    title: "SOLO 成長路徑",
    desc: "四階段框架，找到你現在的位置和下一步。",
    href: "/growth",
    cta: "了解方法論",
  },
];

/* ─── 規劃中的工具 ─── */
const upcomingTools = [
  { name: "名單磁鐵系統", desc: "幫你收集潛在客戶名單的落地頁工具" },
  { name: "時薪計算器", desc: "根據收入目標反推你的最低時薪" },
  { name: "專案報價模板", desc: "專業的報價單，提升成交率" },
  { name: "問卷調查系統", desc: "了解客戶需求，用數據驅動決策" },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen">
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
              工具與資源
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              一人事業者的<span className="text-primary">武器庫</span>
            </h1>
            <p className="mt-4 text-lg text-stone-500 sm:text-xl">
              免費診斷、實戰課程、模板工具——
              <br className="hidden sm:block" />
              幫你用更少的時間，做出更大的成果。
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                asChild
                className="h-12 px-6 shadow-sm shadow-primary/15"
              >
                <Link href="/diagnose">
                  開始免費健檢
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 border-stone-300 px-6 text-stone-700 hover:bg-stone-50"
              >
                <Link href="#digital-products">
                  瀏覽數位產品
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 立即可用的服務 ─── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              立即可用的服務
            </h2>
            <p className="mt-2 text-base text-stone-500">
              這些工具和服務已經上線，立即開始使用。
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:mt-12 sm:grid-cols-2 lg:gap-8">
            {liveServices.map((tool) => {
              const Icon = tool.icon;
              const isExternal = tool.href.startsWith("http");
              return (
                <div
                  key={tool.title}
                  className={`group relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-8 ${
                    tool.highlight
                      ? "border-primary/30 ring-1 ring-primary/10"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {tool.highlight && (
                    <span className="absolute -top-3 right-6 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                      免費使用
                    </span>
                  )}

                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        tool.highlight
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-stone-400">
                      {tool.stats}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-stone-900">
                    {tool.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">
                    {tool.desc}
                  </p>

                  <div className="mt-6">
                    <Button
                      variant={tool.highlight ? "default" : "outline"}
                      size="sm"
                      asChild
                      className={
                        tool.highlight
                          ? "shadow-sm shadow-primary/15"
                          : "border-stone-300 text-stone-700 hover:bg-stone-50"
                      }
                    >
                      {isExternal ? (
                        <a
                          href={tool.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {tool.cta}
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </a>
                      ) : (
                        <Link href={tool.href}>
                          {tool.cta}
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 數位產品 ─── */}
      <section
        id="digital-products"
        className="relative overflow-hidden bg-gradient-to-b from-stone-50 to-white py-16 sm:py-20 scroll-mt-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              下載即用
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              模板 &amp; 工具包
            </h2>
            <p className="mt-2 text-base text-stone-500">
              不用從零開始。Vista 把過去三年累積的工作流封裝成數位產品，付一次費，一輩子帶著走。
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:mt-12 sm:grid-cols-2">
            {digitalProducts.map((product) => {
              const Icon = product.icon;
              return (
                <Link
                  key={product.title}
                  href={product.href}
                  className="group relative flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:p-8"
                >
                  {product.badge && (
                    <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                      {product.badge}
                    </span>
                  )}

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-stone-900">
                    {product.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">
                    {product.desc}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-5">
                    <span className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </span>
                    <span className="inline-flex items-center text-sm font-medium text-stone-600 transition-colors group-hover:text-primary">
                      查看細節
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 免費資源 ─── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              免費資源
            </h2>
            <p className="mt-2 text-base text-stone-500">
              不花一毛錢就能開始學習和成長。
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-6">
            {freeResources.map((resource) => {
              const Icon = resource.icon;
              const isExternal = resource.href.startsWith("http");
              const LinkComp = isExternal ? "a" : Link;
              const linkProps = isExternal
                ? {
                    href: resource.href,
                    target: "_blank" as const,
                    rel: "noopener noreferrer",
                  }
                : { href: resource.href };

              return (
                <LinkComp
                  key={resource.title}
                  {...linkProps}
                  className="group flex flex-col items-center rounded-2xl border border-stone-200 bg-white p-6 text-center transition-all hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-stone-900">
                    {resource.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-stone-500">
                    {resource.desc}
                  </p>
                  <span className="mt-3 inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    {resource.cta}
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </span>
                </LinkComp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 規劃中 ─── */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
              <Wrench className="h-6 w-6 text-stone-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              正在打造中
            </h2>
            <p className="mt-2 text-base text-stone-500">
              這些工具正在開發，訂閱電子報第一時間收到上線通知。
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:mt-12">
            {upcomingTools.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center justify-between rounded-xl border border-stone-100 bg-white px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-stone-700">
                    {tool.name}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-400">{tool.desc}</p>
                </div>
                <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-medium text-stone-500">
                  開發中
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" size="sm" asChild className="border-stone-300">
              <a
                href="https://iamvista.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                訂閱 Vista 電子報，搶先體驗
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="bg-gradient-to-b from-stone-100 to-stone-50 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
            不確定從哪裡開始？
          </h2>
          <p className="mt-4 text-lg text-stone-500">
            花 3 分鐘做免費事業健檢，找出你最需要加強的面向。
          </p>
          <div className="mt-8">
            <Button size="lg" asChild className="h-14 px-8 text-base font-semibold shadow-lg shadow-primary/15 sm:text-lg">
              <Link href="/diagnose">
                開始免費健檢
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
