import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/supabase/admin";
import { getAffiliate, getReferralsForAffiliate } from "@/lib/affiliates";
import { ReferralActions } from "./ReferralActions";

export const metadata: Metadata = {
  title: "聯盟夥伴明細 | 後台",
  robots: { index: false, follow: false },
};

function ntd(n: number): string {
  return `NT$${n.toLocaleString("zh-TW")}`;
}

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

const STATUS_LABEL: Record<string, string> = {
  pending: "待結算",
  approved: "已核准",
  paid: "已付款",
  void: "作廢",
};

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ month?: string }>;
}

export default async function AffiliateDetailPage({ params, searchParams }: PageProps) {
  if (!(await isAdmin())) redirect("/");
  const { id } = await params;
  const rawMonth = (await searchParams).month ?? "";
  const month = /^\d{4}-\d{2}$/.test(rawMonth) ? rawMonth : undefined;
  const affiliate = await getAffiliate(id);
  if (!affiliate) notFound();
  const referrals = await getReferralsForAffiliate(id);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-1 text-2xl font-bold">
        {affiliate.name}（<span className="font-mono">{affiliate.code}</span>）
      </h1>
      <p className="mb-6 text-sm text-stone-500">
        比例 {Math.round(affiliate.commission_rate * 100)}%・
        {affiliate.status === "active" ? "啟用中" : "已停用"}・
        {affiliate.email ?? "（無聯絡 email）"}
      </p>

      <form className="mb-4 flex items-center gap-2" action={`/admin/affiliates/${affiliate.id}`}>
        <input
          type="month"
          name="month"
          defaultValue={month ?? ""}
          className="rounded border px-2 py-1 text-sm"
        />
        <button type="submit" className="rounded border px-3 py-1 text-sm">
          套用月份
        </button>
        {month && (
          <a
            href={`/api/admin/affiliates/${affiliate.id}/export?month=${month}`}
            className="rounded bg-stone-900 px-3 py-1 text-sm text-white"
          >
            匯出 {month} 對帳單
          </a>
        )}
      </form>

      <table className="w-full text-sm">
        <thead className="border-b text-left text-stone-500">
          <tr>
            <th className="py-2">日期</th>
            <th>課程</th>
            <th>學員</th>
            <th className="text-right">實付</th>
            <th className="text-right">分潤</th>
            <th>狀態</th>
            <th>Recur 訂單</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {referrals.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{fmtDate(r.created_at)}</td>
              <td>{r.course_id}</td>
              <td>{r.enrollment_email ?? "—"}</td>
              <td className="text-right">{ntd(r.order_amount)}</td>
              <td className="text-right">{ntd(r.commission_amount)}</td>
              <td>{STATUS_LABEL[r.status] ?? r.status}</td>
              <td className="font-mono text-xs">{r.recur_order_id ?? "—"}</td>
              <td>
                <ReferralActions referralId={r.id} status={r.status} />
              </td>
            </tr>
          ))}
          {referrals.length === 0 && (
            <tr>
              <td colSpan={8} className="py-6 text-center text-stone-400">
                尚無帶單紀錄。
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
