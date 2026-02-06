import { Metadata } from "next";
import Link from "next/link";
import { getAllTags, getPostsByTag, formatDate } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ tag: string }>;
}

// Generate static paths
export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `${decodedTag} | 部落格 | solo.tw`,
    description: `瀏覽所有關於「${decodedTag}」的文章`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = await getPostsByTag(decodedTag);
  const allTags = await getAllTags();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* Header */}
      <div className="mb-12 text-center">
        <Link
          href="/blog"
          className="mb-4 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回部落格
        </Link>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          <span className="text-muted-foreground">#</span> {decodedTag}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          共 {posts.length} 篇文章
        </p>
      </div>

      {/* Tags Cloud */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/blog"
          className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80"
        >
          全部文章
        </Link>
        {allTags.slice(0, 10).map((t) => (
          <Link
            key={t}
            href={`/blog/tag/${encodeURIComponent(t)}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              t === decodedTag
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t}
          </Link>
        ))}
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
            >
              {/* Hero Image */}
              {post.heroImage && (
                <Link href={`/blog/${post.slug}`} className="aspect-video overflow-hidden">
                  <img
                    src={post.heroImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              )}

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h2 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary sm:text-xl">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                {/* Description */}
                <p className="mb-4 line-clamp-2 flex-1 text-base text-muted-foreground">
                  {post.description}
                </p>

                {/* Date */}
                <time className="text-sm text-muted-foreground" dateTime={post.pubDate}>
                  {formatDate(post.pubDate)}
                </time>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 py-20">
          <span className="text-6xl">🔍</span>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            沒有找到相關文章
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            目前沒有「{decodedTag}」標籤的文章
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            瀏覽全部文章
          </Link>
        </div>
      )}
    </div>
  );
}
