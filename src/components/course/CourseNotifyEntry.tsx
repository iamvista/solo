import { getWorkshopBySlug } from "@/lib/workshops";
import { NextCohortNotify } from "./NextCohortNotify";

/**
 * 銷售頁用的薄包裝：頁面只傳 slug，課程狀態與標題一律由 workshops 查出，
 * 免得 9 個手寫銷售頁各自硬編碼一份會漂移的課程資料。
 */
export function CourseNotifyEntry({ slug }: { slug: string }) {
  const workshop = getWorkshopBySlug(slug);
  if (!workshop) return null;

  return (
    <div className="mt-6 flex justify-center">
      <NextCohortNotify
        courseSlug={workshop.id}
        courseTitle={workshop.title}
        status={workshop.status}
        sourcePage={`/courses/${workshop.id}`}
        instructorSlug={workshop.instructor.slug || undefined}
      />
    </div>
  );
}
