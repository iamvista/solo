import { describe, it, expect, vi, beforeEach } from "vitest";

let dataRow: { product_id: string } | null = null;
let queryError: unknown = null;

vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () =>
            Promise.resolve({ data: dataRow, error: queryError }),
        }),
      }),
    }),
  }),
}));

import { getDownloadInfo } from "@/lib/download-info";

beforeEach(() => {
  dataRow = null;
  queryError = null;
});

describe("getDownloadInfo (payment/success)", () => {
  it("returns army-kit download info for an army-kit token", async () => {
    dataRow = { product_id: "army-kit" };
    const info = await getDownloadInfo("tok-army");
    expect(info).toMatchObject({
      productName: "無人公司 AI 軍團啟動包",
      downloadHref: "/api/download/army?token=tok-army",
      ttlHours: 72,
      maxDownloads: 5,
    });
  });

  it("returns ai-coach-kit download info for an ai-coach-kit token (回歸不變)", async () => {
    dataRow = { product_id: "ai-coach-kit" };
    const info = await getDownloadInfo("tok-coach");
    expect(info).toMatchObject({
      productName: "AI 教練工坊",
      downloadHref: "/api/download/ai-coach-kit?token=tok-coach",
      ttlHours: 72,
      maxDownloads: 3,
    });
  });

  it("returns null for a token belonging to another product family (e.g. ars)", async () => {
    dataRow = { product_id: "grad" };
    const info = await getDownloadInfo("tok-ars");
    expect(info).toBeNull();
  });

  it("returns null when the token is not found", async () => {
    dataRow = null;
    queryError = { message: "not found" };
    const info = await getDownloadInfo("tok-missing");
    expect(info).toBeNull();
  });
});
