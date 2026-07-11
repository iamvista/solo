import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

const insert = vi.fn();

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: () => ({ insert }),
  }),
}));

let ipCounter = 0;
function mockReq(body: unknown) {
  ipCounter += 1;
  return new Request("http://localhost/api/interest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": `10.2.0.${ipCounter}`,
    },
    body: JSON.stringify(body),
  }) as unknown as Parameters<typeof POST>[0];
}

beforeEach(() => {
  vi.clearAllMocks();
  insert.mockResolvedValue({ error: null });
});

describe("POST /api/interest", () => {
  it("inserts and returns success", async () => {
    const res = await POST(
      mockReq({
        productId: "lgzuc8wf1ulcw5qu8e78uxjs",
        email: "T@Test.tw",
        name: "測試",
      }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(insert).toHaveBeenCalledWith({
      product_id: "lgzuc8wf1ulcw5qu8e78uxjs",
      email: "t@test.tw",
      name: "測試",
    });
  });

  it("treats a duplicate product_id+email as idempotent success", async () => {
    insert.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key" },
    });
    const res = await POST(
      mockReq({ productId: "lgzuc8wf1ulcw5qu8e78uxjs", email: "t@test.tw" }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
  });

  it("rejects missing email with 400", async () => {
    const res = await POST(mockReq({ productId: "lgzuc8wf1ulcw5qu8e78uxjs" }));
    expect(res.status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });

  it("rejects a malformed email with 400", async () => {
    const res = await POST(
      mockReq({ productId: "lgzuc8wf1ulcw5qu8e78uxjs", email: "not-an-email" }),
    );
    expect(res.status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });

  it("rejects missing productId with 400", async () => {
    const res = await POST(mockReq({ email: "t@test.tw" }));
    expect(res.status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });

  it("returns 500 when the insert fails for a non-duplicate reason", async () => {
    insert.mockResolvedValueOnce({ error: { code: "42501", message: "boom" } });
    const res = await POST(
      mockReq({ productId: "lgzuc8wf1ulcw5qu8e78uxjs", email: "t@test.tw" }),
    );
    expect(res.status).toBe(500);
  });

  it("rate limits a single ip", async () => {
    const ip = "10.9.9.8";
    const hit = () =>
      POST(
        new Request("http://localhost/api/interest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": ip,
          },
          body: JSON.stringify({
            productId: "lgzuc8wf1ulcw5qu8e78uxjs",
            email: "t@test.tw",
          }),
        }) as unknown as Parameters<typeof POST>[0],
      );

    for (let i = 0; i < 10; i++) expect((await hit()).status).toBe(200);
    const blocked = await hit();
    expect(blocked.status).toBe(429);
  });
});
