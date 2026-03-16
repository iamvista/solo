import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  draft: { label: "草稿", class: "bg-stone-100 text-stone-600" },
  published: { label: "已發布", class: "bg-green-100 text-green-700" },
  archived: { label: "已封存", class: "bg-stone-200 text-stone-500" },
};

const RESOURCE_TYPE_ICONS: Record<string, string> = {
  pdf: "📄",
  checklist: "✅",
  template: "📋",
  toolkit: "🧰",
  video: "🎬",
  other: "🎁",
};

export default async function LeadMagnetsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_tier")
    .eq("id", user.id)
    .single();

  const tier = profile?.membership_tier || "free";

  const { data: magnets } = await supabase
    .from("lead_magnets")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  // Usage info
  const { data: usage } = await supabase
    .from("usage_limits")
    .select("lead_magnets_created_this_month, month_year")
    .eq("user_id", user.id)
    .single();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const usedThisMonth = usage?.month_year === currentMonth ? usage.lead_magnets_created_this_month : 0;
  const limit = tier === "premium" ? "無限" : tier === "pro" ? "3" : "0";

  // Total captures across all magnets
  const totalCaptures = (magnets || []).reduce((sum, m) => sum + (m.capture_count || 0), 0);

  return (
    <div className="min-h-[80vh] bg-stone-50/50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">名單磁鐵</h1>
            <p className="mt-1 text-sm text-stone-500">
              {tier === "free"
                ? "升級至 Pro 方案即可建立名單磁鐵"
                : `本月已建立 ${usedThisMonth} / ${limit} 個 · 共收集 ${totalCaptures} 筆名單`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">← 返回 Dashboard</Link>
            </Button>
            {tier !== "free" ? (
              <Button size="sm" asChild>
                <Link href="/dashboard/lead-magnets/new">建立名單磁鐵</Link>
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
              <div className="text-4xl">🧲</div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-stone-900">用名單磁鐵收集潛在客戶</h2>
                <p className="mt-1 text-sm text-stone-600">
                  建立免費下載頁面，用 PDF、模板、工具包等資源交換 Email，自動寄送 + 名單管理。
                </p>
              </div>
              <Button asChild>
                <Link href="/pricing">查看方案</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Magnets List */}
        {magnets && magnets.length > 0 ? (
          <div className="space-y-4">
            {magnets.map((magnet) => {
              const status = STATUS_LABELS[magnet.status] || STATUS_LABELS.draft;
              const icon = RESOURCE_TYPE_ICONS[magnet.resource_type] || "🎁";

              return (
                <Card key={magnet.id} className="border-0 shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.class}`}>
                            {status.label}
                          </span>
                          <span className="text-xs text-stone-400">
                            {icon} {new Date(magnet.created_at).toLocaleDateString("zh-TW")}
                          </span>
                        </div>
                        <h3 className="mt-2 text-base font-semibold text-stone-900 line-clamp-1">
                          {magnet.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-4 text-sm text-stone-500">
                          <span>📧 {magnet.capture_count} 筆名單</span>
                          <span className="text-stone-300">·</span>
                          <span>solo.tw/m/{magnet.slug}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/lead-magnets/${magnet.id}/captures`}>
                            名單
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/lead-magnets/${magnet.id}/edit`}>
                            編輯
                          </Link>
                        </Button>
                        {magnet.status === "published" && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/m/${magnet.slug}`} target="_blank">
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
              <div className="text-5xl">🧲</div>
              <h2 className="mt-4 text-lg font-semibold text-stone-900">還沒有建立任何名單磁鐵</h2>
              <p className="mt-2 text-sm text-stone-500">
                用免費資源交換 Email，開始建立你的潛在客戶名單！
              </p>
              <Button className="mt-6" asChild>
                <Link href="/dashboard/lead-magnets/new">建立第一個名單磁鐵</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
