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
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafafa',
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14, 165, 233, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(251, 191, 36, 0.1), transparent),
            radial-gradient(ellipse 40% 30% at 10% 80%, rgba(14, 165, 233, 0.08), transparent)
          `,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 頂部裝飾條 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #0ea5e9, #06b6d4, #0ea5e9)',
          }}
        />

        {/* 左上角裝飾 */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.3)',
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>S</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 600, color: '#334155' }}>solo.tw</span>
        </div>

        {/* 主要內容區 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 80px',
          }}
        >
          {/* 標籤 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#e0f2fe',
              borderRadius: 50,
              padding: '10px 24px',
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 20, marginRight: 10 }}>🚀</span>
            <span style={{ fontSize: 18, color: '#0369a1', fontWeight: 500 }}>
              專為自由工作者打造的成長平臺
            </span>
          </div>

          {/* 主標題 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 72, fontWeight: 800, color: '#1e293b' }}>
              把專業
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: 16,
                position: 'relative',
              }}
            >
              <span style={{ fontSize: 72, fontWeight: 800, color: '#0ea5e9' }}>
                變成事業
              </span>
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  left: 0,
                  right: 0,
                  height: 16,
                  backgroundColor: 'rgba(14, 165, 233, 0.2)',
                  borderRadius: 4,
                }}
              />
            </div>
          </div>

          {/* 副標題 */}
          <span
            style={{
              fontSize: 26,
              color: '#64748b',
              marginBottom: 40,
              lineHeight: 1.5,
            }}
          >
            講師、顧問、教練的事業加速器
          </span>

          {/* Solo 類型展示 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 32,
            }}
          >
            {[
              { emoji: '🦁', name: '獅子型' },
              { emoji: '🦊', name: '狐狸型' },
              { emoji: '🐘', name: '大象型' },
              { emoji: '🦅', name: '老鷹型' },
              { emoji: '🐢', name: '烏龜型' },
              { emoji: '🐣', name: '小雞型' },
            ].map((type) => (
              <div
                key={type.name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: '16px 20px',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <span style={{ fontSize: 36 }}>{type.emoji}</span>
                <span style={{ fontSize: 14, color: '#475569', marginTop: 6, fontWeight: 500 }}>
                  {type.name}
                </span>
              </div>
            ))}
          </div>

          {/* 功能標籤 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            {[
              { icon: '📊', text: '免費事業診斷' },
              { icon: '🛠️', text: '實用工具箱' },
              { icon: '🎓', text: '成長課程' },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <span style={{ fontSize: 18, color: '#64748b', fontWeight: 500 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 底部裝飾 */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16, color: '#94a3b8' }}>www.solo.tw</span>
          <span style={{ fontSize: 16, color: '#cbd5e1' }}>|</span>
          <span style={{ fontSize: 16, color: '#94a3b8' }}>一人事業成長平臺</span>
        </div>

        {/* 右下角裝飾圓 */}
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            border: '2px solid rgba(14, 165, 233, 0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '2px solid rgba(14, 165, 233, 0.15)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
