import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.WAITLIST_TOKEN_SECRET = "w".repeat(32);
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

const admin = vi.fn(async () => true);
vi.mock("@/lib/supabase/admin", () => ({ isAdmin: () => admin() }));

const sendBatchEmails = vi.fn();
vi.mock("@/lib/email", () => ({
  sendBatchEmails: (...a: unknown[]) => sendBatchEmails(...a),
}));

/** 記錄每次 update().in() 的 id 集合 */
const notifiedIds: string[][] = [];
const fetchRows = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      update: () => ({
        in: async (_col: string, ids: string[]) => {
          notifiedIds.push(ids);
          return { error: null };
        },
      }),
    }),
  }),
}));

vi.mock("@/lib/waitlist-query", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/waitlist-query")>(
      "@/lib/waitlist-query",
    );
  return { ...actual, fetchWaitlist: (...a: unknown[]) => fetchRows(...a) };
});

const { POST } = await import("./route");

function row(i: number, unsubscribed = false) {
  return {
    id: `id-${i}`,
    course_slug: "ai-content",
    name: `人${i}`,
    email: `p${i}@test.tw`,
    unsubscribed_at: unsubscribed ? "2026-07-01T00:00:00Z" : null,
    notified_at: null,
  };
}

function req(body: unknown) {
  return new Request("http://localhost/api/admin/waitlist/broadcast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as never;
}

const valid = {
  filters: { course: "ai-content" },
  cohortDate: "2026/08/15（六）",
  enrolUrl: "https://www.solo.tw/courses/ai-content",
};

beforeEach(() => {
  vi.clearAllMocks();
  notifiedIds.length = 0;
  admin.mockResolvedValue(true);
  sendBatchEmails.mockResolvedValue({ sent: 1, failed: 0 });
});

describe("POST /api/admin/waitlist/broadcast", () => {
  it("rejects non-admins", async () => {
    admin.mockResolvedValueOnce(false);
    fetchRows.mockResolvedValue({ rows: [], error: null });
    const res = await POST(req(valid));
    expect(res.status).toBe(403);
    expect(sendBatchEmails).not.toHaveBeenCalled();
  });

  it("previews the recipient count without sending", async () => {
    fetchRows.mockResolvedValue({ rows: [row(1), row(2)], error: null });
    const res = await POST(req({ ...valid, confirm: false }));
    expect(await res.json()).toMatchObject({ recipientCount: 2, sent: 0 });
    expect(sendBatchEmails).not.toHaveBeenCalled();
    expect(notifiedIds).toEqual([]);
  });

  it("always queries with unsubscribed recipients excluded", async () => {
    fetchRows.mockResolvedValue({ rows: [row(1)], error: null });
    await POST(req({ ...valid, confirm: false }));
    expect(fetchRows).toHaveBeenCalledWith(
      expect.anything(),
      { course: "ai-content" },
      expect.objectContaining({ excludeUnsubscribed: true }),
    );
  });

  it("requires cohort date and enrol url before sending", async () => {
    fetchRows.mockResolvedValue({ rows: [row(1)], error: null });
    // 必須帶 course：否則會先被課程閘門擋下，這條就測不到日期與連結的檢查了
    const res = await POST(req({ filters: { course: "ai-content" }, confirm: true }));
    expect(res.status).toBe(400);
    expect(sendBatchEmails).not.toHaveBeenCalled();
  });

  it("sends and marks notified_at for every recipient of a clean batch", async () => {
    fetchRows.mockResolvedValue({ rows: [row(1), row(2)], error: null });
    const res = await POST(req({ ...valid, confirm: true }));
    expect(await res.json()).toMatchObject({ sent: 2, failed: 0 });
    expect(notifiedIds).toEqual([["id-1", "id-2"]]);
  });

  it("chunks at 100 and never puts a recipient in two batches", async () => {
    const rows = Array.from({ length: 250 }, (_, i) => row(i));
    fetchRows.mockResolvedValue({ rows, error: null });

    await POST(req({ ...valid, confirm: true }));

    expect(sendBatchEmails).toHaveBeenCalledTimes(3);
    const sizes = sendBatchEmails.mock.calls.map((c) => (c[0] as unknown[]).length);
    expect(sizes).toEqual([100, 100, 50]);

    const flat = notifiedIds.flat();
    expect(flat).toHaveLength(250);
    expect(new Set(flat).size).toBe(250);
  });

  it("does not mark notified_at for a failed batch, and reports it", async () => {
    const rows = Array.from({ length: 250 }, (_, i) => row(i));
    fetchRows.mockResolvedValue({ rows, error: null });
    sendBatchEmails
      .mockResolvedValueOnce({ sent: 100, failed: 0 })
      .mockResolvedValueOnce({ sent: 0, failed: 100, error: "boom" })
      .mockResolvedValueOnce({ sent: 50, failed: 0 });

    const res = await POST(req({ ...valid, confirm: true }));
    expect(await res.json()).toMatchObject({ sent: 150, failed: 100 });

    const flat = notifiedIds.flat();
    expect(flat).toHaveLength(150);
    // 失敗批次（第 100..199 筆）完全沒被標記
    expect(flat).not.toContain("id-100");
    expect(flat).not.toContain("id-199");
    expect(flat).toContain("id-0");
    expect(flat).toContain("id-249");
  });

  it("handles an empty recipient set without sending", async () => {
    fetchRows.mockResolvedValue({ rows: [], error: null });
    const res = await POST(req({ ...valid, confirm: true }));
    expect(await res.json()).toMatchObject({ recipientCount: 0, sent: 0 });
    expect(sendBatchEmails).not.toHaveBeenCalled();
  });
});

/**
 * 一則公告只帶一個梯次日期與一條報名連結，但每封信的標題用的是收件人自己的
 * 課程名稱。跨課程寄出時，非目標課程的每個人都會收到自己的課名配上別堂課的
 * 日期與連結。
 */
describe("a broadcast without a course is refused", () => {
  it("refuses a confirmed send whose filters name no course", async () => {
    fetchRows.mockResolvedValue({ rows: [row(1), row(2)], error: null });
    const res = await POST(
      req({
        filters: {},
        cohortDate: "2026/08/15（六）",
        enrolUrl: "https://www.solo.tw/courses/ai-content",
        confirm: true,
      }),
    );
    expect(res.status).toBe(400);
    // 重點不是「少寄幾封」，是一封都不寄
    expect(sendBatchEmails).not.toHaveBeenCalled();
    expect(notifiedIds).toEqual([]);
    expect((await res.json()).error).toMatch(/課程/);
  });

  it("refuses when filters are omitted entirely", async () => {
    fetchRows.mockResolvedValue({ rows: [row(1)], error: null });
    const res = await POST(
      req({
        cohortDate: "2026/08/15（六）",
        enrolUrl: "https://www.solo.tw/courses/ai-content",
        confirm: true,
      }),
    );
    expect(res.status).toBe(400);
    expect(sendBatchEmails).not.toHaveBeenCalled();
  });

  it("refuses an intent-only filter, which would still span courses", async () => {
    fetchRows.mockResolvedValue({ rows: [row(1)], error: null });
    const res = await POST(
      req({
        filters: { intent: "date_conflict" },
        cohortDate: "2026/08/15（六）",
        enrolUrl: "https://www.solo.tw/courses/ai-content",
        confirm: true,
      }),
    );
    expect(res.status).toBe(400);
    expect(sendBatchEmails).not.toHaveBeenCalled();
  });

  it("refuses the preview too, so the operator learns before counting", async () => {
    const res = await POST(req({ filters: {}, confirm: false }));
    expect(res.status).toBe(400);
    // 連查都不查：擋在算人數之前
    expect(fetchRows).not.toHaveBeenCalled();
  });
});
