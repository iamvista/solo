import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SOLO_STAGES = [
  { key: "setup", letter: "S", name: "Set up", label: "建立基礎", color: "amber", description: "定位你的專業，建立品牌基礎" },
  { key: "operate", letter: "O", name: "Operate", label: "開始營運", color: "blue", description: "推出產品服務，取得第一批客戶" },
  { key: "leverage", letter: "L", name: "Leverage", label: "槓桿擴展", color: "violet", description: "用系統與工具放大你的影響力" },
  { key: "outgrow", letter: "O", name: "Outgrow", label: "超越成長", color: "emerald", description: "建立被動收入，突破時間限制" },
] as const;

const STAGE_INDEX: Record<string, number> = { setup: 0, operate: 1, leverage: 2, outgrow: 3 };

const STAGE_COLORS: Record<string, { bg: string; text: string; ring: string; bar: string; light: string }> = {
  amber: { bg: "bg-amber-500", text: "text-amber-700", ring: "ring-amber-500", bar: "bg-amber-400", light: "bg-amber-50" },
  blue: { bg: "bg-blue-500", text: "text-blue-700", ring: "ring-blue-500", bar: "bg-blue-400", light: "bg-blue-50" },
  violet: { bg: "bg-violet-500", text: "text-violet-700", ring: "ring-violet-500", bar: "bg-violet-400", light: "bg-violet-50" },
  emerald: { bg: "bg-emerald-500", text: "text-emerald-700", ring: "ring-emerald-500", bar: "bg-emerald-400", light: "bg-emerald-50" },
};

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  done: boolean;
  exp: number;
}

function getOnboardingTasks(profile: Record<string, unknown> | null, hasDiagnosis: boolean): OnboardingTask[] {
  return [
    {
      id: "username",
      title: "設定使用者名稱",
      description: "取得你的專屬網址 solo.tw/@username",
      href: "/settings",
      cta: "前往設定",
      done: !!profile?.username,
      exp: 50,
    },
    {
      id: "avatar",
      title: "上傳頭像",
      description: "讓大家認識你",
      href: "/settings",
      cta: "上傳頭像",
      done: !!profile?.avatar_url,
      exp: 20,
    },
    {
      id: "bio",
      title: "填寫自我介紹",
      description: "告訴大家你在做什麼",
      href: "/settings",
      cta: "填寫介紹",
      done: !!profile?.bio,
      exp: 20,
    },
    {
      id: "diagnosis",
      title: "完成事業健檢",
      description: "了解你目前的一人事業競爭力",
      href: "/diagnose",
      cta: "開始健檢",
      done: hasDiagnosis,
      exp: 100,
    },
  ];
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: profile }, { data: diagnosisHistory }, { data: registrations }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("diagnosis_results").select("*").eq("user_id", user.id).or("is_deleted.is.null,is_deleted.eq.false").order("created_at", { ascending: false }).limit(3),
    supabase.from("registrations").select("id, event_id, status, created_at, events(title, slug, starts_at)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
  ]);

  const displayName = profile?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0];
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const currentStage = profile?.solo_stage || "setup";
  const currentStageIdx = STAGE_INDEX[currentStage] ?? 0;
  const level = profile?.level || 1;
  const exp = profile?.exp || 0;
  const expForNextLevel = level * 200; // Simple formula: level * 200
  const expProgress = Math.min((exp / expForNextLevel) * 100, 100);

  const hasDiagnosis = !!(diagnosisHistory && diagnosisHistory.length > 0);
  const tasks = getOnboardingTasks(profile, hasDiagnosis);
  const completedTasks = tasks.filter((t) => t.done).length;
  const onboardingProgress = Math.round((completedTasks / tasks.length) * 100);

  return (
    <div className="min-h-[80vh] bg-stone-50/50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Welcome Bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="頭像" className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow sm:h-16 sm:w-16" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-200 text-xl font-bold text-stone-600 ring-2 ring-white shadow sm:h-16 sm:w-16 sm:text-2xl">
                  {displayName?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              {/* Level badge */}
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white">
                {level}
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
                嗨，{displayName}！
              </h1>
              <p className="text-sm text-stone-500 sm:text-base">
                {profile?.username ? (
                  <Link href={`/@${profile.username}`} className="hover:text-primary hover:underline">
                    @{profile.username}
                  </Link>
                ) : (
                  "歡迎來到你的一人事業控制臺"
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="h-9 text-sm">
              <Link href="/settings">設定</Link>
            </Button>
            {profile?.username && (
              <Button variant="outline" size="sm" asChild className="h-9 text-sm">
                <Link href={`/@${profile.username}`}>我的主頁</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: SOLO Map + Tasks */}
          <div className="space-y-6 lg:col-span-2">
            {/* SOLO Growth Map */}
            <Card className="overflow-hidden border-0 shadow-sm">
              <CardHeader className="border-b bg-white pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">SOLO 成長地圖</CardTitle>
                    <p className="mt-1 text-sm text-stone-500">你的一人事業旅程</p>
                  </div>
                  <Link href="/growth" className="text-sm text-primary hover:underline">
                    了解更多 →
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-5 sm:p-6">
                {/* Stage Progress */}
                <div className="relative">
                  {/* Connection line */}
                  <div className="absolute left-0 right-0 top-6 h-1 rounded-full bg-stone-200 sm:top-7">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 via-blue-400 to-violet-400 transition-all duration-700"
                      style={{ width: `${Math.max(((currentStageIdx + 0.5) / SOLO_STAGES.length) * 100, 12)}%` }}
                    />
                  </div>

                  {/* Stage nodes */}
                  <div className="relative flex justify-between">
                    {SOLO_STAGES.map((stage, idx) => {
                      const colors = STAGE_COLORS[stage.color];
                      const isActive = idx === currentStageIdx;
                      const isDone = idx < currentStageIdx;
                      const isFuture = idx > currentStageIdx;

                      return (
                        <div key={stage.key} className="flex flex-col items-center">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-black transition-all sm:h-14 sm:w-14 sm:text-xl ${
                              isActive
                                ? `${colors.bg} text-white ring-4 ${colors.ring}/30 shadow-lg scale-110`
                                : isDone
                                  ? `${colors.bg} text-white`
                                  : "bg-stone-200 text-stone-400"
                            }`}
                          >
                            {isDone ? (
                              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              stage.letter
                            )}
                          </div>
                          <span className={`mt-2 text-xs font-semibold sm:text-sm ${isActive ? colors.text : isFuture ? "text-stone-400" : "text-stone-600"}`}>
                            {stage.name}
                          </span>
                          <span className={`text-[10px] sm:text-xs ${isActive ? "text-stone-600" : "text-stone-400"}`}>
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Current Stage Detail */}
                <div className={`mt-6 rounded-xl p-4 ${STAGE_COLORS[SOLO_STAGES[currentStageIdx].color].light}`}>
                  <p className={`text-sm font-semibold ${STAGE_COLORS[SOLO_STAGES[currentStageIdx].color].text}`}>
                    目前階段：{SOLO_STAGES[currentStageIdx].name} — {SOLO_STAGES[currentStageIdx].label}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    {SOLO_STAGES[currentStageIdx].description}
                  </p>
                </div>

                {/* Level + EXP bar */}
                <div className="mt-5 flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black text-stone-900">Lv.{level}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>EXP {exp} / {expForNextLevel}</span>
                      <span>{Math.round(expProgress)}%</span>
                    </div>
                    <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-stone-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-rose-400 transition-all duration-500"
                        style={{ width: `${expProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onboarding Tasks */}
            {onboardingProgress < 100 && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b bg-white pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">新手任務</CardTitle>
                      <p className="mt-1 text-sm text-stone-500">完成任務獲得 EXP，提升你的等級</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary">{completedTasks}/{tasks.length}</span>
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-stone-200">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${onboardingProgress}%` }} />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="divide-y p-0">
                  {tasks.map((task) => (
                    <div key={task.id} className={`flex items-center gap-4 px-5 py-4 sm:px-6 ${task.done ? "opacity-60" : ""}`}>
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${task.done ? "bg-green-100 text-green-600" : "bg-stone-100 text-stone-400"}`}>
                        {task.done ? (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="h-3 w-3 rounded-full border-2 border-stone-300" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${task.done ? "text-stone-500 line-through" : "text-stone-900"}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-stone-500">{task.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-amber-600">+{task.exp} EXP</span>
                        {!task.done && (
                          <Button size="sm" variant="outline" asChild className="h-8 text-xs">
                            <Link href={task.href}>{task.cta}</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Diagnosis History */}
            {hasDiagnosis && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b bg-white pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">診斷紀錄</CardTitle>
                    <Link href="/dashboard/history" className="text-sm text-primary hover:underline">
                      查看全部 →
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="divide-y p-0">
                  {diagnosisHistory!.map((d) => (
                    <Link
                      key={d.id}
                      href={`/r/${d.short_id || d.id}`}
                      className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-stone-50 sm:px-6"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">
                          {d.solo_type === "lion" && "🦁"}
                          {d.solo_type === "fox" && "🦊"}
                          {d.solo_type === "elephant" && "🐘"}
                          {d.solo_type === "eagle" && "🦅"}
                          {d.solo_type === "turtle" && "🐢"}
                          {d.solo_type === "chick" && "🐣"}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-stone-900">
                            {d.solo_type === "lion" && "獅子型"}
                            {d.solo_type === "fox" && "狐狸型"}
                            {d.solo_type === "elephant" && "大象型"}
                            {d.solo_type === "eagle" && "老鷹型"}
                            {d.solo_type === "turtle" && "烏龜型"}
                            {d.solo_type === "chick" && "小雞型"}
                            {" Solo"}
                          </p>
                          <p className="text-xs text-stone-500">
                            {new Date(d.created_at).toLocaleDateString("zh-TW")}
                            {" · "}
                            {d.diagnosis_type === "quick" ? "快速" : "深度"}診斷
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-primary">{d.total_score}</span>
                        <span className="ml-0.5 text-xs text-stone-400">分</span>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Quick Actions + Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b bg-white pb-4">
                <CardTitle className="text-lg">快速操作</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 p-4 sm:p-5">
                <Link
                  href="/diagnose"
                  className="flex flex-col items-center gap-2 rounded-xl bg-stone-50 p-4 text-center transition-colors hover:bg-stone-100"
                >
                  <span className="text-2xl">📊</span>
                  <span className="text-xs font-medium text-stone-700">事業健檢</span>
                </Link>
                <Link
                  href="/dashboard/my-events"
                  className="flex flex-col items-center gap-2 rounded-xl bg-stone-50 p-4 text-center transition-colors hover:bg-stone-100"
                >
                  <span className="text-2xl">🎪</span>
                  <span className="text-xs font-medium text-stone-700">我的活動</span>
                </Link>
                <Link
                  href="/courses"
                  className="flex flex-col items-center gap-2 rounded-xl bg-stone-50 p-4 text-center transition-colors hover:bg-stone-100"
                >
                  <span className="text-2xl">🎓</span>
                  <span className="text-xs font-medium text-stone-700">課程中心</span>
                </Link>
                <Link
                  href="/tools"
                  className="flex flex-col items-center gap-2 rounded-xl bg-stone-50 p-4 text-center transition-colors hover:bg-stone-100"
                >
                  <span className="text-2xl">🛠️</span>
                  <span className="text-xs font-medium text-stone-700">工具箱</span>
                </Link>
                <Link
                  href="/dashboard/lead-magnets"
                  className="flex flex-col items-center gap-2 rounded-xl bg-stone-50 p-4 text-center transition-colors hover:bg-stone-100"
                >
                  <span className="text-2xl">🧲</span>
                  <span className="text-xs font-medium text-stone-700">名單磁鐵</span>
                </Link>
                <Link
                  href="/growth"
                  className="flex flex-col items-center gap-2 rounded-xl bg-stone-50 p-4 text-center transition-colors hover:bg-stone-100"
                >
                  <span className="text-2xl">🗺️</span>
                  <span className="text-xs font-medium text-stone-700">成長路徑</span>
                </Link>
              </CardContent>
            </Card>

            {/* My Registrations */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b bg-white pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">我的活動</CardTitle>
                  <Link href="/dashboard/events" className="text-sm text-primary hover:underline">
                    查看全部 →
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {registrations && registrations.length > 0 ? (
                  <div className="divide-y">
                    {registrations.map((reg: Record<string, unknown>) => {
                      const event = reg.events as Record<string, string> | null;
                      return (
                        <Link
                          key={reg.id as string}
                          href={event ? `/events/${event.slug}` : "#"}
                          className="block px-5 py-3 transition-colors hover:bg-stone-50"
                        >
                          <p className="text-sm font-medium text-stone-900 line-clamp-1">
                            {event?.title || "活動"}
                          </p>
                          <p className="mt-0.5 text-xs text-stone-500">
                            {event?.starts_at ? new Date(event.starts_at).toLocaleDateString("zh-TW") : ""}
                            <span className={`ml-2 inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium ${
                              reg.status === "confirmed"
                                ? "bg-green-50 text-green-700"
                                : reg.status === "waitlisted"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-stone-100 text-stone-500"
                            }`}>
                              {reg.status === "confirmed" ? "已報名" : reg.status === "waitlisted" ? "候補中" : "已取消"}
                            </span>
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-sm text-stone-500">還沒有報名任何活動</p>
                    <Button size="sm" variant="outline" asChild className="mt-3 h-8 text-xs">
                      <Link href="/events">瀏覽活動</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Membership Info */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-500">目前方案</p>
                    <p className="mt-0.5 text-base font-semibold text-stone-900">
                      {profile?.membership_tier === "premium" ? "Premium 事業家" : profile?.membership_tier === "pro" ? "Pro 實踐者" : "Explorer 探索者"}
                    </p>
                  </div>
                  {profile?.membership_tier === "free" && (
                    <Button size="sm" asChild className="h-8 text-xs">
                      <Link href="/pricing">升級方案</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
