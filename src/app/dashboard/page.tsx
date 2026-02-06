import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 取得用戶的診斷歷史
  const { data: diagnosisHistory } = await supabase
    .from("diagnosis_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // 取得用戶的 profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName = profile?.display_name || user.user_metadata?.display_name || user.email?.split("@")[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          嗨，{displayName}！
        </h1>
        <p className="mt-2 text-muted-foreground">
          歡迎來到你的自由人學院控制台
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">
              📊
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold">事業診斷</h3>
            <p className="mt-1 text-sm text-muted-foreground">診斷你的競爭力</p>
            <Button asChild size="sm" className="mt-3">
              <Link href="/diagnose">開始診斷</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">
              🛠️
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold">工具箱</h3>
            <p className="mt-1 text-sm text-muted-foreground">實用工具與模板</p>
            <Button asChild size="sm" variant="outline" className="mt-3">
              <Link href="/tools">瀏覽工具</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">
              📚
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold">學習資源</h3>
            <p className="mt-1 text-sm text-muted-foreground">文章與教學</p>
            <Button asChild size="sm" variant="outline" className="mt-3">
              <Link href="/learn">開始學習</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:border-primary/50 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">
              🎓
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold">課程中心</h3>
            <p className="mt-1 text-sm text-muted-foreground">系統化課程</p>
            <Button asChild size="sm" variant="outline" className="mt-3">
              <Link href="/courses">瀏覽課程</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Diagnosis History */}
      <Card>
        <CardHeader>
          <CardTitle>你的診斷紀錄</CardTitle>
          <CardDescription>
            追蹤你的事業成長軌跡
          </CardDescription>
        </CardHeader>
        <CardContent>
          {diagnosisHistory && diagnosisHistory.length > 0 ? (
            <div className="space-y-4">
              {diagnosisHistory.map((diagnosis) => (
                <Link
                  key={diagnosis.id}
                  href={`/r/${diagnosis.short_id || diagnosis.id}`}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">
                      {diagnosis.solo_type === "lion" && "🦁"}
                      {diagnosis.solo_type === "fox" && "🦊"}
                      {diagnosis.solo_type === "elephant" && "🐘"}
                      {diagnosis.solo_type === "eagle" && "🦅"}
                      {diagnosis.solo_type === "turtle" && "🐢"}
                      {diagnosis.solo_type === "chick" && "🐣"}
                    </div>
                    <div>
                      <p className="font-medium">
                        {diagnosis.solo_type === "lion" && "獅子型 Solo"}
                        {diagnosis.solo_type === "fox" && "狐狸型 Solo"}
                        {diagnosis.solo_type === "elephant" && "大象型 Solo"}
                        {diagnosis.solo_type === "eagle" && "老鷹型 Solo"}
                        {diagnosis.solo_type === "turtle" && "烏龜型 Solo"}
                        {diagnosis.solo_type === "chick" && "小雞型 Solo"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(diagnosis.created_at).toLocaleDateString("zh-TW", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {" · "}
                        {diagnosis.diagnosis_type === "quick" ? "快速診斷" : "深度診斷"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{diagnosis.total_score}</p>
                      <p className="text-xs text-muted-foreground">總分</p>
                    </div>
                    <svg
                      className="h-5 w-5 text-muted-foreground"
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
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="font-medium">還沒有診斷紀錄</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                完成診斷後，你的紀錄會顯示在這裡
              </p>
              <Button asChild className="mt-4">
                <Link href="/diagnose">開始第一次診斷</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
