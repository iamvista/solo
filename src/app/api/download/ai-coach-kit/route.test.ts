import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

let tokenRow: Record<string, unknown> | null = null;
const updateCalls: Array<Record<string, unknown>> = [];
const headMock = vi.fn(async (pathname: string) => ({
  url: `https://blob.example/${pathname}`,
  size: 999,
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
      update: (payload: Record<string, unknown>) => {
        updateCalls.push(payload);
        return { eq: () => Promise.resolve({ error: null }) };
      },
    }),
  }),
}));

vi.mock("@vercel/blob", () => ({
  head: (pathname: string) => headMock(pathname),
}));

function baseToken(overrides: Record<string, unknown> = {}) {
  return {
    id: "row-1",
    token: "tok-1",
    product_id: "ai-coach-kit",
    download_count: 0,
    max_downloads: 3,
    expires_at: new Date(Date.now() + 3600_000).toISOString(),
    ...overrides,
  };
}

let ipCounter = 0;
function mockReq(qs: string) {
  ipCounter += 1;
  return new NextRequest(`http://localhost/api/download/ai-coach-kit?${qs}`, {
    headers: { "x-forwarded-for": `10.3.0.${ipCounter}` },
  });
}

beforeEach(() => {
  tokenRow = null;
  updateCalls.length = 0;
  headMock.mockClear();
  global.fetch = vi.fn(async () => ({
    ok: true,
    body: new ReadableStream(),
  })) as unknown as typeof fetch;
});

describe("GET /api/download/ai-coach-kit", () => {
  it("403s for an ars token (回歸 P0-2: 現存漏洞回補)", async () => {
    tokenRow = baseToken({ product_id: "grad" });
    const res = await GET(mockReq(`token=tok-1`));
    expect(res.status).toBe(403);
  });

  it("403s for an army-kit token (回歸 P0-2)", async () => {
    tokenRow = baseToken({ product_id: "army-kit" });
    const res = await GET(mockReq(`token=tok-1`));
    expect(res.status).toBe(403);
  });

  it("410s on an expired ai-coach-kit token (行為不變)", async () => {
    tokenRow = baseToken({ expires_at: new Date(Date.now() - 1000).toISOString() });
    const res = await GET(mockReq(`token=tok-1`));
    expect(res.status).toBe(410);
  });

  it("429s when download_count already reached max_downloads (行為不變)", async () => {
    tokenRow = baseToken({ download_count: 3, max_downloads: 3 });
    const res = await GET(mockReq(`token=tok-1`));
    expect(res.status).toBe(429);
  });

  it("serves the ai-coach-kit zip for a valid token (行為不變)", async () => {
    tokenRow = baseToken();
    const res = await GET(mockReq(`token=tok-1`));
    expect(res.status).toBe(200);
    expect(headMock).toHaveBeenCalledWith("products/ai-coach-kit.zip");
    expect(res.headers.get("Content-Disposition")).toContain(
      "ai-coach-kit.zip",
    );
    expect(updateCalls).toHaveLength(1);
    expect(updateCalls[0]).toMatchObject({ download_count: 1 });
  });
});
