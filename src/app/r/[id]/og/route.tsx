import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getDiagnosisById } from '@/lib/supabase/diagnosis';

export const runtime = 'edge';

// Solo 類型定義
const soloTypes: Record<string, { emoji: string; name: string; title: string; color: string }> = {
  lion: { emoji: '🦁', name: '獅子型 Solo', title: '市場領袖', color: '#d97706' },
  fox: { emoji: '🦊', name: '狐狸型 Solo', title: '策略高手', color: '#ea580c' },
  elephant: { emoji: '🐘', name: '大象型 Solo', title: '穩健專家', color: '#4b5563' },
  eagle: { emoji: '🦅', name: '老鷹型 Solo', title: '獨行俠', color: '#2563eb' },
  turtle: { emoji: '🐢', name: '烏龜型 Solo', title: '蓄勢待發', color: '#16a34a' },
  chick: { emoji: '🐣', name: '小雞型 Solo', title: '新手起步', color: '#ca8a04' },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await getDiagnosisById(id);

  // 預設值
  const soloType = data?.solo_type ? soloTypes[data.solo_type] : { emoji: '📊', name: 'Solo', title: '診斷結果', color: '#0891b2' };
  const totalScore = data?.total_score ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 裝飾圓形 */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            backgroundColor: `${soloType.color}20`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            left: -100,
            width: 350,
            height: 350,
            borderRadius: '50%',
            backgroundColor: `${soloType.color}15`,
          }}
        />

        {/* 底部裝飾線 */}
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: soloType.color,
            opacity: 0.6,
          }}
        />

        {/* 主要內容 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            width: '100%',
          }}
        >
          {/* 大 Emoji */}
          <span style={{ fontSize: 120, marginBottom: 20 }}>{soloType.emoji}</span>

          {/* Solo 類型名稱 */}
          <span style={{ fontSize: 52, fontWeight: 'bold', color: 'white', marginBottom: 10 }}>
            {soloType.name}
          </span>

          {/* 類型標題 */}
          <span style={{ fontSize: 32, color: soloType.color, marginBottom: 30 }}>
            {soloType.title}
          </span>

          {/* 分數區 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '20px 50px',
              borderRadius: 20,
              marginBottom: 30,
            }}
          >
            <span style={{ fontSize: 28, color: '#94a3b8', marginRight: 10 }}>總分</span>
            <span style={{ fontSize: 64, fontWeight: 'bold', color: soloType.color }}>{totalScore}</span>
            <span style={{ fontSize: 28, color: '#94a3b8', marginLeft: 5 }}>/100</span>
          </div>

          {/* 網站資訊 */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>S</span>
            </div>
            <span style={{ fontSize: 24, color: '#64748b' }}>solo.tw</span>
            <span style={{ fontSize: 20, color: '#475569', marginLeft: 15 }}>· 自由人學院</span>
          </div>

          {/* CTA */}
          <span style={{ fontSize: 20, color: '#94a3b8', marginTop: 15 }}>
            快來測測你是哪種類型的 Solo！
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
