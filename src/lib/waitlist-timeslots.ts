/**
 * 偏好時段的單一來源。資料庫的 course_waitlist_timeslot_check 約束、
 * 確認信的四個連結、偏好回填路由的驗證，三者必須用同一份定義。
 */
export const TIMESLOT_CHOICES = [
  { slot: "weekday_evening", label: "平日晚間" },
  { slot: "saturday", label: "週六" },
  { slot: "sunday", label: "週日" },
  { slot: "any", label: "都可以" },
] as const;

export const WAITLIST_TIMESLOTS = TIMESLOT_CHOICES.map((c) => c.slot);

export type WaitlistTimeslot = (typeof TIMESLOT_CHOICES)[number]["slot"];

const LABELS: Record<string, string> = Object.fromEntries(
  TIMESLOT_CHOICES.map((c) => [c.slot, c.label]),
);

export function timeslotLabel(slot: string | null): string {
  return slot ? (LABELS[slot] ?? slot) : "未選";
}
