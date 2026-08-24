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

  it("每一門有報名表單的課都納入比對（現行 4 門：ai-content 等）", () => {
    // 這條原本釘死 "vibe-coding"。那門課在第 8 班沒開成之後被移出 COURSE_CONFIGS
    // （見 courses-config.ts 的註解），守門測試從此變成常紅的假警報——紅的是測試
    // 的前提，不是資料。釘任何一門具名課程都會這樣：課程一汰換就過期。
    //
    // 改成從資料推導：COURSE_CONFIGS 裡的每一門課都正在收報名，因此它必然要在
    // workshops.ts 有對應條目、狀態也不能是 coming_soon，否則 /courses 列表上
    // 要嘛看不到它、要嘛顯示「日期尚未公告」。這個不變式不隨課程汰換而過期，
    // 而且比原本強：原本只保證某一門課在比對範圍內，現在保證沒有任何一門漏掉。
    //
    // 同時它也守住原本那條的用意——sharedIds 一旦變空，下面的 it.each 會產生
    // 零個測試，日期漂移的保護就無聲消失，而測試仍然全綠。
    expect([...sharedIds].sort()).toEqual(Object.keys(COURSE_CONFIGS).sort());
  });

  it.each(sharedIds)("%s 的開課日期在 workshops.ts 與 courses-config.ts 必須一致", (id) => {
    const workshop = workshops.find((w) => w.id === id)!;
    const config = COURSE_CONFIGS[id];
    expect(parseConfigDate(config.date)).toEqual(parseSortDate(workshop.sortDate));
  });
});
