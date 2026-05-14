import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isAdmin, getUserStats, getDiagnosisStats, getTrafficAnalysis } from "@/lib/supabase/admin";
import { getEventStats } from "@/lib/supabase/events";
import { createServiceClient } from "@/lib/supabase/service";

type RecentPayment = {
  kind: "course" | "consulting";
  customerName: string;
  email: string;
  amount: number | null;
  productName: string;
  paidAt: string;
  detailHref: string;
};

async function getRecentPayments(days: number): Promise<RecentPayment[]> {
  const sb = createServiceClient();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const [courseRes, consultingRes] = await Promise.all([
    sb
      .from("course_enrollments")
      .select("id, name, email, amount, course_id, paid_at")
      .eq("status", "paid")
      .gte("paid_at", since)
      .order("paid_at", { ascending: false }),
    sb
      .from("consulting_enrollments")
      .select("id, name, email, plan, total_hours, purchased_at")
      .gte("purchased_at", since)
      .order("purchased_at", { ascending: false }),
  ]);

  const courses: RecentPayment[] = (courseRes.data ?? []).map((c) => ({
    kind: "course",
    customerName: c.name ?? "—",
    email: c.email,
    amount: c.amount ?? null,
    productName: c.course_id ?? "課程",
    paidAt: c.paid_at as string,
    detailHref: `/admin/enrollments`,
  }));

  const consultings: RecentPayment[] = (consultingRes.data ?? []).map((e) => ({
    kind: "consulting",
    customerName: e.name ?? "—",
    email: e.email,
    amount: null,
    productName: `${e.plan}（${e.total_hours} 小時）`,
    paidAt: e.purchased_at as string,
    detailHref: `/admin/consulting/enrollments/${e.id}`,
  }));

  return [...courses, ...consultings].sort((a, b) =>
    b.paidAt.localeCompare(a.paidAt),
  );
}

// Solo 類型資料
const soloTypes: Record<string, { emoji: string; name: string }> = {
  lion: { emoji: "🦁", name: "獅子型" },
  fox: { emoji: "🦊", name: "狐狸型" },
  elephant: { emoji: "🐘", name: "大象型" },
  eagle: { emoji: "🦅", name: "老鷹型" },
  turtle: { emoji: "🐢", name: "烏龜型" },
  chick: { emoji: "🐣", name: "小雞型" },
};

export default async function AdminPage() {
  // 驗證管理員權限
  const adminAccess = await isAdmin();

  if (!adminAccess) {
    redirect("/");
  }

  // 獲取所有統計數據
  const [userStats, diagnosisStats, trafficAnalysis, eventStats, recentPayments] = await Promise.all([
    getUserStats(),
    getDiagnosisStats(),
    getTrafficAnalysis(),
    getEventStats(),
    getRecentPayments(7),
  ]);

  const recentRevenue = recentPayments.reduce((sum, p) => sum + (p.amount ?? 0), 0);

  // 計算訂閱率
  const subscriptionRate = userStats.totalUsers > 0
    ? Math.round((userStats.subscribedUsers / userStats.totalUsers) * 100)
    : 0;

  // 排序流量來源
  const topSources = Object.entries(trafficAnalysis.bySource)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topCampaigns = Object.entries(trafficAnalysis.byCampaign)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="outline" className="mb-2">🔐 管理員專區</Badge>
          <h1 className="text-2xl font-bold sm:text-3xl">後臺管理</h1>
          <p className="mt-1 text-base text-muted-foreground sm:text-lg">
            查看用戶數據、診斷紀錄與流量分析
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="h-11 px-4 text-base">
            <Link href="/admin/events">活動管理</Link>
          </Button>
          <Button variant="outline" asChild className="h-11 px-4 text-base">
            <Link href="/admin/users">用戶管理</Link>
          </Button>
          <Button variant="outline" asChild className="h-11 px-4 text-base">
            <Link href="/admin/diagnoses">診斷紀錄</Link>
          </Button>
          <Button variant="outline" asChild className="h-11 px-4 text-base">
            <Link href="/admin/newsletter">📬 電子報</Link>
          </Button>
          <Button variant="outline" asChild className="h-11 px-4 text-base">
            <Link href="/admin/enrollments">🎓 課程報名</Link>
          </Button>
          <Button variant="outline" asChild className="h-11 px-4 text-base">
            <Link href="/admin/consulting/leads">📋 諮詢需求</Link>
          </Button>
          <Button variant="outline" asChild className="h-11 px-4 text-base">
            <Link href="/admin/consulting/enrollments">🎯 諮詢學員</Link>
          </Button>
        </div>
      </div>

      {/* 最近 7 天收款（課程 + 諮詢整合） */}
      <div className="mb-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">💰 最近 7 天收款</h2>
          <p className="text-sm text-muted-foreground">
            共 {recentPayments.length} 筆
            {recentRevenue > 0 && (
              <>
                ｜課程收入小計：
                <span className="font-medium text-emerald-700">
                  NT${recentRevenue.toLocaleString()}
                </span>
                <span className="ml-1 text-xs text-muted-foreground">
                  （諮詢金額以 Recur 後台為準）
                </span>
              </>
            )}
          </p>
        </div>
        {recentPayments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              近 7 天尚無付款紀錄。
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="p-3">類別</th>
                  <th className="p-3">學員</th>
                  <th className="p-3">商品／方案</th>
                  <th className="p-3">金額</th>
                  <th className="p-3">付款時間</th>
                  <th className="p-3 text-right">後台</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p, i) => (
                  <tr key={`${p.kind}-${i}`} className="border-t">
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={
                          p.kind === "consulting"
                            ? "border-purple-300 bg-purple-50 text-purple-800"
                            : "border-blue-300 bg-blue-50 text-blue-800"
                        }
                      >
                        {p.kind === "consulting" ? "🎯 諮詢" : "🎓 課程"}
                      </Badge>
                    </td>
                    <td className="p-3 font-medium">
                      {p.customerName}
                      <br />
                      <span className="text-xs text-muted-foreground">{p.email}</span>
                    </td>
                    <td className="p-3">{p.productName}</td>
                    <td className="p-3 font-medium">
                      {p.amount ? `NT$${p.amount.toLocaleString()}` : "—"}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {new Date(p.paidAt).toLocaleString("zh-TW", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={p.detailHref}>查看 →</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 用戶統計 */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">👥 用戶統計</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">總用戶數</CardDescription>
              <CardTitle className="text-3xl">{userStats.totalUsers}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">
                近 7 天新增 <span className="font-medium text-green-600">+{userStats.newUsersLast7Days}</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">電子報訂閱者</CardDescription>
              <CardTitle className="text-3xl text-green-700">{userStats.subscribedUsers}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">
                訂閱率 <span className="font-medium text-green-600">{subscriptionRate}%</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">未訂閱電子報</CardDescription>
              <CardTitle className="text-3xl text-orange-700">{userStats.unsubscribedUsers}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">
                佔比 {100 - subscriptionRate}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">近 7 天新用戶</CardDescription>
              <CardTitle className="text-3xl">{userStats.newUsersLast7Days}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">
                日均 {Math.round(userStats.newUsersLast7Days / 7 * 10) / 10} 人
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 活動統計 */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">📅 活動統計</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">進行中活動</CardDescription>
              <CardTitle className="text-3xl">{eventStats.activeEvents}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">
                已發布的活動數
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">確認報名數</CardDescription>
              <CardTitle className="text-3xl text-blue-700">{eventStats.totalRegistrations}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">
                所有活動累計
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">本月活動</CardDescription>
              <CardTitle className="text-3xl">{eventStats.monthlyEvents}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">
                本月舉辦的活動
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">最新活動</CardDescription>
              <CardTitle className="truncate text-lg">
                {eventStats.topEvent?.title || "—"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">
                {eventStats.topEvent ? `${eventStats.topEvent.count} 人報名` : "尚無活動"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 診斷統計 */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">📊 診斷統計</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">總診斷次數</CardDescription>
              <CardTitle className="text-3xl">{diagnosisStats.totalDiagnoses}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">
                近 7 天 <span className="font-medium text-green-600">+{diagnosisStats.diagnosesLast7Days}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">快速診斷</CardDescription>
              <CardTitle className="text-3xl">{diagnosisStats.quickDiagnoses}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">
                佔比 {diagnosisStats.totalDiagnoses > 0 ? Math.round(diagnosisStats.quickDiagnoses / diagnosisStats.totalDiagnoses * 100) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">深度診斷</CardDescription>
              <CardTitle className="text-3xl">{diagnosisStats.fullDiagnoses}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">
                佔比 {diagnosisStats.totalDiagnoses > 0 ? Math.round(diagnosisStats.fullDiagnoses / diagnosisStats.totalDiagnoses * 100) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">平均分數</CardDescription>
              <CardTitle className="text-3xl">{diagnosisStats.averageScore}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">
                滿分 100 分
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Solo 類型分佈 */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="p-5 sm:p-6">
            <CardTitle className="text-xl">🎯 Solo 類型分佈</CardTitle>
            <CardDescription className="text-base">
              各類型用戶佔比
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            <div className="space-y-4">
              {Object.entries(diagnosisStats.soloTypeDistribution)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => {
                  const percentage = diagnosisStats.totalDiagnoses > 0
                    ? Math.round(count / diagnosisStats.totalDiagnoses * 100)
                    : 0;
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <span className="text-2xl">{soloTypes[type]?.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{soloTypes[type]?.name}</span>
                          <span className="text-sm text-muted-foreground">{count} 人 ({percentage}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* 流量來源 */}
        <Card>
          <CardHeader className="p-5 sm:p-6">
            <CardTitle className="text-xl">📈 流量來源</CardTitle>
            <CardDescription className="text-base">
              診斷流量的 UTM 來源分析
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            <div className="space-y-6">
              {/* 來源 */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-muted-foreground">UTM Source</h4>
                <div className="space-y-2">
                  {topSources.map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between rounded-lg bg-muted/50 p-2 px-3">
                      <span className="font-medium">{source}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                  {topSources.length === 0 && (
                    <p className="text-sm text-muted-foreground">尚無 UTM 數據</p>
                  )}
                </div>
              </div>

              {/* 活動 */}
              {topCampaigns.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-medium text-muted-foreground">UTM Campaign</h4>
                  <div className="space-y-2">
                    {topCampaigns.map(([campaign, count]) => (
                      <div key={campaign} className="flex items-center justify-between rounded-lg bg-muted/50 p-2 px-3">
                        <span className="font-medium truncate max-w-[200px]">{campaign}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 快速操作 */}
      <Card className="bg-muted">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row sm:p-8">
          <div>
            <h3 className="text-lg font-semibold">📋 查看詳細數據</h3>
            <p className="mt-1 text-base text-muted-foreground">
              查看完整的用戶名單和診斷紀錄
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="h-11 px-6 text-base">
              <Link href="/admin/users">用戶名單</Link>
            </Button>
            <Button variant="outline" asChild className="h-11 px-6 text-base">
              <Link href="/admin/diagnoses">診斷紀錄</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
