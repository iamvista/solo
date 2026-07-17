import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getCohort, getCourseConfig } from "@/lib/courses-config";
import { normalizeEmail } from "@/lib/assignment-access";
import { requireCourseTeacher } from "@/lib/teaching";

/**
 * The guest roster: people a teacher admitted without a payment.
 *
 * Nothing here touches course_enrollments. That table answers "who paid"; a
 * comped seat, a bank transfer, or an assistant sitting in has no answer to
 * give there, and inventing one would corrupt revenue totals, attendee exports,
 * and the admin roster alike.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "格式錯誤" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const courseId = String(b?.course_id ?? "");
  if (!getCourseConfig(courseId)) {
    return NextResponse.json({ error: "找不到這門課" }, { status: 404 });
  }

  const teacher = await requireCourseTeacher(courseId);
  if (!teacher) {
    return NextResponse.json({ error: "沒有權限" }, { status: 403 });
  }

  // 來賓要進哪一期。一門課開多期時，「加入這門課」是沒有意義的說法。
  const cohortKey = String(b?.cohort_key ?? "");
  const config = getCourseConfig(courseId)!;
  if (!getCohort(config, cohortKey)) {
    return NextResponse.json({ error: "請指定期別" }, { status: 400 });
  }

  const email = normalizeEmail(String(b?.email ?? ""));
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "請填寫有效的 email" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Someone who already paid is already in. Adding them would create a second,
  // confusing record of the same fact.
  const { data: paid } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("course_id", courseId)
    .eq("cohort_key", cohortKey)
    .eq("status", "paid")
    .ilike("email", email.replace(/[\\%_]/g, (m) => `\\${m}`));

  if ((paid ?? []).length > 0) {
    return NextResponse.json(
      { error: "這個 email 已經報名付費，本來就進得來" },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("course_guests").insert({
    course_id: courseId,
    cohort_key: cohortKey,
    email,
    name: String(b?.name ?? "").trim() || null,
    note: String(b?.note ?? "").trim() || null,
    added_by: teacher.id,
  });

  if (error) {
    // 23505 = unique_violation on (course_id, email)
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json(
        { error: "這個 email 已經在名單上了" },
        { status: 400 },
      );
    }
    console.error("Guest insert error:", error);
    return NextResponse.json({ error: "加入失敗" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });

  const supabase = createServiceClient();

  // Read the course from the row, then check permission against that. Taking a
  // course id from the caller would let any teacher remove another course's
  // guests.
  const { data: guest } = await supabase
    .from("course_guests")
    .select("course_id")
    .eq("id", id)
    .maybeSingle();

  if (!guest) {
    return NextResponse.json({ error: "找不到這筆來賓" }, { status: 404 });
  }

  const teacher = await requireCourseTeacher(guest.course_id);
  if (!teacher) {
    return NextResponse.json({ error: "沒有權限" }, { status: 403 });
  }

  const { error } = await supabase.from("course_guests").delete().eq("id", id);
  if (error) {
    console.error("Guest delete error:", error);
    return NextResponse.json({ error: "移除失敗" }, { status: 500 });
  }

  // Their submissions stay. The work was really done, and deleting it because
  // access was revoked would destroy something the student made.
  return NextResponse.json({ ok: true });
}
