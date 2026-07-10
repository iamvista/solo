import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.RECUR_WEBHOOK_SECRET = "whsec_test";
process.env.RECUR_SECRET_KEY = "sk_test_x";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
process.env.ADMIN_NOTIFY_EMAIL = "admin@test.tw";
// ARS productId → bundle 已改為 webhook 側寫死常數表（見 src/lib/recur-product-config.ts），
// 這裡直接用真實 productId，不再靠 env 驅動。
const PROD_GRAD = "uywm5vudlfzhlkc96omzcdio";
const PROD_FACULTY = "h8kqd7tlxvq571iqof11gqc2";
const PROD_CLINICIAN = "tyutghxnw5hyg5zqlzci92r8";

// Webhook route 只驗簽再解析 event；signature 驗證本身不是本測試範圍，直接把 payload
// JSON.parse 回傳當作已驗證的 event。
vi.mock("recur-tw/server", () => {
  class MockRecur {
    webhooks = {
      verify: (payload: string) => JSON.parse(payload),
    };
  }
  return { Recur: MockRecur };
});

const sendEmail = vi.fn(async () => ({ success: true, data: { id: "msg" } }));
vi.mock("@/lib/email", () => ({
  sendEmail: (args: { to: string | string[] }) => sendEmail(args),
}));

let existingToken: string | null = null;
let insertError: unknown = null;
const insertCalls: Array<Record<string, unknown>> = [];
// 當非 null 時，download_tokens 的每次 select() 依序消耗這個佇列（用來模擬
// 「insert 前查一次沒有 → insert 撞 23505 → 重查一次拿到贏家 token」的兩段式情境）；
// 佇列耗盡或維持 null 時，退回既有的 existingToken 單一回應行為。
let selectQueue: Array<{ token: string } | null> | null = null;

function chain(result: { data?: unknown; error?: unknown }) {
  const builder: Record<string, unknown> = {};
  builder.select = () => builder;
  builder.eq = () => builder;
  builder.neq = () => builder;
  builder.order = () => builder;
  builder.limit = () => builder;
  builder.maybeSingle = () => Promise.resolve(result);
  builder.single = () => Promise.resolve(result);
  return builder;
}

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === "download_tokens") {
        return {
          select: () => {
            if (selectQueue && selectQueue.length > 0) {
              const next = selectQueue.shift() ?? null;
              return chain({ data: next, error: null });
            }
            return chain({
              data: existingToken ? { token: existingToken } : null,
              error: null,
            });
          },
          insert: (payload: Record<string, unknown>) => {
            insertCalls.push(payload);
            return Promise.resolve({ error: insertError });
          },
        };
      }
      // course_enrollments 等其他表：ars-bundle 不使用 enrollment，一律回「無匹配」。
      return {
        select: () => chain({ data: null, error: null }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
      };
    },
  }),
}));

import { POST } from "./route";

function mockReq(body: unknown) {
  return new Request("http://localhost/api/webhooks/recur", {
    method: "POST",
    headers: { "x-recur-signature": "sig" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  existingToken = null;
  insertError = null;
  insertCalls.length = 0;
  selectQueue = null;
  sendEmail.mockClear();
  sendEmail.mockResolvedValue({ success: true, data: { id: "msg" } });
});

describe("ars-bundle fulfilment (order.paid webhook)", () => {
  it("inserts a token with bundle-specific max_downloads (faculty=12)", async () => {
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-1",
        data: {
          id: "order-1",
          amount: 2980,
          product_id: PROD_FACULTY,
          customer: { email: "buyer@test.tw" },
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(insertCalls).toHaveLength(1);
    expect(insertCalls[0]).toMatchObject({
      order_id: "order-1",
      product_id: "faculty",
      max_downloads: 12,
      email: "buyer@test.tw",
    });
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it("inserts a token with max_downloads=8 for grad", async () => {
    await POST(
      mockReq({
        type: "order.paid",
        id: "evt-2",
        data: {
          id: "order-2",
          amount: 1980,
          product_id: PROD_GRAD,
          customer: { email: "buyer2@test.tw" },
        },
      }),
    );
    expect(insertCalls[0]).toMatchObject({
      product_id: "grad",
      max_downloads: 8,
    });
  });

  it("locks chosen_vertical to 'medical' for clinician at insert time", async () => {
    await POST(
      mockReq({
        type: "order.paid",
        id: "evt-3",
        data: {
          id: "order-3",
          product_id: PROD_CLINICIAN,
          customer: { email: "doc@test.tw" },
        },
      }),
    );
    expect(insertCalls[0]).toMatchObject({
      product_id: "clinician",
      chosen_vertical: "medical",
    });
  });

  it("reuses the existing token for a repeated order_id (idempotent, no duplicate insert)", async () => {
    existingToken = "existing-token-abc";
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-4",
        data: {
          id: "order-4",
          product_id: PROD_GRAD,
          customer: { email: "buyer3@test.tw" },
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(insertCalls).toHaveLength(0);
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it("missing customer.email escalates to an admin alert instead of throwing", async () => {
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-5",
        data: {
          id: "order-5",
          product_id: PROD_GRAD,
          customer: {},
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(insertCalls).toHaveLength(0);
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail.mock.calls[0][0].to).toBe("admin@test.tw");
  });

  it("returns 500 (so Recur retries) when the ars token insert fails", async () => {
    insertError = { message: "db down" };
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-6",
        data: {
          id: "order-6",
          product_id: PROD_GRAD,
          customer: { email: "buyer4@test.tw" },
        },
      }),
    );
    expect(res.status).toBe(500);
  });

  it("23505 unique violation on insert (concurrent winner already fulfilled): reselects the existing token, sends no second email, and returns 200", async () => {
    insertError = { code: "23505", message: "duplicate key value violates unique constraint" };
    // 第一次 select（insert 前的既有 token 檢查）沒查到 → 進入 insert → 撞 23505 →
    // 第二次 select（重查）拿到贏家已寫入的 token。
    selectQueue = [null, { token: "winner-token-abc" }];
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-7",
        data: {
          id: "order-7",
          product_id: PROD_GRAD,
          customer: { email: "buyer5@test.tw" },
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(insertCalls).toHaveLength(1);
    // 關鍵行為差異：23505 情境完全不寄信（贏家已經寄過了），對照下面的
    // email-失敗情境（token 建立成功、寄信失敗）仍會嘗試寄信＋告警。
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("email send failure (token already created): sends an admin alert instead of throwing, and the webhook still returns 200", async () => {
    sendEmail.mockImplementation(async (args: { to: string | string[] }) => {
      if (args.to === "buyer6@test.tw") {
        return { success: false, error: new Error("resend down") };
      }
      return { success: true, data: { id: "msg" } };
    });
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-8",
        data: {
          id: "order-8",
          product_id: PROD_GRAD,
          customer: { email: "buyer6@test.tw" },
        },
      }),
    );
    expect(res.status).toBe(200);
    // Token 仍建立成功（DB 寫入不受影響）。
    expect(insertCalls).toHaveLength(1);
    // 對照 23505 情境（完全不寄信）：這裡先嘗試寄客戶信（失敗），再寄一封 admin 告警信。
    expect(sendEmail).toHaveBeenCalledTimes(2);
    expect(sendEmail.mock.calls[1][0].to).toBe("admin@test.tw");
  });
});
