import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

const STAGE_COLORS: Record<string, string> = {
  setup: "#f59e0b",
  operate: "#3b82f6",
  leverage: "#8b5cf6",
  outgrow: "#10b981",
};

const STAGE_NAMES: Record<string, string> = {
  setup: "Set up",
  operate: "Operate",
  leverage: "Leverage",
  outgrow: "Outgrow",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio, level, solo_stage, membership_tier, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) {
    return new Response("Not found", { status: 404 });
  }

  const displayName = profile.display_name || `@${profile.username}`;
  const stageColor = STAGE_COLORS[profile.solo_stage] || STAGE_COLORS.setup;
  const stageName = STAGE_NAMES[profile.solo_stage] || "Set up";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fafaf9",
          backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, ${stageColor}22, transparent)`,
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: `linear-gradient(90deg, #E63946, ${stageColor})`,
          }}
        />

        {/* Avatar circle */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            backgroundColor: "#e7e5e4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 72,
            fontWeight: 700,
            color: "#78716c",
            border: "4px solid white",
            boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              width={160}
              height={160}
              style={{ objectFit: "cover" }}
            />
          ) : (
            displayName[0]?.toUpperCase()
          )}
        </div>

        {/* Name */}
        <div
          style={{
            marginTop: 24,
            fontSize: 48,
            fontWeight: 700,
            color: "#1c1917",
            lineHeight: 1.2,
          }}
        >
          {displayName}
        </div>

        {/* Username */}
        <div
          style={{
            marginTop: 8,
            fontSize: 24,
            color: "#78716c",
          }}
        >
          @{profile.username}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div
            style={{
              marginTop: 16,
              fontSize: 20,
              color: "#57534e",
              maxWidth: 600,
              textAlign: "center",
              lineHeight: 1.5,
              display: "flex",
            }}
          >
            {profile.bio.length > 80 ? profile.bio.slice(0, 80) + "..." : profile.bio}
          </div>
        )}

        {/* Badges row */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: `${stageColor}20`,
              color: stageColor,
              padding: "8px 16px",
              borderRadius: 20,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {stageName}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f5f5f4",
              color: "#44403c",
              padding: "8px 16px",
              borderRadius: 20,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            Lv.{profile.level}
          </div>
          {profile.membership_tier !== "free" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#E6394615",
                color: "#E63946",
                padding: "8px 16px",
                borderRadius: 20,
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {profile.membership_tier === "pro" ? "Pro" : "Premium"}
            </div>
          )}
        </div>

        {/* Footer branding */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 20,
            color: "#a8a29e",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #E63946, #f87171)",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            S
          </div>
          solo.tw — 一人事業作業系統
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
