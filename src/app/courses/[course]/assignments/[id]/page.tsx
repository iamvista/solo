import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCourseConfig } from "@/lib/courses-config";
import { getVerifiedStudent } from "@/lib/assignment-access";
import {
  getAssignment,
  getOwnSubmission,
  getSubmissionFiles,
} from "@/lib/assignments";
import { listUnlockedRewards } from "@/lib/rewards";
import { SubmitForm } from "./submit-form";
import { RewardsSection } from "./rewards-section";

interface PageProps {
  params: Promise<{ course: string; id: string }>;
}

export const metadata: Metadata = {
  title: "作業 | solo.tw",
  robots: { index: false, follow: false },
};

export default async function AssignmentDetailPage({ params }: PageProps) {
  const { course: slug, id } = await params;
  const course = getCourseConfig(slug);
  if (!course) notFound();

  const assignment = await getAssignment(id);

  // The id is user-supplied, so confirm the assignment really belongs to the
  // course in the URL. Without that check a session for course X would open an
  // assignment from course Y just by pasting its id.
  if (!assignment || assignment.course_id !== slug || !assignment.is_published) {
    notFound();
  }

  const student = await getVerifiedStudent(slug);
  if (!student) {
    redirect(`/courses/${slug}/assignments`);
  }

  const submission = await getOwnSubmission(assignment.id, student.email);
  const [files, rewards] = await Promise.all([
    submission ? getSubmissionFiles(submission.id) : Promise.resolve([]),
    // Returns [] until the student has submitted, so nothing about a locked
    // reward — not even its title — reaches the page.
    listUnlockedRewards(assignment.id, student.email),
  ]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link
        href={`/courses/${slug}/assignments`}
        className="text-sm text-slate-500 hover:text-slate-900"
      >
        ← 回作業區
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        {assignment.title}
      </h1>

      {assignment.due_at && (
        <p className="mt-1 text-xs text-slate-500">
          建議在 {new Date(assignment.due_at).toLocaleDateString("zh-TW")} 前完成
        </p>
      )}

      {assignment.description && (
        <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {assignment.description}
        </div>
      )}

      <RewardsSection
        rewards={rewards.map((r) => ({
          id: r.id,
          kind: r.kind,
          title: r.title,
          description: r.description,
          // listUnlockedRewards() returns [] until the student has submitted,
          // so a locked passage never reaches the page in the first place.
          body: r.body_text,
        }))}
      />

      {submission?.teacher_comment && (
        <section className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-5">
          <h2 className="text-sm font-semibold text-blue-900">老師的評語</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-blue-900">
            {submission.teacher_comment}
          </p>
        </section>
      )}

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {submission ? "你的繳交" : "繳交作業"}
        </h2>
        <SubmitForm
          assignmentId={assignment.id}
          allowFile={assignment.allow_file}
          allowText={assignment.allow_text}
          allowLink={assignment.allow_link}
          initialText={submission?.text_content ?? ""}
          initialLink={submission?.link_url ?? ""}
          existingFiles={files.map((f) => ({ id: f.id, filename: f.filename }))}
          hasSubmitted={Boolean(submission)}
        />
      </section>
    </main>
  );
}
