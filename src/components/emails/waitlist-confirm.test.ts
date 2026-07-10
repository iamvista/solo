import { describe, it, expect } from "vitest";
import { waitlistConfirmText } from "./waitlist-confirm";
import { TIMESLOT_CHOICES } from "@/lib/waitlist-timeslots";

const BASE = "https://www.solo.tw/waitlist/preference?token=abc.def";
const UNSUB = "https://www.solo.tw/waitlist/unsubscribe?token=abc.def";

const props = {
  name: "Vista",
  courseTitle: "AI 內容產製系統工作坊",
  intent: "date_conflict" as const,
  preferenceUrlBase: BASE,
  unsubscribeUrl: UNSUB,
};

describe("waitlistConfirmText", () => {
  it("puts each timeslot link on its own line", () => {
    const lines = waitlistConfirmText(props).split("\n");
    for (const { slot, label } of TIMESLOT_CHOICES) {
      const line = lines.find((l) => l.includes(`&slot=${slot}`));
      expect(line, `missing line for ${slot}`).toBeDefined();
      expect(line).toBe(`${label}：${BASE}&slot=${slot}`);
    }
  });

  it("never runs a label into the preceding url", () => {
    const text = waitlistConfirmText(props);
    // 這正是 Resend 自動轉換造成的缺陷：`...&slot=weekday_evening週六`
    for (const { label } of TIMESLOT_CHOICES) {
      expect(text).not.toMatch(new RegExp(`&slot=[a-z_]+${label}`));
    }
  });

  it("keeps every url intact and separately clickable", () => {
    const text = waitlistConfirmText(props);
    const urls = text.match(/https:\/\/\S+/g) ?? [];
    expect(urls).toHaveLength(TIMESLOT_CHOICES.length + 1); // 四個時段 + 一個退訂
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toContain(UNSUB);
  });

  it("uses the waitlist wording when the course is full", () => {
    const text = waitlistConfirmText({ ...props, intent: "full_waitlist" });
    expect(text).toContain("已將你排入候補名單");
    expect(text).not.toContain("下次開課第一個通知你");
  });

  it("uses the next-cohort wording when the course still has seats", () => {
    const text = waitlistConfirmText(props);
    expect(text).toContain("下次開課第一個通知你");
    expect(text).not.toContain("已將你排入候補名單");
  });

  it("includes the course title and the unsubscribe link", () => {
    const text = waitlistConfirmText(props);
    expect(text).toContain("《AI 內容產製系統工作坊》");
    expect(text).toContain(UNSUB);
  });
});
