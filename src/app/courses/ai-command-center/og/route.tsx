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
          backgroundColor: "#fafafa",
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(230,57,70,0.12), transparent),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(59,130,246,0.08), transparent)
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
            background: "linear-gradient(90deg, #E63946, #FF5A67, #3B82F6)",
          }}
        />

        {/* 上半部：標題 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <span
              style={{
                background: "#E63946",
                color: "white",
                padding: "8px 20px",
                borderRadius: "20px",
                fontSize: "22px",
                fontWeight: 600,
              }}
            >
              6 小時一日實作
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
              2026/5/16（六）
            </span>
          </div>

          <h1
            style={{
              fontSize: "56px",
              fontWeight: 900,
              color: "#1a1a2e",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            用 AI 建你的
          </h1>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 900,
              color: "#E63946",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            個人指揮中心
          </h1>

          <p
            style={{
              fontSize: "28px",
              color: "#64748b",
              marginTop: "20px",
              lineHeight: 1.5,
            }}
          >
            Claude Code + Obsidian — 目標管理 × 知識管理 × AI 自動化
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
                background: "#e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              🚀
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a2e" }}
              >
                Vista
              </span>
              <span style={{ fontSize: "18px", color: "#64748b" }}>
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
                background: "#E63946",
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
              style={{ fontSize: "24px", fontWeight: 700, color: "#94a3b8" }}
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
