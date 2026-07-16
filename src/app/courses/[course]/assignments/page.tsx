import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCourseConfig } from "@/lib/courses-config";
import { getVerifiedStudent } from "@/lib/assignment-access";
import { getOwnSubmissions, listPublishedAssignments } from "@/lib/assignments";
import { AccessForm } from "./access-form";

interface PageProps {
  params: Promise<{ course: string }>;
  searchParams: Promise<{ error?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { course: slug } = await params;
  const course = getCourseConfig(slug);
  return {
    title: course ? `作業區｜${course.title}` : "作業區 | solo.tw",
    robots: { index: false, follow: false },
  };
}

function DueLabel({ dueAt }: { dueAt: string | null }) {
  if (!dueAt) return null;
  // Shown, never enforced: a late submission is still a submission.
  return (
    <span className="text-xs text-slate-500">
      建議在 {new Date(dueAt).toLocaleDateString("zh-TW")} 前完成
    </span>
  );
}

export default async function AssignmentsPage({
  params,
  searchParams,
}: PageProps) {
  const { course: slug } = await params;
  const { error } = await searchParams;
  const course = getCourseConfig(slug);
  if (!course) notFound();

  const student = await getVerifiedStudent(slug);

  // No verified session: render the request form and nothing else. Not a single
  // assignment title may appear in this response.
  if (!student) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <p className="text-sm text-slate-500">{course.title}</p>
        <h1 className="mt-1 mb-6 text-2xl font-bold text-slate-900">作業區</h1>
        <AccessForm
          courseId={slug}
          courseName={course.title}
          linkInvalid={error === "link_invalid"}
        />
      </main>
    );
  }

  const assignments = await listPublishedAssignments(slug);
  const submissions = await getOwnSubmissions(
    assignments.map((a) => a.id),
    student.email,
  );

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-sm text-slate-500">{course.title}</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">作業區</h1>
      <p className="mt-2 text-sm text-slate-600">
        哈囉{student.name ? ` ${student.name}` : ""}，交完作業就能領取對應的資源。
      </p>

      {assignments.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          老師還沒有發布作業，晚點再回來看看。
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {assignments.map((a) => {
            const submission = submissions.get(a.id);
            return (
              <li key={a.id}>
                <Link
                  href={`/courses/${slug}/assignments/${a.id}`}
                  className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-400"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold text-slate-900">{a.title}</h2>
                      <div className="mt-1">
                        <DueLabel dueAt={a.due_at} />
                      </div>
                    </div>
                    {submission ? (
                      <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        已繳交
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        未繳交
                      </span>
                    )}
                  </div>
                  {submission?.teacher_comment && (
                    <p className="mt-3 text-xs text-blue-700">老師已經留了評語</p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
