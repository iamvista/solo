import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Activity,
  BookOpen,
  Calendar,
  FileDown,
  Mail,
  Video,
  Wrench,
} from "lucide-react";
import { SOCIAL_PROOF } from "@/lib/constants";

export const metadata: Metadata = {
  title: "工具與資源 | solo.tw",
  description:
    "一人事業者的實用工具箱。免費事業健檢、AI 工作坊、線上課程、模板工具包——幫你更有效率地經營事業。",
};

/* ─── 已上線的核心工具 ─── */
const liveTools = [
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
    desc: "Vibe Coding、AI 內容產製……把工作坊精華濃縮成隨時都能看的線上課程。",
    stats: "Cloudflare Stream 影片託管",
    href: "https://learn.solo.tw",
    cta: "瀏覽課程",
    highlight: false,
  },
  {
    icon: Video,
    title: "1-on-1 諮詢",
    desc: "不知道下一步該怎麼走？一小時深度對話，幫你理清方向、制定行動計畫。",
    stats: `${SOCIAL_PROOF.consultingHours} 小時累計`,
    href: "/consulting",
    cta: "了解更多",
    highlight: false,
  },
];

/* ─── 免費資源 ─── */
const freeResources = [
  {
    icon: Mail,
    title: "Solo 成長電子報",
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
  { name: "模板 & 工具包", desc: "Notion 模板、Prompt 工具包，即買即用" },
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
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              工具與資源
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              一人事業者的<span className="text-primary">武器庫</span>
            </h1>
            <p className="mt-4 text-lg text-stone-500 sm:text-xl">
              免費診斷、實戰課程、模板工具——
              <br className="hidden sm:block" />
              幫你用更少的時間，做出更大的成果。
            </p>
          </div>
        </div>
      </section>

      {/* ─── 核心工具（已上線） ─── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              現在就能使用
            </h2>
            <p className="mt-2 text-base text-stone-500">
              這些工具和服務已經上線，立即開始使用。
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:mt-12 sm:grid-cols-2 lg:gap-8">
            {liveTools.map((tool) => {
              const Icon = tool.icon;
              const isExternal = tool.href.startsWith("http");
              return (
                <div
                  key={tool.title}
                  className={`group relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md sm:p-8 ${
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

      {/* ─── 免費資源 ─── */}
      <section className="bg-stone-50 py-16 sm:py-20">
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
                  className="group flex flex-col items-center rounded-2xl border border-stone-200 bg-white p-6 text-center transition-all hover:border-stone-300 hover:shadow-md"
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
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100">
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
                className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50/50 px-5 py-4"
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
                訂閱電子報，搶先體驗
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="bg-gradient-to-b from-stone-50 to-stone-100 py-16 sm:py-24">
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
