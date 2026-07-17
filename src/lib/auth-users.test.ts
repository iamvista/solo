import { describe, it, expect, vi, beforeEach } from "vitest";

const listUsers = vi.fn();
const getUserById = vi.fn();

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    auth: { admin: { listUsers, getUserById } },
  }),
}));

const { findAuthUserByEmail, getAuthEmails } = await import("./auth-users");

/** 造一頁使用者。 */
function usersPage(emails: string[]) {
  return {
    data: { users: emails.map((e, i) => ({ id: `u-${e}-${i}`, email: e })) },
    error: null,
  };
}

/** 造 n 個佔位帳號，用來把目標擠到後面幾頁。 */
function filler(n: number, prefix = "filler") {
  return Array.from({ length: n }, (_, i) => `${prefix}${i}@example.com`);
}

beforeEach(() => {
  listUsers.mockReset();
  getUserById.mockReset();
});

describe("findAuthUserByEmail", () => {
  it("找得到第一頁上的帳號", async () => {
    listUsers.mockResolvedValueOnce(usersPage(["a@example.com", "b@example.com"]));

    await expect(findAuthUserByEmail("b@example.com")).resolves.toMatchObject({
      email: "b@example.com",
    });
    expect(listUsers).toHaveBeenCalledTimes(1);
  });

  it("找得到落在第二頁的帳號", async () => {
    // 這就是那個真實的 bug：站上 59 個帳號、Vista 註冊最早，所以他不在第一頁。
    // 舊的寫法只撈一頁就宣告「查無此人」，對一個已註冊的人說謊。
    listUsers
      .mockResolvedValueOnce(usersPage(filler(200)))
      .mockResolvedValueOnce(usersPage(["iamvista@gmail.com"]));

    await expect(
      findAuthUserByEmail("iamvista@gmail.com"),
    ).resolves.toMatchObject({ email: "iamvista@gmail.com" });
    expect(listUsers).toHaveBeenCalledTimes(2);
  });

  it("翻到底才敢說沒有", async () => {
    listUsers
      .mockResolvedValueOnce(usersPage(filler(200)))
      .mockResolvedValueOnce(usersPage(filler(200, "second")))
      .mockResolvedValueOnce(usersPage(["someone@example.com"]));

    await expect(findAuthUserByEmail("nobody@example.com")).resolves.toBeNull();
    expect(listUsers).toHaveBeenCalledTimes(3);
  });

  it("不滿一頁就停，不再多翻", async () => {
    listUsers.mockResolvedValueOnce(usersPage(["a@example.com"]));

    await expect(findAuthUserByEmail("nobody@example.com")).resolves.toBeNull();
    expect(listUsers).toHaveBeenCalledTimes(1);
  });

  it("大小寫不影響比對", async () => {
    listUsers.mockResolvedValueOnce(usersPage(["Vista@Example.COM"]));

    await expect(
      findAuthUserByEmail("  vista@example.com  "),
    ).resolves.toMatchObject({ email: "Vista@Example.COM" });
  });

  it("空字串直接回 null，不打 API", async () => {
    await expect(findAuthUserByEmail("   ")).resolves.toBeNull();
    expect(listUsers).not.toHaveBeenCalled();
  });

  it("查詢出錯回 null 而非爆掉", async () => {
    listUsers.mockResolvedValueOnce({ data: null, error: { message: "boom" } });
    await expect(findAuthUserByEmail("a@example.com")).resolves.toBeNull();
  });

  it("有翻頁上限，不會無限迴圈", async () => {
    // 每頁都是滿的且永遠找不到：若沒有上限就會一直翻下去。
    listUsers.mockResolvedValue(usersPage(filler(200)));

    await expect(findAuthUserByEmail("ghost@example.com")).resolves.toBeNull();
    expect(listUsers.mock.calls.length).toBeLessThanOrEqual(50);
  });
});

describe("getAuthEmails", () => {
  it("逐一以 id 查，完全不碰分頁", async () => {
    getUserById.mockImplementation(async (id: string) => ({
      data: { user: { id, email: `${id}@example.com` } },
    }));

    const map = await getAuthEmails(["u1", "u2"]);

    expect(map.get("u1")).toBe("u1@example.com");
    expect(map.get("u2")).toBe("u2@example.com");
    expect(listUsers).not.toHaveBeenCalled();
  });

  it("重複的 id 只查一次", async () => {
    getUserById.mockImplementation(async (id: string) => ({
      data: { user: { id, email: `${id}@example.com` } },
    }));

    await getAuthEmails(["u1", "u1", "u1"]);

    expect(getUserById).toHaveBeenCalledTimes(1);
  });

  it("真的不存在的帳號不會進對照表", async () => {
    getUserById.mockResolvedValue({ data: { user: null } });

    const map = await getAuthEmails(["ghost"]);

    expect(map.has("ghost")).toBe(false);
  });

  it("空清單不打 API", async () => {
    await getAuthEmails([]);
    expect(getUserById).not.toHaveBeenCalled();
  });
});
