import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCohort, getCourseConfig } from "@/lib/courses-config";
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

  // Only this student's cohorts. A first-cohort student must not be handed the
  // second cohort's work; a returning student who paid for both sees both.
  const assignments = await listPublishedAssignments(slug, student.cohortKeys);
  const submissions = await getOwnSubmissions(
    assignments.map((a) => a.id),
    student.email,
  );

  // Grouped by cohort, in the order the config declares them. One cohort is the
  // normal case and renders as a plain list; two only happens for a returning
  // student, and then the heading is what tells them which is which.
  const byCohort = course.cohorts
    .filter((c) => student.cohortKeys.includes(c.key))
    .map((c) => ({
      cohort: c,
      items: assignments.filter((a) => a.cohort_key === c.key),
    }))
    .filter((g) => g.items.length > 0);
  const showCohortHeadings = byCohort.length > 1;

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
        <div className="mt-8 space-y-8">
          {byCohort.map(({ cohort, items }) => (
            <section key={cohort.key}>
              {showCohortHeadings && (
                <h2 className="mb-3 text-sm font-semibold text-slate-500">
                  {cohort.name}（{cohort.date}）
                </h2>
              )}
              <ul className="space-y-3">
                {items.map((a) => {
                  const submission = submissions.get(a.id);
                  return (
                    <li key={a.id}>
                      <Link
                        href={`/courses/${slug}/assignments/${a.id}`}
                        className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-400"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {a.title}
                            </h3>
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
                          <p className="mt-3 text-xs text-blue-700">
                            老師已經留了評語
                          </p>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

    </main>
  );
}
