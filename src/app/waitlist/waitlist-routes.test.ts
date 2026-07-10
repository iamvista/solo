import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.WAITLIST_TOKEN_SECRET = "w".repeat(32);

const update = vi.fn();
const eq = vi.fn();

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: () => ({ update: (...a: unknown[]) => (update(...a), { eq }) }),
  }),
}));

const { generateWaitlistToken } = await import("@/lib/waitlist-token");
const { GET: preferenceGET } = await import("./preference/route");
const { GET: unsubGET, POST: unsubPOST } = await import("./unsubscribe/route");

const ROW_ID = "3f2504e0-4f89-11d3-9a0c-0305e82c3301";
const token = generateWaitlistToken(ROW_ID);

type Handler = (req: never) => Promise<Response>;
const get = (h: Handler, url: string) =>
  h(new Request(url) as never);

beforeEach(() => {
  vi.clearAllMocks();
  eq.mockResolvedValue({ error: null });
});

describe("GET /waitlist/preference", () => {
  it("writes the chosen timeslot and thanks the visitor", async () => {
    const res = await get(
      preferenceGET as Handler,
      `http://localhost/waitlist/preference?token=${token}&slot=saturday`,
    );
    expect(res.status).toBe(200);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ preferred_timeslot: "saturday" }),
    );
    expect(eq).toHaveBeenCalledWith("id", ROW_ID);
  });

  it("overwrites a previous choice on a second click", async () => {
    await get(
      preferenceGET as Handler,
      `http://localhost/waitlist/preference?token=${token}&slot=saturday`,
    );
    await get(
      preferenceGET as Handler,
      `http://localhost/waitlist/preference?token=${token}&slot=sunday`,
    );
    expect(update).toHaveBeenLastCalledWith(
      expect.objectContaining({ preferred_timeslot: "sunday" }),
    );
  });

  it("rejects an unknown slot without writing", async () => {
    const res = await get(
      preferenceGET as Handler,
      `http://localhost/waitlist/preference?token=${token}&slot=bogus`,
    );
    expect(res.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });

  it("rejects a tampered token without writing", async () => {
    const res = await get(
      preferenceGET as Handler,
      `http://localhost/waitlist/preference?token=${token}x&slot=saturday`,
    );
    expect(res.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });
});

describe("GET /waitlist/unsubscribe", () => {
  it("renders a confirmation form and writes nothing (mail scanner prefetch)", async () => {
    const res = await get(
      unsubGET as Handler,
      `http://localhost/waitlist/unsubscribe?token=${token}`,
    );
    expect(res.status).toBe(200);
    expect(update).not.toHaveBeenCalled();

    const html = await res.text();
    expect(html).toContain('method="post"');
    expect(html).toContain(token);
  });

  it("rejects a tampered token", async () => {
    const res = await get(
      unsubGET as Handler,
      `http://localhost/waitlist/unsubscribe?token=nope`,
    );
    expect(res.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });
});

describe("POST /waitlist/unsubscribe", () => {
  function postReq(t: string) {
    const body = new FormData();
    body.set("token", t);
    return new Request("http://localhost/waitlist/unsubscribe", {
      method: "POST",
      body,
    }) as never;
  }

  it("writes unsubscribed_at on explicit confirmation", async () => {
    const res = await (unsubPOST as Handler)(postReq(token));
    expect(res.status).toBe(200);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ unsubscribed_at: expect.any(String) }),
    );
    expect(eq).toHaveBeenCalledWith("id", ROW_ID);
  });

  it("rejects a tampered token without writing", async () => {
    const res = await (unsubPOST as Handler)(postReq("forged.token"));
    expect(res.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });
});
