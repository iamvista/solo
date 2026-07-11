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
// army-kit productId：見 src/lib/army-kit.ts ARMY_PRODUCT_ID（已建產品，跨環境共用）。
const PROD_ARMY_KIT = "g7i9iptfxfqxjip5jdr6hj90";
// lecturer-kit productId：見 src/lib/lecturer-kit.ts LECTURER_PRODUCT_ID（已建產品，跨環境共用）。
const PROD_LECTURER_KIT = "lgzuc8wf1ulcw5qu8e78uxjs";
// ai-coach-kit productId：見 src/lib/recur-product-config.ts AI_COACH_KIT_PRODUCT_ID。
const PROD_AI_COACH_KIT = "xqvb9nqxtehhfesuhequm9jp";

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

// refund.succeeded → revokeDownloadTokensByOrderId 的 update 鏈路（download_tokens
// 表專用）：紀錄呼叫參數供斷言「只按 order_id 篩選、不分產品」，並可控制回傳結果
// 模擬「已過期不重複更新（data: []）」與「DB 錯誤只 log 不 throw（error 非 null）」。
let updateResult: { data: unknown; error: unknown } = { data: [], error: null };
const updateCalls: Array<{
  payload: Record<string, unknown>;
  eqArgs?: [string, unknown];
  gtArgs?: [string, unknown];
}> = [];

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
          update: (payload: Record<string, unknown>) => {
            const call: (typeof updateCalls)[number] = { payload };
            updateCalls.push(call);
            return {
              eq: (col: string, val: unknown) => {
                call.eqArgs = [col, val];
                return {
                  gt: (col2: string, val2: unknown) => {
                    call.gtArgs = [col2, val2];
                    return {
                      select: () => Promise.resolve(updateResult),
                    };
                  },
                };
              },
            };
          },
        };
      }
      // course_enrollments／affiliate_referrals 等其他表：ars-bundle 不使用 enrollment，
      // 一律回「無匹配」。update().eq() 的回傳值同時是 thenable（滿足單層 eq 直接
      // await 的呼叫端，如 markEnrollmentPaid）也帶 .neq()（滿足 voidCommissionByOrderId
      // 的 update().eq().neq() 兩層鏈路，refund.succeeded 會無條件呼叫到）。
      return {
        select: () => chain({ data: null, error: null }),
        update: () => ({
          eq: () => ({
            neq: () => Promise.resolve({ error: null }),
            then: (resolve: (v: { error: null }) => void) =>
              resolve({ error: null }),
          }),
        }),
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
  updateResult = { data: [], error: null };
  updateCalls.length = 0;
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

  it("reuses the existing token for a repeated order_id (idempotent, no duplicate insert, no duplicate email)", async () => {
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
    // 重送/重複的 order_id 代表已經 fulfil 過，必須 return 早退、不寄第二封信
    // （A-007 Task 6 修正：對照 army-kit 既有的相同斷言）。
    expect(sendEmail).not.toHaveBeenCalled();
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

  it("A-007 Task 6: a real Recur webhook resend for the same orderId sends only one email in total (fulfilArsBundle idempotency early return)", async () => {
    const orderId = "order-resend-1";
    const res1 = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-resend-1a",
        data: {
          id: orderId,
          product_id: PROD_GRAD,
          customer: { email: "resend@test.tw" },
        },
      }),
    );
    expect(res1.status).toBe(200);
    expect(insertCalls).toHaveLength(1);
    expect(sendEmail).toHaveBeenCalledTimes(1);

    // 模擬 DB 在第一次 fulfil 後的實際狀態：該 order_id 已經有 token 了。
    existingToken = insertCalls[0].token as string;

    const res2 = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-resend-1b",
        data: {
          id: orderId,
          product_id: PROD_GRAD,
          customer: { email: "resend@test.tw" },
        },
      }),
    );
    expect(res2.status).toBe(200);
    // Recur 重送同一筆 order.paid：不應該再 insert 第二筆 token，也不應該再寄第二封信。
    expect(insertCalls).toHaveLength(1);
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });
});

describe("army-kit fulfilment (order.paid webhook)", () => {
  it("inserts a token with the army-kit product_id and max_downloads=5", async () => {
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-army-1",
        data: {
          id: "order-army-1",
          amount: 990,
          product_id: PROD_ARMY_KIT,
          customer: { email: "buyer@test.tw" },
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(insertCalls).toHaveLength(1);
    expect(insertCalls[0]).toMatchObject({
      order_id: "order-army-1",
      product_id: "army-kit",
      max_downloads: 5,
      email: "buyer@test.tw",
    });
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it("reuses the existing token for a repeated order_id (idempotent, no duplicate insert, no duplicate email)", async () => {
    existingToken = "existing-army-token";
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-army-2",
        data: {
          id: "order-army-2",
          product_id: PROD_ARMY_KIT,
          customer: { email: "buyer2@test.tw" },
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(insertCalls).toHaveLength(0);
    // 重送/重複的 order_id 代表已經 fulfil 過，必須 return 早退、不寄第二封信。
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("missing customer.email escalates to an admin alert instead of throwing (P1-4 早退點涵蓋 army-kit)", async () => {
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-army-3",
        data: {
          id: "order-army-3",
          product_id: PROD_ARMY_KIT,
          customer: {},
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(insertCalls).toHaveLength(0);
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail.mock.calls[0][0].to).toBe("admin@test.tw");
  });

  it("23505 unique violation on insert (concurrent winner already fulfilled): reselects the existing token, sends no second email, and returns 200", async () => {
    insertError = { code: "23505", message: "duplicate key value violates unique constraint" };
    selectQueue = [null, { token: "army-winner-token" }];
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-army-4",
        data: {
          id: "order-army-4",
          product_id: PROD_ARMY_KIT,
          customer: { email: "buyer3@test.tw" },
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(insertCalls).toHaveLength(1);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 500 (so Recur retries via the shared DigitalFulfilmentError path) when the army-kit token insert fails", async () => {
    insertError = { message: "db down" };
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-army-5",
        data: {
          id: "order-army-5",
          product_id: PROD_ARMY_KIT,
          customer: { email: "buyer4@test.tw" },
        },
      }),
    );
    expect(res.status).toBe(500);
  });

  it("email send failure (token already created): sends an admin alert instead of throwing, and the webhook still returns 200", async () => {
    sendEmail.mockImplementation(async (args: { to: string | string[] }) => {
      if (args.to === "buyer5@test.tw") {
        return { success: false, error: new Error("resend down") };
      }
      return { success: true, data: { id: "msg" } };
    });
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-army-6",
        data: {
          id: "order-army-6",
          product_id: PROD_ARMY_KIT,
          customer: { email: "buyer5@test.tw" },
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(insertCalls).toHaveLength(1);
    expect(sendEmail).toHaveBeenCalledTimes(2);
    expect(sendEmail.mock.calls[1][0].to).toBe("admin@test.tw");
  });
});

describe("ai-coach-kit fulfilment (order.paid webhook)", () => {
  it("A-007 Task 6 Step 6: a real Recur webhook resend for the same orderId sends only one email in total (fulfilAiCoachKit idempotency early return)", async () => {
    const orderId = "order-coach-resend-1";
    const res1 = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-coach-resend-1a",
        data: {
          id: orderId,
          product_id: PROD_AI_COACH_KIT,
          customer: { email: "coach-resend@test.tw" },
        },
      }),
    );
    expect(res1.status).toBe(200);
    expect(insertCalls).toHaveLength(1);
    expect(sendEmail).toHaveBeenCalledTimes(1);

    // 模擬 DB 在第一次 fulfil 後的實際狀態：該 order_id 已經有 token 了。
    existingToken = insertCalls[0].token as string;

    const res2 = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-coach-resend-1b",
        data: {
          id: orderId,
          product_id: PROD_AI_COACH_KIT,
          customer: { email: "coach-resend@test.tw" },
        },
      }),
    );
    expect(res2.status).toBe(200);
    // Recur 重送同一筆 order.paid：不應該再 insert 第二筆 token，也不應該再寄第二封信。
    expect(insertCalls).toHaveLength(1);
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });
});

describe("lecturer-kit fulfilment (order.paid webhook)", () => {
  it("inserts a token with the lecturer-kit product_id and max_downloads=5, and sends one email", async () => {
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-lecturer-1",
        data: {
          id: "order-lecturer-1",
          amount: 1490,
          product_id: PROD_LECTURER_KIT,
          customer: { email: "buyer@test.tw" },
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(insertCalls).toHaveLength(1);
    expect(insertCalls[0]).toMatchObject({
      order_id: "order-lecturer-1",
      product_id: "lecturer-kit",
      max_downloads: 5,
      email: "buyer@test.tw",
    });
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it("reuses the existing token for a repeated order_id (idempotent, no duplicate insert, no duplicate email)", async () => {
    existingToken = "existing-lecturer-token";
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-lecturer-2",
        data: {
          id: "order-lecturer-2",
          product_id: PROD_LECTURER_KIT,
          customer: { email: "buyer2@test.tw" },
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(insertCalls).toHaveLength(0);
    // 重送/重複的 order_id 代表已經 fulfil 過，必須 return 早退、不寄第二封信。
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("email send failure (token already created): sends an admin alert instead of throwing, and the webhook still returns 200", async () => {
    sendEmail.mockImplementation(async (args: { to: string | string[] }) => {
      if (args.to === "buyer3@test.tw") {
        return { success: false, error: new Error("resend down") };
      }
      return { success: true, data: { id: "msg" } };
    });
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-lecturer-3",
        data: {
          id: "order-lecturer-3",
          product_id: PROD_LECTURER_KIT,
          customer: { email: "buyer3@test.tw" },
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(insertCalls).toHaveLength(1);
    expect(sendEmail).toHaveBeenCalledTimes(2);
    expect(sendEmail.mock.calls[1][0].to).toBe("admin@test.tw");
  });

  it("23505 unique violation on insert (concurrent winner already fulfilled): reselects the existing token, sends no second email, and returns 200", async () => {
    insertError = { code: "23505", message: "duplicate key value violates unique constraint" };
    selectQueue = [null, { token: "lecturer-winner-token" }];
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-lecturer-4",
        data: {
          id: "order-lecturer-4",
          product_id: PROD_LECTURER_KIT,
          customer: { email: "buyer4@test.tw" },
        },
      }),
    );
    expect(res.status).toBe(200);
    expect(insertCalls).toHaveLength(1);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 500 (so Recur retries via the shared DigitalFulfilmentError path) when the lecturer-kit token insert fails", async () => {
    insertError = { message: "db down" };
    const res = await POST(
      mockReq({
        type: "order.paid",
        id: "evt-lecturer-5",
        data: {
          id: "order-lecturer-5",
          product_id: PROD_LECTURER_KIT,
          customer: { email: "buyer5@test.tw" },
        },
      }),
    );
    expect(res.status).toBe(500);
  });
});

describe("refund.succeeded revokes download tokens (order-scoped, product-agnostic)", () => {
  it("only revokes the not-yet-expired token(s) belonging to the refunded order_id", async () => {
    updateResult = { data: [{ token: "revoked-tok-1" }], error: null };
    const res = await POST(
      mockReq({
        type: "refund.succeeded",
        id: "evt-refund-1",
        data: { order_id: "order-lecturer-refund-1" },
      }),
    );
    expect(res.status).toBe(200);
    expect(updateCalls).toHaveLength(1);
    expect(updateCalls[0].eqArgs).toEqual(["order_id", "order-lecturer-refund-1"]);
    expect(updateCalls[0].gtArgs?.[0]).toBe("expires_at");
  });

  it("an already-expired token yields zero affected rows and does not error (no duplicate/no-op update)", async () => {
    updateResult = { data: [], error: null };
    const res = await POST(
      mockReq({
        type: "refund.succeeded",
        id: "evt-refund-2",
        data: { order_id: "order-lecturer-refund-2" },
      }),
    );
    expect(res.status).toBe(200);
    expect(updateCalls).toHaveLength(1);
  });

  it("is generic and product-agnostic: filters only by order_id, with no product/kind branch", async () => {
    updateResult = { data: [{ token: "revoked-tok-3" }], error: null };
    const res = await POST(
      mockReq({
        type: "refund.succeeded",
        id: "evt-refund-3",
        data: { order_id: "order-army-refund-3" },
      }),
    );
    expect(res.status).toBe(200);
    expect(updateCalls).toHaveLength(1);
    // 除了 order_id 的 eq 與 expires_at 的 gt，不應該再帶 product_id 之類的篩選條件。
    expect(updateCalls[0].eqArgs?.[0]).toBe("order_id");
  });

  it("a DB error while revoking only logs and does not throw (webhook still returns 200, not 500)", async () => {
    updateResult = { data: null, error: { message: "db down" } };
    const res = await POST(
      mockReq({
        type: "refund.succeeded",
        id: "evt-refund-4",
        data: { order_id: "order-lecturer-refund-4" },
      }),
    );
    expect(res.status).toBe(200);
  });
});
