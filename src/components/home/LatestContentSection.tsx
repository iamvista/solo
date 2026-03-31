import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

// 精選文章（靜態資料，之後可改為從 API 動態取得最新文章）
const articles = [
  {
    slug: "ai-tools-for-solopreneurs",
    title: "一人公司必備的 5 個 AI 工具——我每天都在用的實戰組合",
    excerpt:
      "不是列一堆工具給你看，是我自己每天真的在用、幫我省下大量時間的組合。",
    tag: "AI 應用",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    slug: "freelancer-pricing-strategy",
    title: "自由工作者該怎麼定價？一個讓你不再心虛的計算方法",
    excerpt:
      "定價不是憑感覺。從成本倒推、市場對標到價值定價的完整框架。",
    tag: "一人事業",
    tagColor: "bg-primary/10 text-primary",
  },
  {
    slug: "content-to-passive-income",
    title: "一個人如何用內容建立被動收入？從寫文章到持續進帳的完整路徑",
    excerpt:
      "內容不只是行銷工具，它可以成為你的收入來源。四層漏斗完整拆解。",
    tag: "知識變現",
    tagColor: "bg-amber-100 text-amber-700",
  },
];

export function LatestContentSection() {
  return (
    <section id="latest-content" className="bg-gradient-to-b from-stone-50 to-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              最新內容
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              一人事業的實戰知識庫
            </h2>
          </div>
          <Button
            variant="ghost"
            asChild
            className="hidden text-stone-600 hover:text-stone-900 sm:inline-flex"
          >
            <Link href="/blog">
              全部文章
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-3 sm:gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:border-stone-300 hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-stone-400" />
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${article.tagColor}`}
                >
                  {article.tag}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold leading-snug text-stone-900 transition-colors group-hover:text-primary">
                {article.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">
                {article.excerpt}
              </p>

              <span className="mt-4 inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                閱讀全文
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>

        {/* 手機版全部文章連結 */}
        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild className="border-stone-300">
            <Link href="/blog">
              查看全部文章
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
