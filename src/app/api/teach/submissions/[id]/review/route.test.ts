import { describe, it, expect, vi, beforeEach } from "vitest";

const SUBMISSION_ID = "s1";

const mockGetSubmissionCourse = vi.fn();
const mockRequireCourseTeacher = vi.fn();
const update = vi.fn();

vi.mock("@/lib/teaching", async () => {
  const actual = await vi.importActual<typeof import("@/lib/teaching")>(
    "@/lib/teaching",
  );
  return {
    ...actual,
    getSubmissionCourse: (id: string) => mockGetSubmissionCourse(id),
    requireCourseTeacher: (c: string) => mockRequireCourseTeacher(c),
  };
});

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: () => ({
      update: (patch: Record<string, unknown>) => {
        update(patch);
        return { eq: async () => ({ error: null }) };
      },
    }),
  }),
}));

const { POST } = await import("./route");

const ctx = { params: Promise.resolve({ id: SUBMISSION_ID }) };

function req(body: unknown) {
  return new Request("https://www.solo.tw/api/teach/submissions/s1/review", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  mockGetSubmissionCourse
    .mockReset()
    .mockResolvedValue({ assignmentId: "a1", courseId: "course-x" });
  mockRequireCourseTeacher
    .mockReset()
    .mockResolvedValue({ id: "t1", email: "teacher@example.com" });
  update.mockReset();
});

describe("POST /api/teach/submissions/[id]/review", () => {
  it("stores the comment, the reviewer, and the timestamp", async () => {
    const res = await POST(req({ comment: "寫得很好" }), ctx);

    expect(res.status).toBe(200);
    const patch = update.mock.calls[0][0];
    expect(patch.teacher_comment).toBe("寫得很好");
    expect(patch.reviewed_by).toBe("t1");
    expect(patch.reviewed_at).toBeTruthy();
  });

  it("checks permission against the course that owns the submission", async () => {
    // Reading the course from the row, not the request, is what stops a teacher
    // naming their own course to review someone else's students.
    await POST(req({ comment: "x" }), ctx);
    expect(mockRequireCourseTeacher).toHaveBeenCalledWith("course-x");
  });

  it("refuses a teacher who does not teach that course", async () => {
    mockRequireCourseTeacher.mockResolvedValue(null);

    const res = await POST(req({ comment: "x" }), ctx);

    expect(res.status).toBe(403);
    expect(update).not.toHaveBeenCalled();
  });

  it("refuses an unknown submission", async () => {
    mockGetSubmissionCourse.mockResolvedValue(null);

    const res = await POST(req({ comment: "x" }), ctx);

    expect(res.status).toBe(404);
    expect(update).not.toHaveBeenCalled();
  });

  it("rejects an empty comment", async () => {
    const res = await POST(req({ comment: "   " }), ctx);
    expect(res.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });

  it("writes nothing but the review columns", async () => {
    // Review must never touch the student's own content.
    await POST(req({ comment: "x", text_content: "竄改", student_email: "x@y.z" }), ctx);

    const patch = update.mock.calls[0][0];
    expect(Object.keys(patch).sort()).toEqual([
      "reviewed_at",
      "reviewed_by",
      "teacher_comment",
    ]);
  });
});
