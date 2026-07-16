import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCourseConfig } from "@/lib/courses-config";
import { getCurrentTeacher, listTeachingCourseIds } from "@/lib/teaching";

export const metadata: Metadata = {
  title: "我教的課 | solo.tw",
  robots: { index: false, follow: false },
};

export default async function TeachHomePage() {
  const teacher = await getCurrentTeacher();
  if (!teacher) redirect("/auth/login?redirect=/teach");

  const courseIds = await listTeachingCourseIds(teacher.id);

  // Courses live in the config file, not the database, so a mapping can outlive
  // its course. Skip those rather than crash — see design.md 風險.
  const courses = courseIds
    .map((id) => getCourseConfig(id))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900">我教的課</h1>
      <p className="mt-2 text-sm text-slate-600">{teacher.email}</p>

      {courses.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          目前沒有指派給你的課程。
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {courses.map((course) => (
            <li key={course.slug}>
              <Link
                href={`/teach/${course.slug}`}
                className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-400"
              >
                <h2 className="font-semibold text-slate-900">{course.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{course.subtitle}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
