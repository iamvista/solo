import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fafaf7",
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245,158,11,0.18), transparent),
            radial-gradient(ellipse 60% 40% at 85% 100%, rgba(234,88,12,0.10), transparent)
          `,
          padding: "60px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 頂部裝飾條 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #F59E0B, #EA580C, #DC2626)",
          }}
        />

        {/* 上半部：標題 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
            <span
              style={{
                background: "#F59E0B",
                color: "white",
                padding: "8px 20px",
                borderRadius: "20px",
                fontSize: "22px",
                fontWeight: 600,
              }}
            >
              6 小時實戰工作坊
            </span>
            <span
              style={{
                background: "#1f2937",
                color: "white",
                padding: "8px 20px",
                borderRadius: "20px",
                fontSize: "22px",
                fontWeight: 600,
              }}
            >
              2026/6/13（六）・臺北
            </span>
          </div>

          <h1
            style={{
              fontSize: "50px",
              fontWeight: 900,
              color: "#1a1a2e",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            讓主管與客戶點頭的
          </h1>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "#EA580C",
              lineHeight: 1.2,
              margin: "4px 0 0 0",
            }}
          >
            AI 提案成交力
          </h1>

          <p
            style={{
              fontSize: "28px",
              color: "#475569",
              marginTop: "24px",
              lineHeight: 1.5,
            }}
          >
            你的提案其實並不差，
            <br />
            而是還沒找到讓對方點頭的那個理由。
          </p>
        </div>

        {/* 下半部：講師 + 早鳥 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "20px",
                color: "#94a3b8",
                marginBottom: "4px",
              }}
            >
              主講
            </span>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: "#1a1a2e",
              }}
            >
              陳建銘・創新先生
            </span>
            <span
              style={{
                fontSize: "20px",
                color: "#64748b",
                marginTop: "4px",
              }}
            >
              500+ 場培訓・10,000+ 學員・20+ 國際發明專利
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              background: "white",
              padding: "16px 24px",
              borderRadius: "16px",
              border: "2px solid #F59E0B",
              boxShadow: "0 8px 24px rgba(245,158,11,0.18)",
            }}
          >
            <span
              style={{
                fontSize: "16px",
                color: "#92400e",
                fontWeight: 700,
                letterSpacing: "1px",
              }}
            >
              ⚡ 早鳥優惠（5/30 截止）
            </span>
            <span
              style={{
                fontSize: "44px",
                fontWeight: 900,
                color: "#EA580C",
                lineHeight: 1,
                marginTop: "6px",
              }}
            >
              NT$ 4,980
            </span>
            <span
              style={{
                fontSize: "16px",
                color: "#94a3b8",
                textDecoration: "line-through",
                marginTop: "4px",
              }}
            >
              原價 NT$ 7,800
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "#92400e",
                fontWeight: 600,
                marginTop: "8px",
              }}
            >
              👫 雙人同行 NT$ 8,888
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
