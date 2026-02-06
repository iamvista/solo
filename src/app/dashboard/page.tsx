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

  const displayName = profile?.display_name || user.user_metadata?.full_name || user.user_metadata?.display_name || user.email?.split("@")[0];
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="頭像"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {displayName?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">
              嗨，{displayName}！
            </h1>
            <p className="mt-1 text-muted-foreground">
              歡迎來到你的自由人學院控制臺
            </p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/settings">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            設定
          </Link>
        </Button>
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
