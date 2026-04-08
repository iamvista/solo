import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "部落格 | solo.tw - 自由工作者的成長指南",
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
    title: "部落格 | solo.tw - 自由工作者的成長指南",
    description:
      "探索個人品牌經營、知識變現策略、AI 工具應用等實用內容。幫助自由工作者把專業變成事業，打造屬於自己的一人公司。",
    type: "website",
    url: "https://www.solo.tw/blog",
    siteName: "solo.tw",
    locale: "zh_TW",
    images: [
      {
        url: "https://www.solo.tw/og",
        width: 1200,
        height: 630,
        alt: "solo.tw 部落格 — 自由工作者的成長指南",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "部落格 | solo.tw - 自由工作者的成長指南",
    description:
      "探索個人品牌經營、知識變現策略、AI 工具應用等實用內容。幫助自由工作者把專業變成事業，打造屬於自己的一人公司。",
    images: ["https://www.solo.tw/og"],
  },
  alternates: {
    canonical: "https://www.solo.tw/blog",
  },
};

// JSON-LD
function generateBlogListingSchema(postCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "solo.tw 部落格",
    description: "探索個人品牌經營、知識變現策略、AI 工具應用等實用內容",
    url: "https://solo.tw/blog",
    publisher: {
      "@type": "Organization",
      name: "solo.tw",
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

  // 精選文章（有圖片的前 5 篇）
  const featuredPosts = posts.filter((post) => post.heroImage).slice(0, 5);
  const regularPosts = posts.slice(5);

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
        {/* Hero Header */}
        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                SOLO ACADEMY BLOG
              </p>
              <h1 className="mt-4 text-4xl font-light tracking-tight text-stone-900 sm:text-5xl">
                自由工作者的
                <span className="font-medium text-amber-600">成長指南</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-stone-600">
                個人品牌 · 知識變現 · AI 工具應用
              </p>
            </div>

            {/* Tags */}
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/blog"
                className="rounded-full bg-stone-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
              >
                全部
              </Link>
              {popularTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="rounded-full border border-stone-300 bg-white px-4 py-1.5 text-sm text-stone-600 transition-all hover:border-amber-500 hover:text-amber-600"
                >
                  {tag}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
          {/* Bento Grid - 精選文章 */}
          {featuredPosts.length >= 5 && (
            <section className="mb-16">
              <div className="mb-6 flex items-center gap-4">
                <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-stone-500">
                  精選文章
                </h2>
                <div className="h-px flex-1 bg-stone-200" />
              </div>

              <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2 lg:gap-5">
                {/* 主打文章 - 左側大圖 (16:9 橫向) */}
                <article className="group md:col-span-2 md:row-span-2">
                  <Link
                    href={`/blog/${featuredPosts[0].slug}`}
                    className="block h-full"
                  >
                    <div className="relative h-full min-h-[320px] overflow-hidden rounded-2xl bg-stone-200 md:min-h-full">
                      {featuredPosts[0].heroImage && (
                        <img
                          src={featuredPosts[0].heroImage}
                          alt={featuredPosts[0].title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
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
                        <h3 className="text-xl font-medium leading-snug text-white lg:text-2xl">
                          {featuredPosts[0].title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-white/80 lg:text-base">
                          {featuredPosts[0].description}
                        </p>
                        <time className="mt-3 block text-xs text-white/60">
                          {formatDate(featuredPosts[0].pubDate)}
                        </time>
                      </div>
                    </div>
                  </Link>
                </article>

                {/* 右上 - 第2篇 */}
                <article className="group">
                  <Link
                    href={`/blog/${featuredPosts[1].slug}`}
                    className="block h-full"
                  >
                    <div className="relative h-full min-h-[180px] overflow-hidden rounded-xl bg-stone-200">
                      {featuredPosts[1].heroImage && (
                        <img
                          src={featuredPosts[1].heroImage}
                          alt={featuredPosts[1].title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="mb-1 block text-xs font-medium text-amber-400">
                          {featuredPosts[1].tags[0]}
                        </span>
                        <h3 className="line-clamp-2 text-sm font-medium text-white lg:text-base">
                          {featuredPosts[1].title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </article>

                {/* 右上 - 第3篇 */}
                <article className="group">
                  <Link
                    href={`/blog/${featuredPosts[2].slug}`}
                    className="block h-full"
                  >
                    <div className="relative h-full min-h-[180px] overflow-hidden rounded-xl bg-stone-200">
                      {featuredPosts[2].heroImage && (
                        <img
                          src={featuredPosts[2].heroImage}
                          alt={featuredPosts[2].title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="mb-1 block text-xs font-medium text-amber-400">
                          {featuredPosts[2].tags[0]}
                        </span>
                        <h3 className="line-clamp-2 text-sm font-medium text-white lg:text-base">
                          {featuredPosts[2].title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </article>

                {/* 右下 - 第4篇 */}
                <article className="group">
                  <Link
                    href={`/blog/${featuredPosts[3].slug}`}
                    className="block h-full"
                  >
                    <div className="relative h-full min-h-[180px] overflow-hidden rounded-xl bg-stone-200">
                      {featuredPosts[3].heroImage && (
                        <img
                          src={featuredPosts[3].heroImage}
                          alt={featuredPosts[3].title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="mb-1 block text-xs font-medium text-amber-400">
                          {featuredPosts[3].tags[0]}
                        </span>
                        <h3 className="line-clamp-2 text-sm font-medium text-white lg:text-base">
                          {featuredPosts[3].title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </article>

                {/* 右下 - 第5篇 */}
                <article className="group">
                  <Link
                    href={`/blog/${featuredPosts[4].slug}`}
                    className="block h-full"
                  >
                    <div className="relative h-full min-h-[180px] overflow-hidden rounded-xl bg-stone-200">
                      {featuredPosts[4].heroImage && (
                        <img
                          src={featuredPosts[4].heroImage}
                          alt={featuredPosts[4].title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="mb-1 block text-xs font-medium text-amber-400">
                          {featuredPosts[4].tags[0]}
                        </span>
                        <h3 className="line-clamp-2 text-sm font-medium text-white lg:text-base">
                          {featuredPosts[4].title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </article>
              </div>
            </section>
          )}

          {/* 所有文章 */}
          <section>
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-stone-500">
                所有文章 · {posts.length} 篇
              </h2>
              <div className="h-px flex-1 bg-stone-200" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regularPosts.map((post) => (
                <article key={post.slug} className="group">
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
                    <div className="mt-4">
                      <div className="mb-1.5 flex gap-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-medium text-amber-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="line-clamp-2 text-base font-medium leading-snug text-stone-900 transition-colors group-hover:text-amber-600 lg:text-lg">
                        {post.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-stone-600">
                        {post.description}
                      </p>
                      <time className="mt-2 block text-xs text-stone-500">
                        {formatDate(post.pubDate)}
                      </time>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="mt-20">
            <div className="relative overflow-hidden rounded-2xl bg-stone-900 px-8 py-14 sm:px-14 lg:px-20 lg:py-16">
              <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-amber-500/20 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />

              <div className="relative text-center">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
                  NEWSLETTER
                </p>
                <h2 className="mt-3 text-2xl font-light text-white sm:text-3xl">
                  每週精選，直達信箱
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-stone-400 sm:text-base">
                  訂閱電子報，獲取最新的自由工作者經營心法與 AI 工具應用技巧
                </p>
                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href="https://iamvista.substack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center rounded-full bg-amber-500 px-7 text-sm font-medium text-stone-900 transition-all hover:bg-amber-400"
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
                    已有 18,000+ 訂閱者
                  </span>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-10 text-center">
            <p className="text-sm text-stone-500">
              solo.tw — 幫助自由工作者把專業變成事業
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
