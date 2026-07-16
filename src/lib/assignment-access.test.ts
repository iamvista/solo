import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.ASSIGNMENT_SESSION_SECRET = "s".repeat(32);

type Row = { email: string; name: string | null };

let rows: Row[] = [];
let queryError: unknown = null;
const filters: Array<[string, unknown]> = [];
const tablesTouched: string[] = [];

/**
 * The mock exposes ONLY select(). insert/update/upsert/delete throw, so any
 * write against course_enrollments fails the test loudly rather than silently
 * passing — the enrollment table sits on the checkout path and this system is
 * specified to read it and nothing more.
 */
function forbiddenWrite(): never {
  throw new Error("course_enrollments must never be written to");
}

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: (table: string) => {
      tablesTouched.push(table);
      return {
        insert: forbiddenWrite,
        update: forbiddenWrite,
        upsert: forbiddenWrite,
        delete: forbiddenWrite,
        select: () => {
          const chain = {
            eq: (col: string, val: unknown) => {
              filters.push([col, val]);
              return chain;
            },
            ilike: (col: string, val: unknown) => {
              filters.push([col, val]);
              return Promise.resolve({ data: rows, error: queryError });
            },
          };
          return chain;
        },
      };
    },
  }),
}));

const cookieGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: cookieGet }),
}));

const { findEligibleStudent, getVerifiedStudent, normalizeEmail } = await import(
  "./assignment-access"
);
const { generateSessionToken, sessionCookieName } = await import(
  "./assignment-session"
);

beforeEach(() => {
  rows = [];
  queryError = null;
  filters.length = 0;
  tablesTouched.length = 0;
  cookieGet.mockReset();
});

describe("findEligibleStudent", () => {
  it("only ever reads course_enrollments, filtered to paid", async () => {
    rows = [{ email: "student@example.com", name: "王小明" }];
    await findEligibleStudent("course-x", "student@example.com");

    expect(tablesTouched).toEqual(["course_enrollments"]);
    expect(filters).toContainEqual(["status", "paid"]);
    expect(filters).toContainEqual(["course_id", "course-x"]);
  });

  it("resolves an enrolled student and returns the enrollment name", async () => {
    rows = [{ email: "student@example.com", name: "王小明" }];
    await expect(
      findEligibleStudent("course-x", "student@example.com"),
    ).resolves.toEqual({ email: "student@example.com", name: "王小明" });
  });

  it("matches case-insensitively in both directions", async () => {
    rows = [{ email: "STUDENT@Example.com", name: "王小明" }];
    await expect(
      findEligibleStudent("course-x", "  Student@EXAMPLE.com  "),
    ).resolves.toEqual({ email: "student@example.com", name: "王小明" });
  });

  it("returns null when no enrollment matches", async () => {
    rows = [];
    await expect(
      findEligibleStudent("course-x", "nobody@example.com"),
    ).resolves.toBeNull();
  });

  it("returns null when the narrowed rows do not match exactly", async () => {
    // ilike narrows but does not decide: `_` is a LIKE wildcard and a legal
    // email character, so a near-miss row must still be rejected in JS.
    rows = [{ email: "aXb@example.com", name: "冒牌" }];
    await expect(
      findEligibleStudent("course-x", "a_b@example.com"),
    ).resolves.toBeNull();
  });

  it("returns null on a query error rather than throwing", async () => {
    queryError = { message: "boom" };
    await expect(
      findEligibleStudent("course-x", "student@example.com"),
    ).resolves.toBeNull();
  });

  it("returns null for blank input", async () => {
    await expect(findEligibleStudent("course-x", "   ")).resolves.toBeNull();
    await expect(findEligibleStudent("", "a@example.com")).resolves.toBeNull();
  });

  it("tolerates a missing name", async () => {
    rows = [{ email: "student@example.com", name: null }];
    await expect(
      findEligibleStudent("course-x", "student@example.com"),
    ).resolves.toEqual({ email: "student@example.com", name: "" });
  });
});

describe("getVerifiedStudent", () => {
  function presentCookie(courseId: string, email: string) {
    const value = generateSessionToken({ email, courseId });
    cookieGet.mockImplementation((name: string) =>
      name === sessionCookieName(courseId) ? { value } : undefined,
    );
  }

  it("resolves the student when the cookie is valid and still paid", async () => {
    rows = [{ email: "student@example.com", name: "王小明" }];
    presentCookie("course-x", "student@example.com");

    await expect(getVerifiedStudent("course-x")).resolves.toEqual({
      email: "student@example.com",
      name: "王小明",
    });
  });

  it("returns null when no cookie is present", async () => {
    cookieGet.mockReturnValue(undefined);
    await expect(getVerifiedStudent("course-x")).resolves.toBeNull();
  });

  it("returns null when the enrollment is no longer paid", async () => {
    // Cookie is still validly signed, but the refund already happened. Access
    // must stop now, not when the 30-day cookie lapses.
    rows = [];
    presentCookie("course-x", "student@example.com");
    await expect(getVerifiedStudent("course-x")).resolves.toBeNull();
  });

  it("returns null when the cookie is tampered with", async () => {
    rows = [{ email: "student@example.com", name: "王小明" }];
    cookieGet.mockReturnValue({ value: "forged.signature" });
    await expect(getVerifiedStudent("course-x")).resolves.toBeNull();
  });

  it("refuses a session minted for another course", async () => {
    rows = [{ email: "student@example.com", name: "王小明" }];
    // A course-y session, presented under the course-x cookie name.
    const value = generateSessionToken({
      email: "student@example.com",
      courseId: "course-y",
    });
    cookieGet.mockImplementation((name: string) =>
      name === sessionCookieName("course-x") ? { value } : undefined,
    );

    await expect(getVerifiedStudent("course-x")).resolves.toBeNull();
  });
});

describe("normalizeEmail", () => {
  it("trims and lower-cases", () => {
    expect(normalizeEmail("  A@B.COM ")).toBe("a@b.com");
  });
});
