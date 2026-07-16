import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getCourseConfig } from "@/lib/courses-config";
import { requireCourseTeacher } from "@/lib/teaching";

export interface AssignmentInput {
  title: string;
  description: string | null;
  sort_order: number;
  allow_file: boolean;
  allow_text: boolean;
  allow_link: boolean;
  due_at: string | null;
  is_published: boolean;
}

/**
 * Validate an assignment payload.
 *
 * The "at least one form" rule is enforced here AND by a database check
 * constraint. The constraint is the real guarantee; this exists so the teacher
 * gets a sentence rather than a Postgres error.
 */
export function parseAssignmentInput(
  body: unknown,
): { ok: true; value: AssignmentInput } | { ok: false; error: string } {
  const b = body as Record<string, unknown> | null;

  const title = String(b?.title ?? "").trim();
  if (!title) return { ok: false, error: "請填寫標題" };

  const allowFile = b?.allow_file !== false;
  const allowText = b?.allow_text !== false;
  const allowLink = b?.allow_link !== false;

  if (!allowFile && !allowText && !allowLink) {
    return { ok: false, error: "至少要開放一種繳交形式" };
  }

  const dueRaw = b?.due_at;
  let dueAt: string | null = null;
  if (typeof dueRaw === "string" && dueRaw.trim()) {
    const parsed = new Date(dueRaw);
    if (Number.isNaN(parsed.getTime())) {
      return { ok: false, error: "截止日格式錯誤" };
    }
    dueAt = parsed.toISOString();
  }

  return {
    ok: true,
    value: {
      title,
      description: String(b?.description ?? "").trim() || null,
      sort_order: Number.isFinite(Number(b?.sort_order)) ? Number(b?.sort_order) : 0,
      allow_file: allowFile,
      allow_text: allowText,
      allow_link: allowLink,
      due_at: dueAt,
      is_published: b?.is_published === true,
    },
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "格式錯誤" }, { status: 400 });
  }

  const courseId = String((body as { course_id?: unknown })?.course_id ?? "");
  if (!getCourseConfig(courseId)) {
    return NextResponse.json({ error: "找不到這門課" }, { status: 404 });
  }

  const teacher = await requireCourseTeacher(courseId);
  if (!teacher) {
    return NextResponse.json({ error: "沒有權限" }, { status: 403 });
  }

  const parsed = parseAssignmentInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("assignments")
    .insert({ ...parsed.value, course_id: courseId, created_by: teacher.id })
    .select("id")
    .maybeSingle();

  if (error || !data) {
    console.error("Assignment insert error:", error);
    return NextResponse.json({ error: "建立失敗" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
