import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getPublishedEvents } from "@/lib/supabase/events";
import { createServiceClient } from "@/lib/supabase/service";
import { workshops } from "@/lib/workshops";

const baseUrl = "https://www.solo.tw";

const GUIDE_SLUGS = [
  "choose-method",
  "desktop-setup",
  "install-claude-code",
  "install-coach",
  "first-session",
  "daily-loop",
  "build-your-own",
  "notebooklm",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── 靜態頁面 ─────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/courses`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/consulting`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/growth`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/tools`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/diagnose`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/events`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/community`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/learn`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/methodology`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/editorial-policy`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/roadmap`, changeFrequency: "monthly", priority: 0.5 },
  ];

  // ── 課程詳情頁 ───────────────────────────────────────
  // innovation-workshop、senior-asset-safety 已下架（2026-07-12，A-010），移出 sitemap
  const coursePages: MetadataRoute.Sitemap = [
    ...workshops
      .filter((w) => !w.hidden && !w.isExternal)
      .map((w) => ({
        url: `${baseUrl}${w.url}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  ];

  // ── 部落格文章 ───────────────────────────────────────
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPosts();
    blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedDate
        ? new Date(post.updatedDate)
        : new Date(post.pubDate),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // 部落格不可用——略過
  }

  // 標籤頁保留公開存取，但不列入 sitemap。
  // ── 活動詳情頁（動態）────────────────────────────────
  let eventPages: MetadataRoute.Sitemap = [];
  try {
    const events = await getPublishedEvents();
    eventPages = events.map((ev) => ({
      url: `${baseUrl}/events/${ev.slug}`,
      ...(ev.updated_at ? { lastModified: new Date(ev.updated_at) } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Supabase 不可用——略過
  }

  // ── Lead Magnet 頁面（動態）──────────────────────────
  let magnetPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("lead_magnets")
      .select("slug, updated_at")
      .eq("status", "published");
    if (data) {
      magnetPages = data.map((m: { slug: string; updated_at: string | null }) => ({
        url: `${baseUrl}/m/${m.slug}`,
        ...(m.updated_at ? { lastModified: new Date(m.updated_at) } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // 略過
  }

  // ── AI Coach Kit 指南頁 ──────────────────────────────
  const guidePages: MetadataRoute.Sitemap = GUIDE_SLUGS.map((slug) => ({
    url: `${baseUrl}/products/ai-coach-kit/guide/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...coursePages,
    ...blogPages,
    ...eventPages,
    ...magnetPages,
    ...guidePages,
  ];
}
