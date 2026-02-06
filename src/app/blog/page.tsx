import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags, formatDate } from "@/lib/blog";

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

// JSON-LD
function generateBlogListingSchema(postCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "自由人學院部落格",
    description: "探索個人品牌經營、知識變現策略、AI 工具應用等實用內容",
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

  // 計算標籤統計
  const tagCounts: Record<string, number> = {};
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag]) => tag);

  // 精選文章（有圖片的前 4 篇）
  const featuredPosts = posts.filter((post) => post.heroImage).slice(0, 4);
  const regularPosts = posts.slice(4);

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-4xl font-light tracking-tight text-stone-900">
            部落格
          </h1>
          <p className="mt-4 text-stone-600">文章即將上線，敬請期待</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBlogListingSchema(posts.length)),
        }}
      />

      <div className="min-h-screen bg-stone-50">
        {/* Hero Header - 日式極簡風格 */}
        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                SOLO ACADEMY BLOG
              </p>
              <h1 className="mt-4 text-4xl font-light tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
                自由工作者的
                <span className="font-normal text-amber-600">成長指南</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
                個人品牌 · 知識變現 · AI 工具應用
              </p>
            </div>

            {/* Tags - 膠囊式設計 */}
            <nav className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/blog"
                className="rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
              >
                全部
              </Link>
              {popularTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="rounded-full border border-stone-300 bg-white px-5 py-2 text-sm text-stone-700 transition-all hover:border-amber-500 hover:text-amber-600"
                >
                  {tag}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
          {/* Featured Posts - 雜誌式 Bento Grid */}
          {featuredPosts.length > 0 && (
            <section className="mb-20">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-stone-500">
                  精選文章
                </h2>
                <div className="h-px flex-1 bg-stone-200 ml-6" />
              </div>

              <div className="grid gap-6 lg:grid-cols-12 lg:grid-rows-2">
                {/* Main Feature */}
                <article className="group lg:col-span-7 lg:row-span-2">
                  <Link href={`/blog/${featuredPosts[0].slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-200 lg:aspect-[4/5]">
                      {featuredPosts[0].heroImage && (
                        <img
                          src={featuredPosts[0].heroImage}
                          alt={featuredPosts[0].title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="mb-3 flex gap-2">
                          {featuredPosts[0].tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-2xl font-medium leading-tight text-white lg:text-3xl">
                          {featuredPosts[0].title}
                        </h3>
                        <p className="mt-3 line-clamp-2 text-sm text-white/80">
                          {featuredPosts[0].description}
                        </p>
                        <time className="mt-4 block text-xs text-white/60">
                          {formatDate(featuredPosts[0].pubDate)}
                        </time>
                      </div>
                    </div>
                  </Link>
                </article>

                {/* Secondary Features */}
                {featuredPosts.slice(1, 4).map((post, index) => (
                  <article
                    key={post.slug}
                    className="group lg:col-span-5"
                  >
                    <Link href={`/blog/${post.slug}`} className="flex gap-5">
                      <div className="relative aspect-square w-28 flex-shrink-0 overflow-hidden rounded-xl bg-stone-200 sm:w-36">
                        {post.heroImage && (
                          <img
                            src={post.heroImage}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="flex flex-col justify-center py-1">
                        <div className="mb-2 flex gap-2">
                          {post.tags.slice(0, 1).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs font-medium text-amber-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="line-clamp-2 text-base font-medium leading-snug text-stone-900 transition-colors group-hover:text-amber-600 sm:text-lg">
                          {post.title}
                        </h3>
                        <time className="mt-2 text-xs text-stone-500">
                          {formatDate(post.pubDate)}
                        </time>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* All Posts - 清新卡片式 */}
          <section>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-stone-500">
                所有文章 · {posts.length} 篇
              </h2>
              <div className="h-px flex-1 bg-stone-200 ml-6" />
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {regularPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-stone-200">
                      {post.heroImage ? (
                        <img
                          src={post.heroImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                          <svg
                            className="h-10 w-10 text-stone-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="mt-5">
                      {/* Tags */}
                      <div className="mb-2 flex gap-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-medium text-amber-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className="line-clamp-2 text-lg font-medium leading-snug text-stone-900 transition-colors group-hover:text-amber-600">
                        {post.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">
                        {post.description}
                      </p>

                      {/* Date */}
                      <time className="mt-3 block text-xs text-stone-500">
                        {formatDate(post.pubDate)}
                      </time>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* Newsletter CTA - 精緻日式風格 */}
          <section className="mt-24">
            <div className="relative overflow-hidden rounded-3xl bg-stone-900 px-8 py-16 sm:px-16 lg:px-24 lg:py-20">
              {/* Decorative elements */}
              <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-amber-500/20 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />

              <div className="relative text-center">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
                  NEWSLETTER
                </p>
                <h2 className="mt-4 text-3xl font-light text-white sm:text-4xl">
                  每週精選，直達信箱
                </h2>
                <p className="mx-auto mt-4 max-w-md text-base text-stone-400">
                  訂閱電子報，獲取最新的自由工作者經營心法、AI 工具應用技巧
                </p>
                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href="https://iamvista.substack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center rounded-full bg-amber-500 px-8 text-sm font-medium text-stone-900 transition-all hover:bg-amber-400"
                  >
                    免費訂閱
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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                  <span className="text-sm text-stone-500">
                    已有 16,000+ 訂閱者
                  </span>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-12 text-center">
            <p className="text-sm text-stone-500">
              自由人學院 — 幫助自由工作者把專業變成事業
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
