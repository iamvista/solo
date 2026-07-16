import { describe, it, expect, vi, beforeEach } from "vitest";

let sessionUser: { id: string; email: string } | null = null;
let mappingRows: Array<{ course_id: string }> = [];
let mappingSingle: unknown = null;
const mappingFilters: Array<[string, unknown]> = [];

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: sessionUser } }) },
  }),
}));

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: () => ({
      select: () => {
        const chain = {
          eq: (c: string, v: unknown) => {
            mappingFilters.push([c, v]);
            return Object.assign(
              Promise.resolve({ data: mappingRows, error: null }),
              chain,
            );
          },
          maybeSingle: async () => ({ data: mappingSingle, error: null }),
        };
        return chain;
      },
    }),
  }),
}));

const {
  getCurrentTeacher,
  listTeachingCourseIds,
  isCourseTeacher,
  requireCourseTeacher,
} = await import("./teaching");

beforeEach(() => {
  sessionUser = { id: "t1", email: "susielimusic@example.com" };
  mappingRows = [];
  mappingSingle = null;
  mappingFilters.length = 0;
});

describe("getCurrentTeacher", () => {
  it("resolves the signed-in account", async () => {
    await expect(getCurrentTeacher()).resolves.toEqual({
      id: "t1",
      email: "susielimusic@example.com",
    });
  });

  it("returns null with no session", async () => {
    sessionUser = null;
    await expect(getCurrentTeacher()).resolves.toBeNull();
  });
});

describe("listTeachingCourseIds", () => {
  it("returns only the courses mapped to this account", async () => {
    mappingRows = [{ course_id: "course-x" }];
    await expect(listTeachingCourseIds("t1")).resolves.toEqual(["course-x"]);
    expect(mappingFilters).toContainEqual(["teacher_id", "t1"]);
  });

  it("returns nothing for an unmapped account", async () => {
    mappingRows = [];
    await expect(listTeachingCourseIds("t1")).resolves.toEqual([]);
  });
});

describe("requireCourseTeacher", () => {
  it("grants a mapped teacher", async () => {
    mappingSingle = { id: "m1" };
    await expect(requireCourseTeacher("course-x")).resolves.toEqual({
      id: "t1",
      email: "susielimusic@example.com",
    });
  });

  it("denies an account mapped to a different course", async () => {
    // The mapping lookup filters on both teacher and course, so a course-X
    // teacher asking about course Y matches nothing.
    mappingSingle = null;
    await expect(requireCourseTeacher("course-y")).resolves.toBeNull();
    expect(mappingFilters).toContainEqual(["course_id", "course-y"]);
    expect(mappingFilters).toContainEqual(["teacher_id", "t1"]);
  });

  it("denies an authenticated account with no mapping at all", async () => {
    mappingSingle = null;
    await expect(requireCourseTeacher("course-x")).resolves.toBeNull();
  });

  it("denies an unauthenticated visitor without even checking mappings", async () => {
    sessionUser = null;
    await expect(requireCourseTeacher("course-x")).resolves.toBeNull();
    expect(mappingFilters).toHaveLength(0);
  });

  it("never imports the platform admin module", async () => {
    // Teaching and platform administration are separate models. If this module
    // ever fell back to isAdmin(), granting someone a course would quietly
    // widen their reach across the whole site. Asserted against imports rather
    // than the raw text, so prose about isAdmin in a comment stays legal.
    const source = await import("node:fs").then((fs) =>
      fs.readFileSync("src/lib/teaching.ts", "utf8"),
    );
    const imports = source
      .split("\n")
      .filter((line) => /^\s*import\b/.test(line))
      .join("\n");

    expect(imports).not.toMatch(/supabase\/admin/);
    expect(imports).not.toMatch(/\bisAdmin\b/);
  });
});

describe("isCourseTeacher", () => {
  it("rejects blank input rather than querying unscoped", async () => {
    await expect(isCourseTeacher("", "course-x")).resolves.toBe(false);
    await expect(isCourseTeacher("t1", "")).resolves.toBe(false);
    expect(mappingFilters).toHaveLength(0);
  });
});
