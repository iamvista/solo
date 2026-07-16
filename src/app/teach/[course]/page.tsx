import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCourseConfig } from "@/lib/courses-config";
import { listAllAssignments } from "@/lib/assignments";
import { countSubmissions, requireCourseTeacher } from "@/lib/teaching";

interface PageProps {
  params: Promise<{ course: string }>;
}

export const metadata: Metadata = {
  title: "課程作業 | solo.tw",
  robots: { index: false, follow: false },
};

export default async function TeachCoursePage({ params }: PageProps) {
  const { course: slug } = await params;
  const course = getCourseConfig(slug);
  if (!course) notFound();

  // notFound() rather than a "no permission" page: a teacher of another course
  // learns nothing about this one, not even that it has assignments.
  const teacher = await requireCourseTeacher(slug);
  if (!teacher) notFound();

  const assignments = await listAllAssignments(slug);
  const counts = await countSubmissions(assignments.map((a) => a.id));

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/teach" className="text-sm text-slate-500 hover:text-slate-900">
        ← 我教的課
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
          <p className="mt-1 text-sm text-slate-500">作業與資源</p>
        </div>
        <Link
          href={`/teach/${slug}/assignments/new`}
          className="shrink-0 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          新增作業
        </Link>
      </div>

      {assignments.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          還沒有作業。
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {assignments.map((a) => (
            <li key={a.id}>
              <Link
                href={`/teach/${slug}/assignments/${a.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-400"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-slate-900">{a.title}</h2>
                    {!a.is_published && (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                        未發布
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    收到 {counts.get(a.id) ?? 0} 份繳交
                  </p>
                </div>
                <span className="text-sm text-slate-400">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
