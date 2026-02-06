import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DiagnosisHistoryClient from "./DiagnosisHistoryClient";

export default async function DiagnosisHistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/history");
  }

  // 取得所有診斷歷史（不包含已刪除的）
  const { data: diagnosisHistory } = await supabase
    .from("diagnosis_results")
    .select("*")
    .eq("user_id", user.id)
    .or("is_deleted.is.null,is_deleted.eq.false")
    .order("created_at", { ascending: false });

  // 計算成長趨勢（比較最近兩次診斷）
  const latestDiagnosis = diagnosisHistory?.[0] || null;
  const previousDiagnosis = diagnosisHistory?.[1] || null;

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

      <DiagnosisHistoryClient
        diagnosisHistory={diagnosisHistory || []}
        growthData={growthData}
        latestDiagnosis={latestDiagnosis}
        previousDiagnosis={previousDiagnosis}
      />
    </div>
  );
}
