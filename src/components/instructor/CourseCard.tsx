import Link from "next/link";
import type { Workshop } from "@/lib/workshops";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NextCohortNotify } from "@/components/course/NextCohortNotify";

export function CourseCard({ workshop }: { workshop: Workshop }) {
  const isEnded = workshop.status === "ended";
  const isFull = workshop.status === "full";
  const isComing = workshop.status === "coming_soon";
  const instructorSlug = workshop.instructor.slug || "";
  const notify = (
    <NextCohortNotify
      courseSlug={workshop.id}
      courseTitle={workshop.title}
      status={workshop.status}
      sourcePage={`/teachers/${instructorSlug}`}
      instructorSlug={instructorSlug}
    />
  );

  return (
    <Card className={isEnded ? "opacity-70" : undefined}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              {workshop.emoji} {workshop.title}
            </h3>
            <p className="mt-1 text-sm text-stone-500">{workshop.subtitle}</p>
          </div>
          {workshop.cohort && <Badge variant="secondary">{workshop.cohort}</Badge>}
        </div>

        <p className="mt-3 text-sm text-stone-600">
          {workshop.date}・{workshop.time}
        </p>
        {isEnded && workshop.endedNote && (
          <p className="mt-1 text-sm text-stone-500">{workshop.endedNote}</p>
        )}

        <div className="mt-4">
          {!isEnded && !isFull && !isComing && (
            <div className="flex flex-col items-start">
              <Button asChild>
                <Link href={`/courses/${workshop.id}/register`}>立即報名</Link>
              </Button>
              {notify}
            </div>
          )}
          {isComing && notify}
          {isFull && (
            <div>
              <p className="mb-2 text-sm font-medium text-amber-700">本梯已額滿</p>
              {notify}
            </div>
          )}
          {isEnded && (
            <div className="flex flex-wrap items-center gap-3">
              {notify}
              {workshop.recapUrl && (
                <Link href={workshop.recapUrl} className="text-sm text-primary hover:underline">
                  課程回顧 →
                </Link>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
