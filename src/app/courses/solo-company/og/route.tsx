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
          backgroundColor: "#fafaf9",
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(230,57,70,0.12), transparent),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(120,113,108,0.10), transparent)
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
            background: "linear-gradient(90deg, #E63946, #FF5A67, #78716C)",
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
              一日實作工作坊
            </span>
            <span
              style={{
                background: "#78716C",
                color: "white",
                padding: "8px 20px",
                borderRadius: "20px",
                fontSize: "22px",
                fontWeight: 600,
              }}
            >
              創始梯次・限 20 名
            </span>
          </div>

          <h1
            style={{
              fontSize: "58px",
              fontWeight: 900,
              color: "#1c1917",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            無人公司工作坊
          </h1>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: 900,
              color: "#E63946",
              lineHeight: 1.25,
              margin: "8px 0 0",
            }}
          >
            把你自己，一段一段寫成系統
          </h1>

          <p
            style={{
              fontSize: "27px",
              color: "#57534e",
              marginTop: "20px",
              lineHeight: 1.5,
            }}
          >
            下課前，那位 AI 員工已經上工，那條流程已經跑過一次
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
                background: "#e7e5e4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              🏗️
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{ fontSize: "24px", fontWeight: 700, color: "#1c1917" }}
              >
                Vista
              </span>
              <span style={{ fontSize: "18px", color: "#78716c" }}>
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
