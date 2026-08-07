/**
 * 課程／活動倒數提醒的日期計算。
 *
 * 全部寫成純函式，方便單元測試，也讓 cron 那支 route 只負責取資料與寄信。
 *
 * 為什麼一律換算成臺北當地日曆日：Vercel cron 跑在 UTC（vercel.json 排 `0 2 * * *`，
 * 即臺北 10:00）。若直接拿 UTC 時間加減天數再比對，會在跨日邊界把 D-N 算差一天，
 * 學員就會在錯的日子收到「還有 7 天」。臺北無日光節約時間（固定 UTC+8），
 * 所以「加 N 天」用毫秒運算是安全的，唯一要小心的是格式化成日曆日時指定時區。
 */

const TAIPEI_TZ = "Asia/Taipei";

/** 寄送提醒的天數；由遠到近，對應 D-7／D-5／D-3／D-1。 */
export const REMINDER_OFFSETS = [7, 5, 3, 1] as const;

export type ReminderOffset = (typeof REMINDER_OFFSETS)[number];

/** 把一個時間點格式化成臺北時區的 YYYY-MM-DD（en-CA 的輸出就是這個格式）。 */
export function taipeiDateString(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TAIPEI_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** 回傳 d 之後 days 天的新 Date。臺北無 DST，純加毫秒即可。 */
export function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 86_400_000);
}

/** 以 now 為基準，offsetDays 天後的臺北日曆日（YYYY-MM-DD）。 */
export function targetTaipeiDate(now: Date, offsetDays: number): string {
  return taipeiDateString(addDays(now, offsetDays));
}

/**
 * 今天該為這場活動寄哪些倒數提醒。
 *
 * 回傳的是「今天跑 cron 時命中的 offset」。正常情況最多一個，
 * 但回傳陣列而非單一值，是為了讓 cron 漏跑一天後補寄時不必改介面。
 *
 * @param now        現在時間（cron 執行時間）
 * @param startsAt   開課時間，ISO 字串，必須帶時區（例 "2026-08-30T09:00:00+08:00"）
 */
export function dueOffsets(now: Date, startsAt: string): ReminderOffset[] {
  const start = new Date(startsAt);
  if (Number.isNaN(start.getTime())) return [];

  const startDay = taipeiDateString(start);
  return REMINDER_OFFSETS.filter(
    (offset) => targetTaipeiDate(now, offset) === startDay,
  );
}

/**
 * 內部測試單的金額上限（含）。
 *
 * 測試刷卡一律以 NT$1 開立，真實方案最低是校友價，兩者差了兩個數量級，
 * 100 這條線落在中間很安全。用金額判斷而非寫死 email，是因為測試單
 * 未必都用同一個信箱，而金額是每一筆測試單都有的特徵。
 */
export const TEST_ORDER_MAX_AMOUNT = 100;

/** 這筆報名看起來是內部測試單嗎（測試單不寄開課提醒）。 */
export function isTestOrder(amount: number | null | undefined): boolean {
  if (amount === null || amount === undefined) return true;
  return amount <= TEST_ORDER_MAX_AMOUNT;
}

/**
 * 提醒信的主旨與內文用語。
 *
 * D-1 沿用既有活動提醒的「明天見」語氣；較遠的那幾封講剩餘天數，
 * 避免每一封都長得一樣、被學員當成重複信而略過。
 */
export function reminderCopy(offset: ReminderOffset, courseTitle: string): {
  subject: string;
  headline: string;
  whenLabel: string;
} {
  if (offset === 1) {
    return {
      subject: `明天見！提醒你參加《${courseTitle}》`,
      headline: "明天見！",
      whenLabel: "明天",
    };
  }
  return {
    subject: `還有 ${offset} 天：《${courseTitle}》開課提醒`,
    headline: `還有 ${offset} 天開課`,
    whenLabel: `${offset} 天後`,
  };
}
