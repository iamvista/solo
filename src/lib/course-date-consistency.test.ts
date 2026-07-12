import { describe, it, expect } from "vitest";
import { workshops } from "./workshops";
import { COURSE_CONFIGS } from "./courses-config";

// workshops.ts 的 sortDate 是 ISO 格式（YYYY-MM-DD），直接拆解
function parseSortDate(sortDate: string): [number, number, number] {
  const [y, m, d] = sortDate.split("-").map(Number);
  return [y, m, d];
}

// courses-config.ts 的 date 是「YYYY/M/D（週幾）」，取前段數字部分
function parseConfigDate(date: string): [number, number, number] {
  const match = date.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (!match) {
    throw new Error(`無法解析 courses-config.ts 日期字串：${date}`);
  }
  const [, y, m, d] = match;
  return [Number(y), Number(m), Number(d)];
}

// 兩份課程資料源（workshops.ts 給列表頁、courses-config.ts 給報名表單）以相同 id/slug 對應，
// 曾發生日期漂移（vibe-coding-claude-code 6/27 vs 8/1），A-010 加此測試守住不再漂移。
// status: "coming_soon"（開課通知、日期尚未公告）的課程沒有真實日期可比對，排除在外，
// 只比對兩檔都有明確日期的課程（例：vibe-coding-claude-code 第 2 班取消 8/1 開課後改為此狀態）。
describe("workshops.ts 與 courses-config.ts 日期一致性", () => {
  const sharedIds = workshops
    .filter((w) => w.status !== "coming_soon")
    .map((w) => w.id)
    .filter((id) => id in COURSE_CONFIGS);

  it("至少涵蓋 vibe-coding 這門共用課程", () => {
    expect(sharedIds).toEqual(expect.arrayContaining(["vibe-coding"]));
  });

  it.each(sharedIds)("%s 的開課日期在 workshops.ts 與 courses-config.ts 必須一致", (id) => {
    const workshop = workshops.find((w) => w.id === id)!;
    const config = COURSE_CONFIGS[id];
    expect(parseConfigDate(config.date)).toEqual(parseSortDate(workshop.sortDate));
  });
});
