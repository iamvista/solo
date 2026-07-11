import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

let tokenRow: Record<string, unknown> | null = null;
const rpc = vi.fn();
const headMock = vi.fn(async (pathname: string) => ({
  url: `https://blob.example/${pathname}`,
  size: 1234,
  pathname,
}));

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
        }),
      }),
    }),
    rpc: (name: string, args: unknown) => rpc(name, args),
  }),
}));

vi.mock("@vercel/blob", () => ({
  head: (pathname: string) => headMock(pathname),
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

let ipCounter = 0;
function mockReq(qs: string) {
  ipCounter += 1;
  return new NextRequest(`http://localhost/api/download/ars?${qs}`, {
    headers: { "x-forwarded-for": `10.1.0.${ipCounter}` },
  });
}

beforeEach(() => {
  tokenRow = null;
  rpc.mockReset();
  rpc.mockResolvedValue({ data: [{ id: "row-1", download_count: 1 }], error: null });
  headMock.mockClear();
  global.fetch = vi.fn(async () => ({
    ok: true,
    body: new ReadableStream(),
  })) as unknown as typeof fetch;
});

describe("GET /api/download/ars", () => {
  it("400s on an invalid part value", async () => {
    tokenRow = baseToken();
    const res = await GET(mockReq(`token=tok-1&part=bogus`));
    expect(res.status).toBe(400);
  });

  it("403s when the bundle does not include the requested part (clinician has no teaching)", async () => {
    tokenRow = baseToken({ product_id: "clinician", chosen_vertical: "medical" });
    const res = await GET(mockReq(`token=tok-1&part=teaching`));
    expect(res.status).toBe(403);
  });

  it("403s for a non-ars token (e.g. ai-coach-kit)", async () => {
    tokenRow = baseToken({ product_id: "ai-coach-kit" });
    const res = await GET(mockReq(`token=tok-1&part=core`));
    expect(res.status).toBe(403);
  });

  it("409s when part=vertical is requested before a vertical is chosen", async () => {
    tokenRow = baseToken({ product_id: "grad", chosen_vertical: null });
    const res = await GET(mockReq(`token=tok-1&part=vertical`));
    expect(res.status).toBe(409);
  });

  it("resolves part=vertical to the chosen vertical's blob pathname", async () => {
    tokenRow = baseToken({ product_id: "grad", chosen_vertical: "medical" });
    const res = await GET(mockReq(`token=tok-1&part=vertical`));
    expect(res.status).toBe(200);
    expect(headMock).toHaveBeenCalledWith("products/ars/v1/ars-vertical-medical.zip");
    expect(res.headers.get("Content-Disposition")).toContain(
      "ars-vertical-medical.zip",
    );
  });

  it("serves the core zip for a grad token", async () => {
    tokenRow = baseToken({ product_id: "grad" });
    const res = await GET(mockReq(`token=tok-1&part=core`));
    expect(res.status).toBe(200);
    expect(headMock).toHaveBeenCalledWith("products/ars/v1/ars-core.zip");
  });

  it("410s on an expired token", async () => {
    tokenRow = baseToken({ expires_at: new Date(Date.now() - 1000).toISOString() });
    const res = await GET(mockReq(`token=tok-1&part=core`));
    expect(res.status).toBe(410);
  });

  it("429s when the atomic increment affects zero rows (limit already reached)", async () => {
    tokenRow = baseToken({ product_id: "grad", download_count: 7, max_downloads: 8 });
    rpc.mockResolvedValueOnce({ data: [], error: null });
    const res = await GET(mockReq(`token=tok-1&part=core`));
    expect(res.status).toBe(429);
  });

  it("410s (not 429) when the token was still valid at precheck but expires before the atomic increment runs (A-007 Task 6)", async () => {
    tokenRow = baseToken({
      product_id: "grad",
      // Precheck 那一刻还没过期，但 fetch blob 期間（模擬延遲）會真的過期，
      // 使 increment_download_count 的 RPC（WHERE expires_at > now()）回空。
      expires_at: new Date(Date.now() + 20).toISOString(),
      download_count: 4,
      max_downloads: 8,
    });
    rpc.mockResolvedValueOnce({ data: [], error: null });
    global.fetch = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return { ok: true, body: new ReadableStream() };
    }) as unknown as typeof fetch;
    const res = await GET(mockReq(`token=tok-1&part=core`));
    expect(res.status).toBe(410);
  });
});
