import { ImageResponse } from "next/og";
import { getWorkshopBySlug } from "@/lib/workshops";

export const runtime = "edge";

export async function GET() {
  const workshop = getWorkshopBySlug("story-canvas");
  const title = workshop?.title ?? "一人公司的故事骨架工作坊";
  const subtitle =
    workshop?.subtitle ?? "一句一句改，改到你的定位句過得了轉述測試為止";
  // 梯次資訊只有 workshops.ts 一個來源，換梯時這張圖跟著變，不必另外重畫
  const meta = workshop
    ? `${workshop.date}　${workshop.time}　限額 ${workshop.capacity} 人`
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fdfaf4",
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(217,119,6,0.14), transparent),
            radial-gradient(ellipse 60% 40% at 85% 110%, rgba(120,113,108,0.10), transparent)
          `,
          padding: "64px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #B45309, #D97706, #F59E0B)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#B45309",
              letterSpacing: "0.08em",
              marginBottom: 28,
            }}
          >
            📖　3 小時實體工作坊
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 700,
              color: "#1c1917",
              lineHeight: 1.25,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "#57534e",
              marginTop: 24,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", fontSize: 26, color: "#57534e" }}>
            {meta}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 600,
              color: "#B45309",
            }}
          >
            solo.tw
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
