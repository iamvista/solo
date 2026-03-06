import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const formatLabel: Record<string, string> = {
  online: "線上",
  offline: "實體",
  hybrid: "混合",
};

const categoryLabel: Record<string, string> = {
  workshop: "工作坊",
  lecture: "講座",
  meetup: "聚會",
  conference: "研討會",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  // Use @supabase/supabase-js directly for edge runtime compatibility
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: event } = await supabase
    .from("events")
    .select("title, subtitle, starts_at, format, category, venue_name")
    .eq("slug", slug)
    .single();

  if (!event) {
    return new Response("Not found", { status: 404 });
  }

  const startDate = new Date(event.starts_at);
  const dateStr = new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Taipei",
  }).format(startDate);

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        padding: "60px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <span
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "6px 16px",
            borderRadius: "20px",
            fontSize: "20px",
          }}
        >
          {formatLabel[event.format] || event.format}
        </span>
        {event.category && (
          <span
            style={{
              background: "#6366f1",
              color: "white",
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "20px",
            }}
          >
            {categoryLabel[event.category] || event.category}
          </span>
        )}
      </div>
      <h1
        style={{
          color: "white",
          fontSize: "56px",
          fontWeight: "bold",
          margin: "0 0 16px",
          lineHeight: 1.2,
        }}
      >
        {event.title}
      </h1>
      {event.subtitle && (
        <p style={{ color: "#94a3b8", fontSize: "28px", margin: "0 0 32px" }}>
          {event.subtitle}
        </p>
      )}
      <div
        style={{
          display: "flex",
          gap: "32px",
          color: "#cbd5e1",
          fontSize: "24px",
        }}
      >
        <span>{dateStr}</span>
        <span>
          {event.format === "online"
            ? "線上活動"
            : event.venue_name || "待通知"}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "60px",
          color: "#64748b",
          fontSize: "20px",
        }}
      >
        solo.tw
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
