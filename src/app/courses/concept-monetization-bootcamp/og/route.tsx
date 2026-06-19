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
          backgroundColor: "#0d2038",
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245,158,11,0.18), transparent),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(59,130,246,0.12), transparent)
          `,
          padding: "60px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #F59E0B, #3B82F6, #E63946)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
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
              6 週線上直播陪跑
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "white",
                padding: "8px 20px",
                borderRadius: "20px",
                fontSize: "22px",
                fontWeight: 600,
              }}
            >
              2026/8 創辦梯次・限 12 名
            </span>
          </div>

          <h1
            style={{
              fontSize: "60px",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            概念變現陪跑營
          </h1>
          <h1
            style={{
              fontSize: "40px",
              fontWeight: 800,
              color: "#FBBF24",
              lineHeight: 1.3,
              margin: 0,
              marginTop: "8px",
            }}
          >
            把你的專業，變成一個會賣的知識產品
          </h1>

          <p
            style={{
              fontSize: "26px",
              color: "rgba(255,255,255,0.7)",
              marginTop: "20px",
              lineHeight: 1.5,
            }}
          >
            你不是缺創意，你是缺一個市場買單的產品形式
          </p>
        </div>

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
                background: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              🎯
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "24px", fontWeight: 700, color: "white" }}>
                Vista 鄭緯筌
              </span>
              <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)" }}>
                內容策略顧問・企業講師・作家
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
            <span style={{ fontSize: "24px", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
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
