import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isAdmin, getDiagnosisList } from "@/lib/supabase/admin";

// Solo 類型資料
const soloTypes: Record<string, { emoji: string; name: string }> = {
  lion: { emoji: "🦁", name: "獅子型" },
  fox: { emoji: "🦊", name: "狐狸型" },
  elephant: { emoji: "🐘", name: "大象型" },
  eagle: { emoji: "🦅", name: "老鷹型" },
  turtle: { emoji: "🐢", name: "烏龜型" },
  chick: { emoji: "🐣", name: "小雞型" },
};

export default async function AdminDiagnosesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // 驗證管理員權限
  const adminAccess = await isAdmin();

  if (!adminAccess) {
    redirect("/");
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const { diagnoses, total, totalPages } = await getDiagnosisList(page, 20);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="outline" className="mb-2">🔐 管理員專區</Badge>
          <h1 className="text-2xl font-bold sm:text-3xl">診斷紀錄</h1>
          <p className="mt-1 text-base text-muted-foreground sm:text-lg">
            共 {total} 筆診斷紀錄
          </p>
        </div>
        <Button variant="outline" asChild className="h-11 px-4 text-base">
          <Link href="/admin">← 返回後台</Link>
        </Button>
      </div>

      {/* 診斷列表 */}
      <Card>
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="text-xl">📊 診斷紀錄</CardTitle>
          <CardDescription className="text-base">
            所有用戶的診斷結果與來源分析
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          {/* 表格標題 */}
          <div className="hidden lg:grid lg:grid-cols-8 gap-4 p-4 bg-muted rounded-lg mb-4 font-medium text-sm">
            <div>類型</div>
            <div className="col-span-2">Email / ID</div>
            <div>診斷類型</div>
            <div>總分</div>
            <div>來源</div>
            <div>日期</div>
            <div>操作</div>
          </div>

          {/* 診斷列表 */}
          <div className="space-y-3">
            {diagnoses.map((diagnosis) => (
              <div
                key={diagnosis.id}
                className="grid grid-cols-1 lg:grid-cols-8 gap-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors"
              >
                {/* Solo 類型 */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{soloTypes[diagnosis.solo_type]?.emoji}</span>
                  <span className="text-sm font-medium lg:hidden">{soloTypes[diagnosis.solo_type]?.name}</span>
                </div>

                {/* Email / ID */}
                <div className="col-span-2">
                  <p className="font-medium truncate">
                    {diagnosis.email || "匿名用戶"}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {diagnosis.short_id}
                  </p>
                </div>

                {/* 診斷類型 */}
                <div className="flex items-center">
                  <Badge variant={diagnosis.diagnosis_type === "full" ? "default" : "secondary"}>
                    {diagnosis.diagnosis_type === "full" ? "深度" : "快速"}
                  </Badge>
                </div>

                {/* 總分 */}
                <div className="flex items-center">
                  <span className="text-xl font-bold text-primary">{diagnosis.total_score}</span>
                  <span className="text-sm text-muted-foreground ml-1">/100</span>
                </div>

                {/* 來源 */}
                <div className="flex items-center">
                  {diagnosis.utm_source ? (
                    <Badge variant="outline" className="text-xs">
                      {diagnosis.utm_source}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">直接訪問</span>
                  )}
                </div>

                {/* 日期 */}
                <div className="flex items-center text-sm text-muted-foreground">
                  {new Date(diagnosis.created_at).toLocaleDateString("zh-TW", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                {/* 操作 */}
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/r/${diagnosis.short_id}`} target="_blank">
                      查看 →
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {diagnoses.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              尚無診斷紀錄
            </div>
          )}

          {/* 分頁 */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                asChild={page > 1}
              >
                {page > 1 ? (
                  <Link href={`/admin/diagnoses?page=${page - 1}`}>上一頁</Link>
                ) : (
                  "上一頁"
                )}
              </Button>
              <span className="px-4 text-sm text-muted-foreground">
                第 {page} / {totalPages} 頁
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                asChild={page < totalPages}
              >
                {page < totalPages ? (
                  <Link href={`/admin/diagnoses?page=${page + 1}`}>下一頁</Link>
                ) : (
                  "下一頁"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 維度分數詳情 */}
      <Card className="mt-8">
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="text-xl">📈 維度分數分佈</CardTitle>
          <CardDescription className="text-base">
            最近診斷的各維度分數概覽
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          <div className="grid gap-4 sm:grid-cols-5">
            {[
              { key: "positioning", name: "定位力", color: "bg-blue-500" },
              { key: "delivery", name: "交付力", color: "bg-green-500" },
              { key: "trust", name: "信任力", color: "bg-yellow-500" },
              { key: "monetization", name: "變現力", color: "bg-purple-500" },
              { key: "sustainability", name: "永續力", color: "bg-pink-500" },
            ].map((dim) => {
              const avgScore = diagnoses.length > 0
                ? Math.round(
                    diagnoses.reduce((sum, d) => sum + (d[`score_${dim.key}` as keyof typeof d] as number || 0), 0) / diagnoses.length
                  )
                : 0;
              return (
                <div key={dim.key} className="rounded-lg border p-4 text-center">
                  <p className="text-sm text-muted-foreground">{dim.name}</p>
                  <p className="mt-2 text-2xl font-bold">{avgScore}</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${dim.color}`}
                      style={{ width: `${avgScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
