"use client";

import { useState, useEffect } from "react";
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

// Solo 類型定義
const soloTypes = {
  lion: {
    emoji: "🦁",
    name: "獅子型 Solo",
    title: "市場領袖",
    description: "你已經是市場中的佼佼者！擁有清晰定位、穩定客源和多元收入。現階段可以考慮擴大影響力或培養團隊。",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  fox: {
    emoji: "🦊",
    name: "狐狸型 Solo",
    title: "策略高手",
    description: "你很聰明，懂得運用策略。部分面向已經很強，只需要補強弱項就能更上層樓。",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  elephant: {
    emoji: "🐘",
    name: "大象型 Solo",
    title: "穩健專家",
    description: "你有扎實的專業基礎，走得穩但可能走得慢。考慮加強行銷和定價策略來加速成長。",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
  eagle: {
    emoji: "🦅",
    name: "老鷹型 Solo",
    title: "獨行俠",
    description: "你在某些面向特別突出，但整體發展不均衡。需要補強短板才能飛得更高更遠。",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  turtle: {
    emoji: "🐢",
    name: "烏龜型 Solo",
    title: "蓄勢待發",
    description: "你正在累積實力，每個面向都有進步空間。建議先從定位開始，一步步建立基礎。",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  chick: {
    emoji: "🐣",
    name: "小雞型 Solo",
    title: "新手起步",
    description: "你剛開始這段旅程，一切都是新的。別擔心，我們會陪你一步步建立事業！",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
};

// 維度定義
const dimensions = {
  positioning: { name: "定位力", fullName: "市場定位" },
  delivery: { name: "交付力", fullName: "服務交付" },
  trust: { name: "信任力", fullName: "客戶信任" },
  monetization: { name: "變現力", fullName: "商業變現" },
  sustainability: { name: "永續力", fullName: "事業永續" },
};

type DimensionKey = keyof typeof dimensions;
type SoloTypeKey = keyof typeof soloTypes;

export default function DiagnosePage() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    if (currentQuestion < quickQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setStep("result");
    }
  };

  const calculateScores = () => {
    const dimensionScores: Record<DimensionKey, { total: number; count: number }> = {
      positioning: { total: 0, count: 0 },
      delivery: { total: 0, count: 0 },
      trust: { total: 0, count: 0 },
      monetization: { total: 0, count: 0 },
      sustainability: { total: 0, count: 0 },
    };

    quickQuestions.forEach((q) => {
      if (answers[q.id]) {
        dimensionScores[q.dimension as DimensionKey].total += answers[q.id];
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
        scores[dim] = 50; // 預設分數
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
    setSaved(false);
  };

  // 當進入結果頁時，自動儲存結果
  useEffect(() => {
    if (step === "result" && !saved && !isSaving) {
      const saveResult = async () => {
        setIsSaving(true);
        try {
          const { dimensionScores, avgScore } = calculateScores();
          const soloTypeKey = getSoloType(avgScore);

          await saveDiagnosisResult({
            scores: {
              positioning: dimensionScores.positioning,
              delivery: dimensionScores.delivery,
              trust: dimensionScores.trust,
              monetization: dimensionScores.monetization,
              sustainability: dimensionScores.sustainability,
            },
            totalScore: avgScore,
            soloType: soloTypeKey as SoloType,
            answers,
            diagnosisType: "quick",
          });

          setSaved(true);
          console.log("診斷結果已儲存！");
        } catch (error) {
          console.error("儲存失敗:", error);
        } finally {
          setIsSaving(false);
        }
      };

      saveResult();
    }
  }, [step, saved, isSaving, answers]);

  // 介紹頁
  if (step === "intro") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            ⏱️ 只需 3 分鐘
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Solo 事業健檢
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            7 道題目，快速診斷你的自由事業競爭力
          </p>
        </div>

        <Card className="mt-12">
          <CardHeader className="text-center">
            <CardTitle>你將獲得</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-medium">競爭力雷達圖</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  5 大維度的視覺化分析
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-medium">Solo 類型診斷</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  了解你屬於哪種類型
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="font-medium">行動建議</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  下一步該怎麼做
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 text-center">
          <Button size="lg" onClick={() => setStep("quiz")}>
            開始診斷
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
            完全免費，無需登入
          </p>
        </div>
      </div>
    );
  }

  // 測驗頁
  if (step === "quiz") {
    const question = quickQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / quickQuestions.length) * 100;

    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>問題 {currentQuestion + 1} / {quickQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>

        {/* Question */}
        <Card>
          <CardHeader>
            <Badge variant="outline" className="w-fit">
              {dimensions[question.dimension as DimensionKey].fullName}
            </Badge>
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

  // 結果頁
  if (step === "result") {
    const { dimensionScores, avgScore } = calculateScores();
    const soloTypeKey = getSoloType(avgScore);
    const soloType = soloTypes[soloTypeKey];

    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* 儲存狀態提示 */}
        {isSaving && (
          <div className="mb-4 text-center text-sm text-muted-foreground">
            正在儲存結果...
          </div>
        )}

        {/* Solo Type Card */}
        <Card className={`${soloType.bgColor} border-2`}>
          <CardHeader className="text-center">
            <div className="text-6xl">{soloType.emoji}</div>
            <CardTitle className={`mt-4 text-2xl ${soloType.color}`}>
              {soloType.name}
            </CardTitle>
            <CardDescription className="text-lg font-medium">
              {soloType.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">{soloType.description}</p>
            <div className="mt-6 inline-flex items-center rounded-full bg-white px-4 py-2 shadow-sm">
              <span className="text-sm text-muted-foreground">總分：</span>
              <span className="ml-2 text-2xl font-bold text-primary">{avgScore}</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </CardContent>
        </Card>

        {/* Dimension Scores */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>五維競爭力分析</CardTitle>
            <CardDescription>
              每個維度滿分 100 分，了解你的強項與需要加強的地方
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {(Object.keys(dimensions) as DimensionKey[]).map((key) => (
                <div key={key}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dimensions[key].fullName}</span>
                    <span className="text-lg font-bold">{dimensionScores[key]}</span>
                  </div>
                  <Progress value={dimensionScores[key]} className="mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="mt-8 bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-bold">想要更深入的診斷？</h3>
              <p className="mt-2 text-primary-foreground/80">
                完整版診斷包含 28 道專業題目，產出更詳細的報告與建議
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button variant="secondary" size="lg">
                  免費完整診斷
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={resetQuiz}
                  className="border border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  重新測驗
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">分享你的結果</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Facebook
            </Button>
            <Button variant="outline" size="sm">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X
            </Button>
            <Button variant="outline" size="sm">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.058-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.041 0 2.67.01 2.986.058 4.04.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058 2.67 0 2.987-.01 4.04-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041 0-2.67-.01-2.986-.058-4.04-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.048-1.37-.058-4.041-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 1.802a3.333 3.333 0 1 0 0 6.666 3.333 3.333 0 0 0 0-6.666zm5.338-3.205a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/>
              </svg>
              Threads
            </Button>
            <Button variant="outline" size="sm">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </Button>
            <Button variant="outline" size="sm">
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              複製連結
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
