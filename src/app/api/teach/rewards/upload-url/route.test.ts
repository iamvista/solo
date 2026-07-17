import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Assignment } from "@/lib/assignments";

const COURSE = "positioning-convergence";
const ASSIGNMENT_ID = "11111111-1111-1111-1111-111111111111";

const mockGetAssignment = vi.fn();
const mockRequireCourseTeacher = vi.fn();
const createSignedUploadUrl = vi.fn();

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
    storage: { from: () => ({ createSignedUploadUrl }) },
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
  return new Request("https://www.solo.tw/api/teach/rewards/upload-url", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const base = { assignment_id: ASSIGNMENT_ID, filename: "handout.pdf" };

beforeEach(() => {
  mockGetAssignment.mockReset().mockResolvedValue(assignment());
  mockRequireCourseTeacher
    .mockReset()
    .mockResolvedValue({ id: "t1", email: "teacher@example.com" });
  createSignedUploadUrl.mockReset().mockResolvedValue({
    data: { signedUrl: "https://storage.example/upload", token: "tok" },
    error: null,
  });
});

describe("POST /api/teach/rewards/upload-url", () => {
  it("issues a signed URL to a teacher of the course", async () => {
    const res = await POST(req(base));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.signedUrl).toBe("https://storage.example/upload");
    expect(body.path).toMatch(new RegExp(`^rewards/${COURSE}/`));
  });

  it("authorizes against the course that owns the assignment", async () => {
    // Read from the assignment, never from the request: otherwise a teacher
    // could name their own course to upload against someone else's.
    await POST(req(base));
    expect(mockRequireCourseTeacher).toHaveBeenCalledWith(COURSE);
  });

  it("refuses a teacher who does not teach that course", async () => {
    mockRequireCourseTeacher.mockResolvedValue(null);

    const res = await POST(req(base));

    expect(res.status).toBe(403);
    expect(createSignedUploadUrl).not.toHaveBeenCalled();
  });

  it("refuses an unknown assignment", async () => {
    mockGetAssignment.mockResolvedValue(null);
    expect((await POST(req(base))).status).toBe(404);
    expect(createSignedUploadUrl).not.toHaveBeenCalled();
  });

  it("keys handouts apart from student submissions", async () => {
    // Student work lives under {course}/{assignment}/; handouts must not land
    // in the same prefix or be mistaken for it.
    const body = await (await POST(req(base))).json();

    expect(body.path.startsWith("rewards/")).toBe(true);
    expect(body.path).not.toContain(ASSIGNMENT_ID);
  });

  it("reduces a Chinese filename to an ASCII key", async () => {
    // Supabase Storage rejects non-ASCII keys; the teacher path must not
    // repeat the bug the student path already hit.
    const body = await (await POST(req({ ...base, filename: "第一週講義.pdf" }))).json();

    expect(body.path.split("/").pop()).toMatch(/^[A-Za-z0-9._-]+$/);
    expect(body.path.endsWith(".pdf")).toBe(true);
  });

  it("neutralizes a filename aimed at another prefix", async () => {
    const body = await (await POST(req({ ...base, filename: "../../evil.sh" }))).json();

    expect(body.path).toMatch(new RegExp(`^rewards/${COURSE}/`));
    expect(body.path).not.toContain("..");
  });

  it("rejects a missing filename", async () => {
    const res = await POST(req({ assignment_id: ASSIGNMENT_ID }));
    expect(res.status).toBe(400);
    expect(createSignedUploadUrl).not.toHaveBeenCalled();
  });

  it("surfaces a storage failure rather than a broken URL", async () => {
    createSignedUploadUrl.mockResolvedValue({ data: null, error: { message: "boom" } });
    expect((await POST(req(base))).status).toBe(500);
  });
});
