import { describe, it, expect, vi, beforeEach } from "vitest";

const filters: Array<[string, unknown]> = [];
let rows: unknown = null;

const mockRequireCourseTeacher = vi.fn();
const mockGetVerifiedStudent = vi.fn();

vi.mock("@/lib/teaching", () => ({
  requireCourseTeacher: (courseId: string) => mockRequireCourseTeacher(courseId),
}));

vi.mock("@/lib/assignment-access", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/assignment-access")>(
      "@/lib/assignment-access",
    );
  return {
    ...actual,
    getVerifiedStudent: (courseId: string) => mockGetVerifiedStudent(courseId),
  };
});

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: () => ({
      select: () => {
        const chain = {
          eq: (c: string, v: unknown) => {
            filters.push([c, v]);
            return chain;
          },
          maybeSingle: async () => ({ data: rows, error: null }),
        };
        return chain;
      },
    }),
  }),
}));

const { authorizeSubmissionFile } = await import("./submission-files");

const OWNER = "copyfly36@gmail.com";
const COURSE = "positioning-convergence";
const PATH = "positioning-convergence/f3ce/2223-_-.png";

/** The joined row the real query returns, owned by OWNER on COURSE. */
function fileRow() {
  return {
    id: "f1",
    filename: "定位收斂器-定位卡-方形.png",
    size_bytes: 177680,
    mime_type: "image/png",
    storage_path: PATH,
    submissions: {
      student_email: OWNER,
      assignments: { course_id: COURSE },
    },
  };
}

function student(email: string) {
  return { email, name: "", cohortKeys: ["c1"] };
}

beforeEach(() => {
  filters.length = 0;
  rows = null;
  mockRequireCourseTeacher.mockReset().mockResolvedValue(null);
  mockGetVerifiedStudent.mockReset().mockResolvedValue(null);
});

describe("authorizeSubmissionFile", () => {
  it("grants the teacher of the course the attachment belongs to", async () => {
    rows = fileRow();
    mockRequireCourseTeacher.mockResolvedValue({ id: "t1", email: "v@solo.tw" });

    const result = await authorizeSubmissionFile("f1");

    expect(result.ok).toBe(true);
    expect(result.ok && result.file.storage_path).toBe(PATH);
    // Permission is checked against the course resolved from the attachment,
    // never a course the caller named.
    expect(mockRequireCourseTeacher).toHaveBeenCalledWith(COURSE);
  });

  it("denies a teacher who does not teach that course", async () => {
    rows = fileRow();
    // requireCourseTeacher already answers null for a teacher of another course.
    mockRequireCourseTeacher.mockResolvedValue(null);

    const result = await authorizeSubmissionFile("f1");

    expect(result.ok).toBe(false);
    expect(result).not.toHaveProperty("file");
  });

  it("grants the student who submitted it", async () => {
    rows = fileRow();
    mockGetVerifiedStudent.mockResolvedValue(student(OWNER));

    const result = await authorizeSubmissionFile("f1");

    expect(result.ok).toBe(true);
    expect(mockGetVerifiedStudent).toHaveBeenCalledWith(COURSE);
  });

  it("denies another student holding a session on the same course", async () => {
    rows = fileRow();
    mockGetVerifiedStudent.mockResolvedValue(student("someone-else@gmail.com"));

    const result = await authorizeSubmissionFile("f1");

    expect(result).toEqual({ ok: false, status: 403 });
  });

  it("denies a request with no session at all", async () => {
    rows = fileRow();
    mockGetVerifiedStudent.mockResolvedValue(null);

    const result = await authorizeSubmissionFile("f1");

    expect(result).toEqual({ ok: false, status: 401 });
  });

  it("matches the owner case-insensitively", async () => {
    // Sessions carry a normalized address; submission rows are whatever was
    // written. A case difference must not lock a student out of their own file.
    rows = {
      ...fileRow(),
      submissions: {
        student_email: "CopyFly36@Gmail.com",
        assignments: { course_id: COURSE },
      },
    };
    mockGetVerifiedStudent.mockResolvedValue(student(OWNER));

    expect((await authorizeSubmissionFile("f1")).ok).toBe(true);
  });

  it("unwraps an embedded row PostgREST returns as an array", async () => {
    rows = {
      ...fileRow(),
      submissions: [
        { student_email: OWNER, assignments: [{ course_id: COURSE }] },
      ],
    };
    mockGetVerifiedStudent.mockResolvedValue(student(OWNER));

    expect((await authorizeSubmissionFile("f1")).ok).toBe(true);
  });

  it("denies an unknown attachment without consulting any identity", async () => {
    rows = null;

    expect(await authorizeSubmissionFile("nope")).toEqual({
      ok: false,
      status: 404,
    });
    expect(mockRequireCourseTeacher).not.toHaveBeenCalled();
    expect(mockGetVerifiedStudent).not.toHaveBeenCalled();
  });

  it("returns 404 for an empty id rather than querying unscoped", async () => {
    rows = fileRow();
    expect(await authorizeSubmissionFile("")).toEqual({
      ok: false,
      status: 404,
    });
    expect(filters).toHaveLength(0);
  });
});
