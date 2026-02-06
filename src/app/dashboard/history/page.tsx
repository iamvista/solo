import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadarChart } from "@/components/ui/radar-chart";

// Solo 類型資料
const soloTypes: Record<string, { emoji: string; name: string; title: string }> = {
  lion: { emoji: "🦁", name: "獅子型 Solo", title: "市場領袖" },
  fox: { emoji: "🦊", name: "狐狸型 Solo", title: "策略高手" },
  elephant: { emoji: "🐘", name: "大象型 Solo", title: "穩健專家" },
  eagle: { emoji: "🦅", name: "老鷹型 Solo", title: "獨行俠" },
  turtle: { emoji: "🐢", name: "烏龜型 Solo", title: "蓄勢待發" },
  chick: { emoji: "🐣", name: "小雞型 Solo", title: "新手起步" },
};

export default async function DiagnosisHistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/history");
  }

  // 取得所有診斷歷史
  const { data: diagnosisHistory } = await supabase
    .from("diagnosis_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // 計算成長趨勢（比較最近兩次診斷）
  const latestDiagnosis = diagnosisHistory?.[0];
  const previousDiagnosis = diagnosisHistory?.[1];

  const calculateGrowth = (current: number, previous: number) => {
    const diff = current - previous;
    return { diff, percentage: previous > 0 ? Math.round((diff / previous) * 100) : 0 };
  };

  const growthData = latestDiagnosis && previousDiagnosis ? {
    total: calculateGrowth(latestDiagnosis.total_score, previousDiagnosis.total_score),
    positioning: calculateGrowth(latestDiagnosis.score_positioning, previousDiagnosis.score_positioning),
    delivery: calculateGrowth(latestDiagnosis.score_delivery, previousDiagnosis.score_delivery),
    trust: calculateGrowth(latestDiagnosis.score_trust, previousDiagnosis.score_trust),
    monetization: calculateGrowth(latestDiagnosis.score_monetization, previousDiagnosis.score_monetization),
    sustainability: calculateGrowth(latestDiagnosis.score_sustainability, previousDiagnosis.score_sustainability),
  } : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">診斷歷史紀錄</h1>
          <p className="mt-1 text-base text-muted-foreground sm:text-lg">
            追蹤你的事業成長軌跡
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="h-11 px-4 text-base">
            <Link href="/dashboard">返回控制臺</Link>
          </Button>
          <Button asChild className="h-11 px-4 text-base">
            <Link href="/diagnose/full">新增診斷</Link>
          </Button>
        </div>
      </div>

      {diagnosisHistory && diagnosisHistory.length > 0 ? (
        <>
          {/* 成長趨勢總覽 */}
          {growthData && (
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardHeader className="p-5 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <span className="text-2xl">📈</span> 成長趨勢
                </CardTitle>
                <CardDescription className="text-base">
                  與上次診斷（{new Date(previousDiagnosis!.created_at).toLocaleDateString("zh-TW")}）相比
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                  {/* 總分 */}
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">總分</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{latestDiagnosis!.total_score}</span>
                      <span className={`text-sm font-medium ${growthData.total.diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {growthData.total.diff >= 0 ? "+" : ""}{growthData.total.diff}
                      </span>
                    </div>
                  </div>
                  {/* 定位力 */}
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">定位力</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{latestDiagnosis!.score_positioning}</span>
                      <span className={`text-sm font-medium ${growthData.positioning.diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {growthData.positioning.diff >= 0 ? "+" : ""}{growthData.positioning.diff}
                      </span>
                    </div>
                  </div>
                  {/* 交付力 */}
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">交付力</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{latestDiagnosis!.score_delivery}</span>
                      <span className={`text-sm font-medium ${growthData.delivery.diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {growthData.delivery.diff >= 0 ? "+" : ""}{growthData.delivery.diff}
                      </span>
                    </div>
                  </div>
                  {/* 信任力 */}
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">信任力</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{latestDiagnosis!.score_trust}</span>
                      <span className={`text-sm font-medium ${growthData.trust.diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {growthData.trust.diff >= 0 ? "+" : ""}{growthData.trust.diff}
                      </span>
                    </div>
                  </div>
                  {/* 變現力 */}
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">變現力</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{latestDiagnosis!.score_monetization}</span>
                      <span className={`text-sm font-medium ${growthData.monetization.diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {growthData.monetization.diff >= 0 ? "+" : ""}{growthData.monetization.diff}
                      </span>
                    </div>
                  </div>
                  {/* 永續力 */}
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">永續力</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{latestDiagnosis!.score_sustainability}</span>
                      <span className={`text-sm font-medium ${growthData.sustainability.diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {growthData.sustainability.diff >= 0 ? "+" : ""}{growthData.sustainability.diff}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 最新診斷結果預覽 */}
          {latestDiagnosis && (
            <Card className="mb-8">
              <CardHeader className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl">最新診斷結果</CardTitle>
                  <Button variant="outline" size="sm" asChild className="h-9 px-3 text-sm">
                    <Link href={`/r/${latestDiagnosis.short_id || latestDiagnosis.id}`}>
                      查看完整結果 →
                    </Link>
                  </Button>
                </div>
                <CardDescription className="text-base">
                  {new Date(latestDiagnosis.created_at).toLocaleDateString("zh-TW", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* 類型資訊 */}
                  <div className="flex items-center gap-4">
                    <span className="text-6xl">{soloTypes[latestDiagnosis.solo_type]?.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold">{soloTypes[latestDiagnosis.solo_type]?.name}</h3>
                      <p className="text-muted-foreground">{soloTypes[latestDiagnosis.solo_type]?.title}</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">{latestDiagnosis.total_score}</span>
                        <span className="text-muted-foreground">/100</span>
                      </div>
                    </div>
                  </div>
                  {/* 雷達圖 */}
                  <div className="flex justify-center">
                    <RadarChart
                      data={[
                        { label: "定位力", value: latestDiagnosis.score_positioning },
                        { label: "交付力", value: latestDiagnosis.score_delivery },
                        { label: "信任力", value: latestDiagnosis.score_trust },
                        { label: "變現力", value: latestDiagnosis.score_monetization },
                        { label: "永續力", value: latestDiagnosis.score_sustainability },
                      ]}
                      size={200}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 診斷歷史列表 */}
          <Card>
            <CardHeader className="p-5 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl">所有診斷紀錄</CardTitle>
              <CardDescription className="text-base">
                共 {diagnosisHistory.length} 次診斷
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-4">
                {diagnosisHistory.map((diagnosis, index) => (
                  <Link
                    key={diagnosis.id}
                    href={`/r/${diagnosis.short_id || diagnosis.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50 sm:p-5"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative">
                        <div className="text-4xl sm:text-5xl">
                          {soloTypes[diagnosis.solo_type]?.emoji}
                        </div>
                        {index === 0 && (
                          <Badge className="absolute -right-2 -top-2 bg-primary text-xs">
                            最新
                          </Badge>
                        )}
                      </div>
                      <div>
                        <p className="text-base font-medium sm:text-lg">
                          {soloTypes[diagnosis.solo_type]?.name}
                        </p>
                        <p className="text-sm text-muted-foreground sm:text-base">
                          {new Date(diagnosis.created_at).toLocaleDateString("zh-TW", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                          {" · "}
                          <Badge variant="outline" className="text-xs">
                            {diagnosis.diagnosis_type === "quick" ? "快速診斷" : "深度診斷"}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary sm:text-3xl">{diagnosis.total_score}</p>
                        <p className="text-xs text-muted-foreground sm:text-sm">總分</p>
                      </div>
                      {index > 0 && diagnosisHistory[index - 1] && (
                        <div className="text-right">
                          {(() => {
                            const diff = diagnosisHistory[index - 1].total_score - diagnosis.total_score;
                            return (
                              <span className={`text-sm font-medium ${diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {diff >= 0 ? "→ +" : "→ "}{diff}
                              </span>
                            );
                          })()}
                        </div>
                      )}
                      <svg
                        className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 定期診斷提醒 */}
          <Card className="mt-8 bg-muted">
            <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row sm:p-8">
              <div>
                <h3 className="text-lg font-semibold">💡 建議：定期追蹤你的成長</h3>
                <p className="mt-1 text-base text-muted-foreground">
                  每季做一次深度診斷，追蹤你的事業體質變化，找出需要加強的地方
                </p>
              </div>
              <Button asChild className="h-11 w-full px-6 text-base sm:w-auto">
                <Link href="/diagnose/full">立即開始深度診斷</Link>
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-16 text-center sm:py-20">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted sm:h-24 sm:w-24">
              <span className="text-5xl sm:text-6xl">📊</span>
            </div>
            <h2 className="text-xl font-bold sm:text-2xl">還沒有診斷紀錄</h2>
            <p className="mx-auto mt-2 max-w-md text-base text-muted-foreground sm:text-lg">
              完成第一次診斷，開始追蹤你的事業成長軌跡
            </p>
            <Button asChild className="mt-8 h-12 px-8 text-lg">
              <Link href="/diagnose">開始第一次診斷</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
