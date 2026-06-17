import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "候補名單 | 後台",
  robots: { index: false, follow: false },
};

interface WaitlistRow {
  id: string;
  course_slug: string;
  instructor_slug: string | null;
  name: string;
  email: string;
  phone: string | null;
  source_page: string | null;
  created_at: string;
}

export default async function AdminWaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; instructor?: string }>;
}) {
  if (!(await isAdmin())) redirect("/auth/login");

  const { course, instructor } = await searchParams;
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  let query = supabase
    .from("course_waitlist")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (course) query = query.eq("course_slug", course);
  if (instructor) query = query.eq("instructor_slug", instructor);

  const { data } = await query;
  const rows = (data || []) as WaitlistRow[];

  const exportParams = new URLSearchParams();
  if (course) exportParams.set("course", course);
  if (instructor) exportParams.set("instructor", instructor);
  const exportHref = `/api/admin/waitlist/export${
    exportParams.toString() ? `?${exportParams}` : ""
  }`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">候補名單</h1>
          <p className="mt-1 text-sm text-stone-500">共 {rows.length} 筆</p>
        </div>
        <Button asChild>
          <a href={exportHref}>📄 匯出 CSV</a>
        </Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-stone-50 text-left text-stone-500">
              <tr>
                <th className="p-3">建立時間</th>
                <th className="p-3">課程</th>
                <th className="p-3">老師</th>
                <th className="p-3">姓名</th>
                <th className="p-3">E-mail</th>
                <th className="p-3">手機</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="p-3 text-stone-500">
                    {new Date(r.created_at).toLocaleString("zh-TW")}
                  </td>
                  <td className="p-3">{r.course_slug}</td>
                  <td className="p-3">{r.instructor_slug || "—"}</td>
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">{r.phone || "—"}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-stone-400">
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
          ← 回後台首頁
        </Link>
      </p>
    </div>
  );
}
