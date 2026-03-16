import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/supabase/admin";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function getNewsletterStats() {
  const supabase = getSupabase();

  const [
    { count: totalActive },
    { count: totalUnsubscribed },
    { data: recentSubs },
    { data: sourceBreakdown },
    { data: last7DaySubs },
  ] = await Promise.all([
    supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "unsubscribed"),
    supabase
      .from("newsletter_subscribers")
      .select("id, email, name, source, tags, subscribed_at, status")
      .eq("status", "active")
      .order("subscribed_at", { ascending: false })
      .limit(50),
    supabase
      .from("newsletter_subscribers")
      .select("source")
      .eq("status", "active"),
    supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("status", "active")
      .gte("subscribed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  // 計算來源分佈
  const sourceCounts: Record<string, number> = {};
  sourceBreakdown?.forEach((row) => {
    const s = row.source || "unknown";
    sourceCounts[s] = (sourceCounts[s] || 0) + 1;
  });

  return {
    totalActive: totalActive || 0,
    totalUnsubscribed: totalUnsubscribed || 0,
    newLast7Days: last7DaySubs?.length || 0,
    recentSubscribers: recentSubs || [],
    sourceCounts,
  };
}

export default async function NewsletterAdminPage() {
  const adminAccess = await isAdmin();
  if (!adminAccess) redirect("/");

  const stats = await getNewsletterStats();

  const topSources = Object.entries(stats.sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="outline" className="mb-2">📬 電子報管理</Badge>
          <h1 className="text-2xl font-bold sm:text-3xl">電子報訂閱者</h1>
          <p className="mt-1 text-base text-muted-foreground">
            管理電子報訂閱者名單與統計
          </p>
        </div>
        <Button variant="outline" asChild className="h-11 px-4 text-base">
          <Link href="/admin">← 回到後臺</Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="p-5 pb-2">
            <CardDescription className="text-sm">有效訂閱者</CardDescription>
            <CardTitle className="text-3xl text-green-700">{stats.totalActive}</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-sm text-muted-foreground">
              近 7 天新增 <span className="font-medium text-green-600">+{stats.newLast7Days}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-5 pb-2">
            <CardDescription className="text-sm">已取消訂閱</CardDescription>
            <CardTitle className="text-3xl">{stats.totalUnsubscribed}</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-sm text-muted-foreground">
              流失率 {stats.totalActive + stats.totalUnsubscribed > 0
                ? Math.round(stats.totalUnsubscribed / (stats.totalActive + stats.totalUnsubscribed) * 100)
                : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-5 pb-2">
            <CardDescription className="text-sm">近 7 天新增</CardDescription>
            <CardTitle className="text-3xl">{stats.newLast7Days}</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-sm text-muted-foreground">
              日均 {Math.round(stats.newLast7Days / 7 * 10) / 10} 人
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-5 pb-2">
            <CardDescription className="text-sm">主要來源</CardDescription>
            <CardTitle className="truncate text-lg">
              {topSources[0]?.[0] || "—"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-sm text-muted-foreground">
              {topSources[0] ? `${topSources[0][1]} 人` : "尚無資料"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Source breakdown */}
        <Card>
          <CardHeader className="p-5 sm:p-6">
            <CardTitle className="text-xl">📊 訂閱來源</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            <div className="space-y-2">
              {topSources.map(([source, count]) => (
                <div key={source} className="flex items-center justify-between rounded-lg bg-muted/50 p-2 px-3">
                  <span className="font-medium">{source}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
              {topSources.length === 0 && (
                <p className="text-sm text-muted-foreground">尚無訂閱者</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent subscribers */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-5 sm:p-6">
            <CardTitle className="text-xl">🆕 最近訂閱</CardTitle>
            <CardDescription>最近 50 位訂閱者</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            {stats.recentSubscribers.length > 0 ? (
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b text-left">
                      <th className="pb-2 font-medium text-muted-foreground">Email</th>
                      <th className="pb-2 font-medium text-muted-foreground">來源</th>
                      <th className="pb-2 font-medium text-muted-foreground">標籤</th>
                      <th className="pb-2 text-right font-medium text-muted-foreground">日期</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentSubscribers.map((sub) => (
                      <tr key={sub.id} className="border-b border-muted/50">
                        <td className="max-w-[200px] truncate py-2.5 pr-3 font-medium">
                          {sub.email}
                        </td>
                        <td className="py-2.5 pr-3">
                          <Badge variant="outline" className="text-xs">{sub.source}</Badge>
                        </td>
                        <td className="py-2.5 pr-3">
                          {sub.tags?.length > 0 ? (
                            <div className="flex gap-1">
                              {sub.tags.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap py-2.5 text-right text-muted-foreground">
                          {new Date(sub.subscribed_at).toLocaleDateString("zh-TW")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">尚無訂閱者</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
