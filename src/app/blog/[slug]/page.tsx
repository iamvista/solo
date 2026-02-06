import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";
import "./article.css";
import { TOCHighlight } from "./TOCHighlight";

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
    return { title: "文章未找到 | 自由人學院" };
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
  };
}

// 生成目錄
function generateTOC(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = content.split("\n");

  // 移除 markdown 連結語法，保留連結文字
  const stripMarkdownLinks = (text: string): string => {
    // [連結文字](URL) -> 連結文字
    return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  };

  lines.forEach((line) => {
    const h2Match = line.match(/^## (.+)$/);
    const h3Match = line.match(/^### (.+)$/);

    if (h2Match) {
      const rawText = h2Match[1].trim();
      const text = stripMarkdownLinks(rawText);
      const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "");
      headings.push({ id, text, level: 2 });
    } else if (h3Match) {
      const rawText = h3Match[1].trim();
      const text = stripMarkdownLinks(rawText);
      const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "");
      headings.push({ id, text, level: 3 });
    }
  });

  return headings;
}

// 計算閱讀時間
function calculateReadingTime(content: string): number {
  const charCount = content.replace(/\s/g, "").length;
  return Math.ceil(charCount / 300);
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

  // 相關文章
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3);

  // 熱門文章
  const popularPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.heroImage)
    .slice(0, 5);

  const htmlContent = markdownToHtml(post.content);

  // JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.heroImage,
    datePublished: post.pubDate,
    dateModified: post.updatedDate || post.pubDate,
    author: { "@type": "Person", name: "Vista Cheng" },
    publisher: { "@type": "Organization", name: "自由人學院" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-[#fbf8f4]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-stone-500">
              <li>
                <Link href="/" className="hover:text-stone-800">首頁</Link>
              </li>
              <li className="text-stone-300">/</li>
              <li>
                <Link href="/blog" className="hover:text-stone-800">部落格</Link>
              </li>
            </ol>
          </nav>

          <div className="lg:grid lg:grid-cols-12 lg:gap-10">
            {/* Main Content */}
            <article className="lg:col-span-8">
              {/* Header */}
              <header className="mb-10">
                {post.tags.length > 0 && (
                  <div className="mb-5 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                        <span className="inline-block rounded-full bg-stone-200/60 px-4 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-300/60">
                          {tag}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                <h1 className="text-[1.75rem] font-extrabold leading-[1.3] tracking-tight text-stone-900 sm:text-[2.25rem] md:text-[2.5rem]">
                  {post.title}
                </h1>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-stone-500">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800 text-sm font-bold text-white">
                      V
                    </div>
                    <span className="font-medium text-stone-700">Vista Cheng</span>
                  </div>
                  <span className="text-stone-300">|</span>
                  <time>{formatDate(post.pubDate)}</time>
                  <span className="text-stone-300">|</span>
                  <span>{readingTime} 分鐘閱讀</span>
                </div>
              </header>

              {/* Hero Image */}
              {post.heroImage && (
                <figure className="mb-10">
                  <img
                    src={post.heroImage}
                    alt={post.title}
                    className="h-auto w-full rounded-lg bg-stone-200"
                  />
                </figure>
              )}

              {/* Mobile TOC */}
              {toc.length > 2 && (
                <details className="mb-10 rounded-xl border border-stone-200 bg-white lg:hidden">
                  <summary className="cursor-pointer p-4 font-semibold text-stone-800">
                    📑 文章目錄
                  </summary>
                  <nav className="px-4 pb-4">
                    <ul className="space-y-2 text-sm">
                      {toc.map((item) => (
                        <li key={item.id} className={item.level === 3 ? "ml-4" : ""}>
                          <a href={`#${item.id}`} className="text-stone-600 hover:text-[#d13a3a]">
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </details>
              )}

              {/* Content */}
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {/* Share */}
              <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-stone-200 pt-8">
                <span className="text-sm text-stone-500">分享文章：</span>
                <div className="flex gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=https://solo.tw/blog/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-200 text-stone-600 hover:bg-[#d13a3a] hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=https://solo.tw/blog/${slug}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-200 text-stone-600 hover:bg-[#d13a3a] hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=https://solo.tw/blog/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-200 text-stone-600 hover:bg-[#d13a3a] hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
                <Link href="/blog" className="ml-auto text-sm font-medium text-[#d13a3a] hover:underline">
                  ← 返回所有文章
                </Link>
              </div>

              {/* Author Box */}
              <div className="mt-12 rounded-xl bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-stone-800 text-xl font-bold text-white">
                    V
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-stone-900">Vista Cheng</h3>
                    <p className="mt-2 text-base leading-relaxed text-stone-600">
                      自由人學院創辦人，前媒體主編，專注幫助自由工作者打造個人品牌、建立穩定事業。
                    </p>
                    <a
                      href="https://iamvista.substack.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex h-10 items-center rounded-full bg-stone-800 px-5 text-sm font-medium text-white hover:bg-stone-700"
                    >
                      訂閱電子報 →
                    </a>
                  </div>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <section className="mt-16 border-t border-stone-200 pt-12">
                  <h2 className="mb-8 text-xl font-bold text-stone-900">相關文章</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedPosts.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/blog/${p.slug}`}
                        className="group rounded-xl bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-md"
                      >
                        {p.heroImage && (
                          <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-stone-100">
                            <img
                              src={p.heroImage}
                              alt={p.title}
                              className="h-full w-full object-cover group-hover:scale-105"
                            />
                          </div>
                        )}
                        <h3 className="line-clamp-2 text-base font-semibold text-stone-900 group-hover:text-[#d13a3a]">
                          {p.title}
                        </h3>
                        <time className="mt-2 block text-sm text-stone-500">
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
                {/* TOC with Highlight */}
                {toc.length > 2 && (
                  <div className="rounded-xl border border-stone-200 bg-white p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-stone-800">
                      <svg className="h-5 w-5 text-[#d13a3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      文章目錄
                    </h3>
                    <TOCHighlight toc={toc} />
                  </div>
                )}

                {/* Popular Posts */}
                {popularPosts.length > 0 && (
                  <div className="rounded-xl border border-stone-200 bg-white p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-stone-800">
                      <svg className="h-5 w-5 text-[#d13a3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      熱門文章
                    </h3>
                    <ul className="space-y-4">
                      {popularPosts.map((p, index) => (
                        <li key={p.slug}>
                          <Link href={`/blog/${p.slug}`} className="group flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-stone-100 text-xs font-bold text-stone-600">
                              {index + 1}
                            </span>
                            <span className="line-clamp-2 text-sm text-stone-600 group-hover:text-[#d13a3a]">
                              {p.title}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Newsletter */}
                <div className="rounded-xl bg-stone-800 p-6 text-center">
                  <h3 className="text-lg font-bold text-white">訂閱電子報</h3>
                  <p className="mt-2 text-sm text-stone-300">
                    每週獲取自由工作者經營心法
                  </p>
                  <a
                    href="https://iamvista.substack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-amber-400 text-sm font-semibold text-stone-900 hover:bg-amber-300"
                  >
                    免費訂閱 →
                  </a>
                  <p className="mt-3 text-xs text-stone-400">已有 16,000+ 訂閱者</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

// Markdown to HTML - 修復圖片解析順序
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // 保存已存在的 HTML 標籤
  const htmlTags: string[] = [];
  html = html.replace(/<[^>]+>/g, (match) => {
    htmlTags.push(match);
    return `__HTML_TAG_${htmlTags.length - 1}__`;
  });

  // Process code blocks
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

  // Headers with IDs - 移除連結語法來生成乾淨的 ID
  const stripLinksForId = (text: string): string => {
    return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  };

  html = html.replace(/^### (.+)$/gim, (_, text) => {
    const cleanText = stripLinksForId(text.trim());
    const id = cleanText.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "");
    return `<h3 id="${id}">${text.trim()}</h3>`;
  });
  html = html.replace(/^## (.+)$/gim, (_, text) => {
    const cleanText = stripLinksForId(text.trim());
    const id = cleanText.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "");
    return `<h2 id="${id}">${text.trim()}</h2>`;
  });

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // ⚠️ 重要：圖片必須在連結之前處理！
  // Images - 處理 ![alt](url) 格式
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<figure class="my-8"><img src="$2" alt="$1" loading="lazy" class="w-full rounded-lg" /><figcaption class="mt-2 text-center text-sm text-stone-500">$1</figcaption></figure>'
  );

  // Links (markdown format) - 在圖片之後處理
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Blockquotes
  html = html.replace(/^>\s*(.+)$/gim, "<blockquote><p>$1</p></blockquote>");
  html = html.replace(/<\/blockquote>\n<blockquote>/g, "\n");

  // Horizontal rules
  html = html.replace(/^---$/gim, "<hr />");

  // Lists
  html = html.replace(/^[-*+]\s+(.+)$/gim, "<li>$1</li>");

  // Paragraphs
  const blocks = html.split(/\n\n+/);
  html = blocks
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (/^<[a-z]/.test(block) || /^__/.test(block)) return block;
      if (!block.replace(/\s/g, "")) return "";
      return `<p>${block.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n\n");

  // Clean up
  html = html.replace(/<p>\s*<\/p>/g, "");
  html = html.replace(/<p>(<h[1-6])/g, "$1");
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, "$1");
  html = html.replace(/<p>(<blockquote>)/g, "$1");
  html = html.replace(/(<\/blockquote>)<\/p>/g, "$1");
  html = html.replace(/<p>(<figure)/g, "$1");
  html = html.replace(/(<\/figure>)<\/p>/g, "$1");
  html = html.replace(/<p>(<pre)/g, "$1");
  html = html.replace(/(<\/pre>)<\/p>/g, "$1");
  html = html.replace(/<p>(<hr)/g, "$1");
  html = html.replace(/<p>(<li>)/g, "<ul>$1");
  html = html.replace(/(<\/li>)<\/p>/g, "$1</ul>");

  // Restore
  codeBlocks.forEach((block, i) => {
    html = html.replace(`__CODE_BLOCK_${i}__`, block);
  });
  inlineCodes.forEach((code, i) => {
    html = html.replace(`__INLINE_CODE_${i}__`, code);
  });
  htmlTags.forEach((tag, i) => {
    html = html.replace(`__HTML_TAG_${i}__`, tag);
  });

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
