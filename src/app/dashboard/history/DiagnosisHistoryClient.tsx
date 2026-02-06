"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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

interface DiagnosisResult {
  id: string;
  short_id: string;
  created_at: string;
  diagnosis_type: string;
  total_score: number;
  solo_type: string;
  score_positioning: number;
  score_delivery: number;
  score_trust: number;
  score_monetization: number;
  score_sustainability: number;
}

interface GrowthData {
  total: { diff: number; percentage: number };
  positioning: { diff: number; percentage: number };
  delivery: { diff: number; percentage: number };
  trust: { diff: number; percentage: number };
  monetization: { diff: number; percentage: number };
  sustainability: { diff: number; percentage: number };
}

interface Props {
  diagnosisHistory: DiagnosisResult[];
  growthData: GrowthData | null;
  latestDiagnosis: DiagnosisResult | null;
  previousDiagnosis: DiagnosisResult | null;
}

export default function DiagnosisHistoryClient({
  diagnosisHistory,
  growthData,
  latestDiagnosis,
  previousDiagnosis,
}: Props) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(diagnosisHistory.map((d) => d.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0) return;

    if (!confirm(`確定要刪除 ${selectedIds.size} 筆診斷紀錄嗎？此操作無法復原。`)) {
      return;
    }

    setIsDeleting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/diagnosis/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnosisIds: Array.from(selectedIds) }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        setSelectedIds(new Set());
        // 刷新頁面以獲取最新數據
        router.refresh();
      } else {
        setMessage({ type: "error", text: data.error || "刪除失敗" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "刪除失敗，請稍後再試" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportPDF = (diagnosisId: string) => {
    // 開啟新視窗顯示 PDF 格式的報告
    window.open(`/api/diagnosis/pdf?id=${diagnosisId}`, "_blank");
  };

  if (diagnosisHistory.length === 0) {
    return (
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
    );
  }

  return (
    <>
      {message && (
        <div
          className={`mb-6 rounded-lg p-4 text-base ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 成長趨勢總覽 */}
      {growthData && latestDiagnosis && previousDiagnosis && (
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader className="p-5 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <span className="text-2xl">📈</span> 成長趨勢
            </CardTitle>
            <CardDescription className="text-base">
              與上次診斷（{new Date(previousDiagnosis.created_at).toLocaleDateString("zh-TW")}）相比
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {/* 總分 */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">總分</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{latestDiagnosis.total_score}</span>
                  <span className={`text-sm font-medium ${growthData.total.diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {growthData.total.diff >= 0 ? "+" : ""}{growthData.total.diff}
                  </span>
                </div>
              </div>
              {/* 定位力 */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">定位力</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{latestDiagnosis.score_positioning}</span>
                  <span className={`text-sm font-medium ${growthData.positioning.diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {growthData.positioning.diff >= 0 ? "+" : ""}{growthData.positioning.diff}
                  </span>
                </div>
              </div>
              {/* 交付力 */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">交付力</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{latestDiagnosis.score_delivery}</span>
                  <span className={`text-sm font-medium ${growthData.delivery.diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {growthData.delivery.diff >= 0 ? "+" : ""}{growthData.delivery.diff}
                  </span>
                </div>
              </div>
              {/* 信任力 */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">信任力</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{latestDiagnosis.score_trust}</span>
                  <span className={`text-sm font-medium ${growthData.trust.diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {growthData.trust.diff >= 0 ? "+" : ""}{growthData.trust.diff}
                  </span>
                </div>
              </div>
              {/* 變現力 */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">變現力</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{latestDiagnosis.score_monetization}</span>
                  <span className={`text-sm font-medium ${growthData.monetization.diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {growthData.monetization.diff >= 0 ? "+" : ""}{growthData.monetization.diff}
                  </span>
                </div>
              </div>
              {/* 永續力 */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">永續力</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{latestDiagnosis.score_sustainability}</span>
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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 text-sm"
                  onClick={() => handleExportPDF(latestDiagnosis.short_id || latestDiagnosis.id)}
                >
                  📄 匯出 PDF
                </Button>
                <Button variant="outline" size="sm" asChild className="h-9 px-3 text-sm">
                  <Link href={`/r/${latestDiagnosis.short_id || latestDiagnosis.id}`}>
                    查看完整結果 →
                  </Link>
                </Button>
              </div>
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl sm:text-2xl">所有診斷紀錄</CardTitle>
              <CardDescription className="text-base">
                共 {diagnosisHistory.length} 次診斷
              </CardDescription>
            </div>
            {selectedIds.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-10 px-4"
              >
                {isDeleting ? "刪除中..." : `刪除選取 (${selectedIds.size})`}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          {/* 全選 */}
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <Checkbox
              id="select-all"
              checked={selectedIds.size === diagnosisHistory.length && diagnosisHistory.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
              全選
            </label>
          </div>

          <div className="space-y-4">
            {diagnosisHistory.map((diagnosis, index) => (
              <div
                key={diagnosis.id}
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 sm:p-5"
              >
                {/* 勾選框 */}
                <Checkbox
                  checked={selectedIds.has(diagnosis.id)}
                  onCheckedChange={(checked) => handleSelect(diagnosis.id, checked as boolean)}
                  onClick={(e) => e.stopPropagation()}
                />

                {/* 主要內容 - 可點擊 */}
                <Link
                  href={`/r/${diagnosis.short_id || diagnosis.id}`}
                  className="flex flex-1 items-center justify-between"
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

                {/* PDF 匯出按鈕 */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 text-sm hidden sm:flex"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportPDF(diagnosis.short_id || diagnosis.id);
                  }}
                >
                  📄
                </Button>
              </div>
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
  );
}
