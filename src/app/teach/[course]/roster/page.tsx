import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCourseConfig } from "@/lib/courses-config";
import { createServiceClient } from "@/lib/supabase/service";
import { requireCourseTeacher } from "@/lib/teaching";
import { RosterManager, type GuestRow } from "./roster-manager";

interface PageProps {
  params: Promise<{ course: string }>;
}

export const metadata: Metadata = {
  title: "手動加入的學員 | solo.tw",
  robots: { index: false, follow: false },
};

export default async function RosterPage({ params }: PageProps) {
  const { course: slug } = await params;
  const course = getCourseConfig(slug);
  if (!course) notFound();

  const teacher = await requireCourseTeacher(slug);
  if (!teacher) notFound();

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("course_guests")
    .select("id, email, name, note, created_at")
    .eq("course_id", slug)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link
        href={`/teach/${slug}`}
        className="text-sm text-slate-500 hover:text-slate-900"
      >
        ← {course.title}
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">手動加入的學員</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        給沒有透過刷卡報名的人用：匯款、贈送、合作換課、助教旁聽。加進來的人
        跟付費學員完全一樣，填 email 就能收到入口連結。
      </p>

      <RosterManager courseId={slug} guests={(data ?? []) as GuestRow[]} />
    </main>
  );
}
