import { describe, it, expect, vi, beforeEach } from "vitest";

let tokenRow: { product_id: string } | null = null;

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () =>
            Promise.resolve(
              tokenRow
                ? { data: tokenRow, error: null }
                : { data: null, error: null },
            ),
        }),
      }),
    }),
  }),
}));

import { getDownloadInfo } from "./download-info";

beforeEach(() => {
  tokenRow = null;
});

describe("getDownloadInfo", () => {
  it("returns lecturer-kit productName/downloadHref/ttlHours/maxDownloads for a lecturer-kit token", async () => {
    tokenRow = { product_id: "lecturer-kit" };
    const info = await getDownloadInfo("tok-lecturer-1");
    expect(info).toEqual({
      productName: "講師 AI 幕僚",
      downloadHref: "/api/download/lecturer?token=tok-lecturer-1",
      ttlHours: 72,
      maxDownloads: 5,
    });
  });

  it("returns null for an unrecognized product_id (付款 success 頁不應該假裝有下載資訊)", async () => {
    tokenRow = { product_id: "some-unknown-product" };
    const info = await getDownloadInfo("tok-unknown");
    expect(info).toBeNull();
  });
});
