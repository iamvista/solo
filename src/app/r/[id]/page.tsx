import { Metadata } from "next";
import { getDiagnosisById } from "@/lib/supabase/diagnosis";
import { DiagnosisResultClient } from "./DiagnosisResultClient";

// Solo 類型定義
const soloTypeNames: Record<string, { emoji: string; name: string; title: string }> = {
  lion: { emoji: "🦁", name: "獅子型 Solo", title: "市場領袖" },
  fox: { emoji: "🦊", name: "狐狸型 Solo", title: "策略高手" },
  elephant: { emoji: "🐘", name: "大象型 Solo", title: "穩健專家" },
  eagle: { emoji: "🦅", name: "老鷹型 Solo", title: "獨行俠" },
  turtle: { emoji: "🐢", name: "烏龜型 Solo", title: "蓄勢待發" },
  chick: { emoji: "🐣", name: "小雞型 Solo", title: "新手起步" },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getDiagnosisById(id);

  if (!data) {
    return {
      title: "診斷結果 | solo.tw",
      description: "找不到此診斷結果",
    };
  }

  const soloType = soloTypeNames[data.solo_type] || { emoji: "📊", name: "Solo", title: "診斷結果" };
  const title = `${soloType.emoji} ${soloType.name}（${soloType.title}）| solo.tw 事業診斷`;
  const description = `我在 Solo 自由人學院完成了事業健檢，總分 ${data.total_score} 分！快來測測你是哪種類型的 Solo？`;
  const url = `https://solo.tw/r/${data.short_id || id}`;

  // 使用動態生成的 OG 圖片
  const ogImageUrl = `https://solo.tw/r/${data.short_id || id}/og`;

  return {
    title,
    description,
    metadataBase: new URL("https://solo.tw"),
    openGraph: {
      title,
      description,
      url,
      siteName: "solo.tw",
      locale: "zh_TW",
      type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${soloType.name} - Solo 事業診斷結果`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function DiagnoseResultPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getDiagnosisById(id);

  // 轉換資料格式
  const formattedData = data ? {
    id: data.id,
    short_id: data.short_id,
    score_positioning: data.score_positioning,
    score_delivery: data.score_delivery,
    score_trust: data.score_trust,
    score_monetization: data.score_monetization,
    score_sustainability: data.score_sustainability,
    total_score: data.total_score,
    solo_type: data.solo_type as "lion" | "fox" | "elephant" | "eagle" | "turtle" | "chick",
    diagnosis_type: (data.diagnosis_type || "quick") as "quick" | "full",
    created_at: data.created_at,
  } : null;

  return <DiagnosisResultClient initialData={formattedData} resultId={id} />;
}
