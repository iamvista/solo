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
      title: "文章未找到 | solo.tw",
    };
  }

  return {
    title: `${post.title} | solo.tw`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.pubDate,
      modifiedTime: post.updatedDate,
      images: post.heroImage ? [post.heroImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // 簡單的 Markdown 轉 HTML（基礎版本）
  const htmlContent = simpleMarkdownToHtml(post.content);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* Back Link */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center text-base text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回部落格
      </Link>

      {/* Header */}
      <header className="mb-8">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                <Badge variant="secondary" className="text-sm hover:bg-secondary/80">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-base text-muted-foreground">
          <time dateTime={post.pubDate}>{formatDate(post.pubDate)}</time>
          {post.updatedDate && (
            <>
              <span>•</span>
              <span>更新於 {formatDate(post.updatedDate)}</span>
            </>
          )}
        </div>
      </header>

      {/* Hero Image */}
      {post.heroImage && (
        <div className="mb-10 overflow-hidden rounded-xl">
          <img
            src={post.heroImage}
            alt={post.title}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-ul:my-4 prose-ol:my-4 prose-li:my-1"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Author Box */}
      <div className="mt-12 rounded-xl border bg-muted/30 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            V
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Vista Cheng</h3>
            <p className="mt-1 text-base text-muted-foreground">
              自由人學院創辦人，專注於幫助自由工作者打造個人品牌、建立穩定事業。
            </p>
            <div className="mt-3 flex gap-3">
              <a
                href="https://iamvista.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                訂閱電子報 →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts CTA */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/blog"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          閱讀更多文章
        </Link>
      </div>
    </article>
  );
}

// Simple markdown to HTML converter (basic version)
function simpleMarkdownToHtml(markdown: string): string {
  let html = markdown;

  // Escape HTML entities first
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg" />');

  // Unordered lists
  html = html.replace(/^\s*[-*+]\s+(.+)$/gim, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");

  // Ordered lists
  html = html.replace(/^\s*\d+\.\s+(.+)$/gim, "<li>$1</li>");

  // Blockquotes
  html = html.replace(/^\s*&gt;\s*(.+)$/gim, "<blockquote><p>$1</p></blockquote>");

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Horizontal rules
  html = html.replace(/^---$/gim, "<hr />");

  // Paragraphs - wrap non-tagged lines
  html = html.split("\n\n").map((block) => {
    block = block.trim();
    if (!block) return "";
    // Skip if already wrapped in HTML tag
    if (/^<[a-z]/.test(block)) return block;
    return `<p>${block}</p>`;
  }).join("\n\n");

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, "");

  return html;
}
