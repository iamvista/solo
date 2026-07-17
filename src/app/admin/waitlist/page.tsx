import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/supabase/admin";
import { fetchWaitlist, timeslotDistribution } from "@/lib/waitlist-query";
import { timeslotLabel } from "@/lib/waitlist-timeslots";
import { sourceLabel } from "@/lib/waitlist-source";
import { WAITLIST_INTENTS } from "@/lib/waitlist";
import { BroadcastPanel } from "./BroadcastPanel";

export const metadata: Metadata = {
  title: "候補名單 | 後臺",
  robots: { index: false, follow: false },
};

const INTENT_LABELS: Record<string, string> = {
  full_waitlist: "額滿候補",
  date_conflict: "等下一期",
  ad_lead: "廣告名單",
};

interface SearchParams {
  course?: string;
  instructor?: string;
  intent?: string;
  campaign?: string;
}

export default async function AdminWaitlistPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  if (!(await isAdmin())) redirect("/auth/login");

  const filters = await searchParams;
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { rows } = await fetchWaitlist(supabase, filters);
  const dist = timeslotDistribution(rows);
  const activeCount = rows.filter((r) => !r.unsubscribed_at).length;

  const exportParams = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v) as [string, string][],
  );
  const exportHref = `/api/admin/waitlist/export${
    exportParams.toString() ? `?${exportParams}` : ""
  }`;

  const intentHref = (intent?: string) => {
    const p = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v) as [string, string][],
    );
    if (intent) p.set("intent", intent);
    else p.delete("intent");
    return `/admin/waitlist${p.toString() ? `?${p}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">候補名單</h1>
          <p className="mt-1 text-sm text-stone-500">
            共 {rows.length} 筆，其中 {activeCount} 筆可接收通知
          </p>
        </div>
        <Button asChild>
          <a href={exportHref}>📄 匯出 CSV</a>
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-stone-500">名單類型：</span>
        <Link
          href={intentHref()}
          className={`rounded-full border px-3 py-1 ${!filters.intent ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600 hover:border-stone-400"}`}
        >
          全部
        </Link>
        {WAITLIST_INTENTS.map((i) => (
          <Link
            key={i}
            href={intentHref(i)}
            className={`rounded-full border px-3 py-1 ${filters.intent === i ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600 hover:border-stone-400"}`}
          >
            {INTENT_LABELS[i]}
          </Link>
        ))}
        {(filters.course || filters.campaign || filters.instructor) && (
          <span className="text-stone-500">
            ・篩選中：
            {filters.course && `課程 ${filters.course} `}
            {filters.instructor && `老師 ${filters.instructor} `}
            {filters.campaign && `活動 ${filters.campaign}`}
          </span>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-3 text-sm">
        {Object.entries(dist).map(([slot, n]) => (
          <span
            key={slot}
            className="rounded-md border border-stone-200 bg-stone-50 px-3 py-1.5 text-stone-600"
          >
            {slot === "unset" ? "未選時段" : timeslotLabel(slot)}
            <strong className="ml-2 text-stone-900">{n}</strong>
          </span>
        ))}
      </div>

      <div className="mb-6">
        <BroadcastPanel filters={filters} />
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-stone-50 text-left text-stone-500">
              <tr>
                <th className="p-3">建立時間</th>
                <th className="p-3">課程</th>
                <th className="p-3">來源</th>
                <th className="p-3">類型</th>
                <th className="p-3">姓名</th>
                <th className="p-3">E-mail</th>
                <th className="p-3">偏好時段</th>
                <th className="p-3">廣告活動</th>
                <th className="p-3">狀態</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="p-3 text-stone-500">
                    {new Date(r.created_at).toLocaleString("zh-TW")}
                  </td>
                  <td className="p-3">{r.course_slug}</td>
                  <td className="p-3 text-stone-500">
                    {sourceLabel(r.source_page)}
                  </td>
                  <td className="p-3">{INTENT_LABELS[r.intent] ?? r.intent}</td>
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">{timeslotLabel(r.preferred_timeslot)}</td>
                  <td className="p-3">{r.utm_campaign || "—"}</td>
                  <td className="p-3">
                    {r.unsubscribed_at ? (
                      <span className="text-rose-600">已退訂</span>
                    ) : r.notified_at ? (
                      <span className="text-stone-500">
                        已通知 {new Date(r.notified_at).toLocaleDateString("zh-TW")}
                      </span>
                    ) : (
                      <span className="text-emerald-700">待通知</span>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-stone-400">
                    目前沒有候補資料
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <p className="mt-4">
        <Link href="/admin" className="text-sm text-primary hover:underline">
          ← 回後臺首頁
        </Link>
      </p>
    </div>
  );
}
