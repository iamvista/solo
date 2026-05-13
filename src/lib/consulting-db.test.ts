import { describe, it, expect } from "vitest";
import { computeExpiresAt, validateLeadPayload } from "./consulting-db";

describe("computeExpiresAt", () => {
  it("returns purchased_at + 6 months", () => {
    const purchased = new Date("2026-05-13T00:00:00Z");
    const expires = computeExpiresAt(purchased);
    expect(expires.getUTCMonth()).toBe(10); // May (4) + 6 = November (10)
    expect(expires.getUTCFullYear()).toBe(2026);
  });
});

describe("validateLeadPayload", () => {
  it("rejects payload missing specific_problem", () => {
    const result = validateLeadPayload({
      name: "Test",
      email: "t@t.tw",
      contactMethod: "email",
      topics: ["vibe-coding"],
      level: "basic",
      plan: "1hr",
      consentTerms: true,
    });
    expect(result.ok).toBe(false);
  });

  it("accepts a complete valid payload", () => {
    const result = validateLeadPayload({
      name: "Test",
      email: "t@t.tw",
      contactMethod: "email",
      topics: ["vibe-coding"],
      specificProblem: "我想做一個 podcast 推薦工具，但不知道從哪開始也不會 React",
      level: "basic",
      plan: "1hr",
      consentTerms: true,
    });
    expect(result.ok).toBe(true);
  });

  it("rejects specific_problem < 30 chars", () => {
    const result = validateLeadPayload({
      name: "Test",
      email: "t@t.tw",
      contactMethod: "email",
      topics: ["vibe-coding"],
      specificProblem: "太短了",
      level: "basic",
      plan: "1hr",
      consentTerms: true,
    });
    expect(result.ok).toBe(false);
  });
});
