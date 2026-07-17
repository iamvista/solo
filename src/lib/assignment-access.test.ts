import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.ASSIGNMENT_SESSION_SECRET = "s".repeat(32);

type Row = { email: string; name: string | null; cohort_key?: string | null };

let rows: Row[] = [];
let guestRows: Row[] = [];
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
      const isGuests = table === "course_guests";
      return {
        // Writes are forbidden on course_enrollments specifically; the guest
        // table is writable in production but nothing in this module writes.
        insert: forbiddenWrite,
        update: forbiddenWrite,
        upsert: forbiddenWrite,
        delete: forbiddenWrite,
        select: () => {
          // The chain is thenable: some callers end at .eq() and await the
          // builder directly (listEligibleStudents), others end at .ilike()
          // or .maybeSingle().
          const result = () => ({
            data: isGuests ? guestRows : rows,
            error: queryError,
          });
          const chain = {
            eq: (col: string, val: unknown) => {
              filters.push([`${table}.${col}`, val]);
              return chain;
            },
            ilike: (col: string, val: unknown) => {
              filters.push([`${table}.${col}`, val]);
              return Promise.resolve({ data: rows, error: queryError });
            },
            maybeSingle: async () => ({
              data: isGuests ? (guestRows[0] ?? null) : null,
              error: queryError,
            }),
            then: (resolve: (v: unknown) => unknown) => resolve(result()),
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

const {
  findEligibleStudent,
  getVerifiedStudent,
  listEligibleStudents,
  normalizeEmail,
} = await import("./assignment-access");
const { generateSessionToken, sessionCookieName } = await import(
  "./assignment-session"
);

beforeEach(() => {
  rows = [];
  guestRows = [];
  queryError = null;
  filters.length = 0;
  tablesTouched.length = 0;
  cookieGet.mockReset();
});

describe("findEligibleStudent", () => {
  it("only ever reads course_enrollments, filtered to paid", async () => {
    rows = [{ email: "student@example.com", name: "王小明", cohort_key: "1" }];
    await findEligibleStudent("course-x", "student@example.com");

    expect(tablesTouched[0]).toBe("course_enrollments");
    expect(filters).toContainEqual(["course_enrollments.status", "paid"]);
    expect(filters).toContainEqual(["course_enrollments.course_id", "course-x"]);
  });

  it("resolves an enrolled student and returns the enrollment name", async () => {
    rows = [{ email: "student@example.com", name: "王小明", cohort_key: "1" }];
    await expect(
      findEligibleStudent("course-x", "student@example.com"),
    ).resolves.toEqual({ email: "student@example.com", name: "王小明", cohortKeys: ["1"] });
  });

  it("matches case-insensitively in both directions", async () => {
    rows = [{ email: "STUDENT@Example.com", name: "王小明", cohort_key: "1" }];
    await expect(
      findEligibleStudent("course-x", "  Student@EXAMPLE.com  "),
    ).resolves.toEqual({ email: "student@example.com", name: "王小明", cohortKeys: ["1"] });
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
    rows = [{ email: "aXb@example.com", name: "冒牌", cohort_key: "1" }];
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
    rows = [{ email: "student@example.com", name: null, cohort_key: "1" }];
    await expect(
      findEligibleStudent("course-x", "student@example.com"),
    ).resolves.toEqual({ email: "student@example.com", name: "", cohortKeys: ["1"] });
  });
});

describe("findEligibleStudent: guest roster", () => {
  it("admits a guest who never paid", async () => {
    rows = [];
    guestRows = [{ email: "guest@example.com", name: "來賓小明", cohort_key: "1" }];

    await expect(
      findEligibleStudent("course-x", "guest@example.com"),
    ).resolves.toEqual({ email: "guest@example.com", name: "來賓小明", cohortKeys: ["1"] });
  });

  it("scopes the guest lookup to the course and the address", async () => {
    rows = [];
    guestRows = [{ email: "guest@example.com", name: "來賓", cohort_key: "1" }];
    await findEligibleStudent("course-x", "guest@example.com");

    expect(filters).toContainEqual(["course_guests.course_id", "course-x"]);
    expect(filters).toContainEqual(["course_guests.email", "guest@example.com"]);
  });

  it("consults both grants and merges their cohorts", async () => {
    // Deliberately does NOT short-circuit on the paid hit. Someone who paid for
    // the first cohort and was comped into the second belongs to both, and
    // returning early would silently drop one of them.
    //
    // The cost is one extra query for every student, including the common case
    // of a single paid cohort. Worth it: the alternative is a wrong answer for
    // returning students.
    rows = [{ email: "student@example.com", name: "付費學員", cohort_key: "1" }];
    guestRows = [{ email: "student@example.com", name: "來賓名", cohort_key: "2" }];

    const result = await findEligibleStudent("course-x", "student@example.com");

    expect(tablesTouched).toContain("course_enrollments");
    expect(tablesTouched).toContain("course_guests");
    expect(result?.cohortKeys.sort()).toEqual(["1", "2"]);
    // 付費那筆的姓名優先：那是他付款時親手填的。
    expect(result?.name).toBe("付費學員");
  });

  it("keeps access for a refunded student who is on the guest roster", async () => {
    // The two grants are independent: the teacher's admission stands on its own
    // terms, whatever the payment later did.
    rows = []; // refunded, so the paid query returns nothing
    guestRows = [{ email: "both@example.com", name: "退款但受邀", cohort_key: "1" }];

    await expect(
      findEligibleStudent("course-x", "both@example.com"),
    ).resolves.toEqual({ email: "both@example.com", name: "退款但受邀", cohortKeys: ["1"] });
  });

  it("refuses someone who neither paid nor was admitted", async () => {
    rows = [];
    guestRows = [];
    await expect(
      findEligibleStudent("course-x", "stranger@example.com"),
    ).resolves.toBeNull();
  });

  it("never writes to course_enrollments while admitting a guest", async () => {
    // The whole reason guests exist: admitting someone must not fabricate a
    // payment record. The mock throws on any write.
    rows = [];
    guestRows = [{ email: "guest@example.com", name: "來賓", cohort_key: "1" }];
    await expect(
      findEligibleStudent("course-x", "guest@example.com"),
    ).resolves.not.toBeNull();
  });
});

describe("listEligibleStudents", () => {
  it("returns paying students and guests together", async () => {
    rows = [{ email: "payer@example.com", name: "付費學員", cohort_key: "1" }];
    guestRows = [{ email: "guest@example.com", name: "來賓", cohort_key: "1" }];

    const result = await listEligibleStudents("course-x", "1");

    expect(result.map((s) => s.email).sort()).toEqual([
      "guest@example.com",
      "payer@example.com",
    ]);
  });

  it("collapses someone who both paid and was admitted into one person", async () => {
    // One human, one mail.
    rows = [{ email: "both@example.com", name: "付費名", cohort_key: "1" }];
    guestRows = [{ email: "both@example.com", name: "來賓名", cohort_key: "1" }];

    const result = await listEligibleStudents("course-x", "1");

    expect(result).toHaveLength(1);
    // The paid record wins: it is read first and is the more authoritative name.
    expect(result[0]).toEqual({
      email: "both@example.com",
      name: "付費名",
      cohortKeys: ["1"],
    });
  });

  it("returns nothing for a blank course", async () => {
    await expect(listEligibleStudents("", "1")).resolves.toEqual([]);
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
    rows = [{ email: "student@example.com", name: "王小明", cohort_key: "1" }];
    presentCookie("course-x", "student@example.com");

    await expect(getVerifiedStudent("course-x")).resolves.toEqual({
      email: "student@example.com",
      name: "王小明",
      cohortKeys: ["1"],
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
    rows = [{ email: "student@example.com", name: "王小明", cohort_key: "1" }];
    cookieGet.mockReturnValue({ value: "forged.signature" });
    await expect(getVerifiedStudent("course-x")).resolves.toBeNull();
  });

  it("refuses a session minted for another course", async () => {
    rows = [{ email: "student@example.com", name: "王小明", cohort_key: "1" }];
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

describe("跨期隔離", () => {
  // 這次變更的核心承諾：第一期的學員看不到第二期的作業與回放。
  // 一門課開很多期，course_id 相同，所以「同一門課」這個條件擋不住任何事。

  it("只回傳這個人真正付過錢的那幾期", async () => {
    rows = [{ email: "first@example.com", name: "第一期學員", cohort_key: "1" }];
    guestRows = [];

    const student = await findEligibleStudent("course-x", "first@example.com");

    expect(student?.cohortKeys).toEqual(["1"]);
    expect(student?.cohortKeys).not.toContain("2");
  });

  it("回訓生兩期都報名就兩期都算", async () => {
    // 不是特例處理，是規則的自然結果：他兩期都付了錢。
    rows = [
      { email: "repeat@example.com", name: "回訓生", cohort_key: "1" },
      { email: "repeat@example.com", name: "回訓生", cohort_key: "2" },
    ];
    guestRows = [];

    const student = await findEligibleStudent("course-x", "repeat@example.com");

    expect(student?.cohortKeys.sort()).toEqual(["1", "2"]);
  });

  it("同一個人的多筆報名不會讓期別重複", async () => {
    rows = [
      { email: "dup@example.com", name: "x", cohort_key: "1" },
      { email: "dup@example.com", name: "x", cohort_key: "1" },
    ];
    guestRows = [];

    const student = await findEligibleStudent("course-x", "dup@example.com");

    expect(student?.cohortKeys).toEqual(["1"]);
  });

  it("沒有期別的報名不算數", async () => {
    // 舊資料或期別沒設好時，寧可讓他進不去也不要讓他看到不該看的。
    rows = [{ email: "orphan@example.com", name: "孤兒報名", cohort_key: null }];
    guestRows = [];

    await expect(
      findEligibleStudent("course-x", "orphan@example.com"),
    ).resolves.toBeNull();
  });

  it("通知只找該期的人", async () => {
    rows = [{ email: "second@example.com", name: "第二期學員", cohort_key: "2" }];
    guestRows = [];

    await listEligibleStudents("course-x", "2");

    expect(filters).toContainEqual(["course_enrollments.cohort_key", "2"]);
    expect(filters).toContainEqual(["course_guests.cohort_key", "2"]);
  });
});

describe("normalizeEmail", () => {
  it("trims and lower-cases", () => {
    expect(normalizeEmail("  A@B.COM ")).toBe("a@b.com");
  });
});
