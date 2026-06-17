import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getInstructorBySlug,
  getAllInstructorSlugs,
  getInstructorWorkshops,
} from "@/lib/workshops";
import { InstructorHero } from "@/components/instructor/InstructorHero";
import { CourseCard } from "@/components/instructor/CourseCard";

export function generateStaticParams() {
  return getAllInstructorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const instructor = getInstructorBySlug(slug);
  if (!instructor) return { title: "找不到老師 | solo.tw" };
  const title = `${instructor.name}｜${instructor.title} - solo.tw`;
  const description = instructor.bio || `${instructor.name} 的所有課程`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.solo.tw/teachers/${slug}`,
      images: instructor.avatar ? [instructor.avatar] : undefined,
    },
  };
}

export default async function InstructorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const instructor = getInstructorBySlug(slug);
  if (!instructor) notFound();

  const { enrolling, comingSoon, ended } = getInstructorWorkshops(slug);

  return (
    <main className="min-h-screen bg-white pb-20">
      <InstructorHero instructor={instructor} />

      <div className="mx-auto mt-12 max-w-3xl space-y-12 px-4">
        {enrolling.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-stone-900">正在招生</h2>
            <div className="space-y-4">
              {enrolling.map((w) => (
                <CourseCard key={w.id} workshop={w} />
              ))}
            </div>
          </section>
        )}

        {comingSoon.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-stone-900">即將開課</h2>
            <div className="space-y-4">
              {comingSoon.map((w) => (
                <CourseCard key={w.id} workshop={w} />
              ))}
            </div>
          </section>
        )}

        {ended.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-stone-900">過去開過的課</h2>
            <p className="mb-4 text-sm text-stone-500">
              想上這些課的下一梯？留下聯絡方式，開課第一個通知你。
            </p>
            <div className="space-y-4">
              {ended.map((w) => (
                <CourseCard key={w.id} workshop={w} />
              ))}
            </div>
          </section>
        )}

        {enrolling.length === 0 && comingSoon.length === 0 && ended.length === 0 && (
          <p className="text-center text-stone-500">這位老師還沒有上架課程。</p>
        )}
      </div>
    </main>
  );
}
