"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { saveDiagnosisResult } from "@/lib/supabase/diagnosis";
import type { SoloType } from "@/lib/supabase/types";

// 深度診斷題目（18 題，每個維度 3-4 題）
const fullQuestions = [
  // ===== 定位力 (Positioning) - 4 題 =====
  {
    id: 1,
    dimension: "positioning",
    question: "你能在 30 秒內清楚說明自己的專業價值嗎？",
    options: [
      { value: 5, label: "非常清楚，客戶一聽就懂" },
      { value: 4, label: "大致可以，但偶爾會卡詞" },
      { value: 3, label: "有時候能說清楚" },
      { value: 2, label: "常常解釋很久" },
      { value: 1, label: "我自己也不太確定" },
    ],
  },
  {
    id: 2,
    dimension: "positioning",
    question: "你的目標客戶輪廓有多清晰？",
    options: [
      { value: 5, label: "非常清楚，可以描述他們的特徵和痛點" },
      { value: 4, label: "大致知道是哪類人" },
      { value: 3, label: "有想過但不太確定" },
      { value: 2, label: "來者不拒" },
      { value: 1, label: "沒想過這個問題" },
    ],
  },
  {
    id: 3,
    dimension: "positioning",
    question: "客戶選擇你而不是競爭對手的主要原因是？",
    options: [
      { value: 5, label: "我有獨特的優勢和差異化定位" },
      { value: 4, label: "我的專業能力較強" },
      { value: 3, label: "價格或時機剛好" },
      { value: 2, label: "主要靠關係或推薦" },
      { value: 1, label: "不太清楚" },
    ],
  },
  {
    id: 4,
    dimension: "positioning",
    question: "你有沒有明確拒絕過不適合的客戶？",
    options: [
      { value: 5, label: "經常，我清楚知道哪些客戶不適合我" },
      { value: 4, label: "偶爾會拒絕" },
      { value: 3, label: "很少，但會考慮" },
      { value: 2, label: "幾乎不會拒絕" },
      { value: 1, label: "能接的都接" },
    ],
  },

  // ===== 交付力 (Delivery) - 4 題 =====
  {
    id: 5,
    dimension: "delivery",
    question: "你的服務交付流程有多標準化？",
    options: [
      { value: 5, label: "有完整 SOP，可複製" },
      { value: 4, label: "有大致流程，但每次會調整" },
      { value: 3, label: "看情況決定怎麼做" },
      { value: 2, label: "每次都重新想" },
      { value: 1, label: "完全沒有固定流程" },
    ],
  },
  {
    id: 6,
    dimension: "delivery",
    question: "客戶對你的交付品質評價如何？",
    options: [
      { value: 5, label: "經常超出預期，收到很多讚美" },
      { value: 4, label: "大多滿意，偶爾需要調整" },
      { value: 3, label: "符合預期" },
      { value: 2, label: "有時會收到抱怨" },
      { value: 1, label: "經常需要重做或退款" },
    ],
  },
  {
    id: 7,
    dimension: "delivery",
    question: "你能同時處理多少個專案而不影響品質？",
    options: [
      { value: 5, label: "有系統管理，可同時處理 5 個以上" },
      { value: 4, label: "可以處理 3-4 個" },
      { value: 3, label: "2-3 個勉強可以" },
      { value: 2, label: "一次只能專注 1 個" },
      { value: 1, label: "經常手忙腳亂" },
    ],
  },
  {
    id: 8,
    dimension: "delivery",
    question: "你有沒有可重複使用的模板、工具或資源？",
    options: [
      { value: 5, label: "有完整的工具箱，大幅提升效率" },
      { value: 4, label: "有一些模板和工具" },
      { value: 3, label: "部分有，部分每次重做" },
      { value: 2, label: "很少，大部分重新來" },
      { value: 1, label: "每次都從零開始" },
    ],
  },

  // ===== 信任力 (Trust) - 3 題 =====
  {
    id: 9,
    dimension: "trust",
    question: "過去 3 個月，你的客戶來源主要是？",
    options: [
      { value: 5, label: "超過 50% 是舊客推薦" },
      { value: 4, label: "舊客推薦約 30-50%" },
      { value: 3, label: "推薦和自己開發各半" },
      { value: 2, label: "大部分靠自己開發" },
      { value: 1, label: "很少有客戶或主要靠平臺" },
    ],
  },
  {
    id: 10,
    dimension: "trust",
    question: "你有多少個持續合作超過 1 年的客戶？",
    options: [
      { value: 5, label: "5 個以上" },
      { value: 4, label: "3-4 個" },
      { value: 3, label: "1-2 個" },
      { value: 2, label: "沒有，但有回頭客" },
      { value: 1, label: "幾乎都是一次性合作" },
    ],
  },
  {
    id: 11,
    dimension: "trust",
    question: "你有公開的作品集或客戶見證嗎？",
    options: [
      { value: 5, label: "有專業網站，作品集和見證都很豐富" },
      { value: 4, label: "有整理過，但不夠完整" },
      { value: 3, label: "有一些，但沒系統整理" },
      { value: 2, label: "很少，零星幾個" },
      { value: 1, label: "完全沒有" },
    ],
  },

  // ===== 變現力 (Monetization) - 4 題 =====
  {
    id: 12,
    dimension: "monetization",
    question: "你的定價策略是？",
    options: [
      { value: 5, label: "有明確價值定價，客戶願意付" },
      { value: 4, label: "有訂價但常被議價" },
      { value: 3, label: "看客戶預算來報價" },
      { value: 2, label: "常常不知道怎麼定價" },
      { value: 1, label: "通常接受客戶出的價" },
    ],
  },
  {
    id: 13,
    dimension: "monetization",
    question: "你有多少不同的收入來源？",
    options: [
      { value: 5, label: "3 種以上（如諮詢、課程、產品等）" },
      { value: 4, label: "2-3 種" },
      { value: 3, label: "1-2 種" },
      { value: 2, label: "只有 1 種" },
      { value: 1, label: "收入非常不穩定" },
    ],
  },
  {
    id: 14,
    dimension: "monetization",
    question: "過去一年，你的單價有提升嗎？",
    options: [
      { value: 5, label: "提升超過 30%" },
      { value: 4, label: "提升 10-30%" },
      { value: 3, label: "小幅提升或維持" },
      { value: 2, label: "沒變化" },
      { value: 1, label: "反而降價了" },
    ],
  },
  {
    id: 15,
    dimension: "monetization",
    question: "你有可擴展的收入模式嗎（如課程、產品、被動收入）？",
    options: [
      { value: 5, label: "有穩定的被動收入來源" },
      { value: 4, label: "有一些，但還在發展" },
      { value: 3, label: "正在規劃" },
      { value: 2, label: "想過但沒行動" },
      { value: 1, label: "完全依賴時間換錢" },
    ],
  },

  // ===== 永續力 (Sustainability) - 3 題 =====
  {
    id: 16,
    dimension: "sustainability",
    question: "如果你今天完全停止接案，收入可以維持多久？",
    options: [
      { value: 5, label: "有被動收入或儲備可維持 6 個月以上" },
      { value: 4, label: "可維持 3-6 個月" },
      { value: 3, label: "可維持 1-3 個月" },
      { value: 2, label: "最多 1 個月" },
      { value: 1, label: "馬上就有問題" },
    ],
  },
  {
    id: 17,
    dimension: "sustainability",
    question: "你的工作與生活平衡如何？",
    options: [
      { value: 5, label: "很好，有充足的休息和自我時間" },
      { value: 4, label: "還不錯，偶爾會忙" },
      { value: 3, label: "普通，工作量起伏大" },
      { value: 2, label: "經常加班或壓力大" },
      { value: 1, label: "完全失衡，身心俱疲" },
    ],
  },
  {
    id: 18,
    dimension: "sustainability",
    question: "你對未來 3 年的事業發展有清晰的規劃嗎？",
    options: [
      { value: 5, label: "有詳細的目標和執行計畫" },
      { value: 4, label: "有大致方向和階段性目標" },
      { value: 3, label: "有想過但不夠具體" },
      { value: 2, label: "走一步算一步" },
      { value: 1, label: "完全沒有規劃" },
    ],
  },
];

// 維度定義
const dimensions = {
  positioning: { name: "定位力", fullName: "市場定位" },
  delivery: { name: "交付力", fullName: "服務交付" },
  trust: { name: "信任力", fullName: "客戶信任" },
  monetization: { name: "變現力", fullName: "商業變現" },
  sustainability: { name: "永續力", fullName: "事業永續" },
};

type DimensionKey = keyof typeof dimensions;
type SoloTypeKey = "lion" | "fox" | "elephant" | "eagle" | "turtle" | "chick";

export default function FullDiagnosePage() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "quiz" | "saving">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleAnswer = async (questionId: number, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestion < fullQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // 最後一題，計算並儲存結果
      setStep("saving");
      await saveAndRedirect(newAnswers);
    }
  };

  const saveAndRedirect = async (finalAnswers: Record<number, number>) => {
    try {
      const { dimensionScores, avgScore } = calculateScoresFromAnswers(finalAnswers);
      const soloTypeKey = getSoloType(avgScore);

      const result = await saveDiagnosisResult({
        scores: {
          positioning: dimensionScores.positioning,
          delivery: dimensionScores.delivery,
          trust: dimensionScores.trust,
          monetization: dimensionScores.monetization,
          sustainability: dimensionScores.sustainability,
        },
        totalScore: avgScore,
        soloType: soloTypeKey as SoloType,
        answers: finalAnswers,
        diagnosisType: "full",
      });

      if (result?.id) {
        router.push(`/r/${result.id}`);
      } else {
        console.error("儲存失敗，無法取得 ID");
        router.push(`/diagnose`);
      }
    } catch (error) {
      console.error("儲存失敗:", error);
      router.push(`/diagnose`);
    }
  };

  const calculateScoresFromAnswers = (ans: Record<number, number>) => {
    const dimensionScores: Record<DimensionKey, { total: number; count: number }> = {
      positioning: { total: 0, count: 0 },
      delivery: { total: 0, count: 0 },
      trust: { total: 0, count: 0 },
      monetization: { total: 0, count: 0 },
      sustainability: { total: 0, count: 0 },
    };

    fullQuestions.forEach((q) => {
      if (ans[q.id]) {
        dimensionScores[q.dimension as DimensionKey].total += ans[q.id];
        dimensionScores[q.dimension as DimensionKey].count += 1;
      }
    });

    const scores: Record<DimensionKey, number> = {} as Record<DimensionKey, number>;
    let totalScore = 0;
    let totalCount = 0;

    Object.keys(dimensionScores).forEach((key) => {
      const dim = key as DimensionKey;
      if (dimensionScores[dim].count > 0) {
        scores[dim] = Math.round((dimensionScores[dim].total / dimensionScores[dim].count) * 20);
        totalScore += scores[dim];
        totalCount += 1;
      } else {
        scores[dim] = 50;
      }
    });

    const avgScore = totalCount > 0 ? Math.round(totalScore / totalCount) : 50;

    return { dimensionScores: scores, avgScore };
  };

  const getSoloType = (avgScore: number): SoloTypeKey => {
    if (avgScore >= 85) return "lion";
    if (avgScore >= 70) return "fox";
    if (avgScore >= 55) return "elephant";
    if (avgScore >= 40) return "eagle";
    if (avgScore >= 25) return "turtle";
    return "chick";
  };

  // 介紹頁
  if (step === "intro") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            ⏱️ 約需 8-10 分鐘
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            深度事業診斷
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            18 道專業題目，全面剖析你的自由事業競爭力
          </p>
        </div>

        <Card className="mt-12">
          <CardHeader className="text-center">
            <CardTitle>深度診斷的獨特價值</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-medium">更精準分析</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  每個維度 3-4 題，結果更準確
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-medium">完整雷達圖</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  5 維度視覺化競爭力分析
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="font-medium">專屬建議</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  根據結果給予個人化行動方案
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl">🔄</span>
                </div>
                <h3 className="font-medium">追蹤進步</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  登入後可儲存並比較歷次結果
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 題目範圍說明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">題目涵蓋 5 大維度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-5">
              {(Object.keys(dimensions) as DimensionKey[]).map((key) => (
                <div key={key} className="text-center">
                  <div className="rounded-lg bg-muted p-3">
                    <span className="text-sm font-medium">{dimensions[key].fullName}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 text-center">
          <Button size="lg" onClick={() => setStep("quiz")}>
            開始深度診斷
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            完全免費，結果可分享
          </p>
          <div className="mt-4">
            <Link href="/diagnose" className="text-sm text-muted-foreground hover:text-primary">
              ← 我想先做快速診斷（3 分鐘）
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 測驗頁
  if (step === "quiz") {
    const question = fullQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / fullQuestions.length) * 100;

    // 計算當前維度的題數
    const currentDimension = question.dimension as DimensionKey;
    const dimensionQuestions = fullQuestions.filter(q => q.dimension === currentDimension);
    const currentDimensionIndex = dimensionQuestions.findIndex(q => q.id === question.id) + 1;

    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>問題 {currentQuestion + 1} / {fullQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>

        {/* Question */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {dimensions[currentDimension].fullName}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {currentDimensionIndex} / {dimensionQuestions.length}
              </span>
            </div>
            <CardTitle className="mt-4 text-xl leading-relaxed">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className="flex w-full items-center rounded-lg border p-4 text-left transition-all hover:border-primary hover:bg-primary/5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium">
                    {option.value}
                  </span>
                  <span className="ml-4">{option.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Back button */}
        {currentQuestion > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
            >
              ← 上一題
            </Button>
          </div>
        )}
      </div>
    );
  }

  // 儲存中畫面
  if (step === "saving") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-6 text-lg font-medium">正在深度分析你的診斷結果...</p>
          <p className="mt-2 text-muted-foreground">結合 18 題回答，產出完整報告</p>
        </div>
      </div>
    );
  }

  return null;
}
