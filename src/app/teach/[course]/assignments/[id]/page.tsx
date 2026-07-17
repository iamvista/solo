import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCourseConfig } from "@/lib/courses-config";
import { getAssignment, getSubmissionFiles } from "@/lib/assignments";
import { listRewards } from "@/lib/rewards";
import {
  getLastNotification,
  listSubmissions,
  requireCourseTeacher,
} from "@/lib/teaching";
import { AssignmentForm } from "../../assignment-form";
import { ReviewForm } from "./review-form";
import { RewardsManager } from "./rewards-manager";
import { NotifyButton } from "./notify-button";

interface PageProps {
  params: Promise<{ course: string; id: string }>;
}

export const metadata: Metadata = {
  title: "繳交名單 | solo.tw",
  robots: { index: false, follow: false },
};

export default async function TeachAssignmentPage({ params }: PageProps) {
  const { course: slug, id } = await params;
  const course = getCourseConfig(slug);
  if (!course) notFound();

  const teacher = await requireCourseTeacher(slug);
  if (!teacher) notFound();

  const assignment = await getAssignment(id);
  // Confirm the assignment really belongs to this course: without it, a teacher
  // could open another course's assignment by pasting its id under their own
  // course's URL.
  if (!assignment || assignment.course_id !== slug) notFound();

  const [submissions, rewards, lastNotification] = await Promise.all([
    listSubmissions(assignment.id),
    listRewards(assignment.id),
    getLastNotification(assignment.id),
  ]);
  const filesBySubmission = new Map(
    await Promise.all(
      submissions.map(
        async (s) => [s.id, await getSubmissionFiles(s.id)] as const,
      ),
    ),
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <Link
        href={`/teach/${slug}`}
        className="text-sm text-slate-500 hover:text-slate-900"
      >
        ← {course.title}
      </Link>

      <div className="mt-4 flex items-center gap-2">
        <h1 className="text-2xl font-bold text-slate-900">{assignment.title}</h1>
        {!assignment.is_published && (
          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
            未發布
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-500">
        收到 {submissions.length} 份繳交
      </p>

      <div className="mt-6">
        <NotifyButton
          assignmentId={assignment.id}
          isPublished={assignment.is_published}
          lastNotifiedAt={lastNotification?.sent_at ?? null}
          lastRecipientCount={lastNotification?.recipient_count ?? null}
        />
      </div>

      <details className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <summary className="cursor-pointer text-sm font-medium text-slate-900">
          編輯這份作業
        </summary>
        <div className="mt-4">
          <AssignmentForm
            courseId={slug}
            cohorts={course.cohorts}
            initial={{
              id: assignment.id,
              cohort_key: assignment.cohort_key ?? "",
              title: assignment.title,
              description: assignment.description ?? "",
              sort_order: assignment.sort_order,
              allow_file: assignment.allow_file,
              allow_text: assignment.allow_text,
              allow_link: assignment.allow_link,
              due_at: assignment.due_at ?? "",
              is_published: assignment.is_published,
            }}
          />
        </div>
      </details>

      <RewardsManager assignmentId={assignment.id} rewards={rewards} />

      <h2 className="mt-10 text-lg font-semibold text-slate-900">繳交名單</h2>

      {submissions.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          還沒有人繳交。
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {submissions.map((s) => {
            const files = filesBySubmission.get(s.id) ?? [];
            return (
              <li
                key={s.id}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-sm font-medium text-slate-900">
                    {s.student_email}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(s.updated_at).toLocaleString("zh-TW")}
                    {s.reviewed_at ? "・已批改" : "・未批改"}
                  </span>
                </div>

                {s.text_content && (
                  <p className="mt-3 whitespace-pre-wrap rounded bg-slate-50 p-3 text-sm text-slate-700">
                    {s.text_content}
                  </p>
                )}

                {s.link_url && (
                  <p className="mt-3 text-sm">
                    <a
                      href={s.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {s.link_url}
                    </a>
                  </p>
                )}

                {files.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {files.map((f) => (
                      <li key={f.id} className="text-sm text-slate-600">
                        📎 {f.filename}（{Math.round(f.size_bytes / 1024)} KB）
                      </li>
                    ))}
                  </ul>
                )}

                <ReviewForm
                  submissionId={s.id}
                  initialComment={s.teacher_comment ?? ""}
                />
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
