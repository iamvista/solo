"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WaitlistForm } from "@/components/instructor/WaitlistForm";
import type { Workshop } from "@/lib/workshops";
import type { WaitlistIntent } from "@/lib/waitlist";

/**
 * 課程頁與課程卡片共用的「下期開課通知」入口。
 *
 * 課程還有名額時，入口是報名按鈕下方一行低調的次要連結：會點它的人本來
 * 就不會報名當期，因此不與「立即報名」搶主要行動點。課程額滿時沒有這層
 * 顧慮，表單直接呈現。
 */
export function NextCohortNotify({
  courseSlug,
  courseTitle,
  status,
  sourcePage,
  instructorSlug,
}: {
  courseSlug: string;
  courseTitle: string;
  status: Workshop["status"];
  sourcePage: string;
  instructorSlug?: string;
}) {
  const isFull = status === "full";
  const hasSeats = status === "open" || status === "filling";
  const intent: WaitlistIntent = isFull ? "full_waitlist" : "date_conflict";

  const [open, setOpen] = useState(false);

  const form = (
    <WaitlistForm
      courseSlug={courseSlug}
      courseTitle={courseTitle}
      intent={intent}
      sourcePage={sourcePage}
      instructorSlug={instructorSlug}
      onCancel={isFull ? undefined : () => setOpen(false)}
    />
  );

  // 額滿：沒有報名按鈕可搶，表單就是主要行動點
  if (isFull) return form;

  if (open) return form;

  // 有名額：次要文字連結，視覺層級明確低於「立即報名」
  if (hasSeats) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 text-sm text-stone-500 underline underline-offset-4 transition-colors hover:text-stone-800"
      >
        這個時間無法參加？留下 E-mail，下次開課通知你
      </button>
    );
  }

  // coming_soon / ended：沒有當期可報名，維持既有的按鈕入口
  return (
    <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
      通知我下一梯
    </Button>
  );
}
