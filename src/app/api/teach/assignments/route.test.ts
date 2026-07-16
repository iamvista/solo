import { describe, it, expect, vi, beforeEach } from "vitest";

const COURSE = "positioning-convergence"; // a real slug from courses-config.ts

const mockRequireCourseTeacher = vi.fn();
const insert = vi.fn();

vi.mock("@/lib/teaching", async () => {
  const actual = await vi.importActual<typeof import("@/lib/teaching")>(
    "@/lib/teaching",
  );
  return {
    ...actual,
    requireCourseTeacher: (c: string) => mockRequireCourseTeacher(c),
  };
});

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: () => ({
      insert: (row: Record<string, unknown>) => {
        insert(row);
        return {
          select: () => ({ maybeSingle: async () => ({ data: { id: "a1" }, error: null }) }),
        };
      },
    }),
  }),
}));

const { POST, parseAssignmentInput } = await import("./route");

function req(body: unknown) {
  return new Request("https://www.solo.tw/api/teach/assignments", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const base = { course_id: COURSE, title: "第一份作業" };

beforeEach(() => {
  mockRequireCourseTeacher
    .mockReset()
    .mockResolvedValue({ id: "t1", email: "teacher@example.com" });
  insert.mockReset();
});

describe("POST /api/teach/assignments", () => {
  it("creates an assignment for a teacher of that course", async () => {
    const res = await POST(req(base));

    expect(res.status).toBe(200);
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        course_id: COURSE,
        title: "第一份作業",
        created_by: "t1",
      }),
    );
  });

  it("refuses a teacher who does not teach that course", async () => {
    mockRequireCourseTeacher.mockResolvedValue(null);

    const res = await POST(req(base));

    expect(res.status).toBe(403);
    expect(insert).not.toHaveBeenCalled();
  });

  it("refuses an unknown course", async () => {
    const res = await POST(req({ ...base, course_id: "no-such-course" }));
    expect(res.status).toBe(404);
    expect(insert).not.toHaveBeenCalled();
  });

  it("rejects an assignment with every submission form disabled", async () => {
    // Such an assignment could never be submitted. The database enforces this
    // too; rejecting here just means a sentence instead of a constraint error.
    const res = await POST(
      req({ ...base, allow_file: false, allow_text: false, allow_link: false }),
    );

    expect(res.status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });

  it("rejects a blank title", async () => {
    const res = await POST(req({ ...base, title: "   " }));
    expect(res.status).toBe(400);
  });

  it("creates unpublished by default", async () => {
    // A half-written assignment must not appear to students the moment it is saved.
    await POST(req(base));
    expect(insert.mock.calls[0][0]).toMatchObject({ is_published: false });
  });
});

describe("parseAssignmentInput", () => {
  it("defaults all three forms to enabled", () => {
    const result = parseAssignmentInput({ title: "x" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.allow_file).toBe(true);
      expect(result.value.allow_text).toBe(true);
      expect(result.value.allow_link).toBe(true);
    }
  });

  it("accepts a due date but keeps it advisory", () => {
    const result = parseAssignmentInput({ title: "x", due_at: "2026-08-01" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.due_at).toBe(new Date("2026-08-01").toISOString());
      // No lateness flag exists anywhere in the shape: due dates are shown,
      // never enforced.
      expect(result.value).not.toHaveProperty("enforce_due");
    }
  });

  it("rejects an unparseable due date", () => {
    const result = parseAssignmentInput({ title: "x", due_at: "not-a-date" });
    expect(result.ok).toBe(false);
  });

  it("treats a blank due date as none", () => {
    const result = parseAssignmentInput({ title: "x", due_at: "  " });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.due_at).toBeNull();
  });
});
