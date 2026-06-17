import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getAllInstructorSlugs,
  getInstructorBySlug,
  getInstructorWorkshops,
} from "@/lib/workshops";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "合作講師｜solo.tw",
  description:
    "solo.tw 的合作講師——點進每位老師的專屬頁，看他們開過與正在招生的課程。",
  openGraph: {
    title: "合作講師｜solo.tw",
    description: "點進每位老師的專屬頁，看他們開過與正在招生的課程。",
    url: "https://www.solo.tw/teachers",
  },
};

export default function InstructorsIndexPage() {
  const instructors = getAllInstructorSlugs()
    .map((slug) => getInstructorBySlug(slug))
    .filter((i): i is NonNullable<typeof i> => !!i);

  return (
    <main className="min-h-screen bg-white pb-20">
      <header className="mx-auto max-w-3xl px-4 pt-16 text-center">
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          合作講師
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-stone-500 sm:text-lg">
          每位老師都有一個專屬頁，收錄他們開過與正在招生的課程。把喜歡的老師存起來，隨時回來看下一梯。
        </p>
      </header>

      <div className="mx-auto mt-12 grid max-w-3xl gap-5 px-4 sm:grid-cols-2">
        {instructors.map((ins) => {
          const { enrolling, comingSoon, ended } = getInstructorWorkshops(
            ins.slug as string,
          );
          const openCount = enrolling.length + comingSoon.length;
          return (
            <Link key={ins.slug} href={`/teachers/${ins.slug}`} className="group">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardContent className="flex items-start gap-4 p-5">
                  {ins.avatar && (
                    <Image
                      src={ins.avatar}
                      alt={ins.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 shrink-0 rounded-full object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-stone-900">
                      {ins.name}
                    </h2>
                    <p className="mt-0.5 text-sm text-stone-500">{ins.title}</p>
                    {ins.bio && (
                      <p className="mt-2 line-clamp-2 text-sm text-stone-600">
                        {ins.bio}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-stone-400">
                      {openCount > 0 && `${openCount} 門課程招生中`}
                      {openCount > 0 && ended.length > 0 && "・"}
                      {ended.length > 0 && `${ended.length} 門過去課程`}
                      {openCount === 0 &&
                        ended.length === 0 &&
                        "課程即將公布"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
