import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.ASSIGNMENT_SESSION_SECRET = "s".repeat(32);

type Row = { email: string; name: string | null };

let rows: Row[] = [];
let guestRow: Row | null = null;
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
            data: isGuests ? (guestRow ? [guestRow] : []) : rows,
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
              data: isGuests ? guestRow : null,
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
  guestRow = null;
  queryError = null;
  filters.length = 0;
  tablesTouched.length = 0;
  cookieGet.mockReset();
});

describe("findEligibleStudent", () => {
  it("only ever reads course_enrollments, filtered to paid", async () => {
    rows = [{ email: "student@example.com", name: "王小明" }];
    await findEligibleStudent("course-x", "student@example.com");

    expect(tablesTouched[0]).toBe("course_enrollments");
    expect(filters).toContainEqual(["course_enrollments.status", "paid"]);
    expect(filters).toContainEqual(["course_enrollments.course_id", "course-x"]);
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

describe("findEligibleStudent: guest roster", () => {
  it("admits a guest who never paid", async () => {
    rows = [];
    guestRow = { email: "guest@example.com", name: "來賓小明" };

    await expect(
      findEligibleStudent("course-x", "guest@example.com"),
    ).resolves.toEqual({ email: "guest@example.com", name: "來賓小明" });
  });

  it("scopes the guest lookup to the course and the address", async () => {
    rows = [];
    guestRow = { email: "guest@example.com", name: "來賓" };
    await findEligibleStudent("course-x", "guest@example.com");

    expect(filters).toContainEqual(["course_guests.course_id", "course-x"]);
    expect(filters).toContainEqual(["course_guests.email", "guest@example.com"]);
  });

  it("does not consult the guest roster when the student already paid", async () => {
    // Paying students are the common case and must cost one query, not two.
    rows = [{ email: "student@example.com", name: "付費學員" }];
    guestRow = { email: "student@example.com", name: "來賓名" };

    const result = await findEligibleStudent("course-x", "student@example.com");

    expect(result).toEqual({ email: "student@example.com", name: "付費學員" });
    expect(tablesTouched).not.toContain("course_guests");
  });

  it("keeps access for a refunded student who is on the guest roster", async () => {
    // The two grants are independent: the teacher's admission stands on its own
    // terms, whatever the payment later did.
    rows = []; // refunded, so the paid query returns nothing
    guestRow = { email: "both@example.com", name: "退款但受邀" };

    await expect(
      findEligibleStudent("course-x", "both@example.com"),
    ).resolves.toEqual({ email: "both@example.com", name: "退款但受邀" });
  });

  it("refuses someone who neither paid nor was admitted", async () => {
    rows = [];
    guestRow = null;
    await expect(
      findEligibleStudent("course-x", "stranger@example.com"),
    ).resolves.toBeNull();
  });

  it("never writes to course_enrollments while admitting a guest", async () => {
    // The whole reason guests exist: admitting someone must not fabricate a
    // payment record. The mock throws on any write.
    rows = [];
    guestRow = { email: "guest@example.com", name: "來賓" };
    await expect(
      findEligibleStudent("course-x", "guest@example.com"),
    ).resolves.not.toBeNull();
  });
});

describe("listEligibleStudents", () => {
  it("returns paying students and guests together", async () => {
    rows = [{ email: "payer@example.com", name: "付費學員" }];
    guestRow = { email: "guest@example.com", name: "來賓" };

    const result = await listEligibleStudents("course-x");

    expect(result.map((s) => s.email).sort()).toEqual([
      "guest@example.com",
      "payer@example.com",
    ]);
  });

  it("collapses someone who both paid and was admitted into one person", async () => {
    // One human, one mail.
    rows = [{ email: "both@example.com", name: "付費名" }];
    guestRow = { email: "both@example.com", name: "來賓名" };

    const result = await listEligibleStudents("course-x");

    expect(result).toHaveLength(1);
    // The paid record wins: it is read first and is the more authoritative name.
    expect(result[0]).toEqual({ email: "both@example.com", name: "付費名" });
  });

  it("returns nothing for a blank course", async () => {
    await expect(listEligibleStudents("")).resolves.toEqual([]);
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
