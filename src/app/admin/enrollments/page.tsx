import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "課程報名名單 | 後台",
  robots: { index: false, follow: false },
};

interface Enrollment {
  id: string;
  course_id: string;
  email: string;
  name: string;
  phone: string;
  phone_country: string | null;
  organization: string | null;
  job_title: string | null;
  attribution: string | null;
  question: string | null;
  current_proposal_pain: string | null;
  line_id: string | null;
  facebook: string | null;
  dietary: string | null;
  invoice_company: string | null;
  invoice_tax_id: string | null;
  marketing_consent: boolean;
  status: "pending" | "paid" | "failed" | "cancelled" | "refunded" | string;
  recur_order_id: string | null;
  recur_product_id: string | null;
  amount: number | null;
  created_at: string;
  paid_at: string | null;
  email_confirmation_sent_at: string | null;
  sms_confirmation_sent_at: string | null;
}

const STATUS_BADGE: Record<
  string,
  { label: string; className: string }
> = {
  paid: {
    label: "已付款",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  },
  pending: {
    label: "待付款",
    className: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  },
  failed: {
    label: "付款失敗",
    className: "bg-rose-500/10 text-rose-700 border-rose-500/30",
  },
  cancelled: {
    label: "已取消",
    className: "bg-stone-500/10 text-stone-600 border-stone-500/30",
  },
  refunded: {
    label: "已退款",
    className: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  },
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Taipei",
  }).format(new Date(iso));
}

interface PageProps {
  searchParams: Promise<{ course?: string; status?: string }>;
}

export default async function AdminEnrollmentsPage({ searchParams }: PageProps) {
  const adminAccess = await isAdmin();
  if (!adminAccess) redirect("/");

  const { course: courseFilter, status: statusFilter } = await searchParams;

  const sb = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  let query = sb
    .from("course_enrollments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (courseFilter) query = query.eq("course_id", courseFilter);
  if (statusFilter) query = query.eq("status", statusFilter);

  const { data, error } = await query;
  const enrollments = (data ?? []) as Enrollment[];

  // 統計
  const total = enrollments.length;
  const paidCount = enrollments.filter((e) => e.status === "paid").length;
  const pendingCount = enrollments.filter((e) => e.status === "pending").length;
  const failedCount = enrollments.filter((e) => e.status === "failed").length;
  const totalRevenue = enrollments
    .filter((e) => e.status === "paid")
    .reduce((sum, e) => sum + (e.amount ?? 0), 0);

  // 取所有 distinct course_id 給 filter 下拉
  const distinctCourses = Array.from(
    new Set(enrollments.map((e) => e.course_id)),
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Badge variant="outline" className="mb-2">後臺</Badge>
          <h1 className="text-2xl font-bold sm:text-3xl">課程報名名單</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            最多顯示最近 500 筆。可用網址 query 過濾：
            <code className="mx-1 rounded bg-stone-100 px-1.5 py-0.5 text-xs">
              ?course=ai-proposal-spotlight&amp;status=paid
            </code>
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin">← 返回後臺</Link>
        </Button>
      </div>

      {/* 統計卡 */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">總筆數</p>
            <p className="mt-1 text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-emerald-700">已付款</p>
            <p className="mt-1 text-2xl font-bold text-emerald-700">
              {paidCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-amber-700">待付款</p>
            <p className="mt-1 text-2xl font-bold text-amber-700">
              {pendingCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">已付款金額</p>
            <p className="mt-1 text-2xl font-bold">
              NT${totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter chips */}
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">課程：</span>
        <FilterChip
          href="/admin/enrollments"
          active={!courseFilter}
          label="全部"
        />
        {distinctCourses.map((c) => (
          <FilterChip
            key={c}
            href={`/admin/enrollments?course=${c}${
              statusFilter ? `&status=${statusFilter}` : ""
            }`}
            active={courseFilter === c}
            label={c}
          />
        ))}
        <span className="ml-4 text-muted-foreground">狀態：</span>
        {(["paid", "pending", "failed"] as const).map((s) => (
          <FilterChip
            key={s}
            href={`/admin/enrollments?${
              courseFilter ? `course=${courseFilter}&` : ""
            }status=${s}`}
            active={statusFilter === s}
            label={STATUS_BADGE[s]?.label ?? s}
          />
        ))}
        {(courseFilter || statusFilter) && (
          <Link
            href="/admin/enrollments"
            className="text-xs text-rose-600 underline-offset-2 hover:underline"
          >
            清除篩選
          </Link>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          顯示 {enrollments.length} 筆
        </span>
      </div>

      {error && (
        <Card className="mb-4 border-rose-200 bg-rose-50">
          <CardContent className="p-4 text-sm text-rose-900">
            讀取失敗：{error.message}
          </CardContent>
        </Card>
      )}

      {/* 表格 */}
      <Card>
        <CardContent className="p-0">
          {enrollments.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              目前沒有報名資料
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-stone-50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">建立時間</th>
                    <th className="px-3 py-2 font-medium">狀態</th>
                    <th className="px-3 py-2 font-medium">課程</th>
                    <th className="px-3 py-2 font-medium">姓名</th>
                    <th className="px-3 py-2 font-medium">E-mail</th>
                    <th className="px-3 py-2 font-medium">手機</th>
                    <th className="px-3 py-2 font-medium">金額</th>
                    <th className="px-3 py-2 font-medium">公司／職稱</th>
                    <th className="px-3 py-2 font-medium">LINE</th>
                    <th className="px-3 py-2 font-medium">付款時間</th>
                    <th className="px-3 py-2 font-medium">細節</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e) => {
                    const status = STATUS_BADGE[e.status] ?? {
                      label: e.status,
                      className: "bg-stone-200 text-stone-700",
                    };
                    return (
                      <tr key={e.id} className="border-b last:border-0 hover:bg-stone-50/50">
                        <td className="px-3 py-2 align-top text-xs text-muted-foreground whitespace-nowrap">
                          {fmtDate(e.created_at)}
                        </td>
                        <td className="px-3 py-2 align-top">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-3 py-2 align-top text-xs">{e.course_id}</td>
                        <td className="px-3 py-2 align-top font-medium">{e.name}</td>
                        <td className="px-3 py-2 align-top">
                          <a
                            href={`mailto:${e.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {e.email}
                          </a>
                        </td>
                        <td className="px-3 py-2 align-top whitespace-nowrap">
                          <a
                            href={`tel:${e.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {e.phone}
                          </a>
                          {e.phone_country && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({e.phone_country})
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 align-top whitespace-nowrap">
                          {e.amount ? `NT$${e.amount.toLocaleString()}` : "—"}
                        </td>
                        <td className="px-3 py-2 align-top text-xs">
                          {e.organization || "—"}
                          {e.job_title && (
                            <div className="text-muted-foreground">{e.job_title}</div>
                          )}
                        </td>
                        <td className="px-3 py-2 align-top text-xs">{e.line_id || "—"}</td>
                        <td className="px-3 py-2 align-top text-xs text-muted-foreground whitespace-nowrap">
                          {fmtDate(e.paid_at)}
                        </td>
                        <td className="px-3 py-2 align-top">
                          <details className="cursor-pointer">
                            <summary className="text-xs text-blue-600 hover:underline">
                              展開
                            </summary>
                            <div className="mt-2 space-y-1 rounded bg-stone-50 p-2 text-xs">
                              {e.attribution && (
                                <div>
                                  <span className="text-muted-foreground">歸因：</span>
                                  {e.attribution}
                                </div>
                              )}
                              {e.current_proposal_pain && (
                                <div>
                                  <span className="text-muted-foreground">提案痛點：</span>
                                  {e.current_proposal_pain}
                                </div>
                              )}
                              {e.question && (
                                <div>
                                  <span className="text-muted-foreground">想問講師：</span>
                                  {e.question}
                                </div>
                              )}
                              {e.dietary && (
                                <div>
                                  <span className="text-muted-foreground">飲食：</span>
                                  {e.dietary}
                                </div>
                              )}
                              {e.facebook && (
                                <div>
                                  <span className="text-muted-foreground">FB：</span>
                                  {e.facebook}
                                </div>
                              )}
                              {(e.invoice_company || e.invoice_tax_id) && (
                                <div>
                                  <span className="text-muted-foreground">發票：</span>
                                  {e.invoice_company} {e.invoice_tax_id}
                                </div>
                              )}
                              {e.recur_order_id && (
                                <div>
                                  <span className="text-muted-foreground">Recur 訂單：</span>
                                  <code>{e.recur_order_id}</code>
                                </div>
                              )}
                              <div className="pt-1 text-muted-foreground">
                                行銷同意：{e.marketing_consent ? "✓" : "✗"} ｜
                                E-mail 寄出：{e.email_confirmation_sent_at ? "✓" : "✗"} ｜
                                SMS 寄出：{e.sms_confirmation_sent_at ? "✓" : "✗"}
                              </div>
                            </div>
                          </details>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {failedCount > 0 && (
        <p className="mt-4 text-sm text-rose-700">
          ⚠️ 有 {failedCount} 筆付款失敗的紀錄，建議主動聯繫補刷。
        </p>
      )}
    </div>
  );
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-stone-200 bg-card text-foreground hover:border-stone-300"
      }`}
    >
      {label}
    </Link>
  );
}
