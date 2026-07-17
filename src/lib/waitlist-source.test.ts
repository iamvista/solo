import { describe, it, expect } from "vitest";
import { sourceLabel, courseLabel } from "./waitlist-source";
import { workshops } from "./workshops";

describe("courseLabel", () => {
  it("shows the course title rather than the slug", () => {
    const w = workshops[0];
    expect(courseLabel(w.id)).toBe(w.title);
  });

  it("falls back to the slug for a course no longer in the catalogue", () => {
    // course_waitlist 可能留有已下架課程的候補者，他們不該從選單消失
    expect(courseLabel("ai-social-content-old")).toBe("ai-social-content-old");
  });
});

describe("sourceLabel", () => {
  it.each([
    ["/courses/ai-academic-writing#footer", "頁尾"],
    ["/courses/ai-academic-writing", "報名按鈕下方"],
    ["/courses/ai-content/notify", "廣告落地頁"],
    ["/teachers/vista", "講師頁"],
  ])("maps %s to %s", (sourcePage, expected) => {
    expect(sourceLabel(sourcePage)).toBe(expected);
  });

  it("distinguishes the two entries on the same sales page", () => {
    // 這組差異就是整個 #footer 歸因存在的理由
    expect(sourceLabel("/courses/vibe-coding#footer")).not.toBe(
      sourceLabel("/courses/vibe-coding"),
    );
  });

  it("shows a dash when there is no source", () => {
    expect(sourceLabel(null)).toBe("—");
  });

  it("passes through an unrecognised source rather than guessing", () => {
    expect(sourceLabel("/some/new/surface")).toBe("/some/new/surface");
  });
});
