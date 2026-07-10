import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

let tokenRow: Record<string, unknown> | null = null;
const rpc = vi.fn();
const latestChosenVertical = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve(
              tokenRow
                ? { data: tokenRow, error: null }
                : { data: null, error: { message: "not found" } },
            ),
          maybeSingle: () => latestChosenVertical(),
        }),
      }),
    }),
    rpc: (name: string, args: unknown) => rpc(name, args),
  }),
}));

function baseToken(overrides: Record<string, unknown> = {}) {
  return {
    id: "row-1",
    token: "tok-1",
    product_id: "grad",
    chosen_vertical: null,
    download_count: 0,
    max_downloads: 8,
    expires_at: new Date(Date.now() + 3600_000).toISOString(),
    ...overrides,
  };
}

function mockReq(body: unknown) {
  return new NextRequest("http://localhost/api/download/ars/select-vertical", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  tokenRow = null;
  rpc.mockReset();
  latestChosenVertical.mockReset();
  latestChosenVertical.mockResolvedValue({ data: { chosen_vertical: null } });
});

describe("POST /api/download/ars/select-vertical", () => {
  it("400s on a vertical outside the whitelist", async () => {
    tokenRow = baseToken();
    const res = await POST(mockReq({ token: "tok-1", vertical: "law" }));
    expect(res.status).toBe(400);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("locks the vertical on first selection (affected rows = 1)", async () => {
    tokenRow = baseToken({ chosen_vertical: null });
    rpc.mockResolvedValueOnce({
      data: [{ ...baseToken(), chosen_vertical: "medical" }],
      error: null,
    });
    const res = await POST(mockReq({ token: "tok-1", vertical: "medical" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true, vertical: "medical" });
    expect(rpc).toHaveBeenCalledWith("select_ars_vertical", {
      p_token: "tok-1",
      p_vertical: "medical",
    });
  });

  it("returns the already-locked value without re-selecting (no rpc call)", async () => {
    tokenRow = baseToken({ chosen_vertical: "medical" });
    const res = await POST(mockReq({ token: "tok-1", vertical: "stem" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true, vertical: "medical" });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("403s for a clinician token (vertical already locked at fulfilment, not selectable here)", async () => {
    tokenRow = baseToken({ product_id: "clinician", chosen_vertical: "medical" });
    const res = await POST(mockReq({ token: "tok-1", vertical: "medical" }));
    expect(res.status).toBe(403);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("403s for an allaccess token (no vertical selection needed)", async () => {
    tokenRow = baseToken({ product_id: "allaccess", chosen_vertical: null });
    const res = await POST(mockReq({ token: "tok-1", vertical: "medical" }));
    expect(res.status).toBe(403);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("403s for a non-ARS token (e.g. ai-coach-kit)", async () => {
    tokenRow = baseToken({ product_id: "ai-coach-kit", chosen_vertical: null });
    const res = await POST(mockReq({ token: "tok-1", vertical: "medical" }));
    expect(res.status).toBe(403);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("simulates a race: a second concurrent call sees zero affected rows and reads back the winner's value", async () => {
    tokenRow = baseToken({ chosen_vertical: null });
    // 原子更新沒搶到（另一個並發請求先鎖定），affected rows = 0
    rpc.mockResolvedValueOnce({ data: [], error: null });
    latestChosenVertical.mockResolvedValueOnce({
      data: { chosen_vertical: "business" },
    });
    const res = await POST(mockReq({ token: "tok-1", vertical: "stem" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true, vertical: "business" });
  });
});
