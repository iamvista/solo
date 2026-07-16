import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.ASSIGNMENT_SESSION_SECRET = "s".repeat(32);
process.env.NEXT_PUBLIC_SITE_URL = "https://www.solo.tw";

const COURSE = "positioning-convergence"; // a real slug from courses-config.ts

type Row = { email: string; name: string | null };
let enrollmentRows: Row[] = [];
let guestRow: Row | null = null;
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
      // course_enrollments and course_guests: read-only here. Eligibility now
      // means "paid OR admitted as a guest", so both tables get consulted.
      const isGuests = table === "course_guests";
      return {
        select: () => {
          const chain = {
            eq: () => chain,
            ilike: () => Promise.resolve({ data: enrollmentRows, error: null }),
            maybeSingle: async () => ({
              data: isGuests ? guestRow : null,
              error: null,
            }),
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

// The rate limiter keeps module-level state that outlives each test, so every
// request gets a fresh IP and every test a fresh address unless it is
// deliberately exercising a limit.
let counter = 0;
const freshIp = () => `10.0.0.${++counter}`;
const freshEmail = () => `student${++counter}@example.com`;

function req(
  body: unknown,
  ip: string = freshIp(),
): Request {
  return new Request("https://www.solo.tw/api/assignments/access/request", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function snapshot(res: Response) {
  return { status: res.status, body: await res.json() };
}

beforeEach(() => {
  enrollmentRows = [];
  guestRow = null;
  insertError = null;
  tokenInserts.length = 0;
  sendEmail.mockClear();
});

describe("POST /api/assignments/access/request", () => {
  it("mints a token and mails an eligible student", async () => {
    const email = freshEmail();
    enrollmentRows = [{ email, name: "王小明" }];

    const res = await POST(req({ courseId: COURSE, email }));

    expect(res.status).toBe(200);
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(tokenInserts).toHaveLength(1);
    expect(tokenInserts[0].email).toBe(email);
    expect(tokenInserts[0].course_id).toBe(COURSE);
  });

  it("gives an unenrolled address the same response, without mailing", async () => {
    enrollmentRows = [];

    const res = await POST(req({ courseId: COURSE, email: freshEmail() }));

    expect(res.status).toBe(200);
    expect(sendEmail).not.toHaveBeenCalled();
    expect(tokenInserts).toHaveLength(0);
  });

  it("is indistinguishable between enrolled and unenrolled addresses", async () => {
    // The whole point of the identical response: this endpoint must not become
    // an oracle for who bought the course.
    const enrolledEmail = freshEmail();
    enrollmentRows = [{ email: enrolledEmail, name: "王小明" }];
    const enrolled = await snapshot(
      await POST(req({ courseId: COURSE, email: enrolledEmail })),
    );

    enrollmentRows = [];
    const notEnrolled = await snapshot(
      await POST(req({ courseId: COURSE, email: freshEmail() })),
    );

    expect(notEnrolled).toEqual(enrolled);
  });

  it("gives an unknown course the same response too", async () => {
    const email = freshEmail();
    enrollmentRows = [{ email, name: "王小明" }];
    const known = await snapshot(await POST(req({ courseId: COURSE, email })));

    sendEmail.mockClear();
    const unknown = await snapshot(
      await POST(req({ courseId: "no-such-course", email: freshEmail() })),
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
    const email = freshEmail();
    enrollmentRows = [{ email, name: "王小明" }];
    insertError = { message: "boom" };

    const res = await POST(req({ courseId: COURSE, email }));

    expect(res.status).toBe(200);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("normalizes the address before minting the token", async () => {
    const email = freshEmail();
    enrollmentRows = [{ email: email.toUpperCase(), name: "王小明" }];

    await POST(req({ courseId: COURSE, email: `  ${email.toUpperCase()} ` }));

    expect(tokenInserts[0].email).toBe(email);
  });
});

describe("guests", () => {
  it("mails a guest who never paid", async () => {
    // Guests are indistinguishable from paying students once admitted.
    const email = freshEmail();
    enrollmentRows = [];
    guestRow = { email, name: "來賓小明" };

    const res = await POST(req({ courseId: COURSE, email }));

    expect(res.status).toBe(200);
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(tokenInserts[0].email).toBe(email);
  });
});

describe("rate limiting", () => {
  it("throttles one client hammering many addresses", async () => {
    const ip = freshIp();
    enrollmentRows = [];

    const statuses: number[] = [];
    for (let i = 0; i < 12; i++) {
      const res = await POST(req({ courseId: COURSE, email: freshEmail() }, ip));
      statuses.push(res.status);
    }

    expect(statuses.slice(0, 10)).toEqual(Array(10).fill(200));
    expect(statuses.slice(10)).toEqual([429, 429]);
  });

  it("throttles a flood aimed at one address from many clients", async () => {
    // A per-IP limit alone would let this through — this is the limit that
    // actually protects a student's inbox.
    const email = freshEmail();
    enrollmentRows = [{ email, name: "王小明" }];

    const statuses: number[] = [];
    for (let i = 0; i < 5; i++) {
      const res = await POST(req({ courseId: COURSE, email }, freshIp()));
      statuses.push(res.status);
    }

    expect(statuses).toEqual([200, 200, 200, 429, 429]);
    expect(sendEmail).toHaveBeenCalledTimes(3);
  });

  it("throttles enrolled and unenrolled addresses identically", async () => {
    // If throttling only applied to enrolled addresses, a 429 would itself
    // reveal roster membership.
    const enrolledEmail = freshEmail();
    enrollmentRows = [{ email: enrolledEmail, name: "王小明" }];
    for (let i = 0; i < 3; i++) {
      await POST(req({ courseId: COURSE, email: enrolledEmail }, freshIp()));
    }
    const enrolledThrottled = await snapshot(
      await POST(req({ courseId: COURSE, email: enrolledEmail }, freshIp())),
    );

    enrollmentRows = [];
    const strangerEmail = freshEmail();
    for (let i = 0; i < 3; i++) {
      await POST(req({ courseId: COURSE, email: strangerEmail }, freshIp()));
    }
    const strangerThrottled = await snapshot(
      await POST(req({ courseId: COURSE, email: strangerEmail }, freshIp())),
    );

    expect(strangerThrottled).toEqual(enrolledThrottled);
    expect(enrolledThrottled.status).toBe(429);
  });

  it("does not mail for throttled requests", async () => {
    const email = freshEmail();
    enrollmentRows = [{ email, name: "王小明" }];

    for (let i = 0; i < 3; i++) {
      await POST(req({ courseId: COURSE, email }, freshIp()));
    }
    sendEmail.mockClear();

    const res = await POST(req({ courseId: COURSE, email }, freshIp()));

    expect(res.status).toBe(429);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
