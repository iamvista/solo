import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.ASSIGNMENT_SESSION_SECRET = "s".repeat(32);
process.env.NEXT_PUBLIC_SITE_URL = "https://www.solo.tw";

const COURSE = "positioning-convergence"; // a real slug from courses-config.ts

type ClaimResult = { data: { email: string; course_id: string } | null; error: unknown };
let claimResult: ClaimResult = { data: null, error: null };
const claimFilters: Array<[string, unknown]> = [];

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: () => ({
      update: (patch: Record<string, unknown>) => {
        claimFilters.push(["__patch", patch]);
        const chain = {
          eq: (c: string, v: unknown) => {
            claimFilters.push([c, v]);
            return chain;
          },
          is: (c: string, v: unknown) => {
            claimFilters.push([`is:${c}`, v]);
            return chain;
          },
          gt: (c: string, v: unknown) => {
            claimFilters.push([`gt:${c}`, v]);
            return chain;
          },
          select: () => ({ maybeSingle: async () => claimResult }),
        };
        return chain;
      },
    }),
  }),
}));

const { GET } = await import("./route");
const { sessionCookieName, verifySessionToken } = await import(
  "@/lib/assignment-session"
);

function req(query: string) {
  return new Request(
    `https://www.solo.tw/api/assignments/access/verify${query}`,
  );
}

beforeEach(() => {
  claimResult = { data: null, error: null };
  claimFilters.length = 0;
});

describe("GET /api/assignments/access/verify", () => {
  it("claims the token and issues a scoped session cookie", async () => {
    claimResult = {
      data: { email: "student@example.com", course_id: COURSE },
      error: null,
    };

    const res = await GET(req(`?token=abc&course=${COURSE}`));

    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe(
      `https://www.solo.tw/courses/${COURSE}/assignments`,
    );

    const cookie = res.cookies.get(sessionCookieName(COURSE));
    expect(cookie).toBeDefined();
    expect(verifySessionToken(cookie!.value)).toEqual({
      email: "student@example.com",
      courseId: COURSE,
    });
    expect(cookie!.httpOnly).toBe(true);
    expect(cookie!.secure).toBe(true);
    expect(cookie!.sameSite).toBe("lax");
  });

  it("claims atomically: only an unused, unexpired token matches", async () => {
    claimResult = {
      data: { email: "student@example.com", course_id: COURSE },
      error: null,
    };

    await GET(req(`?token=abc&course=${COURSE}`));

    // Reading first and updating after would let two concurrent clicks both win.
    expect(claimFilters).toContainEqual(["is:used_at", null]);
    expect(claimFilters.some(([k]) => k === "gt:expires_at")).toBe(true);
    expect(claimFilters).toContainEqual(["token", "abc"]);
  });

  it("rejects a token that is already used, expired, or unknown", async () => {
    // All three collapse to the same thing: the atomic claim matched no row.
    claimResult = { data: null, error: null };

    const res = await GET(req(`?token=stale&course=${COURSE}`));

    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe(
      `https://www.solo.tw/courses/${COURSE}/assignments?error=link_invalid`,
    );
    expect(res.cookies.get(sessionCookieName(COURSE))).toBeUndefined();
  });

  it("issues no cookie when the token is missing", async () => {
    const res = await GET(req(`?course=${COURSE}`));
    expect(res.status).toBe(303);
    expect(res.cookies.get(sessionCookieName(COURSE))).toBeUndefined();
  });

  it("refuses to redirect to an unvalidated course param", async () => {
    // The param is attacker-controlled; an unchecked value here is an open redirect.
    claimResult = { data: null, error: null };

    const res = await GET(req("?token=x&course=https://evil.example.com"));

    expect(res.headers.get("location")).toBe("https://www.solo.tw/courses");
  });

  it("issues no cookie when the claim errors", async () => {
    claimResult = { data: null, error: { message: "boom" } };
    const res = await GET(req(`?token=abc&course=${COURSE}`));
    expect(res.cookies.get(sessionCookieName(COURSE))).toBeUndefined();
  });
});
