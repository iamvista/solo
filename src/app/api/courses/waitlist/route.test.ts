import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { HONEYPOT_FIELD } from "@/lib/waitlist";

process.env.WAITLIST_TOKEN_SECRET = "w".repeat(32);

const rpc = vi.fn();
const newsletterMaybeSingle = vi.fn();
const newsletterInsert = vi.fn();

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

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    rpc,
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: newsletterMaybeSingle }),
      }),
      insert: newsletterInsert,
    }),
  }),
}));

const sendEmail = vi.fn(async (args: { to: string; text?: string }) => ({
  success: true,
  data: { id: `msg-${args.to}` },
}));
vi.mock("@/lib/email", () => ({
  sendEmail: (args: { to: string; text?: string }) => sendEmail(args),
}));

let ipCounter = 0;
function mockReq(body: unknown) {
  ipCounter += 1;
  return new Request("http://localhost/api/courses/waitlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": `10.0.0.${ipCounter}`,
    },
    body: JSON.stringify(body),
  }) as unknown as Parameters<typeof POST>[0];
}

const base = {
  course_slug: "ai-content",
  name: "測試",
  email: "t@test.tw",
  intent: "date_conflict",
};

beforeEach(() => {
  vi.clearAllMocks();
  rpc.mockResolvedValue({ data: "row-uuid-1", error: null });
  newsletterMaybeSingle.mockResolvedValue({ data: null });
  newsletterInsert.mockResolvedValue({ error: null });
});

describe("POST /api/courses/waitlist", () => {
  it("writes the row and returns ok", async () => {
    const res = await POST(mockReq(base));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(rpc).toHaveBeenCalledWith(
      "upsert_course_waitlist",
      expect.objectContaining({
        p_course_slug: "ai-content",
        p_intent: "date_conflict",
      }),
    );
  });

  it("forwards utm attribution to the rpc", async () => {
    await POST(
      mockReq({
        ...base,
        intent: "ad_lead",
        utm: { source: "facebook", campaign: "aiaw-phase1" },
      }),
    );
    expect(rpc).toHaveBeenCalledWith(
      "upsert_course_waitlist",
      expect.objectContaining({
        p_intent: "ad_lead",
        p_utm_source: "facebook",
        p_utm_campaign: "aiaw-phase1",
        p_utm_medium: null,
      }),
    );
  });

  it("silently discards a honeypot submission with an identical success body", async () => {
    const real = await POST(mockReq(base));
    const realBody = await real.json();
    vi.clearAllMocks();

    const bot = await POST(mockReq({ ...base, [HONEYPOT_FIELD]: "spam" }));
    expect(bot.status).toBe(real.status);
    expect(await bot.json()).toEqual(realBody);

    expect(rpc).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("rejects an unknown intent", async () => {
    const res = await POST(mockReq({ ...base, intent: "vip" }));
    expect(res.status).toBe(400);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("sends a confirmation email after a successful capture", async () => {
    await POST(mockReq(base));
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail.mock.calls[0][0].to).toBe("t@test.tw");
  });

  it("supplies an explicit plain-text alternative so links stay clickable", async () => {
    await POST(mockReq(base));
    const { text } = sendEmail.mock.calls[0][0];
    expect(text).toBeTruthy();
    expect(text).toContain("&slot=saturday");
    // Resend 自動轉換會產生 `...&slot=weekday_evening週六`
    expect(text).not.toMatch(/&slot=[a-z_]+週/);
  });

  it("still succeeds when the confirmation email throws", async () => {
    sendEmail.mockRejectedValueOnce(new Error("resend down"));
    const res = await POST(mockReq(base));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(rpc).toHaveBeenCalled();
  });

  it("still succeeds when the newsletter sync throws", async () => {
    newsletterMaybeSingle.mockRejectedValueOnce(new Error("db down"));
    const res = await POST(mockReq(base));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("returns 500 when the upsert fails", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { message: "boom" } });
    const res = await POST(mockReq(base));
    expect(res.status).toBe(500);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("rate limits a single ip", async () => {
    const ip = "10.9.9.9";
    const hit = () =>
      POST(
        new Request("http://localhost/api/courses/waitlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": ip,
          },
          body: JSON.stringify(base),
        }) as unknown as Parameters<typeof POST>[0],
      );

    for (let i = 0; i < 10; i++) expect((await hit()).status).toBe(200);
    const blocked = await hit();
    expect(blocked.status).toBe(429);
  });
});
