import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Assignment } from "@/lib/assignments";

const COURSE = "positioning-convergence";
const ASSIGNMENT_ID = "11111111-1111-1111-1111-111111111111";
const SUBMISSION_ID = "22222222-2222-2222-2222-222222222222";

const mockGetAssignment = vi.fn();
const mockGetVerifiedStudent = vi.fn();

const upsert = vi.fn();
const filesInsert = vi.fn();
const filesDelete = vi.fn();

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
    from: (table: string) => {
      if (table === "submissions") {
        return {
          upsert: (row: unknown, opts: unknown) => {
            upsert(row, opts);
            return {
              select: () => ({
                maybeSingle: async () => ({
                  data: { id: SUBMISSION_ID },
                  error: null,
                }),
              }),
            };
          },
        };
      }
      return {
        delete: () => ({ eq: async (...a: unknown[]) => filesDelete(...a) }),
        insert: async (rows: unknown) => {
          filesInsert(rows);
          return { error: null };
        },
      };
    },
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
  return new Request("https://www.solo.tw/api/assignments/x/submit", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const ctx = { params: Promise.resolve({ id: ASSIGNMENT_ID }) };

function validFile(path = `${COURSE}/${ASSIGNMENT_ID}/abc-report.pdf`) {
  return { path, filename: "report.pdf", size_bytes: 1234, mime_type: "application/pdf" };
}

beforeEach(() => {
  mockGetAssignment.mockReset().mockResolvedValue(assignment());
  mockGetVerifiedStudent
    .mockReset()
    .mockResolvedValue({
      email: "student@example.com",
      name: "王小明",
      cohortKeys: ["1"],
    });
  upsert.mockReset();
  filesInsert.mockReset();
  filesDelete.mockReset();
});

describe("POST /api/assignments/[id]/submit", () => {
  it("stores a submission keyed by the session's address", async () => {
    const res = await POST(req({ text_content: "我的作業" }), ctx);

    expect(res.status).toBe(200);
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        assignment_id: ASSIGNMENT_ID,
        student_email: "student@example.com",
        text_content: "我的作業",
      }),
      { onConflict: "assignment_id,student_email" },
    );
  });

  it("takes the address from the session, never the request body", async () => {
    // Trusting a body-supplied address would let anyone submit as anyone.
    await POST(
      req({ text_content: "x", student_email: "victim@example.com" }),
      ctx,
    );

    expect(upsert.mock.calls[0][0]).toMatchObject({
      student_email: "student@example.com",
    });
  });

  it("refuses a submission with no verified session", async () => {
    mockGetVerifiedStudent.mockResolvedValue(null);

    const res = await POST(req({ text_content: "x" }), ctx);

    expect(res.status).toBe(401);
    expect(upsert).not.toHaveBeenCalled();
  });

  it("refuses an unpublished assignment", async () => {
    mockGetAssignment.mockResolvedValue(assignment({ is_published: false }));

    const res = await POST(req({ text_content: "x" }), ctx);

    expect(res.status).toBe(404);
    expect(upsert).not.toHaveBeenCalled();
  });

  it("rejects content in a form the assignment does not accept", async () => {
    mockGetAssignment.mockResolvedValue(assignment({ allow_text: false }));

    const res = await POST(req({ text_content: "一篇長文" }), ctx);

    expect(res.status).toBe(400);
    expect(upsert).not.toHaveBeenCalled();
  });

  it("rejects a link when links are not accepted", async () => {
    mockGetAssignment.mockResolvedValue(assignment({ allow_link: false }));
    const res = await POST(req({ link_url: "https://example.com" }), ctx);
    expect(res.status).toBe(400);
  });

  it("rejects files when files are not accepted", async () => {
    mockGetAssignment.mockResolvedValue(assignment({ allow_file: false }));
    const res = await POST(req({ files: [validFile()] }), ctx);
    expect(res.status).toBe(400);
  });

  it("rejects an entirely empty submission", async () => {
    const res = await POST(req({}), ctx);
    expect(res.status).toBe(400);
    expect(upsert).not.toHaveBeenCalled();
  });

  it("refuses an attachment pointing outside this assignment's prefix", async () => {
    // Otherwise a student could attach another student's uploaded object to
    // their own submission and be handed a signed URL for it.
    const res = await POST(
      req({ files: [validFile(`${COURSE}/other-assignment/secret.pdf`)] }),
      ctx,
    );

    expect(res.status).toBe(400);
    expect(upsert).not.toHaveBeenCalled();
  });

  it("refuses a malformed attachment payload", async () => {
    const res = await POST(req({ files: [{ path: "x" }] }), ctx);
    expect(res.status).toBe(400);
  });

  it("replaces attachments wholesale on resubmission", async () => {
    await POST(req({ files: [validFile()] }), ctx);

    expect(filesDelete).toHaveBeenCalledWith("submission_id", SUBMISSION_ID);
    expect(filesInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        submission_id: SUBMISSION_ID,
        storage_path: `${COURSE}/${ASSIGNMENT_ID}/abc-report.pdf`,
        filename: "report.pdf",
      }),
    ]);
  });

  it("never touches the teacher's review columns", async () => {
    // A resubmission must not silently wipe a comment the teacher already left.
    await POST(req({ text_content: "第二版" }), ctx);

    const row = upsert.mock.calls[0][0] as Record<string, unknown>;
    expect(row).not.toHaveProperty("teacher_comment");
    expect(row).not.toHaveProperty("reviewed_at");
    expect(row).not.toHaveProperty("reviewed_by");
  });

  it("accepts a late submission without flagging it", async () => {
    mockGetAssignment.mockResolvedValue(
      assignment({ due_at: "2020-01-01T00:00:00Z" }),
    );

    const res = await POST(req({ text_content: "遲交" }), ctx);

    expect(res.status).toBe(200);
    const row = upsert.mock.calls[0][0] as Record<string, unknown>;
    expect(row).not.toHaveProperty("is_late");
  });
});
