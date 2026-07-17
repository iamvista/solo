import { describe, it, expect, vi, beforeEach } from "vitest";

const COURSE = "positioning-convergence"; // a real slug from courses-config.ts

const mockRequireCourseTeacher = vi.fn();
const guestInsert = vi.fn();
const guestDelete = vi.fn();

let paidRows: Array<{ id: string }> = [];
let guestRow: { course_id: string } | null = null;
let insertError: { code?: string; message?: string } | null = null;
const tablesTouched: string[] = [];

function forbiddenEnrollmentWrite(): never {
  throw new Error("course_enrollments must never be written to");
}

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
    from: (table: string) => {
      tablesTouched.push(table);
      if (table === "course_enrollments") {
        return {
          insert: forbiddenEnrollmentWrite,
          update: forbiddenEnrollmentWrite,
          upsert: forbiddenEnrollmentWrite,
          delete: forbiddenEnrollmentWrite,
          select: () => {
            const chain = {
              eq: () => chain,
              ilike: () => Promise.resolve({ data: paidRows, error: null }),
            };
            return chain;
          },
        };
      }
      return {
        insert: async (row: Record<string, unknown>) => {
          guestInsert(row);
          return { error: insertError };
        },
        select: () => {
          const chain = {
            eq: () => chain,
            maybeSingle: async () => ({ data: guestRow, error: null }),
          };
          return chain;
        },
        delete: () => ({
          eq: async (c: string, v: unknown) => {
            guestDelete(c, v);
            return { error: null };
          },
        }),
      };
    },
  }),
}));

const { POST, DELETE } = await import("./route");

function post(body: unknown) {
  return new Request("https://www.solo.tw/api/teach/roster", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const base = {
  course_id: COURSE,
  cohort_key: "1", // positioning-convergence 的唯一一期
  email: "guest@example.com",
  name: "來賓",
};

beforeEach(() => {
  mockRequireCourseTeacher
    .mockReset()
    .mockResolvedValue({ id: "t1", email: "teacher@example.com" });
  guestInsert.mockReset();
  guestDelete.mockReset();
  paidRows = [];
  guestRow = null;
  insertError = null;
  tablesTouched.length = 0;
});

describe("POST /api/teach/roster", () => {
  it("admits a guest and records who added them", async () => {
    const res = await POST(post({ ...base, note: "匯款" }));

    expect(res.status).toBe(200);
    expect(guestInsert).toHaveBeenCalledWith({
      course_id: COURSE,
      cohort_key: "1",
      email: "guest@example.com",
      name: "來賓",
      note: "匯款",
      added_by: "t1",
    });
  });

  it("never writes to course_enrollments", async () => {
    // The whole point of a guest roster: admitting someone must not fabricate a
    // payment record. The mock throws on any write to that table.
    await POST(post(base));
    expect(guestInsert).toHaveBeenCalled();
  });

  it("normalizes the address", async () => {
    await POST(post({ ...base, email: "  GUEST@Example.com " }));
    expect(guestInsert.mock.calls[0][0]).toMatchObject({
      email: "guest@example.com",
    });
  });

  it("refuses someone who already paid", async () => {
    // They are already in; a second record of the same fact only confuses.
    paidRows = [{ id: "e1" }];

    const res = await POST(post(base));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toContain("已經");
    expect(guestInsert).not.toHaveBeenCalled();
  });

  it("refuses a duplicate email on the same course", async () => {
    insertError = { code: "23505" };

    const res = await POST(post(base));

    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain("已經在名單上");
  });

  it("refuses a teacher who does not teach that course", async () => {
    mockRequireCourseTeacher.mockResolvedValue(null);

    const res = await POST(post(base));

    expect(res.status).toBe(403);
    expect(guestInsert).not.toHaveBeenCalled();
  });

  it("refuses an unknown course", async () => {
    const res = await POST(post({ ...base, course_id: "no-such-course" }));
    expect(res.status).toBe(404);
    expect(guestInsert).not.toHaveBeenCalled();
  });

  it("rejects an unknown cohort", async () => {
    // 「加入這門課」在一門課開多期時是沒有意義的說法。
    const res = await POST(post({ ...base, cohort_key: "99" }));
    expect(res.status).toBe(400);
    expect(guestInsert).not.toHaveBeenCalled();
  });

  it("rejects a missing cohort", async () => {
    const { cohort_key: _drop, ...noCohort } = base;
    const res = await POST(post(noCohort));
    expect(res.status).toBe(400);
    expect(guestInsert).not.toHaveBeenCalled();
  });

  it("rejects a malformed address", async () => {
    const res = await POST(post({ ...base, email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(guestInsert).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/teach/roster", () => {
  function del(id: string) {
    return new Request(`https://www.solo.tw/api/teach/roster?id=${id}`, {
      method: "DELETE",
    });
  }

  it("removes a guest from a course the caller teaches", async () => {
    guestRow = { course_id: COURSE };

    const res = await DELETE(del("g1"));

    expect(res.status).toBe(200);
    expect(guestDelete).toHaveBeenCalledWith("id", "g1");
  });

  it("checks permission against the course the guest belongs to", async () => {
    // Read from the row, not the request: otherwise any teacher could remove
    // another course's guests.
    guestRow = { course_id: "someone-elses-course" };

    await DELETE(del("g1"));

    expect(mockRequireCourseTeacher).toHaveBeenCalledWith("someone-elses-course");
  });

  it("refuses a teacher who does not teach that course", async () => {
    guestRow = { course_id: COURSE };
    mockRequireCourseTeacher.mockResolvedValue(null);

    const res = await DELETE(del("g1"));

    expect(res.status).toBe(403);
    expect(guestDelete).not.toHaveBeenCalled();
  });

  it("refuses an unknown guest", async () => {
    guestRow = null;
    expect((await DELETE(del("nope"))).status).toBe(404);
  });
});
