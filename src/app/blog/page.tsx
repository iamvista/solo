import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags, formatDate } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "部落格 | 自由人學院 - 自由工作者的成長指南",
  description:
    "探索個人品牌經營、知識變現策略、AI 工具應用等實用內容。幫助自由工作者把專業變成事業，打造屬於自己的一人公司。",
  keywords: [
    "自由工作者",
    "個人品牌",
    "知識付費",
    "一人公司",
    "AI應用",
    "內容創作",
    "自媒體經營",
  ],
  openGraph: {
    title: "部落格 | 自由人學院",
    description:
      "探索個人品牌經營、知識變現策略、AI 工具應用等實用內容。幫助自由工作者把專業變成事業。",
    type: "website",
    url: "https://solo.tw/blog",
    siteName: "自由人學院",
  },
  twitter: {
    card: "summary_large_image",
    title: "部落格 | 自由人學院",
    description:
      "探索個人品牌經營、知識變現策略、AI 工具應用等實用內容。幫助自由工作者把專業變成事業。",
  },
  alternates: {
    canonical: "https://solo.tw/blog",
  },
};

// JSON-LD 結構化資料
function generateBlogListingSchema(postCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "自由人學院部落格",
    description:
      "探索個人品牌經營、知識變現策略、AI 工具應用等實用內容",
    url: "https://solo.tw/blog",
    publisher: {
      "@type": "Organization",
      name: "自由人學院",
      url: "https://solo.tw",
    },
    blogPost: {
      "@type": "ItemList",
      numberOfItems: postCount,
    },
  };
}

export default async function BlogPage() {
  const posts = await getAllPosts();
  const allTags = await getAllTags();

  // 取得熱門標籤（按文章數量排序）
  const tagCounts: Record<string, number> = {};
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  // 精選文章（最新的 3 篇有圖片的文章）
  const featuredPosts = posts.filter((post) => post.heroImage).slice(0, 3);
  const regularPosts = posts.filter(
    (post) => !featuredPosts.includes(post)
  );

  // 如果沒有文章
  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            部落格
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            自由工作者的經營心法與實戰經驗
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 py-20">
          <span className="text-6xl">📝</span>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            文章即將上線
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            我們正在準備精彩的內容，請稍後再來！
          </p>
          <Link
            href="https://iamvista.substack.com"
            target="_blank"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            先訂閱電子報 →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBlogListingSchema(posts.length)),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Header Section */}
        <header className="mb-12 text-center lg:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            共 {posts.length} 篇文章
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            自由工作者的
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              成長指南
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            探索個人品牌經營、知識變現策略、AI 工具應用
            <br className="hidden sm:block" />
            幫助你把專業變成事業
          </p>
        </header>

        {/* Tags Navigation */}
        <nav className="mb-12 lg:mb-16" aria-label="文章分類">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/blog"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md"
            >
              全部文章
            </Link>
            {popularTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                {tag}
                <span className="ml-1 text-xs opacity-60">
                  ({tagCounts[tag]})
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16" aria-labelledby="featured-heading">
            <h2 id="featured-heading" className="sr-only">
              精選文章
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Featured Post */}
              <article className="group relative lg:col-span-2 lg:row-span-2">
                <Link
                  href={`/blog/${featuredPosts[0].slug}`}
                  className="block overflow-hidden rounded-2xl"
                >
                  <div className="relative aspect-[16/9] lg:aspect-[16/10]">
                    <img
                      src={featuredPosts[0].heroImage}
                      alt={featuredPosts[0].title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <div className="mb-3 flex flex-wrap gap-2">
                        {featuredPosts[0].tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                        {featuredPosts[0].title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-white/80 sm:text-base">
                        {featuredPosts[0].description}
                      </p>
                      <time
                        className="mt-3 block text-sm text-white/60"
                        dateTime={featuredPosts[0].pubDate}
                      >
                        {formatDate(featuredPosts[0].pubDate)}
                      </time>
                    </div>
                  </div>
                </Link>
              </article>

              {/* Secondary Featured Posts */}
              {featuredPosts.slice(1, 3).map((post) => (
                <article key={post.slug} className="group">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block overflow-hidden rounded-xl"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={post.heroImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="mb-2 flex gap-2">
                          {post.tags.slice(0, 1).map((tag) => (
                            <Badge
                              key={tag}
                              className="bg-white/20 text-xs text-white backdrop-blur-sm"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="line-clamp-2 text-base font-semibold text-white sm:text-lg">
                          {post.title}
                        </h3>
                        <time
                          className="mt-1 block text-xs text-white/60"
                          dateTime={post.pubDate}
                        >
                          {formatDate(post.pubDate)}
                        </time>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        <section aria-labelledby="all-posts-heading">
          <div className="mb-8 flex items-center justify-between">
            <h2
              id="all-posts-heading"
              className="text-xl font-bold text-foreground sm:text-2xl"
            >
              所有文章
            </h2>
            <span className="text-sm text-muted-foreground">
              共 {regularPosts.length} 篇
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {regularPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Hero Image */}
                {post.heroImage ? (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="aspect-video overflow-hidden"
                  >
                    <img
                      src={post.heroImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                ) : (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex aspect-video items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"
                  >
                    <svg
                      className="h-12 w-12 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </Link>
                )}

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="mb-2 line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary sm:text-lg">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  {/* Description */}
                  <p className="mb-3 line-clamp-2 flex-1 text-sm text-muted-foreground">
                    {post.description}
                  </p>

                  {/* Date */}
                  <time
                    className="text-xs text-muted-foreground"
                    dateTime={post.pubDate}
                  >
                    {formatDate(post.pubDate)}
                  </time>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="mt-20" aria-labelledby="newsletter-heading">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-12 lg:p-16">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="grid"
                    width="32"
                    height="32"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M0 32V0h32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-4 py-1.5 text-sm font-medium text-amber-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                免費訂閱
              </div>
              <h2
                id="newsletter-heading"
                className="mt-4 text-2xl font-bold text-white sm:text-3xl lg:text-4xl"
              >
                想收到更多實用內容？
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base text-slate-300 sm:text-lg">
                訂閱電子報，每週直送你的信箱。獲取最新的自由工作者經營心法、AI
                工具應用技巧，以及獨家的變現策略。
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="https://iamvista.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-amber-400 px-8 text-base font-semibold text-slate-900 shadow-lg transition-all hover:bg-amber-300 hover:shadow-xl"
                >
                  立即訂閱
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
                <span className="text-sm text-slate-400">
                  已有 2,000+ 訂閱者
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Footer Text */}
        <footer className="mt-16 border-t pt-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              自由人學院部落格提供自由工作者、一人公司創業者所需的經營知識與實戰經驗。
            </p>
            <p className="mt-2">
              涵蓋個人品牌打造、知識付費策略、AI 工具應用、內容創作技巧等主題。
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
