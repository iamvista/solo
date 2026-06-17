import { describe, it, expect } from "vitest";
import {
  getInstructorBySlug,
  getAllInstructorSlugs,
  getInstructorWorkshops,
} from "./workshops";

describe("getAllInstructorSlugs", () => {
  it("includes vista", () => {
    expect(getAllInstructorSlugs()).toContain("vista");
  });
  it("returns no empty strings and no duplicates", () => {
    const slugs = getAllInstructorSlugs();
    expect(slugs.every((s) => s.length > 0)).toBe(true);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getInstructorBySlug", () => {
  it("finds vista", () => {
    expect(getInstructorBySlug("vista")?.name).toBe("Vista");
  });
  it("returns undefined for unknown slug", () => {
    expect(getInstructorBySlug("nobody")).toBeUndefined();
  });
});

describe("getInstructorWorkshops", () => {
  it("groups vista's workshops into enrolling/comingSoon/ended", () => {
    const g = getInstructorWorkshops("vista");
    const all = [...g.enrolling, ...g.comingSoon, ...g.ended];
    // 每堂都屬於 vista
    expect(all.every((w) => w.instructor.name === "Vista")).toBe(true);
    // enrolling 不含 ended/coming_soon
    expect(g.enrolling.every((w) => w.status !== "ended" && w.status !== "coming_soon")).toBe(true);
    expect(g.ended.every((w) => w.status === "ended")).toBe(true);
    expect(g.comingSoon.every((w) => w.status === "coming_soon")).toBe(true);
  });
  it("returns empty groups for unknown instructor", () => {
    const g = getInstructorWorkshops("nobody");
    expect(g.enrolling).toEqual([]);
    expect(g.comingSoon).toEqual([]);
    expect(g.ended).toEqual([]);
  });
});
