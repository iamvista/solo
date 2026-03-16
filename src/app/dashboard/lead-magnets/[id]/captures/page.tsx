import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function CapturesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Get lead magnet (verify ownership)
  const { data: magnet } = await supabase
    .from("lead_magnets")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (!magnet) redirect("/dashboard/lead-magnets");

  // Get captures using service client (bypasses RLS for count accuracy)
  const serviceClient = createServiceClient();
  const { data: captures } = await serviceClient
    .from("lead_captures")
    .select("*")
    .eq("lead_magnet_id", id)
    .order("created_at", { ascending: false });

  const captureList = captures || [];

  // Stats
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = captureList.filter((c) => c.created_at.slice(0, 10) === today).length;

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const weekCount = captureList.filter((c) => c.created_at >= weekAgo).length;

  return (
    <div className="min-h-[80vh] bg-stone-50/50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">{magnet.title}</h1>
            <p className="mt-1 text-sm text-stone-500">名單管理</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/lead-magnets">← 返回</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/api/lead-magnets/${id}/captures?format=csv`}>
                匯出 CSV
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-stone-900">{captureList.length}</p>
              <p className="text-sm text-stone-500">總名單數</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{todayCount}</p>
              <p className="text-sm text-stone-500">今日新增</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{weekCount}</p>
              <p className="text-sm text-stone-500">近 7 天</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        {captureList.length > 0 ? (
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-stone-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium text-stone-600">Email</th>
                    <th className="px-4 py-3 font-medium text-stone-600">姓名</th>
                    <th className="px-4 py-3 font-medium text-stone-600">來源</th>
                    <th className="px-4 py-3 font-medium text-stone-600">日期</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {captureList.map((capture) => (
                    <tr key={capture.id} className="hover:bg-stone-50/50">
                      <td className="px-4 py-3 text-stone-900">{capture.email}</td>
                      <td className="px-4 py-3 text-stone-600">{capture.name || "—"}</td>
                      <td className="px-4 py-3 text-stone-500 text-xs">
                        {capture.utm_source || capture.source_page || "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-500">
                        {new Date(capture.created_at).toLocaleDateString("zh-TW")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="text-5xl">📭</div>
              <h2 className="mt-4 text-lg font-semibold text-stone-900">還沒有收到任何名單</h2>
              <p className="mt-2 text-sm text-stone-500">
                分享你的名單磁鐵連結，開始收集潛在客戶！
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-stone-100 px-4 py-2 text-sm text-stone-700">
                🔗 solo.tw/m/{magnet.slug}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
