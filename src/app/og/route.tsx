import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
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
            top: -50,
            right: -50,
            width: 400,
            height: 400,
            borderRadius: '50%',
            backgroundColor: 'rgba(8, 145, 178, 0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            backgroundColor: 'rgba(8, 145, 178, 0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            right: 200,
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: 'rgba(251, 191, 36, 0.06)',
          }}
        />

        {/* 底部裝飾線 */}
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.5), rgba(251, 191, 36, 0.2))',
          }}
        />

        {/* 主要內容 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '80px',
            width: '100%',
          }}
        >
          {/* 左側文字區 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '600px',
            }}
          >
            {/* Logo 區域 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 20,
                }}
              >
                <span style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>S</span>
              </div>
              <span style={{ fontSize: 56, fontWeight: 'bold', color: 'white' }}>solo.tw</span>
            </div>

            {/* 副標題 */}
            <span style={{ fontSize: 32, color: '#94a3b8', marginBottom: 20 }}>自由人學院</span>

            {/* 主標語 */}
            <span style={{ fontSize: 44, color: '#fbbf24', fontWeight: 600, marginBottom: 30 }}>
              把專業變成事業
            </span>

            {/* 描述 */}
            <span style={{ fontSize: 22, color: '#64748b' }}>
              免費事業診斷 · 實用工具資源 · 成長課程
            </span>
          </div>

          {/* 右側 Emoji 區 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ display: 'flex', marginBottom: 10 }}>
              <span style={{ fontSize: 60, marginRight: 20 }}>🦁</span>
              <span style={{ fontSize: 55 }}>🦊</span>
            </div>
            <div style={{ display: 'flex', marginBottom: 10 }}>
              <span style={{ fontSize: 50, marginRight: 25 }}>🐘</span>
              <span style={{ fontSize: 55 }}>🦅</span>
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ fontSize: 50, marginRight: 20 }}>🐢</span>
              <span style={{ fontSize: 55 }}>🐣</span>
            </div>
            {/* 右側小文字 */}
            <span style={{ fontSize: 22, color: '#cbd5e1', marginTop: 30, textAlign: 'right' }}>
              測測你是哪種類型的 Solo？
            </span>
            <span style={{ fontSize: 16, color: '#64748b', marginTop: 8, textAlign: 'right' }}>
              五維競爭力分析 · 專屬成長建議
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
