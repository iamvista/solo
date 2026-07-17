import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Assignment } from "@/lib/assignments";

process.env.NEXT_PUBLIC_SITE_URL = "https://www.solo.tw";

const COURSE = "positioning-convergence"; // a real slug from courses-config.ts
const ASSIGNMENT_ID = "11111111-1111-1111-1111-111111111111";

const mockGetAssignment = vi.fn();
const mockRequireCourseTeacher = vi.fn();
const mockListEligible = vi.fn();
const sendBatchEmails = vi.fn();
const notificationInsert = vi.fn();

vi.mock("@/lib/assignments", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/assignments")>("@/lib/assignments");
  return { ...actual, getAssignment: (id: string) => mockGetAssignment(id) };
});

vi.mock("@/lib/teaching", async () => {
  const actual = await vi.importActual<typeof import("@/lib/teaching")>(
    "@/lib/teaching",
  );
  return {
    ...actual,
    requireCourseTeacher: (c: string) => mockRequireCourseTeacher(c),
  };
});

vi.mock("@/lib/assignment-access", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/assignment-access")
  >("@/lib/assignment-access");
  return { ...actual, listEligibleStudents: (c: string) => mockListEligible(c) };
});

vi.mock("@/lib/email", () => ({
  sendBatchEmails: (msgs: unknown[]) => sendBatchEmails(msgs),
}));

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: () => ({
      insert: async (row: Record<string, unknown>) => {
        notificationInsert(row);
        return { error: null };
      },
    }),
  }),
}));

const { POST } = await import("./route");

function assignment(overrides: Partial<Assignment> = {}): Assignment {
  return {
    id: ASSIGNMENT_ID,
    course_id: COURSE,
    cohort_key: "1",
    title: "第一份作業",
    description: null,
    sort_order: 0,
    allow_file: true,
    allow_text: true,
    allow_link: true,
    due_at: null,
    is_published: true,
    ...overrides,
  };
}

const ctx = { params: Promise.resolve({ id: ASSIGNMENT_ID }) };
const req = new Request("https://www.solo.tw/api/teach/assignments/x/notify", {
  method: "POST",
});

beforeEach(() => {
  mockGetAssignment.mockReset().mockResolvedValue(assignment());
  mockRequireCourseTeacher
    .mockReset()
    .mockResolvedValue({ id: "t1", email: "teacher@example.com" });
  mockListEligible.mockReset().mockResolvedValue([
    { email: "a@example.com", name: "學員 A" },
    { email: "b@example.com", name: "學員 B" },
  ]);
  sendBatchEmails.mockReset().mockResolvedValue({ sent: 2, failed: 0 });
  notificationInsert.mockReset();
});

describe("POST /api/teach/assignments/[id]/notify", () => {
  it("mails every eligible student and reports the count", async () => {
    const res = await POST(req, ctx);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ ok: true, sent: 2, failed: 0 });
    expect(sendBatchEmails).toHaveBeenCalledTimes(1);
    expect(sendBatchEmails.mock.calls[0][0].map((m: { to: string }) => m.to)).toEqual([
      "a@example.com",
      "b@example.com",
    ]);
  });

  it("draws recipients from the same eligibility rule the assignment area uses", async () => {
    // A second query for "who gets the mail" would drift from "who may enter",
    // and the drift would be silent.
    await POST(req, ctx);
    expect(mockListEligible).toHaveBeenCalledWith(COURSE);
  });

  it("refuses to notify an unpublished assignment", async () => {
    // The mail would lead to a page the student cannot open.
    mockGetAssignment.mockResolvedValue(assignment({ is_published: false }));

    const res = await POST(req, ctx);

    expect(res.status).toBe(400);
    expect(sendBatchEmails).not.toHaveBeenCalled();
    expect(notificationInsert).not.toHaveBeenCalled();
  });

  it("refuses a teacher who does not teach that course", async () => {
    mockRequireCourseTeacher.mockResolvedValue(null);

    const res = await POST(req, ctx);

    expect(res.status).toBe(403);
    expect(sendBatchEmails).not.toHaveBeenCalled();
  });

  it("authorizes against the assignment's own course", async () => {
    await POST(req, ctx);
    expect(mockRequireCourseTeacher).toHaveBeenCalledWith(COURSE);
  });

  it("sends nothing and records nothing when there are no students", async () => {
    mockListEligible.mockResolvedValue([]);

    const res = await POST(req, ctx);
    const body = await res.json();

    expect(body).toEqual({ ok: true, sent: 0, failed: 0 });
    expect(sendBatchEmails).not.toHaveBeenCalled();
    expect(notificationInsert).not.toHaveBeenCalled();
  });

  it("records the send with the sender and the count that actually went out", async () => {
    sendBatchEmails.mockResolvedValue({ sent: 2, failed: 0 });

    await POST(req, ctx);

    expect(notificationInsert).toHaveBeenCalledWith({
      assignment_id: ASSIGNMENT_ID,
      sent_by: "t1",
      recipient_count: 2,
    });
  });

  it("records what succeeded, not what was attempted", async () => {
    mockListEligible.mockResolvedValue([
      { email: "a@example.com", name: "A" },
      { email: "b@example.com", name: "B" },
      { email: "c@example.com", name: "C" },
    ]);
    sendBatchEmails.mockResolvedValue({ sent: 2, failed: 1 });

    const body = await (await POST(req, ctx)).json();

    expect(body).toEqual({ ok: true, sent: 2, failed: 1 });
    expect(notificationInsert.mock.calls[0][0]).toMatchObject({
      recipient_count: 2,
    });
  });

  it("does not block a deliberate repeat send", async () => {
    // A teacher may genuinely want to remind the class. The guard against
    // accidents is confirmation and visibility, not prohibition.
    await POST(req, ctx);
    await POST(req, ctx);

    expect(sendBatchEmails).toHaveBeenCalledTimes(2);
    expect(notificationInsert).toHaveBeenCalledTimes(2);
  });

  it("chunks large classes rather than truncating them", async () => {
    // Resend's batch endpoint caps at 100; passing 150 whole would silently
    // drop 50 students.
    mockListEligible.mockResolvedValue(
      Array.from({ length: 150 }, (_, i) => ({
        email: `s${i}@example.com`,
        name: `S${i}`,
      })),
    );
    sendBatchEmails.mockImplementation(async (msgs: unknown[]) => ({
      sent: (msgs as unknown[]).length,
      failed: 0,
    }));

    const body = await (await POST(req, ctx)).json();

    expect(sendBatchEmails).toHaveBeenCalledTimes(2);
    expect(sendBatchEmails.mock.calls[0][0]).toHaveLength(100);
    expect(sendBatchEmails.mock.calls[1][0]).toHaveLength(50);
    expect(body.sent).toBe(150);
  });

  it("points the mail at the assignment's own page", async () => {
    await POST(req, ctx);
    const msg = sendBatchEmails.mock.calls[0][0][0];
    expect(msg.subject).toContain("第一份作業");
  });

  it("refuses an unknown assignment", async () => {
    mockGetAssignment.mockResolvedValue(null);
    expect((await POST(req, ctx)).status).toBe(404);
    expect(sendBatchEmails).not.toHaveBeenCalled();
  });
});
