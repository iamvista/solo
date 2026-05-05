import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { getPublishedEvents } from "@/lib/supabase/events";
import { createServiceClient } from "@/lib/supabase/service";

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
  const now = new Date();

  // ── 靜態頁面 ─────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/consulting`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/growth`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/diagnose`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/events`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/products/writing-os`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/products/ai-coach-kit`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/community`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/learn`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/roadmap`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // ── 課程詳情頁 ───────────────────────────────────────
  const coursePages: MetadataRoute.Sitemap = [
    "ai-command-center",
    "ai-proposal-spotlight",
    "ai-social-content",
    "innovation-workshop",
    "senior-asset-safety",
    "vibe-coding",
    "ai-content",
  ].map((slug) => ({
    url: `${baseUrl}/courses/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

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

  // ── 部落格 Tag 頁 ────────────────────────────────────
  let tagPages: MetadataRoute.Sitemap = [];
  try {
    const tags = await getAllTags();
    tagPages = tags.map((tag) => ({
      url: `${baseUrl}/blog/tag/${encodeURIComponent(tag)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    }));
  } catch {
    // 略過
  }

  // ── 活動詳情頁（動態）────────────────────────────────
  let eventPages: MetadataRoute.Sitemap = [];
  try {
    const events = await getPublishedEvents();
    eventPages = events.map((ev) => ({
      url: `${baseUrl}/events/${ev.slug}`,
      lastModified: ev.updated_at ? new Date(ev.updated_at) : now,
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
        lastModified: m.updated_at ? new Date(m.updated_at) : now,
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
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...coursePages,
    ...blogPages,
    ...tagPages,
    ...eventPages,
    ...magnetPages,
    ...guidePages,
  ];
}
