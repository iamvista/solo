import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAssignment } from "@/lib/assignments";
import { requireCourseTeacher } from "@/lib/teaching";

const KINDS = ["video", "file", "link", "text"] as const;
type Kind = (typeof KINDS)[number];

const EMPTY_PAYLOAD = {
  video_url: null,
  storage_path: null,
  external_url: null,
  body_text: null,
};

/**
 * Each kind carries its payload in its own column, and the database enforces
 * the pairing with a check constraint. Validating here too means the teacher
 * gets told which field is missing instead of hitting a constraint violation.
 *
 * `text` differs from the other three in kind, not just in column: they point
 * at content living elsewhere, it *is* the content.
 */
function parsePayload(
  kind: Kind,
  body: Record<string, unknown>,
):
  | { ok: true; value: Record<string, string | null> }
  | { ok: false; error: string } {
  if (kind === "video") {
    const url = String(body.video_url ?? "").trim();
    if (!url) return { ok: false, error: "請填寫影片網址" };
    return { ok: true, value: { ...EMPTY_PAYLOAD, video_url: url } };
  }
  if (kind === "link") {
    const url = String(body.external_url ?? "").trim();
    if (!url) return { ok: false, error: "請填寫連結網址" };
    return { ok: true, value: { ...EMPTY_PAYLOAD, external_url: url } };
  }
  if (kind === "text") {
    const text = String(body.body_text ?? "").trim();
    if (!text) return { ok: false, error: "請填寫要給學員的文字" };
    return { ok: true, value: { ...EMPTY_PAYLOAD, body_text: text } };
  }
  const path = String(body.storage_path ?? "").trim();
  if (!path) return { ok: false, error: "請先選擇講義檔案" };
  return { ok: true, value: { ...EMPTY_PAYLOAD, storage_path: path } };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "格式錯誤" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const assignmentId = String(b?.assignment_id ?? "");

  // Ownership comes from the assignment, which carries the course. There is no
  // course-level reward, so an assignment is always the anchor.
  const assignment = await getAssignment(assignmentId);
  if (!assignment) {
    return NextResponse.json({ error: "找不到這份作業" }, { status: 404 });
  }

  const teacher = await requireCourseTeacher(assignment.course_id);
  if (!teacher) {
    return NextResponse.json({ error: "沒有權限" }, { status: 403 });
  }

  const kind = String(b?.kind ?? "") as Kind;
  if (!KINDS.includes(kind)) {
    return NextResponse.json({ error: "資源類型不正確" }, { status: 400 });
  }

  const title = String(b?.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "請填寫標題" }, { status: 400 });

  const payload = parsePayload(kind, b);
  if (!payload.ok) {
    return NextResponse.json({ error: payload.error }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("rewards")
    .insert({
      assignment_id: assignment.id,
      kind,
      title,
      description: String(b?.description ?? "").trim() || null,
      sort_order: Number.isFinite(Number(b?.sort_order)) ? Number(b?.sort_order) : 0,
      ...payload.value,
    })
    .select("id")
    .maybeSingle();

  if (error || !data) {
    console.error("Reward insert error:", error);
    return NextResponse.json({ error: "建立失敗" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
