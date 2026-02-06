import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "文章未找到 | 自由人學院",
    };
  }

  return {
    title: `${post.title} | 自由人學院`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.pubDate,
      modifiedTime: post.updatedDate,
      images: post.heroImage ? [post.heroImage] : [],
      siteName: "自由人學院",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

// 生成目錄
function generateTOC(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = content.split("\n");

  lines.forEach((line) => {
    const h2Match = line.match(/^## (.+)$/);
    const h3Match = line.match(/^### (.+)$/);

    if (h2Match) {
      const text = h2Match[1].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, "-")
        .replace(/^-|-$/g, "");
      headings.push({ id, text, level: 2 });
    } else if (h3Match) {
      const text = h3Match[1].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, "-")
        .replace(/^-|-$/g, "");
      headings.push({ id, text, level: 3 });
    }
  });

  return headings;
}

// 計算閱讀時間
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 300; // 中文閱讀速度
  const charCount = content.replace(/\s/g, "").length;
  return Math.ceil(charCount / wordsPerMinute);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getAllPosts();
  const toc = generateTOC(post.content);
  const readingTime = calculateReadingTime(post.content);

  // 相關文章（同標籤）
  const relatedPosts = allPosts
    .filter(
      (p) =>
        p.slug !== post.slug &&
        p.tags.some((tag) => post.tags.includes(tag))
    )
    .slice(0, 3);

  // 熱門文章（有封面圖的最新文章）
  const popularPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.heroImage)
    .slice(0, 5);

  const htmlContent = markdownToHtml(post.content);

  // JSON-LD 結構化資料
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.heroImage,
    datePublished: post.pubDate,
    dateModified: post.updatedDate || post.pubDate,
    author: {
      "@type": "Person",
      name: "Vista Cheng",
      url: "https://solo.tw",
    },
    publisher: {
      "@type": "Organization",
      name: "自由人學院",
      url: "https://solo.tw",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8 lg:py-20">
        {/* Breadcrumb */}
        <nav className="mb-10" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-stone-500">
            <li>
              <Link href="/" className="hover:text-stone-900 transition-colors">
                首頁
              </Link>
            </li>
            <li className="text-stone-300">/</li>
            <li>
              <Link href="/blog" className="hover:text-stone-900 transition-colors">
                部落格
              </Link>
            </li>
            <li className="text-stone-300">/</li>
            <li className="text-stone-700">{post.title.slice(0, 25)}...</li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content */}
          <article className="lg:col-span-8">
            {/* Header - 更大的留白與層次感 */}
            <header className="mb-12">
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                      <span className="inline-block rounded-full border border-stone-200 bg-stone-50 px-4 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:border-amber-400 hover:text-amber-600">
                        {tag}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Title - 更大字體與更寬鬆的行高 */}
              <h1 className="text-[1.75rem] font-semibold leading-[1.35] tracking-tight text-stone-900 sm:text-[2rem] md:text-[2.5rem] lg:text-[2.75rem] lg:leading-[1.25]">
                {post.title}
              </h1>

              {/* Meta - 更多間距 */}
              <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-stone-500">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white">
                    V
                  </div>
                  <span className="font-medium text-stone-700">Vista Cheng</span>
                </div>
                <span className="hidden text-stone-300 sm:inline">|</span>
                <time dateTime={post.pubDate}>{formatDate(post.pubDate)}</time>
                <span className="text-stone-300">|</span>
                <span>{readingTime} 分鐘閱讀</span>
              </div>
            </header>

            {/* Hero Image - 更大的上下間距 */}
            {post.heroImage && (
              <figure className="mb-14 overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={post.heroImage}
                  alt={post.title}
                  className="h-auto w-full object-cover"
                />
              </figure>
            )}

            {/* Mobile TOC */}
            {toc.length > 2 && (
              <details className="mb-8 rounded-xl border bg-muted/30 lg:hidden">
                <summary className="cursor-pointer p-4 font-semibold text-foreground">
                  📑 文章目錄
                </summary>
                <nav className="px-4 pb-4">
                  <ul className="space-y-2 text-sm">
                    {toc.map((item) => (
                      <li
                        key={item.id}
                        className={item.level === 3 ? "ml-4" : ""}
                      >
                        <a
                          href={`#${item.id}`}
                          className="text-muted-foreground hover:text-primary"
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </details>
            )}

            {/* Content - 日式排版：注重留白與節奏感 */}
            <div
              className="prose prose-stone max-w-none dark:prose-invert
                prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-stone-900
                prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-[1.625rem] prose-h2:leading-snug sm:prose-h2:text-[1.875rem] prose-h2:border-l-4 prose-h2:border-amber-500 prose-h2:pl-4 prose-h2:border-b-0
                prose-h3:mt-12 prose-h3:mb-5 prose-h3:text-xl sm:prose-h3:text-[1.375rem] prose-h3:text-stone-800
                prose-p:text-[1.0625rem] prose-p:leading-[1.9] prose-p:tracking-wide prose-p:text-stone-600 prose-p:mb-6 sm:prose-p:text-lg sm:prose-p:leading-[2]
                prose-a:text-amber-600 prose-a:font-medium prose-a:no-underline prose-a:border-b prose-a:border-amber-300 hover:prose-a:border-amber-500 hover:prose-a:text-amber-700
                prose-strong:text-stone-800 prose-strong:font-semibold
                prose-blockquote:border-l-4 prose-blockquote:border-stone-300 prose-blockquote:bg-stone-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r-xl prose-blockquote:my-10 prose-blockquote:text-stone-600
                prose-ul:my-8 prose-ul:space-y-3 prose-ol:my-8 prose-ol:space-y-3 prose-li:text-stone-600 prose-li:leading-relaxed prose-li:pl-2
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-10
                prose-figure:my-12
                prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-stone-500 prose-figcaption:mt-3
                prose-code:text-amber-700 prose-code:bg-amber-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.9em] prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-stone-900 prose-pre:rounded-2xl prose-pre:my-10 prose-pre:shadow-xl
                prose-hr:my-16 prose-hr:border-stone-200"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Share & Actions - 更多上方間距 */}
            <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-b border-stone-200 py-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>分享文章：</span>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://solo.tw/blog/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                  aria-label="分享到 Facebook"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=https://solo.tw/blog/${slug}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                  aria-label="分享到 X"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=https://solo.tw/blog/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                  aria-label="分享到 LinkedIn"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
              <Link
                href="/blog"
                className="text-sm font-medium text-primary hover:underline"
              >
                ← 返回所有文章
              </Link>
            </div>

            {/* Author Box - 更大間距 */}
            <div className="mt-14 rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 to-white p-8 sm:p-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground sm:h-20 sm:w-20 sm:text-3xl">
                  V
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">Vista Cheng</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    自由人學院創辦人，前媒體主編，專注幫助自由工作者打造個人品牌、建立穩定事業。著有《ChatGPT 提問課》等書籍。
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://iamvista.substack.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      訂閱電子報 →
                    </a>
                    <a
                      href="https://www.facebook.com/iamvista"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-full border px-5 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      追蹤 Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Posts - 更大間距 */}
            {relatedPosts.length > 0 && (
              <section className="mt-20">
                <h2 className="mb-8 text-xl font-semibold text-stone-900 sm:text-2xl">
                  相關文章
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="group rounded-xl border bg-card p-4 transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      {p.heroImage && (
                        <div className="mb-3 aspect-video overflow-hidden rounded-lg">
                          <img
                            src={p.heroImage}
                            alt={p.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}
                      <h3 className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary">
                        {p.title}
                      </h3>
                      <time className="mt-2 block text-sm text-muted-foreground">
                        {formatDate(p.pubDate)}
                      </time>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents */}
              {toc.length > 2 && (
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                    文章目錄
                  </h3>
                  <nav>
                    <ul className="space-y-2 text-sm">
                      {toc.map((item) => (
                        <li
                          key={item.id}
                          className={item.level === 3 ? "ml-4" : ""}
                        >
                          <a
                            href={`#${item.id}`}
                            className="block py-1 text-muted-foreground transition-colors hover:text-primary"
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}

              {/* Popular Posts */}
              {popularPosts.length > 0 && (
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                    <svg
                      className="h-5 w-5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    熱門文章
                  </h3>
                  <ul className="space-y-4">
                    {popularPosts.map((p, index) => (
                      <li key={p.slug}>
                        <Link
                          href={`/blog/${p.slug}`}
                          className="group flex gap-3"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                            {index + 1}
                          </span>
                          <span className="line-clamp-2 text-sm text-muted-foreground transition-colors group-hover:text-primary">
                            {p.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Newsletter CTA */}
              <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-center">
                <h3 className="text-lg font-bold text-white">訂閱電子報</h3>
                <p className="mt-2 text-sm text-slate-300">
                  每週獲取最新的自由工作者經營心法
                </p>
                <a
                  href="https://iamvista.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-amber-400 text-sm font-semibold text-slate-900 hover:bg-amber-300"
                >
                  免費訂閱 →
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
      </div>
    </>
  );
}

// Markdown to HTML converter with proper link handling
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Process code blocks first (to avoid escaping code content)
  const codeBlocks: string[] = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    codeBlocks.push(`<pre class="language-${lang || 'text'}"><code>${escapeHtml(code.trim())}</code></pre>`);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // Process inline code
  const inlineCodes: string[] = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
    return `__INLINE_CODE_${inlineCodes.length - 1}__`;
  });

  // Escape HTML entities (but not in code blocks)
  html = escapeHtml(html);

  // Restore code blocks and inline codes
  codeBlocks.forEach((block, i) => {
    html = html.replace(`__CODE_BLOCK_${i}__`, block);
  });
  inlineCodes.forEach((code, i) => {
    html = html.replace(`__INLINE_CODE_${i}__`, code);
  });

  // Headers with IDs for TOC
  html = html.replace(/^### (.+)$/gim, (_, text) => {
    const id = text.trim().toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "");
    return `<h3 id="${id}">${text.trim()}</h3>`;
  });
  html = html.replace(/^## (.+)$/gim, (_, text) => {
    const id = text.trim().toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "");
    return `<h2 id="${id}">${text.trim()}</h2>`;
  });
  html = html.replace(/^# (.+)$/gim, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links - properly handle with target="_blank"
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Images
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<figure><img src="$2" alt="$1" loading="lazy" /><figcaption>$1</figcaption></figure>'
  );

  // Blockquotes
  html = html.replace(/^&gt;\s*(.+)$/gim, "<blockquote><p>$1</p></blockquote>");
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, "\n");

  // Horizontal rules
  html = html.replace(/^---$/gim, "<hr />");
  html = html.replace(/^\*\*\*$/gim, "<hr />");

  // Lists - Unordered
  html = html.replace(/^[-*+]\s+(.+)$/gim, "<li>$1</li>");
  html = html.replace(/(<li>[\s\S]*?<\/li>)(\n(?!<li>|<\/ul>))/g, "$1</ul>$2");
  html = html.replace(/(?<!<\/li>\n)(<li>)/g, "<ul>$1");

  // Paragraphs
  const blocks = html.split(/\n\n+/);
  html = blocks
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      // Skip if already wrapped in HTML tag
      if (/^<[a-z]/.test(block)) return block;
      // Skip if it's just whitespace or line breaks
      if (!block.replace(/\s/g, "")) return "";
      return `<p>${block.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n\n");

  // Clean up
  html = html.replace(/<p>\s*<\/p>/g, "");
  html = html.replace(/<p>(<h[1-6])/g, "$1");
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, "$1");
  html = html.replace(/<p>(<ul>)/g, "$1");
  html = html.replace(/(<\/ul>)<\/p>/g, "$1");
  html = html.replace(/<p>(<blockquote>)/g, "$1");
  html = html.replace(/(<\/blockquote>)<\/p>/g, "$1");
  html = html.replace(/<p>(<figure>)/g, "$1");
  html = html.replace(/(<\/figure>)<\/p>/g, "$1");
  html = html.replace(/<p>(<pre)/g, "$1");
  html = html.replace(/(<\/pre>)<\/p>/g, "$1");
  html = html.replace(/<p>(<hr)/g, "$1");

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
