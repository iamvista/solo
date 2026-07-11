import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

let tokenRow: Record<string, unknown> | null = null;
const rpc = vi.fn();
const headMock = vi.fn(async (pathname: string) => ({
  url: `https://blob.example/${pathname}`,
  size: 4321,
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
    product_id: "army-kit",
    download_count: 0,
    max_downloads: 5,
    expires_at: new Date(Date.now() + 3600_000).toISOString(),
    ...overrides,
  };
}

let ipCounter = 0;
function mockReq(qs: string) {
  ipCounter += 1;
  return new NextRequest(`http://localhost/api/download/army?${qs}`, {
    headers: { "x-forwarded-for": `10.2.0.${ipCounter}` },
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

describe("GET /api/download/army", () => {
  it("400s when token is missing", async () => {
    const res = await GET(mockReq(""));
    expect(res.status).toBe(400);
  });

  it("404s for an unknown token", async () => {
    const res = await GET(mockReq(`token=tok-1`));
    expect(res.status).toBe(404);
  });

  it("403s for a non-army-kit token (e.g. ai-coach-kit)", async () => {
    tokenRow = baseToken({ product_id: "ai-coach-kit" });
    const res = await GET(mockReq(`token=tok-1`));
    expect(res.status).toBe(403);
  });

  it("403s for an ars token", async () => {
    tokenRow = baseToken({ product_id: "grad" });
    const res = await GET(mockReq(`token=tok-1`));
    expect(res.status).toBe(403);
  });

  it("410s on an expired token", async () => {
    tokenRow = baseToken({ expires_at: new Date(Date.now() - 1000).toISOString() });
    const res = await GET(mockReq(`token=tok-1`));
    expect(res.status).toBe(410);
  });

  it("429s when the pre-check download_count has already reached max_downloads", async () => {
    tokenRow = baseToken({ download_count: 5, max_downloads: 5 });
    const res = await GET(mockReq(`token=tok-1`));
    expect(res.status).toBe(429);
  });

  it("429s when the atomic increment affects zero rows (concurrent race already exhausted the limit)", async () => {
    tokenRow = baseToken({ download_count: 4, max_downloads: 5 });
    rpc.mockResolvedValueOnce({ data: [], error: null });
    const res = await GET(mockReq(`token=tok-1`));
    expect(res.status).toBe(429);
  });

  it("410s (not 429) when the token was still valid at precheck but expires before the atomic increment runs", async () => {
    tokenRow = baseToken({
      // Precheck 那一刻还没过期，但 fetch blob 期間（模擬延遲）會真的過期。
      expires_at: new Date(Date.now() + 20).toISOString(),
      download_count: 4,
      max_downloads: 5,
    });
    rpc.mockResolvedValueOnce({ data: [], error: null });
    global.fetch = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return { ok: true, body: new ReadableStream() };
    }) as unknown as typeof fetch;
    const res = await GET(mockReq(`token=tok-1`));
    expect(res.status).toBe(410);
  });

  it("serves the army-kit zip for a valid token", async () => {
    tokenRow = baseToken();
    const res = await GET(mockReq(`token=tok-1`));
    expect(res.status).toBe(200);
    expect(headMock).toHaveBeenCalledWith("products/army/v1/solo-army-full.zip");
    expect(res.headers.get("Content-Disposition")).toContain(
      "solo-army-kit.zip",
    );
    expect(rpc).toHaveBeenCalledWith("increment_download_count", {
      p_token: "tok-1",
    });
  });
});
