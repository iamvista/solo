import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.ASSIGNMENT_SESSION_SECRET = "s".repeat(32);
process.env.NEXT_PUBLIC_SITE_URL = "https://www.solo.tw";

const COURSE = "positioning-convergence"; // a real slug from courses-config.ts

type Row = { email: string; name: string | null };
let enrollmentRows: Row[] = [];
let insertError: unknown = null;
const tokenInserts: Array<Record<string, unknown>> = [];

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: (table: string) => {
      if (table === "assignment_access_tokens") {
        return {
          insert: async (row: Record<string, unknown>) => {
            tokenInserts.push(row);
            return { error: insertError };
          },
        };
      }
      // course_enrollments: read-only
      return {
        select: () => {
          const chain = {
            eq: () => chain,
            ilike: () => Promise.resolve({ data: enrollmentRows, error: null }),
          };
          return chain;
        },
      };
    },
  }),
}));

const sendEmail = vi.fn(async (args: { to: string }) => ({
  success: true,
  data: { id: `msg-${args.to}` },
}));
vi.mock("@/lib/email", () => ({
  sendEmail: (args: { to: string }) => sendEmail(args),
}));

const { POST } = await import("./route");

function req(body: unknown) {
  return new Request("https://www.solo.tw/api/assignments/access/request", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function snapshot(res: Response) {
  return { status: res.status, body: await res.json() };
}

beforeEach(() => {
  enrollmentRows = [];
  insertError = null;
  tokenInserts.length = 0;
  sendEmail.mockClear();
});

describe("POST /api/assignments/access/request", () => {
  it("mints a token and mails an eligible student", async () => {
    enrollmentRows = [{ email: "student@example.com", name: "王小明" }];

    const res = await POST(req({ courseId: COURSE, email: "student@example.com" }));

    expect(res.status).toBe(200);
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(tokenInserts).toHaveLength(1);
    expect(tokenInserts[0].email).toBe("student@example.com");
    expect(tokenInserts[0].course_id).toBe(COURSE);
  });

  it("gives an unenrolled address the same response, without mailing", async () => {
    enrollmentRows = [];

    const res = await POST(req({ courseId: COURSE, email: "nobody@example.com" }));

    expect(res.status).toBe(200);
    expect(sendEmail).not.toHaveBeenCalled();
    expect(tokenInserts).toHaveLength(0);
  });

  it("is indistinguishable between enrolled and unenrolled addresses", async () => {
    // The whole point of the identical response: this endpoint must not become
    // an oracle for who bought the course.
    enrollmentRows = [{ email: "student@example.com", name: "王小明" }];
    const enrolled = await snapshot(
      await POST(req({ courseId: COURSE, email: "student@example.com" })),
    );

    enrollmentRows = [];
    const notEnrolled = await snapshot(
      await POST(req({ courseId: COURSE, email: "nobody@example.com" })),
    );

    expect(notEnrolled).toEqual(enrolled);
  });

  it("gives an unknown course the same response too", async () => {
    enrollmentRows = [{ email: "student@example.com", name: "王小明" }];
    const known = await snapshot(
      await POST(req({ courseId: COURSE, email: "student@example.com" })),
    );

    sendEmail.mockClear();
    const unknown = await snapshot(
      await POST(req({ courseId: "no-such-course", email: "student@example.com" })),
    );

    expect(unknown).toEqual(known);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("gives a malformed body the same response", async () => {
    const res = await snapshot(await POST(req("not json")));
    expect(res.status).toBe(200);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("does not mail when the token insert fails", async () => {
    // Better to send nothing than to send a link that can never verify.
    enrollmentRows = [{ email: "student@example.com", name: "王小明" }];
    insertError = { message: "boom" };

    const res = await POST(req({ courseId: COURSE, email: "student@example.com" }));

    expect(res.status).toBe(200);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("normalizes the address before minting the token", async () => {
    enrollmentRows = [{ email: "STUDENT@Example.com", name: "王小明" }];

    await POST(req({ courseId: COURSE, email: "  Student@EXAMPLE.com " }));

    expect(tokenInserts[0].email).toBe("student@example.com");
  });
});
