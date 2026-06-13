import { describe, it, expect, vi } from "vitest";
import { POST } from "./route";

function mockReq(body: unknown, ip = "1.2.3.4") {
  return new Request("http://localhost/api/consulting/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

// after() 在單元測試沒有請求情境會丟錯；mock 成直接執行 callback。
vi.mock("next/server", async () => {
  const actual =
    await vi.importActual<typeof import("next/server")>("next/server");
  return {
    ...actual,
    after: (fn: () => unknown) => {
      void fn();
    },
  };
});

vi.mock("@/lib/consulting-db", async () => {
  const actual = await vi.importActual<typeof import("@/lib/consulting-db")>(
    "@/lib/consulting-db",
  );
  return {
    ...actual,
    insertLead: vi.fn(async (p: Record<string, unknown>) => ({
      id: "lead-id-1",
      ...p,
    })),
  };
});

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn(async () => ({ success: true, data: { id: "msg" } })),
}));

describe("POST /api/consulting/leads", () => {
  it("422 on missing required fields", async () => {
    const res = await POST(mockReq({ email: "t@t.tw" }, "1.2.3.5"));
    expect(res.status).toBe(422);
  });

  it("200 with leadId on valid payload", async () => {
    const res = await POST(
      mockReq(
        {
          name: "Test",
          email: "t@t.tw",
          contactMethod: "email",
          topics: ["vibe-coding"],
          specificProblem:
            "我想做一個 podcast 推薦工具，但不知道從哪開始也不會 React",
          level: "basic",
          plan: "1hr",
          consentTerms: true,
        },
        "1.2.3.6",
      ),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.leadId).toBe("lead-id-1");
  });
});
