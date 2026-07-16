import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { COURSE_CONFIGS, getCourseConfig } from "@/lib/courses-config";
import { createServiceClient } from "@/lib/supabase/service";
import { isAdmin } from "@/lib/supabase/admin";
import { TeachersManager, type TeacherRow } from "./teachers-manager";

export const metadata: Metadata = {
  title: "授課老師 | solo.tw",
  robots: { index: false, follow: false },
};

export default async function CourseTeachersPage() {
  // Platform administration, not teaching: this page hands out access to other
  // people's courses, so it uses the admin gate and never course_teachers.
  if (!(await isAdmin())) redirect("/");

  const supabase = createServiceClient();
  const { data: rows } = await supabase
    .from("course_teachers")
    .select("id, course_id, teacher_id")
    .order("created_at", { ascending: false });

  const { data: users } = await supabase.auth.admin.listUsers();
  const emailById = new Map(
    (users?.users ?? []).map((u) => [u.id, u.email ?? ""]),
  );

  const teacherIds = (rows ?? []).map((r) => r.teacher_id);
  const { data: profiles } = teacherIds.length
    ? await supabase.from("profiles").select("id, display_name").in("id", teacherIds)
    : { data: [] };
  const nameById = new Map(
    (profiles ?? []).map((p) => [p.id, p.display_name as string | null]),
  );

  const teachers: TeacherRow[] = (rows ?? []).map((r) => ({
    id: r.id,
    course_id: r.course_id,
    courseTitle: getCourseConfig(r.course_id)?.title ?? r.course_id,
    email: emailById.get(r.teacher_id) ?? "（帳號已刪除）",
    displayName: nameById.get(r.teacher_id) ?? null,
  }));

  const courses = Object.values(COURSE_CONFIGS).map((c) => ({
    slug: c.slug,
    title: c.title,
  }));

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900">授課老師</h1>
      <p className="mt-2 text-sm text-slate-600">
        指派誰能進入某門課的 /teach 後臺。只有平臺管理者能改這裡。
      </p>

      <TeachersManager courses={courses} teachers={teachers} />
    </main>
  );
}
