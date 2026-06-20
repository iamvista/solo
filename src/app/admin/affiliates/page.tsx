import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/supabase/admin";
import { listAffiliatesWithTotals } from "@/lib/affiliates";

export const metadata: Metadata = {
  title: "聯盟分潤 | 後台",
  robots: { index: false, follow: false },
};

function ntd(n: number): string {
  return `NT$${n.toLocaleString("zh-TW")}`;
}

export default async function AdminAffiliatesPage() {
  if (!(await isAdmin())) redirect("/");
  const affiliates = await listAffiliatesWithTotals();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">聯盟分潤代碼</h1>
        <Link
          href="/admin/affiliates/new"
          className="rounded bg-stone-900 px-4 py-2 text-sm text-white"
        >
          新增代碼
        </Link>
      </div>
      <table className="w-full text-sm">
        <thead className="border-b text-left text-stone-500">
          <tr>
            <th className="py-2">代碼</th>
            <th>夥伴</th>
            <th>比例</th>
            <th>狀態</th>
            <th className="text-right">帶單</th>
            <th className="text-right">待結算</th>
            <th className="text-right">已核准</th>
            <th className="text-right">已付款</th>
          </tr>
        </thead>
        <tbody>
          {affiliates.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="py-2 font-mono">
                <Link href={`/admin/affiliates/${a.id}`} className="underline">
                  {a.code}
                </Link>
              </td>
              <td>{a.name}</td>
              <td>{Math.round(a.commission_rate * 100)}%</td>
              <td>{a.status === "active" ? "啟用" : "停用"}</td>
              <td className="text-right">{a.referral_count}</td>
              <td className="text-right">{ntd(a.pending_amount)}</td>
              <td className="text-right">{ntd(a.approved_amount)}</td>
              <td className="text-right">{ntd(a.paid_amount)}</td>
            </tr>
          ))}
          {affiliates.length === 0 && (
            <tr>
              <td colSpan={8} className="py-6 text-center text-stone-400">
                尚無代碼，點右上「新增代碼」建立。
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
