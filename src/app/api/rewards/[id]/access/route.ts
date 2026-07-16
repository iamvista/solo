import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { SUBMISSIONS_BUCKET } from "@/lib/assignments";
import { authorizeReward } from "@/lib/rewards";

/** Short enough that a leaked URL is stale almost immediately. */
const SIGNED_URL_TTL_SECONDS = 300;

const DENIALS: Record<number, string> = {
  401: "請先取得作業區入口連結",
  403: "交完這份作業就能領取",
  404: "找不到這項資源",
};

/**
 * Hand back the URL for one reward, but only to a student who has submitted.
 *
 * Every denial returns a message and nothing else — no URL, no storage path.
 * The reward's location is never in the response unless access was granted.
 */
export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const auth = await authorizeReward(id);
  if (!auth.ok) {
    return NextResponse.json(
      { error: DENIALS[auth.status] },
      { status: auth.status },
    );
  }

  const { reward } = auth;

  if (reward.kind === "video" && reward.video_url) {
    return NextResponse.json({ kind: "video", url: reward.video_url });
  }

  if (reward.kind === "link" && reward.external_url) {
    return NextResponse.json({ kind: "link", url: reward.external_url });
  }

  if (reward.kind === "file" && reward.storage_path) {
    const supabase = createServiceClient();
    const { data, error } = await supabase.storage
      .from(SUBMISSIONS_BUCKET)
      .createSignedUrl(reward.storage_path, SIGNED_URL_TTL_SECONDS);

    if (error || !data) {
      console.error("Reward signed URL error:", error);
      return NextResponse.json({ error: "無法建立下載連結" }, { status: 500 });
    }

    return NextResponse.json({ kind: "file", url: data.signedUrl });
  }

  // A row whose payload does not match its kind. The database check constraint
  // makes this unreachable, but returning a broken URL would be worse than
  // saying so.
  console.error("Reward payload does not match its kind:", reward.id);
  return NextResponse.json({ error: "這項資源設定有誤" }, { status: 500 });
}
