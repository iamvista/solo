import { describe, it, expect } from "vitest";
import {
  normalizeCode,
  isCourseInScope,
  computeCommission,
  canTransitionReferral,
} from "./affiliates";

describe("normalizeCode", () => {
  it("trims and uppercases", () => {
    expect(normalizeCode("  vista20 ")).toBe("VISTA20");
  });
  it("returns empty string for blank", () => {
    expect(normalizeCode("   ")).toBe("");
  });
});

describe("isCourseInScope", () => {
  it("null scope = all courses", () => {
    expect(isCourseInScope(null, "concept-monetization-bootcamp")).toBe(true);
  });
  it("empty scope = all courses", () => {
    expect(isCourseInScope([], "any-course")).toBe(true);
  });
  it("restricts to listed courses", () => {
    expect(isCourseInScope(["a", "b"], "b")).toBe(true);
    expect(isCourseInScope(["a", "b"], "c")).toBe(false);
  });
});

describe("computeCommission", () => {
  it("rounds to nearest integer", () => {
    expect(computeCommission(9999, 0.2)).toBe(2000); // 1999.8 → 2000
  });
  it("handles zero/negative amount", () => {
    expect(computeCommission(0, 0.2)).toBe(0);
    expect(computeCommission(-100, 0.2)).toBe(0);
  });
});

describe("canTransitionReferral", () => {
  it("allows the legal transitions", () => {
    expect(canTransitionReferral("pending", "approved")).toBe(true);
    expect(canTransitionReferral("approved", "paid")).toBe(true);
    expect(canTransitionReferral("pending", "void")).toBe(true);
    expect(canTransitionReferral("paid", "void")).toBe(true);
  });
  it("rejects illegal transitions", () => {
    expect(canTransitionReferral("pending", "paid")).toBe(false);
    expect(canTransitionReferral("void", "approved")).toBe(false);
    expect(canTransitionReferral("paid", "approved")).toBe(false);
  });
});
