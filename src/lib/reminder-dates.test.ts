import { describe, it, expect } from "vitest";
import {
  taipeiDateString,
  addDays,
  targetTaipeiDate,
  dueOffsets,
  reminderCopy,
  REMINDER_OFFSETS,
  isTestOrder,
  TEST_ORDER_MAX_AMOUNT,
} from "./reminder-dates";

// cron 實際跑在 UTC 02:00，換算臺北是同日 10:00。
const cronAt = (taipeiDate: string) => new Date(`${taipeiDate}T02:00:00Z`);

describe("taipeiDateString", () => {
  it("以臺北時區輸出日曆日", () => {
    expect(taipeiDateString(new Date("2026-08-30T01:00:00Z"))).toBe("2026-08-30");
  });

  it("UTC 當天尚未跨日、臺北已跨日時，回傳臺北那一天", () => {
    // UTC 8/29 17:00 ＝ 臺北 8/30 01:00
    expect(taipeiDateString(new Date("2026-08-29T17:00:00Z"))).toBe("2026-08-30");
  });

  it("UTC 已跨日、臺北仍是前一天時，回傳臺北那一天", () => {
    // UTC 8/30 00:30 ＝ 臺北 8/30 08:30，仍同日；取更極端的：UTC 8/30 15:59 ＝ 臺北 8/30 23:59
    expect(taipeiDateString(new Date("2026-08-30T15:59:00Z"))).toBe("2026-08-30");
    // UTC 8/30 16:00 ＝ 臺北 8/31 00:00
    expect(taipeiDateString(new Date("2026-08-30T16:00:00Z"))).toBe("2026-08-31");
  });
});

describe("addDays", () => {
  it("跨月正確", () => {
    expect(taipeiDateString(addDays(cronAt("2026-08-30"), 3))).toBe("2026-09-02");
  });

  it("跨年正確", () => {
    expect(taipeiDateString(addDays(cronAt("2026-12-30"), 5))).toBe("2027-01-04");
  });
});

describe("targetTaipeiDate", () => {
  it("回傳 N 天後的臺北日曆日", () => {
    expect(targetTaipeiDate(cronAt("2026-08-23"), 7)).toBe("2026-08-30");
  });
});

describe("dueOffsets", () => {
  const startsAt = "2026-08-30T09:00:00+08:00";

  it.each([
    ["2026-08-23", 7],
    ["2026-08-25", 5],
    ["2026-08-27", 3],
    ["2026-08-29", 1],
  ])("cron 在臺北 %s 跑時命中 D-%i", (day, offset) => {
    expect(dueOffsets(cronAt(day as string), startsAt)).toEqual([offset]);
  });

  it.each([["2026-08-22"], ["2026-08-24"], ["2026-08-26"], ["2026-08-28"]])(
    "非提醒日 %s 不寄任何一封",
    (day) => {
      expect(dueOffsets(cronAt(day as string), startsAt)).toEqual([]);
    },
  );

  it("開課當天與開課後都不再寄", () => {
    expect(dueOffsets(cronAt("2026-08-30"), startsAt)).toEqual([]);
    expect(dueOffsets(cronAt("2026-08-31"), startsAt)).toEqual([]);
  });

  it("startsAt 格式錯誤時回空陣列，不讓 cron 爆掉", () => {
    expect(dueOffsets(cronAt("2026-08-23"), "not-a-date")).toEqual([]);
    expect(dueOffsets(cronAt("2026-08-23"), "")).toEqual([]);
  });

  it("開課時間落在臺北深夜時，D-N 仍以臺北日曆日計算", () => {
    // 臺北 8/30 00:30 開始 ＝ UTC 8/29 16:30；若誤用 UTC 日會算成 8/29，D-7 就會差一天
    const lateNight = "2026-08-30T00:30:00+08:00";
    expect(dueOffsets(cronAt("2026-08-23"), lateNight)).toEqual([7]);
  });
});

describe("isTestOrder", () => {
  it("NT$1 的測試刷卡視為測試單", () => {
    expect(isTestOrder(1)).toBe(true);
  });

  it("金額為 null 或 undefined 時保守視為測試單，不寄", () => {
    expect(isTestOrder(null)).toBe(true);
    expect(isTestOrder(undefined)).toBe(true);
  });

  it("真實課程價格不會被誤判", () => {
    for (const amount of [3500, 4500, 5000, 6800, 7000]) {
      expect(isTestOrder(amount), `NT$${amount} 被誤判為測試單`).toBe(false);
    }
  });

  it("邊界值：門檻本身算測試單，門檻加一不算", () => {
    expect(isTestOrder(TEST_ORDER_MAX_AMOUNT)).toBe(true);
    expect(isTestOrder(TEST_ORDER_MAX_AMOUNT + 1)).toBe(false);
  });
});

describe("reminderCopy", () => {
  it("D-1 用明天見的語氣", () => {
    const c = reminderCopy(1, "AI 內容產製系統工作坊");
    expect(c.subject).toContain("明天見");
    expect(c.whenLabel).toBe("明天");
  });

  it("其餘幾封講剩餘天數，主旨彼此不同", () => {
    const subjects = REMINDER_OFFSETS.map(
      (o) => reminderCopy(o, "AI 內容產製系統工作坊").subject,
    );
    expect(new Set(subjects).size).toBe(REMINDER_OFFSETS.length);
  });

  it("主旨帶課名", () => {
    expect(reminderCopy(7, "測試課").subject).toContain("測試課");
  });
});
