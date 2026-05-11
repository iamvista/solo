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
          backgroundColor: "#0b0d12",
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(217,119,87,0.20), transparent),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(245,158,11,0.12), transparent)
          `,
          padding: "60px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
          overflow: "hidden",
          color: "#f5f5f4",
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
            background: "linear-gradient(90deg, #D97757, #F59E0B, #FBBF24)",
          }}
        />

        {/* 上半部：標題 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <span
              style={{
                background: "#D97757",
                color: "white",
                padding: "8px 20px",
                borderRadius: "20px",
                fontSize: "22px",
                fontWeight: 600,
              }}
            >
              for Claude Code 首發班
            </span>
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
              2026/6/27（六）
            </span>
          </div>

          <h1
            style={{
              fontSize: "60px",
              fontWeight: 900,
              color: "#fafaf9",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Vibe Coding for Claude Code
          </h1>
          <h2
            style={{
              fontSize: "44px",
              fontWeight: 800,
              color: "#FBBF24",
              lineHeight: 1.2,
              margin: "10px 0 0 0",
            }}
          >
            在終端機裡 3 小時打造數位資產
          </h2>

          <p
            style={{
              fontSize: "26px",
              color: "#d6d3d1",
              marginTop: "24px",
              lineHeight: 1.5,
            }}
          >
            Claude Code 首發班・舊生 −NT$1,000・限 12 名
          </p>
        </div>

        {/* 下半部：講師 + 品牌 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(217,119,87,0.20)",
                border: "1px solid rgba(217,119,87,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              💻
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{ fontSize: "24px", fontWeight: 700, color: "#fafaf9" }}
              >
                Vista
              </span>
              <span style={{ fontSize: "18px", color: "#a8a29e" }}>
                AI 應用培訓師・內容策略顧問
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "#D97757",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px",
                fontWeight: 800,
              }}
            >
              S
            </div>
            <span
              style={{ fontSize: "24px", fontWeight: 700, color: "#a8a29e" }}
            >
              solo.tw
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
