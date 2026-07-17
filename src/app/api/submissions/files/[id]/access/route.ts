import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { SUBMISSIONS_BUCKET } from "@/lib/assignments";
import { authorizeSubmissionFile } from "@/lib/submission-files";

/** Short enough that a leaked URL is stale almost immediately. */
const SIGNED_URL_TTL_SECONDS = 300;

const DENIALS: Record<number, string> = {
  401: "請先取得作業區入口連結",
  403: "這份附件不屬於你",
  404: "找不到這個附件",
};

/**
 * Hand back a viewable URL for one submitted attachment.
 *
 * The bucket carries no policies, so this signed URL is the only way to the
 * bytes — which is why authorization runs before one is ever minted.
 *
 * Every denial returns a message and nothing else: no URL, no storage path, no
 * filename. A student probing another student's attachment id learns only that
 * they were refused, never whether the file exists or what it is called.
 */
export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const auth = await authorizeSubmissionFile(id);
  if (!auth.ok) {
    return NextResponse.json(
      { error: DENIALS[auth.status] },
      { status: auth.status },
    );
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase.storage
    .from(SUBMISSIONS_BUCKET)
    .createSignedUrl(auth.file.storage_path, SIGNED_URL_TTL_SECONDS);

  if (error || !data) {
    console.error("Submission file signed URL error:", error);
    return NextResponse.json({ error: "無法開啟這個附件" }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
