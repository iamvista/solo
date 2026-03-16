import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  draft: { label: "草稿", class: "bg-stone-100 text-stone-600" },
  published: { label: "已發布", class: "bg-green-100 text-green-700" },
  cancelled: { label: "已取消", class: "bg-red-100 text-red-600" },
  archived: { label: "已結束", class: "bg-stone-200 text-stone-500" },
};

export default async function MyEventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Check membership
  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_tier, username")
    .eq("id", user.id)
    .single();

  const tier = profile?.membership_tier || "free";

  // Get user's events
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  // Get reg counts
  const eventIds = (events || []).map((e) => e.id);
  let countMap: Record<string, { confirmed: number; waitlisted: number }> = {};

  if (eventIds.length > 0) {
    const serviceClient = createServiceClient();
    const { data: regs } = await serviceClient
      .from("registrations")
      .select("event_id, status")
      .in("event_id", eventIds)
      .neq("status", "cancelled");

    regs?.forEach((r) => {
      if (!countMap[r.event_id]) countMap[r.event_id] = { confirmed: 0, waitlisted: 0 };
      if (r.status === "confirmed") countMap[r.event_id].confirmed++;
      if (r.status === "waitlisted") countMap[r.event_id].waitlisted++;
    });
  }

  // Usage info
  const { data: usage } = await supabase
    .from("usage_limits")
    .select("events_created_this_month, month_year")
    .eq("user_id", user.id)
    .single();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const usedThisMonth = usage?.month_year === currentMonth ? usage.events_created_this_month : 0;
  const limit = tier === "premium" ? "無限" : tier === "pro" ? "3" : "0";

  return (
    <div className="min-h-[80vh] bg-stone-50/50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">我的活動</h1>
            <p className="mt-1 text-sm text-stone-500">
              {tier === "free"
                ? "升級至 Pro 方案即可建立活動"
                : `本月已建立 ${usedThisMonth} / ${limit} 場`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">← 返回 Dashboard</Link>
            </Button>
            {tier !== "free" ? (
              <Button size="sm" asChild>
                <Link href="/dashboard/my-events/new">建立活動</Link>
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link href="/pricing">升級方案</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Upgrade CTA for free tier */}
        {tier === "free" && (
          <Card className="mb-8 border-amber-200 bg-amber-50">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
              <div className="text-4xl">🔒</div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-stone-900">升級以建立你的活動</h2>
                <p className="mt-1 text-sm text-stone-600">
                  Pro 方案每月可建立 3 場活動，Premium 方案無限制。包含報名管理、CSV 匯出等功能。
                </p>
              </div>
              <Button asChild>
                <Link href="/pricing">查看方案</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Events List */}
        {events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => {
              const status = STATUS_LABELS[event.status] || STATUS_LABELS.draft;
              const confirmed = countMap[event.id]?.confirmed || 0;
              const waitlisted = countMap[event.id]?.waitlisted || 0;

              return (
                <Card key={event.id} className="border-0 shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.class}`}>
                            {status.label}
                          </span>
                          <span className="text-xs text-stone-400">
                            {new Date(event.starts_at).toLocaleDateString("zh-TW")}
                          </span>
                        </div>
                        <h3 className="mt-2 text-base font-semibold text-stone-900 line-clamp-1">
                          {event.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-4 text-sm text-stone-500">
                          <span>{confirmed} 已報名</span>
                          {waitlisted > 0 && <span>{waitlisted} 候補</span>}
                          <span>容量 {event.capacity}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/my-events/${event.id}/registrations`}>
                            報名者
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/my-events/${event.id}/email`}>
                            確認信
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/my-events/${event.id}/edit`}>
                            編輯
                          </Link>
                        </Button>
                        {event.status === "published" && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/events/${event.slug}`} target="_blank">
                              查看 ↗
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : tier !== "free" ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="text-5xl">🎪</div>
              <h2 className="mt-4 text-lg font-semibold text-stone-900">還沒有建立任何活動</h2>
              <p className="mt-2 text-sm text-stone-500">
                建立你的第一場活動，開始收集報名者吧！
              </p>
              <Button className="mt-6" asChild>
                <Link href="/dashboard/my-events/new">建立第一場活動</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
