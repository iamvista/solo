import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Assignment } from "@/lib/assignments";

const COURSE = "positioning-convergence";
const ASSIGNMENT_ID = "11111111-1111-1111-1111-111111111111";

const mockGetAssignment = vi.fn();
const mockGetVerifiedStudent = vi.fn();
const createSignedUploadUrl = vi.fn();

vi.mock("@/lib/assignment-access", () => ({
  getVerifiedStudent: (courseId: string) => mockGetVerifiedStudent(courseId),
}));

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

function req(body: unknown) {
  return new Request("https://www.solo.tw/api/assignments/x/upload-url", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const ctx = { params: Promise.resolve({ id: ASSIGNMENT_ID }) };

beforeEach(() => {
  mockGetAssignment.mockReset().mockResolvedValue(assignment());
  mockGetVerifiedStudent
    .mockReset()
    .mockResolvedValue({
      email: "student@example.com",
      name: "王小明",
      cohortKeys: ["1"],
    });
  createSignedUploadUrl.mockReset().mockResolvedValue({
    data: { signedUrl: "https://storage.example/upload", token: "tok" },
    error: null,
  });
});

describe("POST /api/assignments/[id]/upload-url", () => {
  it("issues a signed URL to a verified student", async () => {
    const res = await POST(req({ filename: "報告.pdf" }), ctx);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.signedUrl).toBe("https://storage.example/upload");
    expect(body.path).toMatch(new RegExp(`^${COURSE}/${ASSIGNMENT_ID}/`));
  });

  it("checks the session against the assignment's own course", async () => {
    await POST(req({ filename: "a.pdf" }), ctx);
    expect(mockGetVerifiedStudent).toHaveBeenCalledWith(COURSE);
  });

  it("refuses a request with no verified session", async () => {
    mockGetVerifiedStudent.mockResolvedValue(null);

    const res = await POST(req({ filename: "a.pdf" }), ctx);

    expect(res.status).toBe(401);
    expect(createSignedUploadUrl).not.toHaveBeenCalled();
  });

  it("refuses when the assignment does not accept files", async () => {
    mockGetAssignment.mockResolvedValue(assignment({ allow_file: false }));

    const res = await POST(req({ filename: "a.pdf" }), ctx);

    expect(res.status).toBe(400);
    expect(createSignedUploadUrl).not.toHaveBeenCalled();
  });

  it("refuses an unpublished assignment", async () => {
    mockGetAssignment.mockResolvedValue(assignment({ is_published: false }));

    const res = await POST(req({ filename: "a.pdf" }), ctx);

    expect(res.status).toBe(404);
    expect(createSignedUploadUrl).not.toHaveBeenCalled();
  });

  it("refuses an unknown assignment", async () => {
    mockGetAssignment.mockResolvedValue(null);
    const res = await POST(req({ filename: "a.pdf" }), ctx);
    expect(res.status).toBe(404);
  });

  it("keeps the student's address out of the storage key", async () => {
    // Storage keys surface in logs and error payloads; an address there is a
    // personal-data leak. Ownership lives in submission_files instead.
    const res = await POST(req({ filename: "a.pdf" }), ctx);
    const body = await res.json();

    expect(body.path).not.toContain("student@example.com");
    expect(body.path).not.toContain("student");
    expect(body.path).not.toContain("@");
  });

  it("neutralizes a filename aimed at another prefix", async () => {
    const res = await POST(req({ filename: "../../../etc/passwd" }), ctx);
    const body = await res.json();

    expect(body.path).toMatch(new RegExp(`^${COURSE}/${ASSIGNMENT_ID}/`));
    expect(body.path).not.toContain("..");
    expect(body.path).toContain("passwd");
  });

  it("gives two uploads of the same filename distinct keys", async () => {
    const first = await (await POST(req({ filename: "a.pdf" }), ctx)).json();
    const second = await (await POST(req({ filename: "a.pdf" }), ctx)).json();
    expect(first.path).not.toBe(second.path);
  });

  it("rejects a missing filename", async () => {
    const res = await POST(req({}), ctx);
    expect(res.status).toBe(400);
  });

  it("surfaces a storage failure rather than returning a broken URL", async () => {
    createSignedUploadUrl.mockResolvedValue({ data: null, error: { message: "boom" } });
    const res = await POST(req({ filename: "a.pdf" }), ctx);
    expect(res.status).toBe(500);
  });
});
