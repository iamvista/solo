import { getWorkshopBySlug } from "@/lib/workshops";
import { WaitlistForm } from "@/components/instructor/WaitlistForm";
import type { WaitlistIntent } from "@/lib/waitlist";

/**
 * 銷售頁尾的候補入口。
 *
 * 與 CourseNotifyEntry 的差別在位置與意圖：頁尾距離報名按鈕整整一頁內容，
 * 會滑到這裡還沒報名的人多半已決定這期不報，因此表單直接展開，不必先點一下。
 * 兩個入口的 source_page 不同，後臺才分得出各自收到多少名單。
 */
export function CourseNotifyFooter({ slug }: { slug: string }) {
  const workshop = getWorkshopBySlug(slug);

  if (!workshop) {
    // 靜默 return null 會讓銷售頁掛著一個什麼都不渲染的入口而沒人發現，
    // 所以開發期直接炸開；線上則以不破版為優先。
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        `CourseNotifyFooter：查無課程「${slug}」，請確認該 slug 已登記於 workshops.ts`,
      );
    }
    return null;
  }

  const isFull = workshop.status === "full";
  const intent: WaitlistIntent = isFull ? "full_waitlist" : "date_conflict";
  // intent 只有兩種，區塊提示卻要三種：date_conflict 涵蓋的狀態裡，
  // coming_soon 根本還沒公告日期，說「時間對不上」是在問一個不存在的日期。
  const prompt = isFull
    ? {
        heading: "這期已經額滿？",
        detail: "留下 E-mail，有名額釋出時第一時間通知你。",
      }
    : workshop.status === "coming_soon"
      ? {
          heading: "還沒公告開課日期？",
          detail: "留下 E-mail，日期一公告就第一時間通知你。",
        }
      : {
          heading: "這期時間對不上？",
          detail: "留下 E-mail，下期開課時第一時間通知你。",
        };

  return (
    <section className="border-t py-14 sm:py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            📬 {prompt.heading}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {prompt.detail}
          </p>
        </div>
        <WaitlistForm
          courseSlug={workshop.id}
          courseTitle={workshop.title}
          intent={intent}
          sourcePage={`/courses/${workshop.id}#footer`}
          instructorSlug={workshop.instructor.slug || undefined}
        />
      </div>
    </section>
  );
}
