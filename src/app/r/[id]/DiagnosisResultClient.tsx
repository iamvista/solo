"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
  short_id?: string;
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

interface DiagnosisResultClientProps {
  initialData: DiagnosisResult | null;
  resultId: string;
}

export function DiagnosisResultClient({ initialData, resultId }: DiagnosisResultClientProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!initialData) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-20">
        <div className="text-6xl sm:text-7xl">🔍</div>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">找不到診斷結果</h1>
        <p className="mt-2 text-base text-muted-foreground sm:text-lg">
          這個診斷結果可能不存在或已被刪除
        </p>
        <Button asChild className="mt-6 h-11 px-6 text-base">
          <Link href="/diagnose">重新診斷</Link>
        </Button>
      </div>
    );
  }

  const result = initialData;
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

  // 使用固定的 URL 格式，確保社群分享有正確的 OG tags
  const shareUrl = `https://solo.tw/r/${result.short_id || resultId}`;
  const shareText = `${soloType.emoji} 我在 Solo 自由人學院完成了事業健檢，我是「${soloType.name}」！總分 ${result.total_score} 分。快來測測你是哪種類型？`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      alert("複製失敗，請手動複製網址");
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    const urls: Record<string, string> = {
      // Facebook 只需要 URL，會自動抓取 OG tags
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      // X (Twitter) 需要文字和 URL
      x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      // LinkedIn 只需要 URL
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      // Threads 需要文字和 URL
      threads: `https://threads.net/intent/post?text=${encodedText}%20${encodedUrl}`,
      // LINE
      line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=500,noopener,noreferrer");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* Solo Type Card */}
      <Card className={`${soloType.bgColor} ${soloType.borderColor} border-2`}>
        <CardHeader className="p-5 text-center sm:p-6">
          <Badge variant={result.diagnosis_type === "full" ? "default" : "secondary"} className="mx-auto mb-4 text-sm">
            {result.diagnosis_type === "full" ? "🎯 深度診斷" : "⚡ 快速診斷"}
          </Badge>
          <div className="text-7xl sm:text-8xl">{soloType.emoji}</div>
          <CardTitle className={`mt-4 text-2xl sm:text-3xl ${soloType.color}`}>
            {soloType.name}
          </CardTitle>
          <CardDescription className="text-lg font-medium text-foreground sm:text-xl">
            {soloType.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 text-center sm:p-6 sm:pt-0">
          <p className="text-base text-muted-foreground sm:text-lg">{soloType.description}</p>
          <div className="mt-6 inline-flex items-center rounded-full bg-white px-6 py-3 shadow-sm sm:px-8 sm:py-4">
            <span className="text-base text-muted-foreground sm:text-lg">總分：</span>
            <span className="ml-2 text-3xl font-bold text-primary sm:text-4xl">{result.total_score}</span>
            <span className="text-base text-muted-foreground sm:text-lg">/100</span>
          </div>
        </CardContent>
      </Card>

      {/* Dimension Scores */}
      <Card className="mt-8">
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">五維競爭力分析</CardTitle>
          <CardDescription className="text-base">
            每個維度滿分 100 分，了解你的強項與需要加強的地方
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          <div className="space-y-5 sm:space-y-6">
            {(Object.keys(dimensions) as DimensionKey[]).map((key) => {
              const score = dimensionScores[key];
              const isStrong = key === strongest[0];
              const isWeak = key === weakest[0];

              return (
                <div key={key} className={`rounded-lg p-4 ${isStrong ? "bg-green-50" : isWeak ? "bg-red-50" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-medium sm:text-lg">{dimensions[key].fullName}</span>
                      {isStrong && <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">最強</span>}
                      {isWeak && <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">需加強</span>}
                    </div>
                    <span className="text-xl font-bold sm:text-2xl">{score}</span>
                  </div>
                  <Progress value={score} className="mt-2 h-2.5" />
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
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
          <CardHeader className="p-5 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <span className="text-2xl sm:text-3xl">💪</span> 你的優勢
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            <ul className="space-y-3">
              {soloType.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-2 text-base">
                  <span className="mt-0.5 text-green-500">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-5 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <span className="text-2xl sm:text-3xl">🎯</span> 下一步行動
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            <ul className="space-y-3">
              {soloType.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-base">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
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
        <CardContent className="p-6 sm:p-8">
          <div className="text-center">
            {result.diagnosis_type === "quick" ? (
              <>
                <h3 className="text-xl font-bold sm:text-2xl">想要更深入的診斷？</h3>
                <p className="mt-2 text-base text-primary-foreground/80 sm:text-lg">
                  深度診斷包含 18 道專業題目，每個維度 3-4 題，結果更精準
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button variant="secondary" size="lg" asChild className="h-12 w-full px-6 text-base sm:w-auto">
                    <Link href="/diagnose/full">開始深度診斷</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    asChild
                    className="h-12 w-full border border-white/40 bg-white/10 px-6 text-base text-white hover:bg-white/20 hover:text-white sm:w-auto"
                  >
                    <Link href="/diagnose">重新快速診斷</Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold sm:text-2xl">🎉 你完成了深度診斷！</h3>
                <p className="mt-2 text-base text-primary-foreground/80 sm:text-lg">
                  建議定期（每季）重新診斷，追蹤你的事業成長軌跡
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button variant="secondary" size="lg" asChild className="h-12 w-full px-6 text-base sm:w-auto">
                    <Link href="/dashboard">查看診斷紀錄</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    asChild
                    className="h-12 w-full border border-white/40 bg-white/10 px-6 text-base text-white hover:bg-white/20 hover:text-white sm:w-auto"
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
      <div className="mt-10 rounded-lg border bg-muted/30 p-6 text-center sm:p-8">
        <h3 className="text-lg font-semibold sm:text-xl">📣 分享你的結果</h3>
        <p className="mt-2 text-base text-muted-foreground">
          讓朋友也來測測看是哪種類型的 Solo！
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="outline" className="h-11 px-4 text-base" onClick={() => handleShare("facebook")}>
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
            Facebook
          </Button>
          <Button variant="outline" className="h-11 px-4 text-base" onClick={() => handleShare("line")}>
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            LINE
          </Button>
          <Button variant="outline" className="h-11 px-4 text-base" onClick={() => handleShare("x")}>
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X
          </Button>
          <Button variant="outline" className="h-11 px-4 text-base" onClick={() => handleShare("threads")}>
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32l-1.663-1.197c.922-1.374 2.478-2.122 4.384-2.122h.039c3.12.019 4.913 1.902 5.365 5.639.177.074.351.154.522.24 1.347.672 2.373 1.638 2.968 2.798.756 1.476.782 3.924-.965 5.715-1.835 1.877-4.146 2.665-7.503 2.688zm.014-8.567c-1.17.063-2.082.377-2.642.906-.461.436-.674.963-.643 1.57.03.548.306 1.072.777 1.473.603.516 1.417.773 2.357.746 1.396-.05 2.447-.631 3.04-1.681.3-.53.476-1.19.516-1.968-.758-.124-1.56-.176-2.394-.153-.345.01-.689.034-1.011.107z"/>
            </svg>
            Threads
          </Button>
          <Button
            variant={copySuccess ? "default" : "outline"}
            className="h-11 px-4 text-base"
            onClick={handleCopyLink}
          >
            {copySuccess ? (
              <>
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                已複製！
              </>
            ) : (
              <>
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
                複製連結
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Timestamp */}
      <p className="mt-8 text-center text-base text-muted-foreground">
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
