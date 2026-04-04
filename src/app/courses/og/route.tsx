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
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#FAFAFA",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* Background decorative gradients */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            right: "-5%",
            width: "45%",
            height: "80%",
            background:
              "radial-gradient(ellipse, rgba(230,57,70,0.07), transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "-5%",
            width: "35%",
            height: "60%",
            background:
              "radial-gradient(ellipse, rgba(245,158,11,0.05), transparent)",
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #E63946, #FF5A67)",
            zIndex: 10,
          }}
        />

        {/* Left column — 60% */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "60%",
            paddingLeft: 56,
            paddingRight: 24,
            zIndex: 2,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: "linear-gradient(135deg, #E63946, #FF5A67)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(230,57,70,0.25)",
              }}
            >
              <span
                style={{ fontSize: 24, fontWeight: "bold", color: "white" }}
              >
                S
              </span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 600, color: "#666" }}>
              solo.tw
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#1A1A1A",
              lineHeight: 1.15,
              marginBottom: 4,
            }}
          >
            小班制實戰課程
          </div>
          <div
            style={{
              display: "flex",
              position: "relative",
              marginBottom: 18,
            }}
          >
            <span
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: "#E63946",
                lineHeight: 1.15,
              }}
            >
              即學即用
            </span>
            <div
              style={{
                position: "absolute",
                bottom: 4,
                left: 0,
                width: 200,
                height: 14,
                background: "rgba(230,57,70,0.15)",
                borderRadius: 3,
              }}
            />
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 24,
              color: "#6B7280",
              lineHeight: 1.5,
            }}
          >
            不只教理論，現場動手做。帶著你的問題來，帶著成果走。
          </div>
        </div>

        {/* Right column — 40%, course cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "40%",
            gap: 16,
            zIndex: 2,
          }}
        >
          {[
            { emoji: "✍️", name: "AI 內容產製系統", date: "5/23" },
            { emoji: "🚀", name: "AI 個人指揮中心", date: "5/16" },
            { emoji: "💻", name: "Vibe Coding 實戰", date: "5/9" },
            { emoji: "💬", name: "AI 社群內容", date: "5/3" },
          ].map((course) => (
            <div
              key={course.name}
              style={{
                background: "white",
                borderRadius: 14,
                padding: "16px 28px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                border: "1px solid #F0F0F0",
                width: 320,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span style={{ fontSize: 28 }}>{course.emoji}</span>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1A1A1A",
                    lineHeight: 1.3,
                  }}
                >
                  {course.name}
                </span>
                <span style={{ fontSize: 14, color: "#9CA3AF" }}>
                  {course.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 40,
            background: "rgba(255,255,255,0.9)",
            borderTop: "1px solid #F0F0F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 14, color: "#9CA3AF" }}>www.solo.tw/courses</span>
          <span style={{ fontSize: 14, color: "#ddd" }}>|</span>
          <span style={{ fontSize: 14, color: "#9CA3AF" }}>
            AI 應用・實戰工作坊
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
