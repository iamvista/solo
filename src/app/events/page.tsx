import { Metadata } from "next";
import { getPublishedEvents } from "@/lib/supabase/events";
import EventCard from "@/components/events/EventCard";
import EventFilters from "@/components/events/EventFilters";

// ISR: revalidate every 5 minutes
export const revalidate = 300;

export const metadata: Metadata = {
  title: "活動 | 自由人學院",
  description: "探索最新的工作坊、講座和聚會活動。免費報名，學習新技能。",
  openGraph: {
    title: "活動 | 自由人學院",
    description: "探索最新的工作坊、講座和聚會活動",
    url: "https://www.solo.tw/events",
  },
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const events = await getPublishedEvents();
  const params = await searchParams;
  const format = params.format || "";
  const category = params.category || "";
  const search = params.q || "";

  // Filter events
  let filtered = events;
  if (format) filtered = filtered.filter((e) => e.format === format);
  if (category) filtered = filtered.filter((e) => e.category === category);
  if (search) filtered = filtered.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  // Sort: featured first, then upcoming first, ended at bottom
  const now = new Date();
  filtered.sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    const aEnded = new Date(a.starts_at) < now && a.status === "archived";
    const bEnded = new Date(b.starts_at) < now && b.status === "archived";
    if (aEnded !== bEnded) return aEnded ? 1 : -1;
    return new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime();
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">活動</h1>
        <p className="mt-2 text-lg text-muted-foreground">探索最新的工作坊、講座和聚會活動</p>
      </div>

      <EventFilters currentFormat={format} currentCategory={category} currentSearch={search} />

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <p className="text-lg">目前沒有符合條件的活動</p>
          <p className="mt-2 text-sm">試試其他篩選條件，或稍後再來看看</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
