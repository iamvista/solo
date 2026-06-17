import Link from "next/link";
import type { Workshop } from "@/lib/workshops";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WaitlistForm } from "./WaitlistForm";

export function CourseCard({ workshop }: { workshop: Workshop }) {
  const isEnded = workshop.status === "ended";
  const isFull = workshop.status === "full";
  const isComing = workshop.status === "coming_soon";
  const instructorSlug = workshop.instructor.slug || "";

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
            <Button asChild>
              <Link href={`/courses/${workshop.id}/register`}>立即報名</Link>
            </Button>
          )}
          {isComing && (
            <WaitlistForm courseSlug={workshop.id} instructorSlug={instructorSlug} courseTitle={workshop.title} />
          )}
          {isFull && (
            <div>
              <p className="mb-2 text-sm font-medium text-amber-700">本梯已額滿</p>
              <WaitlistForm courseSlug={workshop.id} instructorSlug={instructorSlug} courseTitle={workshop.title} />
            </div>
          )}
          {isEnded && (
            <div className="flex flex-wrap items-center gap-3">
              <WaitlistForm courseSlug={workshop.id} instructorSlug={instructorSlug} courseTitle={workshop.title} />
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
