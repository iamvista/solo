import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Solo 類型資料
const soloTypes: Record<string, { emoji: string; name: string; title: string; description: string }> = {
  lion: {
    emoji: "🦁",
    name: "獅子型 Solo",
    title: "市場領袖",
    description: "你是天生的領導者，具有強大的市場影響力和個人品牌。你善於掌控局面，擁有清晰的事業願景。"
  },
  fox: {
    emoji: "🦊",
    name: "狐狸型 Solo",
    title: "策略高手",
    description: "你機智靈活，善於發現市場機會。你的策略思維和適應能力是你最大的優勢。"
  },
  elephant: {
    emoji: "🐘",
    name: "大象型 Solo",
    title: "穩健專家",
    description: "你穩重可靠，建立了深厚的專業信譽。客戶信任你，因為你總是能交付高品質的成果。"
  },
  eagle: {
    emoji: "🦅",
    name: "老鷹型 Solo",
    title: "獨行俠",
    description: "你有敏銳的洞察力，善於從高處俯瞰全局。你獨立自主，追求卓越。"
  },
  turtle: {
    emoji: "🐢",
    name: "烏龜型 Solo",
    title: "蓄勢待發",
    description: "你穩紮穩打，正在累積實力。雖然起步較慢，但你有堅韌的毅力和持久的動力。"
  },
  chick: {
    emoji: "🐣",
    name: "小雞型 Solo",
    title: "新手起步",
    description: "你剛踏入自由工作的世界，充滿好奇和學習熱情。每一步都是成長的機會。"
  },
};

// 維度資料
const dimensions = [
  { key: "positioning", name: "定位力", description: "你的市場定位和差異化能力" },
  { key: "delivery", name: "交付力", description: "你交付專業成果的能力" },
  { key: "trust", name: "信任力", description: "建立客戶信任和口碑的能力" },
  { key: "monetization", name: "變現力", description: "將專業轉化為收入的能力" },
  { key: "sustainability", name: "永續力", description: "維持長期事業發展的能力" },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const diagnosisId = searchParams.get("id");

    if (!diagnosisId) {
      return NextResponse.json({ error: "請提供診斷 ID" }, { status: 400 });
    }

    const supabase = await createClient();

    // 獲取診斷結果
    const { data: diagnosis, error } = await supabase
      .from("diagnosis_results")
      .select("*")
      .or(`id.eq.${diagnosisId},short_id.eq.${diagnosisId}`)
      .single();

    if (error || !diagnosis) {
      return NextResponse.json({ error: "找不到診斷紀錄" }, { status: 404 });
    }

    const soloType = soloTypes[diagnosis.solo_type];
    const createdDate = new Date(diagnosis.created_at).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // 生成 HTML 內容（會被轉換為 PDF）
    const htmlContent = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>Solo 事業診斷報告 - ${soloType?.name || "診斷結果"}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      padding-bottom: 30px;
      border-bottom: 2px solid #e5e7eb;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #4f46e5;
      margin-bottom: 10px;
    }
    .date {
      color: #6b7280;
      font-size: 14px;
    }
    .type-section {
      text-align: center;
      padding: 30px;
      background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
      border-radius: 16px;
      margin-bottom: 30px;
    }
    .type-emoji {
      font-size: 80px;
      margin-bottom: 15px;
    }
    .type-name {
      font-size: 28px;
      font-weight: bold;
      color: #4f46e5;
      margin-bottom: 5px;
    }
    .type-title {
      font-size: 18px;
      color: #6b7280;
      margin-bottom: 15px;
    }
    .total-score {
      font-size: 48px;
      font-weight: bold;
      color: #4f46e5;
    }
    .total-score span {
      font-size: 20px;
      color: #9ca3af;
    }
    .type-description {
      margin-top: 20px;
      color: #4b5563;
      font-size: 16px;
    }
    .scores-section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .score-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .score-label {
      width: 100px;
      font-weight: 600;
    }
    .score-bar-container {
      flex: 1;
      height: 12px;
      background: #e5e7eb;
      border-radius: 6px;
      margin: 0 15px;
      overflow: hidden;
    }
    .score-bar {
      height: 100%;
      background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);
      border-radius: 6px;
    }
    .score-value {
      width: 50px;
      text-align: right;
      font-weight: bold;
      color: #4f46e5;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #9ca3af;
      font-size: 14px;
    }
    .footer a {
      color: #4f46e5;
      text-decoration: none;
    }
    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🎯 自由人學院</div>
    <div class="date">診斷日期：${createdDate}</div>
  </div>

  <div class="type-section">
    <div class="type-emoji">${soloType?.emoji || "📊"}</div>
    <div class="type-name">${soloType?.name || "Solo 診斷"}</div>
    <div class="type-title">${soloType?.title || ""}</div>
    <div class="total-score">${diagnosis.total_score}<span>/100</span></div>
    <p class="type-description">${soloType?.description || ""}</p>
  </div>

  <div class="scores-section">
    <h2 class="section-title">五力分析</h2>
    ${dimensions.map((dim) => {
      const score = diagnosis[`score_${dim.key}`] || 0;
      return `
        <div class="score-item">
          <div class="score-label">${dim.name}</div>
          <div class="score-bar-container">
            <div class="score-bar" style="width: ${score}%"></div>
          </div>
          <div class="score-value">${score}</div>
        </div>
      `;
    }).join("")}
  </div>

  <div class="footer">
    <p>此報告由 <a href="https://www.solo.tw">自由人學院</a> 生成</p>
    <p>診斷類型：${diagnosis.diagnosis_type === "full" ? "深度診斷" : "快速診斷"}</p>
  </div>
</body>
</html>
    `;

    // 返回 HTML 內容，瀏覽器會處理打印/保存為 PDF
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("PDF API error:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
