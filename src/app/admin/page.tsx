import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  isAdmin,
  getUserStats,
  getDiagnosisStats,
} from "@/lib/supabase/admin";
import { getEventStats } from "@/lib/supabase/events";
import { getRegistrationInsights } from "@/lib/admin-insights";
import { getAcquisitionInsights } from "@/lib/admin-insights";
import { getGA4Traffic } from "@/lib/ga4";
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

  // 一次撈完所有資料
  const [userStats, diagnosisStats, eventStats, recentPayments, reg, acq, ga4] =
    await Promise.all([
      getUserStats(),
      getDiagnosisStats(),
      getEventStats(),
      getRecentPayments(7),
      getRegistrationInsights(),
      getAcquisitionInsights(),
      getGA4Traffic(28),
    ]);

  const recentRevenue = recentPayments.reduce(
    (sum, p) => sum + (p.amount ?? 0),
    0,
  );

  // 近 8 週收入趨勢最大值（防止除以零）
  const maxTrendRevenue = Math.max(...reg.revenueTrend.map((w) => w.revenue), 1);

  // 報名來源最大值
  const maxAttribution = reg.attribution[0]?.[1] ?? 1;

  // 獲客漏斗換算率
  const acqDiagnoses = acq.funnel.diagnoses;
  const acqEnrollments = acq.funnel.enrollments;
  const acqPaid = acq.funnel.paid;
  const rateEnroll =
    acqDiagnoses > 0 ? ((acqEnrollments / acqDiagnoses) * 100).toFixed(1) : "0";
  const ratePaid =
    acqEnrollments > 0 ? ((acqPaid / acqEnrollments) * 100).toFixed(1) : "0";

  // UTM 來源最大值
  const maxUtm = acq.utmSources[0]?.[1] ?? 1;
  const maxNl = acq.newsletterBySource[0]?.[1] ?? 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* ── 1. 頁頭 ── */}
      <div className="mb-8">
        <Badge variant="outline" className="mb-2">
          🔐 管理員專區
        </Badge>
        <h1 className="text-2xl font-bold sm:text-3xl">後臺管理</h1>
        <p className="mt-1 text-base text-muted-foreground sm:text-lg">
          營收、名單、流量一覽
        </p>
      </div>

      {/* ── 2. KPI 條 ── */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* 本月營收 */}
        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader className="p-5 pb-2">
            <CardDescription className="text-sm">本月營收</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-700">
              NT${reg.monthRevenue.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-xs text-muted-foreground">課程已付款</p>
          </CardContent>
        </Card>

        {/* 近 30 天報名 */}
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardDescription className="text-sm">近 30 天報名</CardDescription>
            <CardTitle className="text-2xl font-bold">{reg.enroll30d}</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-xs text-muted-foreground">
              已付 {reg.paidCount} 筆
            </p>
          </CardContent>
        </Card>

        {/* 待付款 */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="p-5 pb-2">
            <CardDescription className="text-sm text-amber-700">
              ⚠️ 待付款
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-700">
              {reg.pendingCount} 筆
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-xs text-amber-600">
              可追回 NT${reg.pendingAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* 候補需求 */}
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardDescription className="text-sm">候補需求</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {reg.waitlistCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-xs text-muted-foreground">等待開課</p>
          </CardContent>
        </Card>

        {/* 電子報訂閱者 */}
        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader className="p-5 pb-2">
            <CardDescription className="text-sm">電子報訂閱者</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-700">
              {userStats.subscribedUsers}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-xs text-emerald-600">
              近 7 天 +{userStats.newUsersLast7Days}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── 3. 管理模組 ── */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">🗂 管理模組</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-semibold">
                營收與報名
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-5 pt-0">
              <Link
                href="/admin/enrollments"
                className="block text-sm hover:underline"
              >
                🎓 課程報名
              </Link>
              <Link
                href="/admin/waitlist"
                className="block text-sm hover:underline"
              >
                ⏳ 候補名單
              </Link>
              <Link
                href="/admin/consulting/enrollments"
                className="block text-sm hover:underline"
              >
                🎯 諮詢學員
              </Link>
              <Link
                href="/admin/consulting/leads"
                className="block text-sm hover:underline"
              >
                📋 諮詢需求
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-semibold">
                名單與訂閱
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-5 pt-0">
              <Link
                href="/admin/newsletter"
                className="block text-sm hover:underline"
              >
                📬 電子報
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-semibold">
                內容與活動
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-5 pt-0">
              <Link
                href="/admin/events"
                className="block text-sm hover:underline"
              >
                📅 活動管理
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-semibold">
                用戶與診斷
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-5 pt-0">
              <Link
                href="/admin/users"
                className="block text-sm hover:underline"
              >
                👤 用戶管理
              </Link>
              <Link
                href="/admin/diagnoses"
                className="block text-sm hover:underline"
              >
                📊 診斷紀錄
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── 4. 報名洞察 ── */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">📈 報名洞察</h2>

        {/* 4a. 每堂課漏斗表 */}
        <div className="mb-6 overflow-x-auto rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="p-3">課程</th>
                <th className="p-3 text-right">候補</th>
                <th className="p-3 text-right">待付款</th>
                <th className="p-3 text-right">已付</th>
                <th className="p-3 text-right">收入</th>
              </tr>
            </thead>
            <tbody>
              {reg.courseFunnel.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-4 text-center text-muted-foreground"
                  >
                    尚無資料
                  </td>
                </tr>
              ) : (
                reg.courseFunnel.map((row) => (
                  <tr key={row.courseId} className="border-t">
                    <td className="p-3">
                      <span className="font-medium">{row.title}</span>
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {row.courseId}
                      </span>
                    </td>
                    <td className="p-3 text-right">{row.waitlist}</td>
                    <td className="p-3 text-right text-amber-700">
                      {row.pending}
                    </td>
                    <td className="p-3 text-right text-emerald-700 font-medium">
                      {row.paid}
                    </td>
                    <td className="p-3 text-right font-medium">
                      NT${row.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4b. 待付款追回 */}
        {reg.pendingCount > 0 && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-semibold text-amber-800">
                ⚠️ 待付款追回（{reg.pendingCount} 筆）
              </CardTitle>
              <CardDescription className="text-amber-700">
                這些是已填表但未完成付款的人，可主動聯繫追回
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="mb-4 overflow-x-auto rounded-lg border border-amber-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-amber-50 text-left text-xs uppercase tracking-wide text-amber-700">
                    <tr>
                      <th className="p-3">姓名</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">手機</th>
                      <th className="p-3">課程</th>
                      <th className="p-3 text-right">金額</th>
                      <th className="p-3">建立時間</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reg.pending.map((p) => (
                      <tr key={p.id} className="border-t border-amber-100">
                        <td className="p-3 font-medium">{p.name}</td>
                        <td className="p-3 text-xs">{p.email}</td>
                        <td className="p-3 text-xs">{p.phone ?? "—"}</td>
                        <td className="p-3 text-xs">{p.courseId}</td>
                        <td className="p-3 text-right text-xs">
                          {p.amount ? `NT$${p.amount.toLocaleString()}` : "—"}
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">
                          {new Date(p.createdAt).toLocaleDateString("zh-TW")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/enrollments">查看全部報名 →</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 4c. 報名來源 */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-semibold">
                報名來源分佈
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="space-y-3">
                {reg.attribution.length === 0 ? (
                  <p className="text-sm text-muted-foreground">尚無資料</p>
                ) : (
                  reg.attribution.slice(0, 8).map(([label, count]) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 text-sm">{label}</span>
                      <div className="flex-1 rounded-full bg-muted h-2">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{
                            width: `${(count / maxAttribution) * 100}%`,
                          }}
                        />
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {count}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* 4d. 近 8 週收入趨勢 */}
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-semibold">
                近 8 週收入趨勢
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="flex h-28 items-end gap-1">
                {reg.revenueTrend.map((w) => (
                  <div
                    key={w.label}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-t bg-emerald-400"
                      style={{
                        height: `${Math.max(
                          4,
                          (w.revenue / maxTrendRevenue) * 96,
                        )}px`,
                      }}
                      title={`NT$${w.revenue.toLocaleString()}`}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {w.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── 5. 獲客與流量 ── */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">🌐 獲客與流量</h2>

        {/* 5a. 獲客漏斗 */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">診斷人數</CardDescription>
              <CardTitle className="text-3xl">{acqDiagnoses}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground">漏斗頂端</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">報名人數</CardDescription>
              <CardTitle className="text-3xl">{acqEnrollments}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground">
                轉換率 {rateEnroll}%（診斷→報名）
              </p>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">付費人數</CardDescription>
              <CardTitle className="text-3xl text-emerald-700">
                {acqPaid}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-emerald-600">
                轉換率 {ratePaid}%（報名→付費）
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 5b. UTM 來源 + 名單來源 */}
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-semibold">
                UTM 診斷來源
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="space-y-2">
                {acq.utmSources.length === 0 ? (
                  <p className="text-sm text-muted-foreground">尚無 UTM 數據</p>
                ) : (
                  acq.utmSources.map(([source, count]) => (
                    <div key={source} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 text-sm">{source}</span>
                      <div className="flex-1 rounded-full bg-muted h-2">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${(count / maxUtm) * 100}%` }}
                        />
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {count}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-semibold">
                名單成長來源
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="space-y-2">
                {acq.newsletterBySource.length === 0 ? (
                  <p className="text-sm text-muted-foreground">尚無訂閱資料</p>
                ) : (
                  acq.newsletterBySource.map(([src, count]) => (
                    <div key={src} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 text-sm">{src}</span>
                      <div className="flex-1 rounded-full bg-muted h-2">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${(count / maxNl) * 100}%` }}
                        />
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {count}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 5c. GA4 流量 */}
        {!ga4.configured ? (
          <Card className="border-dashed">
            <CardContent className="p-6 text-sm text-muted-foreground">
              <p className="mb-2 font-medium">尚未接上 GA4</p>
              <p>
                在 Vercel 環境變數設定{" "}
                <code className="rounded bg-muted px-1">GA4_PROPERTY_ID</code>、
                <code className="rounded bg-muted px-1">GA4_CLIENT_EMAIL</code>、
                <code className="rounded bg-muted px-1">GA4_PRIVATE_KEY</code>{" "}
                後，這裡會自動顯示真實訪客數、熱門頁與來源。
              </p>
            </CardContent>
          </Card>
        ) : ga4.error ? (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-5 text-sm text-amber-700">
              GA4 連線異常：{ga4.error}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-base font-semibold">
                  GA4 真實流量（近 {ga4.rangeDays} 天）
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="mb-4 flex gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground">訪客</p>
                    <p className="text-2xl font-bold">
                      {ga4.activeUsers.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">工作階段</p>
                    <p className="text-2xl font-bold">
                      {ga4.sessions.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">瀏覽量</p>
                    <p className="text-2xl font-bold">
                      {ga4.pageViews.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  {ga4.channels.map((ch) => (
                    <div
                      key={ch.channel}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{ch.channel}</span>
                      <Badge variant="secondary">{ch.sessions}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-base font-semibold">
                  熱門頁面
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="space-y-2">
                  {ga4.topPages.map((pg) => (
                    <div
                      key={pg.path}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate max-w-[220px] font-mono text-xs">
                        {pg.path}
                      </span>
                      <Badge variant="secondary">{pg.views}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* ── 6. 最近 7 天收款 ── */}
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
                  （諮詢金額以 Recur 後臺為準）
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
                  <th className="p-3 text-right">後臺</th>
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
                      <span className="text-xs text-muted-foreground">
                        {p.email}
                      </span>
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

      {/* ── 7. 診斷統計 + Solo 類型分佈 ── */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold">📊 診斷統計</h2>
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">總診斷次數</CardDescription>
              <CardTitle className="text-3xl">
                {diagnosisStats.totalDiagnoses}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">
                近 7 天{" "}
                <span className="font-medium text-green-600">
                  +{diagnosisStats.diagnosesLast7Days}
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">快速診斷</CardDescription>
              <CardTitle className="text-3xl">
                {diagnosisStats.quickDiagnoses}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">
                佔比{" "}
                {diagnosisStats.totalDiagnoses > 0
                  ? Math.round(
                      (diagnosisStats.quickDiagnoses /
                        diagnosisStats.totalDiagnoses) *
                        100,
                    )
                  : 0}
                %
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">深度診斷</CardDescription>
              <CardTitle className="text-3xl">
                {diagnosisStats.fullDiagnoses}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">
                佔比{" "}
                {diagnosisStats.totalDiagnoses > 0
                  ? Math.round(
                      (diagnosisStats.fullDiagnoses /
                        diagnosisStats.totalDiagnoses) *
                        100,
                    )
                  : 0}
                %
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-5 pb-2">
              <CardDescription className="text-sm">平均分數</CardDescription>
              <CardTitle className="text-3xl">
                {diagnosisStats.averageScore}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-sm text-muted-foreground">滿分 100 分</p>
            </CardContent>
          </Card>
        </div>

        {/* Solo 類型分佈 */}
        <div className="grid gap-6 lg:grid-cols-2">
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
                    const percentage =
                      diagnosisStats.totalDiagnoses > 0
                        ? Math.round(
                            (count / diagnosisStats.totalDiagnoses) * 100,
                          )
                        : 0;
                    return (
                      <div key={type} className="flex items-center gap-3">
                        <span className="text-2xl">{soloTypes[type]?.emoji}</span>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-medium">
                              {soloTypes[type]?.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {count} 人 ({percentage}%)
                            </span>
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

          {/* 活動小結 */}
          <Card>
            <CardHeader className="p-5 sm:p-6">
              <CardTitle className="text-xl">📅 活動小結</CardTitle>
              <CardDescription className="text-base">
                活動系統概況
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">進行中活動</span>
                  <span className="font-semibold">{eventStats.activeEvents}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">確認報名數</span>
                  <span className="font-semibold">
                    {eventStats.totalRegistrations}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">本月活動</span>
                  <span className="font-semibold">{eventStats.monthlyEvents}</span>
                </div>
                {eventStats.topEvent && (
                  <div className="rounded-lg border p-3 text-sm">
                    <p className="font-medium">{eventStats.topEvent.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {eventStats.topEvent.count} 人報名
                    </p>
                  </div>
                )}
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/events">管理活動 →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
