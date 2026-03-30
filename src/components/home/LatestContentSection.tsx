import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

// 精選文章（靜態資料，之後可改為從 API 動態取得最新文章）
const articles = [
  {
    slug: "how-professionals-leverage-ai-agents",
    title: "職場人士如何善用 AI Agent？從問 AI 到讓 AI 幫你做的關鍵轉變",
    excerpt:
      "AI Agent 正是那塊缺失的拼圖，幫助你從「問答者」升級為「AI 的監督者」。",
    tag: "AI 應用",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    slug: "profit-awakening-knowledge-worker",
    title: "知識工作者的獲利覺醒：從現金流思維到微型組織時代的生存法則",
    excerpt:
      "當 AI 重塑工作型態，每個人都必須學會把自己變成可獲利的微型組織。",
    tag: "個人品牌",
    tagColor: "bg-violet-100 text-violet-700",
  },
  {
    slug: "selling-yourself-2026",
    title: "賣自己：一人事業者的品牌經營心法",
    excerpt:
      "你的專業不是產品，你才是。學會把自己賣出去的關鍵思維。",
    tag: "實戰分享",
    tagColor: "bg-amber-100 text-amber-700",
  },
];

export function LatestContentSection() {
  return (
    <section id="latest-content" className="bg-gradient-to-b from-stone-50 to-white py-16 sm:py-20 lg:py-24">
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
