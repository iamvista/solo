import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCourseConfig } from "@/lib/courses-config";
import { requireCourseTeacher } from "@/lib/teaching";
import { AssignmentForm } from "../../assignment-form";

interface PageProps {
  params: Promise<{ course: string }>;
}

export const metadata: Metadata = {
  title: "新增作業 | solo.tw",
  robots: { index: false, follow: false },
};

export default async function NewAssignmentPage({ params }: PageProps) {
  const { course: slug } = await params;
  const course = getCourseConfig(slug);
  if (!course) notFound();

  const teacher = await requireCourseTeacher(slug);
  if (!teacher) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link
        href={`/teach/${slug}`}
        className="text-sm text-slate-500 hover:text-slate-900"
      >
        ← {course.title}
      </Link>

      <h1 className="mt-4 mb-8 text-2xl font-bold text-slate-900">新增作業</h1>

      <AssignmentForm
        courseId={slug}
        cohorts={course.cohorts}
        onDone={`/teach/${slug}`}
      />
    </main>
  );
}
