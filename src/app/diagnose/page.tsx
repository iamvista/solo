"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { saveDiagnosisResult } from "@/lib/supabase/diagnosis";
import type { SoloType } from "@/lib/supabase/types";

// 快速診斷題目（7 題）
const quickQuestions = [
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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

export default function DiagnosePage() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "quiz" | "saving">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleAnswer = async (questionId: number, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestion < quickQuestions.length - 1) {
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
        diagnosisType: "quick",
      });

      if (result?.id) {
        router.push(`/r/${result.id}`);
      } else {
        // 如果儲存失敗，仍導向一個通用結果頁
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

    quickQuestions.forEach((q) => {
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

  const resetQuiz = () => {
    setStep("intro");
    setCurrentQuestion(0);
    setAnswers({});
  };

  // 介紹頁
  if (step === "intro") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Solo 事業健檢
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:mt-6 sm:text-xl">
            診斷你的自由事業競爭力，獲得專屬成長建議
          </p>
        </div>

        {/* 診斷類型選擇 */}
        <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2">
          {/* 快速診斷 */}
          <Card className="relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg cursor-pointer" onClick={() => setStep("quiz")}>
            <div className="absolute right-4 top-4">
              <Badge variant="secondary" className="text-sm">推薦新手</Badge>
            </div>
            <CardHeader className="p-5 sm:p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-3xl sm:h-16 sm:w-16 sm:text-4xl">
                ⚡
              </div>
              <CardTitle className="mt-4 text-xl sm:text-2xl">快速診斷</CardTitle>
              <CardDescription className="text-base sm:text-lg">
                3 分鐘完成，快速了解現況
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
              <ul className="space-y-3 text-base text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> 7 道精選題目
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> 5 維度競爭力分析
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Solo 類型診斷
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> 行動建議
                </li>
              </ul>
              <Button className="mt-6 h-12 w-full text-base" onClick={() => setStep("quiz")}>
                開始快速診斷
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
            </CardContent>
          </Card>

          {/* 深度診斷 */}
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-primary/5 transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="absolute right-4 top-4">
              <Badge className="text-sm">完整版</Badge>
            </div>
            <CardHeader className="p-5 sm:p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-3xl sm:h-16 sm:w-16 sm:text-4xl">
                🎯
              </div>
              <CardTitle className="mt-4 text-xl sm:text-2xl">深度診斷</CardTitle>
              <CardDescription className="text-base sm:text-lg">
                8-10 分鐘，全面剖析事業體質
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
              <ul className="space-y-3 text-base text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> 18 道專業題目
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> 更精準的維度分析
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> 個人化行動方案
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> 可追蹤歷次結果
                </li>
              </ul>
              <Button className="mt-6 h-12 w-full text-base" variant="default" asChild>
                <a href="/diagnose/full">
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
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 你將獲得 */}
        <Card className="mt-10 sm:mt-12">
          <CardHeader className="text-center p-5 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl">你將獲得</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 sm:h-16 sm:w-16">
                  <span className="text-3xl sm:text-4xl">📊</span>
                </div>
                <h3 className="text-base font-medium sm:text-lg">競爭力雷達圖</h3>
                <p className="mt-1 text-base text-muted-foreground">
                  5 大維度的視覺化分析
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 sm:h-16 sm:w-16">
                  <span className="text-3xl sm:text-4xl">🦁</span>
                </div>
                <h3 className="text-base font-medium sm:text-lg">Solo 類型診斷</h3>
                <p className="mt-1 text-base text-muted-foreground">
                  6 種類型，了解你的特質
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 sm:h-16 sm:w-16">
                  <span className="text-3xl sm:text-4xl">💡</span>
                </div>
                <h3 className="text-base font-medium sm:text-lg">行動建議</h3>
                <p className="mt-1 text-base text-muted-foreground">
                  下一步該怎麼做
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-base text-muted-foreground">
          完全免費，結果可分享，登入後可儲存紀錄
        </p>
      </div>
    );
  }

  // 測驗頁
  if (step === "quiz") {
    const question = quickQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / quickQuestions.length) * 100;

    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-base text-muted-foreground">
            <span>問題 {currentQuestion + 1} / {quickQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="mt-3 h-2.5" />
        </div>

        {/* Question */}
        <Card>
          <CardHeader className="p-5 sm:p-6">
            <Badge variant="outline" className="w-fit text-sm">
              {dimensions[question.dimension as DimensionKey].fullName}
            </Badge>
            <CardTitle className="mt-4 text-xl leading-relaxed sm:text-2xl">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className="flex w-full items-center rounded-lg border p-4 text-left transition-all hover:border-primary hover:bg-primary/5 sm:p-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-base font-medium sm:h-11 sm:w-11">
                    {option.value}
                  </span>
                  <span className="ml-4 text-base sm:text-lg">{option.label}</span>
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
              className="h-11 px-6 text-base"
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
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent sm:h-16 sm:w-16"></div>
          <p className="mt-6 text-xl font-medium sm:text-2xl">正在分析你的診斷結果...</p>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">馬上就好</p>
        </div>
      </div>
    );
  }

  return null;
}
