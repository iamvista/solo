import { describe, it, expect, vi, beforeEach } from "vitest";

const COURSE = "positioning-convergence"; // a real slug from courses-config.ts

const mockIsAdmin = vi.fn();
const mockFindUser = vi.fn();
const teacherInsert = vi.fn();
const teacherDelete = vi.fn();
let foundUser: { id: string; email: string } | null = null;
let insertError: { code?: string } | null = null;

vi.mock("@/lib/supabase/admin", () => ({
  isAdmin: () => mockIsAdmin(),
}));

vi.mock("@/lib/auth-users", () => ({
  findAuthUserByEmail: (email: string) => mockFindUser(email),
}));

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: () => ({
      insert: async (row: Record<string, unknown>) => {
        teacherInsert(row);
        return { error: insertError };
      },
      delete: () => ({
        eq: async (c: string, v: unknown) => {
          teacherDelete(c, v);
          return { error: null };
        },
      }),
    }),
  }),
}));

const { POST, DELETE } = await import("./route");

function post(body: unknown) {
  return new Request("https://www.solo.tw/api/admin/course-teachers", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const base = { course_id: COURSE, email: "susie@example.com" };

beforeEach(() => {
  mockIsAdmin.mockReset().mockResolvedValue(true);
  teacherInsert.mockReset();
  teacherDelete.mockReset();
  insertError = null;
  foundUser = { id: "u1", email: "susie@example.com" };
  mockFindUser.mockReset().mockImplementation(async () => foundUser);
});

describe("POST /api/admin/course-teachers", () => {
  it("assigns a teacher when the caller is a platform administrator", async () => {
    const res = await POST(post(base));

    expect(res.status).toBe(200);
    expect(teacherInsert).toHaveBeenCalledWith({
      course_id: COURSE,
      teacher_id: "u1",
    });
  });

  it("refuses anyone who is not a platform administrator", async () => {
    // Notably including course teachers: granting teaching access reaches
    // another course's student work, so a teacher must not hand it out.
    mockIsAdmin.mockResolvedValue(false);

    const res = await POST(post(base));

    expect(res.status).toBe(403);
    expect(teacherInsert).not.toHaveBeenCalled();
  });

  it("never consults course_teachers to authorize itself", async () => {
    // The two permission models stay separate: if this gate fell back to
    // teaching permission, a teacher could promote themselves anywhere.
    const source = await import("node:fs").then((fs) =>
      fs.readFileSync("src/app/api/admin/course-teachers/route.ts", "utf8"),
    );
    const imports = source
      .split("\n")
      .filter((l) => /^\s*import\b/.test(l))
      .join("\n");

    expect(imports).not.toMatch(/requireCourseTeacher|isCourseTeacher/);
  });

  it("matches the account case-insensitively", async () => {
    await POST(post({ ...base, email: "  SUSIE@Example.com " }));
    expect(mockFindUser).toHaveBeenCalledWith("susie@example.com");
    expect(teacherInsert).toHaveBeenCalledWith({
      course_id: COURSE,
      teacher_id: "u1",
    });
  });

  it("finds accounts beyond the first page of users", async () => {
    // listUsers() 每頁 50 筆，早期註冊的帳號會落在第一頁之外。這支 route
    // 曾經因此對已註冊的人回「找不到這個帳號」。分頁封在 findAuthUserByEmail，
    // 這裡確認 route 不再自己呼叫 listUsers。
    //
    // 斷言對準「呼叫」而非整份文字：註解裡提到 listUsers 是合法的，
    // 用 toContain 掃全文會被自己的註解弄紅。
    const source = await import("node:fs").then((fs) =>
      fs.readFileSync("src/app/api/admin/course-teachers/route.ts", "utf8"),
    );

    expect(source).not.toMatch(/admin\.listUsers\s*\(/);
    expect(source).toMatch(/findAuthUserByEmail\s*\(/);
  });

  it("refuses an email with no account", async () => {
    foundUser = null;

    const res = await POST(post(base));

    expect(res.status).toBe(404);
    expect((await res.json()).error).toContain("註冊");
    expect(teacherInsert).not.toHaveBeenCalled();
  });

  it("refuses a duplicate mapping", async () => {
    insertError = { code: "23505" };

    const res = await POST(post(base));

    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain("已經是");
  });

  it("refuses an unknown course", async () => {
    const res = await POST(post({ ...base, course_id: "no-such-course" }));
    expect(res.status).toBe(404);
    expect(teacherInsert).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/admin/course-teachers", () => {
  function del(id: string) {
    return new Request(`https://www.solo.tw/api/admin/course-teachers?id=${id}`, {
      method: "DELETE",
    });
  }

  it("removes a mapping for a platform administrator", async () => {
    const res = await DELETE(del("m1"));

    expect(res.status).toBe(200);
    expect(teacherDelete).toHaveBeenCalledWith("id", "m1");
  });

  it("refuses anyone who is not a platform administrator", async () => {
    mockIsAdmin.mockResolvedValue(false);

    const res = await DELETE(del("m1"));

    expect(res.status).toBe(403);
    expect(teacherDelete).not.toHaveBeenCalled();
  });
});
