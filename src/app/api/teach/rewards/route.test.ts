import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Assignment } from "@/lib/assignments";

const COURSE = "positioning-convergence";
const ASSIGNMENT_ID = "11111111-1111-1111-1111-111111111111";

const mockGetAssignment = vi.fn();
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

vi.mock("@/lib/assignments", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/assignments")>("@/lib/assignments");
  return { ...actual, getAssignment: (id: string) => mockGetAssignment(id) };
});

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: () => ({
      insert: (row: Record<string, unknown>) => {
        insert(row);
        return {
          select: () => ({
            maybeSingle: async () => ({ data: { id: "r1" }, error: null }),
          }),
        };
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
    title: "作業一",
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

function req(body: unknown) {
  return new Request("https://www.solo.tw/api/teach/rewards", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const base = { assignment_id: ASSIGNMENT_ID, title: "資源" };

beforeEach(() => {
  mockGetAssignment.mockReset().mockResolvedValue(assignment());
  mockRequireCourseTeacher
    .mockReset()
    .mockResolvedValue({ id: "t1", email: "teacher@example.com" });
  insert.mockReset();
});

describe("POST /api/teach/rewards", () => {
  it("creates a text reward and stores the passage", async () => {
    const res = await POST(
      req({ ...base, kind: "text", body_text: "第一段。\n第二段。" }),
    );

    expect(res.status).toBe(200);
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: "text",
        body_text: "第一段。\n第二段。",
        video_url: null,
        storage_path: null,
        external_url: null,
      }),
    );
  });

  it("rejects a text reward with no body", async () => {
    const res = await POST(req({ ...base, kind: "text" }));
    expect(res.status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });

  it("rejects a text reward whose body is only whitespace", async () => {
    const res = await POST(req({ ...base, kind: "text", body_text: "   \n  " }));
    expect(res.status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });

  it("creates the other three kinds with body_text left null", async () => {
    for (const [kind, field, value] of [
      ["video", "video_url", "https://youtu.be/x"],
      ["link", "external_url", "https://cal.com/x"],
      ["file", "storage_path", "rewards/course/x.pdf"],
    ] as const) {
      insert.mockClear();
      const res = await POST(req({ ...base, kind, [field]: value }));

      expect(res.status).toBe(200);
      expect(insert.mock.calls[0][0]).toMatchObject({ kind, body_text: null });
    }
  });

  it("stores the handout's original filename alongside the key", async () => {
    // The key is ASCII-mangled (Storage rejects non-ASCII), so 講義.pdf becomes
    // something unreadable. Without the original name the teacher would be shown
    // a broken-looking path — exactly what the design says they should never see.
    await POST(
      req({
        ...base,
        kind: "file",
        storage_path: "rewards/course-x/a1b2-file.pdf",
        file_name: "第一週講義.pdf",
      }),
    );

    expect(insert.mock.calls[0][0]).toMatchObject({
      storage_path: "rewards/course-x/a1b2-file.pdf",
      file_name: "第一週講義.pdf",
    });
  });

  it("rejects an unknown kind", async () => {
    const res = await POST(req({ ...base, kind: "podcast", body_text: "x" }));
    expect(res.status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });

  it("refuses a teacher who does not teach that course", async () => {
    mockRequireCourseTeacher.mockResolvedValue(null);

    const res = await POST(req({ ...base, kind: "text", body_text: "x" }));

    expect(res.status).toBe(403);
    expect(insert).not.toHaveBeenCalled();
  });

  it("stores markup literally rather than interpreting it", async () => {
    // Plain text end to end: the passage is escaped at render, so this is only
    // asserting nothing mangles it on the way in.
    await POST(req({ ...base, kind: "text", body_text: "<b>bold</b>" }));
    expect(insert.mock.calls[0][0]).toMatchObject({ body_text: "<b>bold</b>" });
  });
});
