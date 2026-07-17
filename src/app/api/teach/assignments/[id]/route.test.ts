import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Assignment } from "@/lib/assignments";

const COURSE = "positioning-convergence";
const ASSIGNMENT_ID = "11111111-1111-1111-1111-111111111111";

const mockGetAssignment = vi.fn();
const mockRequireCourseTeacher = vi.fn();
const update = vi.fn();
const sendEmail = vi.fn();
const sendBatchEmails = vi.fn();

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

vi.mock("@/lib/email", () => ({
  sendEmail: (...a: unknown[]) => sendEmail(...a),
  sendBatchEmails: (...a: unknown[]) => sendBatchEmails(...a),
}));

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: () => ({
      update: (patch: Record<string, unknown>) => {
        update(patch);
        return { eq: async () => ({ error: null }) };
      },
      delete: () => ({ eq: async () => ({ error: null }) }),
    }),
  }),
}));

const { PATCH, DELETE } = await import("./route");

function assignment(overrides: Partial<Assignment> = {}): Assignment {
  return {
    id: ASSIGNMENT_ID,
    course_id: COURSE,
    cohort_key: "1",
    title: "作業一",
    description: null,
    sort_order: 0,
    allow_file: true,
    allow_text: true,
    allow_link: true,
    due_at: null,
    is_published: false,
    ...overrides,
  };
}

const ctx = { params: Promise.resolve({ id: ASSIGNMENT_ID }) };

function req(body: unknown) {
  return new Request("https://www.solo.tw/api/teach/assignments/x", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  mockGetAssignment.mockReset().mockResolvedValue(assignment());
  mockRequireCourseTeacher
    .mockReset()
    .mockResolvedValue({ id: "t1", email: "teacher@example.com" });
  update.mockReset();
  sendEmail.mockReset();
  sendBatchEmails.mockReset();
});

describe("PATCH /api/teach/assignments/[id]", () => {
  it("updates an assignment for a teacher of that course", async () => {
    const res = await PATCH(req({ cohort_key: "1", title: "改過的標題" }), ctx);

    expect(res.status).toBe(200);
    expect(update.mock.calls[0][0]).toMatchObject({ title: "改過的標題" });
  });

  it("refuses a teacher who does not teach that course", async () => {
    mockRequireCourseTeacher.mockResolvedValue(null);
    expect((await PATCH(req({ cohort_key: "1", title: "x" }), ctx)).status).toBe(403);
    expect(update).not.toHaveBeenCalled();
  });

  it("authorizes against the assignment's own course", async () => {
    await PATCH(req({ cohort_key: "1", title: "x" }), ctx);
    expect(mockRequireCourseTeacher).toHaveBeenCalledWith(COURSE);
  });
});

describe("saving an assignment never mails anyone", () => {
  // The whole reason notifying is a separate, confirmed action: a teacher
  // fixing a typo on a published assignment must not mail the class again.

  it("sends no mail when publishing an existing assignment", async () => {
    mockGetAssignment.mockResolvedValue(assignment({ is_published: false }));

    await PATCH(req({ cohort_key: "1", title: "作業一", is_published: true }), ctx);

    expect(update.mock.calls[0][0]).toMatchObject({ is_published: true });
    expect(sendEmail).not.toHaveBeenCalled();
    expect(sendBatchEmails).not.toHaveBeenCalled();
  });

  it("sends no mail when editing an already-published assignment", async () => {
    mockGetAssignment.mockResolvedValue(assignment({ is_published: true }));

    await PATCH(req({ cohort_key: "1", title: "修好錯字", is_published: true }), ctx);

    expect(sendEmail).not.toHaveBeenCalled();
    expect(sendBatchEmails).not.toHaveBeenCalled();
  });

  it("sends no mail when unpublishing", async () => {
    mockGetAssignment.mockResolvedValue(assignment({ is_published: true }));

    await PATCH(req({ cohort_key: "1", title: "作業一", is_published: false }), ctx);

    expect(sendEmail).not.toHaveBeenCalled();
    expect(sendBatchEmails).not.toHaveBeenCalled();
  });

  it("sends no mail when deleting", async () => {
    await DELETE(new Request("https://www.solo.tw/x", { method: "DELETE" }), ctx);
    expect(sendEmail).not.toHaveBeenCalled();
    expect(sendBatchEmails).not.toHaveBeenCalled();
  });
});
