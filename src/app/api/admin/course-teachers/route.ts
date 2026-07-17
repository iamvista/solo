import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getCourseConfig } from "@/lib/courses-config";
import { isAdmin } from "@/lib/supabase/admin";
import { findAuthUserByEmail } from "@/lib/auth-users";

/**
 * Assign or remove course teachers.
 *
 * Platform administrators only, deliberately: teaching a course reaches that
 * course's student work, so granting it is a platform-level trust decision.
 * A teacher must not be able to hand it out, to themselves or anyone else.
 *
 * This uses the existing isAdmin() helper without modifying it, and does not
 * consult course_teachers for authorization. The two permission models stay
 * separate: neither inherits from the other, so widening one cannot quietly
 * widen the other.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "沒有權限" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "格式錯誤" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const courseId = String(b?.course_id ?? "");
  const email = String(b?.email ?? "").trim().toLowerCase();

  if (!getCourseConfig(courseId)) {
    return NextResponse.json({ error: "找不到這門課" }, { status: 404 });
  }
  if (!email) {
    return NextResponse.json({ error: "請填寫 email" }, { status: 400 });
  }

  // The teacher must already hold an account: teaching uses the site's existing
  // sign-in, so there is nothing to map an unregistered address to.
  //
  // findAuthUserByEmail paginates. listUsers() alone defaults to 50 per page,
  // which silently excluded the earliest-registered accounts and made this
  // endpoint tell the truth-shaped lie "no such account, please register".
  const user = await findAuthUserByEmail(email);
  if (!user) {
    return NextResponse.json(
      { error: "找不到這個帳號，請對方先到 solo.tw 註冊" },
      { status: 404 },
    );
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("course_teachers")
    .insert({ course_id: courseId, teacher_id: user.id });

  if (error) {
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json(
        { error: "這個人已經是這門課的老師了" },
        { status: 400 },
      );
    }
    console.error("course_teachers insert error:", error);
    return NextResponse.json({ error: "指派失敗" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "沒有權限" }, { status: 403 });
  }

  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });

  const supabase = createServiceClient();
  const { error } = await supabase.from("course_teachers").delete().eq("id", id);

  if (error) {
    console.error("course_teachers delete error:", error);
    return NextResponse.json({ error: "移除失敗" }, { status: 500 });
  }

  // The course's assignments, submissions, and rewards are untouched: removing
  // a teacher revokes access, it does not undo their work.
  return NextResponse.json({ ok: true });
}
