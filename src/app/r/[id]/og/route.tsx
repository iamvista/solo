import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getDiagnosisById } from '@/lib/supabase/diagnosis';

export const runtime = 'edge';

// Solo 類型定義
const soloTypes: Record<string, { emoji: string; name: string; title: string; color: string; bgColor: string }> = {
  lion: { emoji: '🦁', name: '獅子型 Solo', title: '市場領袖', color: '#d97706', bgColor: '#fef3c7' },
  fox: { emoji: '🦊', name: '狐狸型 Solo', title: '策略高手', color: '#ea580c', bgColor: '#ffedd5' },
  elephant: { emoji: '🐘', name: '大象型 Solo', title: '穩健專家', color: '#4b5563', bgColor: '#f3f4f6' },
  eagle: { emoji: '🦅', name: '老鷹型 Solo', title: '獨行俠', color: '#2563eb', bgColor: '#dbeafe' },
  turtle: { emoji: '🐢', name: '烏龜型 Solo', title: '蓄勢待發', color: '#16a34a', bgColor: '#dcfce7' },
  chick: { emoji: '🐣', name: '小雞型 Solo', title: '新手起步', color: '#ca8a04', bgColor: '#fef9c3' },
};

// 生成簡化版雷達圖的 SVG 路徑
function generateRadarPath(scores: number[], center: number, radius: number): string {
  const angleStep = (2 * Math.PI) / scores.length;
  const startAngle = -Math.PI / 2;

  const points = scores.map((score, index) => {
    const angle = startAngle + index * angleStep;
    const r = (score / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  });

  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
}

// 生成網格路徑
function generateGridPath(center: number, radius: number, sides: number): string {
  const angleStep = (2 * Math.PI) / sides;
  const startAngle = -Math.PI / 2;

  const points = Array.from({ length: sides }, (_, index) => {
    const angle = startAngle + index * angleStep;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  });

  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await getDiagnosisById(id);

  // 預設值
  const soloType = data?.solo_type ? soloTypes[data.solo_type] : { emoji: '📊', name: 'Solo', title: '診斷結果', color: '#dc2626', bgColor: '#fee2e2' };
  const totalScore = data?.total_score ?? 0;

  // 維度分數
  const scores = [
    data?.score_positioning ?? 50,
    data?.score_delivery ?? 50,
    data?.score_trust ?? 50,
    data?.score_monetization ?? 50,
    data?.score_sustainability ?? 50,
  ];

  const dimensionLabels = ['定位力', '交付力', '信任力', '變現力', '永續力'];

  // 雷達圖參數
  const radarCenter = 100;
  const radarRadius = 70;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          backgroundColor: '#fafaf9',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* 左側：類型資訊 */}
        <div
          style={{
            width: '55%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '50px 60px',
            background: `linear-gradient(135deg, ${soloType.bgColor} 0%, #ffffff 100%)`,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <span
              style={{
                backgroundColor: soloType.color,
                color: 'white',
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              Solo 事業健檢
            </span>
          </div>

          {/* Emoji */}
          <span style={{ fontSize: 100, marginBottom: 10 }}>{soloType.emoji}</span>

          {/* Solo 類型名稱 */}
          <span style={{ fontSize: 48, fontWeight: 'bold', color: '#1c1917', marginBottom: 8 }}>
            {soloType.name}
          </span>

          {/* 類型標題 */}
          <span style={{ fontSize: 28, color: soloType.color, marginBottom: 24 }}>
            {soloType.title}
          </span>

          {/* 分數 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              backgroundColor: 'white',
              padding: '16px 32px',
              borderRadius: 16,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 20, color: '#78716c', marginRight: 8 }}>總分</span>
            <span style={{ fontSize: 52, fontWeight: 'bold', color: '#dc2626' }}>{totalScore}</span>
            <span style={{ fontSize: 20, color: '#78716c', marginLeft: 4 }}>/100</span>
          </div>

          {/* 網站資訊 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>S</span>
            </div>
            <span style={{ fontSize: 20, color: '#57534e' }}>solo.tw · 自由人學院</span>
          </div>
        </div>

        {/* 右側：雷達圖 */}
        <div
          style={{
            width: '45%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            backgroundColor: '#ffffff',
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 600, color: '#44403c', marginBottom: 16 }}>
            五維競爭力
          </span>

          {/* SVG 雷達圖 */}
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* 背景網格 */}
            <path
              d={generateGridPath(radarCenter, radarRadius, 5)}
              fill="none"
              stroke="#e7e5e4"
              strokeWidth="1"
            />
            <path
              d={generateGridPath(radarCenter, radarRadius * 0.66, 5)}
              fill="none"
              stroke="#e7e5e4"
              strokeWidth="0.5"
              strokeDasharray="3,3"
            />
            <path
              d={generateGridPath(radarCenter, radarRadius * 0.33, 5)}
              fill="none"
              stroke="#e7e5e4"
              strokeWidth="0.5"
              strokeDasharray="3,3"
            />

            {/* 軸線 */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
              return (
                <line
                  key={i}
                  x1={radarCenter}
                  y1={radarCenter}
                  x2={radarCenter + radarRadius * Math.cos(angle)}
                  y2={radarCenter + radarRadius * Math.sin(angle)}
                  stroke="#d6d3d1"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* 數據區域 */}
            <path
              d={generateRadarPath(scores, radarCenter, radarRadius)}
              fill="rgba(220, 38, 38, 0.25)"
              stroke="#dc2626"
              strokeWidth="2.5"
            />

            {/* 數據點 */}
            {scores.map((score, i) => {
              const angle = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
              const r = (score / 100) * radarRadius;
              return (
                <circle
                  key={i}
                  cx={radarCenter + r * Math.cos(angle)}
                  cy={radarCenter + r * Math.sin(angle)}
                  r="5"
                  fill="white"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                />
              );
            })}
          </svg>

          {/* 維度標籤 */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
              marginTop: 20,
              maxWidth: 200,
            }}
          >
            {dimensionLabels.map((label, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f5f5f4',
                  padding: '4px 10px',
                  borderRadius: 12,
                  fontSize: 12,
                }}
              >
                <span style={{ color: '#78716c' }}>{label}</span>
                <span style={{ color: '#dc2626', fontWeight: 600, marginLeft: 4 }}>{scores[i]}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <span style={{ fontSize: 14, color: '#a8a29e', marginTop: 20 }}>
            測測你是哪種類型？
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
