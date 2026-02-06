"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getDiagnosisById } from "@/lib/supabase/diagnosis";

// Solo 類型定義
const soloTypes = {
  lion: {
    emoji: "🦁",
    name: "獅子型 Solo",
    title: "市場領袖",
    description: "你已經是市場中的佼佼者！擁有清晰定位、穩定客源和多元收入。現階段可以考慮擴大影響力或培養團隊。",
    strengths: ["清晰的個人品牌", "穩定的客戶來源", "多元收入管道"],
    nextSteps: ["考慮建立團隊擴大規模", "開發高端產品或服務", "成為業界意見領袖"],
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  fox: {
    emoji: "🦊",
    name: "狐狸型 Solo",
    title: "策略高手",
    description: "你很聰明，懂得運用策略。部分面向已經很強，只需要補強弱項就能更上層樓。",
    strengths: ["靈活的商業思維", "善於發現機會", "快速適應市場"],
    nextSteps: ["強化弱項維度", "建立更系統化的流程", "培養長期客戶關係"],
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  elephant: {
    emoji: "🐘",
    name: "大象型 Solo",
    title: "穩健專家",
    description: "你有扎實的專業基礎，走得穩但可能走得慢。考慮加強行銷和定價策略來加速成長。",
    strengths: ["扎實的專業能力", "良好的服務品質", "穩定的交付能力"],
    nextSteps: ["學習行銷與個人品牌經營", "提升定價信心", "開發被動收入來源"],
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
  eagle: {
    emoji: "🦅",
    name: "老鷹型 Solo",
    title: "獨行俠",
    description: "你在某些面向特別突出，但整體發展不均衡。需要補強短板才能飛得更高更遠。",
    strengths: ["在特定領域表現出色", "有獨特的競爭優勢", "敢於嘗試新事物"],
    nextSteps: ["辨識並補強最弱的維度", "建立更完整的服務體系", "考慮與他人合作互補"],
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  turtle: {
    emoji: "🐢",
    name: "烏龜型 Solo",
    title: "蓄勢待發",
    description: "你正在累積實力，每個面向都有進步空間。建議先從定位開始，一步步建立基礎。",
    strengths: ["腳踏實地的態度", "願意學習成長", "有潛力等待發揮"],
    nextSteps: ["先確立清楚的市場定位", "找到你的理想客戶", "建立第一個成功案例"],
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  chick: {
    emoji: "🐣",
    name: "小雞型 Solo",
    title: "新手起步",
    description: "你剛開始這段旅程，一切都是新的。別擔心，我們會陪你一步步建立事業！",
    strengths: ["充滿熱情與動力", "沒有包袱可以大膽嘗試", "學習空間最大"],
    nextSteps: ["完成基礎課程了解全貌", "找到一個可以切入的利基市場", "完成第一個付費客戶"],
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
};

// 維度定義
const dimensions = {
  positioning: {
    name: "定位力",
    fullName: "市場定位",
    description: "清楚知道自己是誰、服務誰、解決什麼問題",
    lowAdvice: "花時間釐清你的目標客群和獨特價值",
    highAdvice: "持續強化你的個人品牌識別度",
  },
  delivery: {
    name: "交付力",
    fullName: "服務交付",
    description: "有效率地交付高品質的服務成果",
    lowAdvice: "建立標準化的服務流程和檢核清單",
    highAdvice: "考慮將流程產品化，提升可規模性",
  },
  trust: {
    name: "信任力",
    fullName: "客戶信任",
    description: "讓客戶信任你、推薦你、持續回購",
    lowAdvice: "累積作品集和客戶見證",
    highAdvice: "建立推薦機制，讓口碑為你帶來更多客戶",
  },
  monetization: {
    name: "變現力",
    fullName: "商業變現",
    description: "將專業轉化為穩定且可成長的收入",
    lowAdvice: "學習價值定價，提升報價信心",
    highAdvice: "開發多元收入來源，降低單一風險",
  },
  sustainability: {
    name: "永續力",
    fullName: "事業永續",
    description: "建立可長期經營的事業模式",
    lowAdvice: "規劃財務緩衝和被動收入",
    highAdvice: "思考如何在不增加時間投入下擴大收入",
  },
};

type DimensionKey = keyof typeof dimensions;
type SoloTypeKey = keyof typeof soloTypes;

interface DiagnosisResult {
  id: string;
  score_positioning: number;
  score_delivery: number;
  score_trust: number;
  score_monetization: number;
  score_sustainability: number;
  total_score: number;
  solo_type: SoloTypeKey;
  diagnosis_type: "quick" | "full";
  created_at: string;
}

export default function DiagnoseResultPage() {
  const params = useParams();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchResult() {
      if (!params.id) return;

      try {
        const data = await getDiagnosisById(params.id as string);
        if (data) {
          setResult(data as DiagnosisResult);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">載入診斷結果中...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="text-6xl">🔍</div>
        <h1 className="mt-4 text-2xl font-bold">找不到診斷結果</h1>
        <p className="mt-2 text-muted-foreground">
          這個診斷結果可能不存在或已被刪除
        </p>
        <Button asChild className="mt-6">
          <Link href="/diagnose">重新診斷</Link>
        </Button>
      </div>
    );
  }

  const soloType = soloTypes[result.solo_type];
  const dimensionScores: Record<DimensionKey, number> = {
    positioning: result.score_positioning,
    delivery: result.score_delivery,
    trust: result.score_trust,
    monetization: result.score_monetization,
    sustainability: result.score_sustainability,
  };

  // 找出最強和最弱的維度
  const sortedDimensions = (Object.entries(dimensionScores) as [DimensionKey, number][])
    .sort((a, b) => b[1] - a[1]);
  const strongest = sortedDimensions[0];
  const weakest = sortedDimensions[sortedDimensions.length - 1];

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `我在 Solo 自由人學院完成了事業診斷，我是「${soloType.name}」！總分 ${result.total_score} 分。來測測你是哪種類型？`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("連結已複製！");
    } catch {
      alert("複製失敗，請手動複製網址");
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      threads: `https://threads.net/intent/post?text=${encodedText}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Solo Type Card */}
      <Card className={`${soloType.bgColor} ${soloType.borderColor} border-2`}>
        <CardHeader className="text-center">
          <Badge variant={result.diagnosis_type === "full" ? "default" : "secondary"} className="mx-auto mb-4">
            {result.diagnosis_type === "full" ? "🎯 深度診斷" : "⚡ 快速診斷"}
          </Badge>
          <div className="text-7xl">{soloType.emoji}</div>
          <CardTitle className={`mt-4 text-3xl ${soloType.color}`}>
            {soloType.name}
          </CardTitle>
          <CardDescription className="text-xl font-medium text-foreground">
            {soloType.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg text-muted-foreground">{soloType.description}</p>
          <div className="mt-6 inline-flex items-center rounded-full bg-white px-6 py-3 shadow-sm">
            <span className="text-muted-foreground">總分：</span>
            <span className="ml-2 text-3xl font-bold text-primary">{result.total_score}</span>
            <span className="text-muted-foreground">/100</span>
          </div>
        </CardContent>
      </Card>

      {/* Dimension Scores with Radar-like visualization */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>五維競爭力分析</CardTitle>
          <CardDescription>
            每個維度滿分 100 分，了解你的強項與需要加強的地方
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {(Object.keys(dimensions) as DimensionKey[]).map((key) => {
              const score = dimensionScores[key];
              const isStrong = key === strongest[0];
              const isWeak = key === weakest[0];

              return (
                <div key={key} className={`rounded-lg p-4 ${isStrong ? "bg-green-50" : isWeak ? "bg-red-50" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{dimensions[key].fullName}</span>
                      {isStrong && <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">最強</span>}
                      {isWeak && <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">需加強</span>}
                    </div>
                    <span className="text-xl font-bold">{score}</span>
                  </div>
                  <Progress value={score} className="mt-2" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {score >= 70 ? dimensions[key].highAdvice : dimensions[key].lowAdvice}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Next Steps */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💪</span> 你的優勢
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {soloType.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 text-green-500">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎯</span> 下一步行動
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {soloType.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card className="mt-8 bg-primary text-primary-foreground">
        <CardContent className="pt-6">
          <div className="text-center">
            {result.diagnosis_type === "quick" ? (
              <>
                <h3 className="text-xl font-bold">想要更深入的診斷？</h3>
                <p className="mt-2 text-primary-foreground/80">
                  深度診斷包含 18 道專業題目，每個維度 3-4 題，結果更精準
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/diagnose/full">開始深度診斷</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    asChild
                    className="border border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  >
                    <Link href="/diagnose">重新快速診斷</Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold">🎉 你完成了深度診斷！</h3>
                <p className="mt-2 text-primary-foreground/80">
                  建議定期（每季）重新診斷，追蹤你的事業成長軌跡
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/dashboard">查看診斷紀錄</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    asChild
                    className="border border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  >
                    <Link href="/diagnose/full">再次深度診斷</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Share */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">分享你的結果</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => handleShare("facebook")}>
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
            Facebook
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleShare("x")}>
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleShare("threads")}>
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.058-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.041 0 2.67.01 2.986.058 4.04.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058 2.67 0 2.987-.01 4.04-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041 0-2.67-.01-2.986-.058-4.04-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.048-1.37-.058-4.041-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 1.802a3.333 3.333 0 1 0 0 6.666 3.333 3.333 0 0 0 0-6.666zm5.338-3.205a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/>
            </svg>
            Threads
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleShare("linkedin")}>
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            複製連結
          </Button>
        </div>
      </div>

      {/* Timestamp */}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        診斷時間：{new Date(result.created_at).toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
