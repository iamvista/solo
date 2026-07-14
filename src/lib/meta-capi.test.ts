import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createHash } from "node:crypto";
import { buildUserData, buildPayload, parseFbCookies, sendCapiEvent } from "./meta-capi";

const sha = (v: string) => createHash("sha256").update(v).digest("hex");

describe("buildUserData", () => {
  it("hashes email lowercased+trimmed, phone digits-only, name lowercased", () => {
    const ud = buildUserData({ email: "  Foo@Bar.COM ", phone: "+886 912-345-678", firstName: "Vista" });
    expect(ud.em).toEqual([sha("foo@bar.com")]);
    expect(ud.ph).toEqual([sha("886912345678")]);
    expect(ud.fn).toEqual([sha("vista")]);
  });
  it("omits empty fields and passes through fbp/fbc/ip/ua", () => {
    const ud = buildUserData({ email: "", fbp: "fb.1.2.3", fbc: "fb.1.4.5", clientIp: "1.2.3.4", userAgent: "UA" });
    expect(ud.em).toBeUndefined();
    expect(ud.fbp).toBe("fb.1.2.3");
    expect(ud.client_ip_address).toBe("1.2.3.4");
    expect(ud.client_user_agent).toBe("UA");
  });
});

describe("buildPayload", () => {
  it("builds base fields and only adds custom_data when value/currency present", () => {
    const base = buildPayload({ eventName: "Lead", eventId: "e1", eventSourceUrl: "https://x", user: {} }, 100);
    expect(base.event_name).toBe("Lead");
    expect(base.event_time).toBe(100);
    expect(base.event_id).toBe("e1");
    expect(base.action_source).toBe("website");
    expect(base.custom_data).toBeUndefined();
    const p = buildPayload({ eventName: "Purchase", eventId: "o1", eventSourceUrl: "https://x", user: {}, customData: { value: 3000, currency: "TWD" } }, 100);
    expect(p.custom_data).toEqual({ value: 3000, currency: "TWD" });
  });
});

describe("parseFbCookies", () => {
  it("extracts _fbp/_fbc", () => {
    expect(parseFbCookies("a=1; _fbp=fb.1.2.3; _fbc=fb.1.4.5")).toEqual({ fbp: "fb.1.2.3", fbc: "fb.1.4.5" });
    expect(parseFbCookies(null)).toEqual({});
  });
});

describe("sendCapiEvent", () => {
  const OLD = { ...process.env };
  beforeEach(() => { vi.restoreAllMocks(); });
  afterEach(() => { process.env = { ...OLD }; });

  it("returns false and does not fetch when env missing", async () => {
    delete process.env.NEXT_PUBLIC_META_PIXEL_ID;
    delete process.env.META_CAPI_ACCESS_TOKEN;
    const f = vi.spyOn(global, "fetch");
    const ok = await sendCapiEvent({ eventName: "Lead", eventId: "e1", eventSourceUrl: "https://x", user: {} });
    expect(ok).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });

  it("posts to the pixel events endpoint and returns true on ok", async () => {
    process.env.NEXT_PUBLIC_META_PIXEL_ID = "PIX";
    process.env.META_CAPI_ACCESS_TOKEN = "TOK";
    delete process.env.META_CAPI_TEST_CODE;
    const f = vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({ events_received: 1 }), { status: 200 }));
    const ok = await sendCapiEvent({ eventName: "Lead", eventId: "e1", eventSourceUrl: "https://x", user: { email: "a@b.com" } });
    expect(ok).toBe(true);
    const url = (f.mock.calls[0][0] as string);
    expect(url).toBe("https://graph.facebook.com/v23.0/PIX/events");
    const body = (f.mock.calls[0][1] as RequestInit).body as URLSearchParams;
    expect(body.get("access_token")).toBe("TOK");
    expect(body.get("data")).toContain("\"event_name\":\"Lead\"");
  });

  it("returns false (never throws) when fetch rejects", async () => {
    process.env.NEXT_PUBLIC_META_PIXEL_ID = "PIX";
    process.env.META_CAPI_ACCESS_TOKEN = "TOK";
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network"));
    const ok = await sendCapiEvent({ eventName: "Lead", eventId: "e1", eventSourceUrl: "https://x", user: {} });
    expect(ok).toBe(false);
  });
});
