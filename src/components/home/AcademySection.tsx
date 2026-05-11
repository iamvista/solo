import Link from "next/link";
import { Button } from "@/components/ui/button";

const courses = [
  {
    title: "Vibe Coding 實戰課程",
    subtitle: "不寫程式也能打造你的數位產品",
    description:
      "學會用自然語言和 AI 協作，從想法到上線只需要一個下午。專為零程式基礎的創業者、自由工作者、行銷人設計。",
    price: "NT$2,980",
    originalPrice: "NT$3,980",
    badge: "早鳥優惠",
    href: "https://www.solo.tw/courses/vibe-coding",
    lessons: 21,
    chapters: 6,
  },
];

export function AcademySection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 py-20 sm:py-28 lg:py-36">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary sm:text-base">
            線上課程
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            用 AI 學會打造你的
            <span className="bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">
              數位產品
            </span>
          </h2>
          <p className="mt-4 text-lg text-stone-400 sm:text-xl">
            不只給你工具，更教你從零到一的完整方法。實戰課程，學完就能用。
          </p>
        </div>

        {/* Course cards */}
        <div className="mx-auto mt-12 max-w-3xl sm:mt-16">
          {courses.map((course) => (
            <Link
              key={course.title}
              href={course.href}
              className="group block rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-primary/30 hover:bg-white/10 sm:p-8"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                <div className="flex-1">
                  {course.badge && (
                    <span className="inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
                      {course.badge}
                    </span>
                  )}
                  <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-base text-stone-300">
                    {course.subtitle}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-stone-400">
                    {course.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-stone-500">
                    <span>{course.chapters} 章</span>
                    <span>·</span>
                    <span>{course.lessons} 堂課</span>
                  </div>
                </div>

                <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {course.price}
                    </p>
                    {course.originalPrice && (
                      <p className="text-sm text-stone-500 line-through">
                        {course.originalPrice}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-medium text-primary transition group-hover:translate-x-1">
                    前往課程 →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom link */}
        <div className="mt-10 text-center">
          <Button
            asChild
            variant="outline"
            className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/courses">
              瀏覽所有線上課程
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
