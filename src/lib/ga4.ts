import { BetaAnalyticsDataClient } from "@google-analytics/data";

// GA4 真實流量（訪客、工作階段、熱門頁、管道）。
// 需要環境變數才會啟用，未設定時優雅降級（configured:false），不會讓 /admin 壞掉：
//   GA4_PROPERTY_ID   — GA4「資源 ID」數字（注意：不是 G-XXXX 評估 ID）
//   GA4_CLIENT_EMAIL  — Google 服務帳號 email
//   GA4_PRIVATE_KEY   — 服務帳號私鑰（Vercel 環境變數中換行用 \n）
export interface GA4Traffic {
  configured: boolean;
  error?: string;
  rangeDays: number;
  activeUsers: number;
  sessions: number;
  pageViews: number;
  topPages: { path: string; views: number }[];
  channels: { channel: string; sessions: number }[];
}

function getClient():
  | { client: BetaAnalyticsDataClient; propertyId: string }
  | null {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const clientEmail = process.env.GA4_CLIENT_EMAIL;
  const privateKey = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!propertyId || !clientEmail || !privateKey) return null;
  const client = new BetaAnalyticsDataClient({
    credentials: { client_email: clientEmail, private_key: privateKey },
  });
  return { client, propertyId };
}

export async function getGA4Traffic(rangeDays = 28): Promise<GA4Traffic> {
  const base: GA4Traffic = {
    configured: false,
    rangeDays,
    activeUsers: 0,
    sessions: 0,
    pageViews: 0,
    topPages: [],
    channels: [],
  };

  const conn = getClient();
  if (!conn) return base;

  const { client, propertyId } = conn;
  const property = `properties/${propertyId}`;
  const dateRanges = [{ startDate: `${rangeDays}daysAgo`, endDate: "today" }];

  try {
    const [totals, pages, channels] = await Promise.all([
      client.runReport({
        property,
        dateRanges,
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
        ],
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [
          { metric: { metricName: "screenPageViews" }, desc: true },
        ],
        limit: 8,
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 6,
      }),
    ]);

    const t = totals[0].rows?.[0]?.metricValues ?? [];
    return {
      configured: true,
      rangeDays,
      activeUsers: Number(t[0]?.value ?? 0),
      sessions: Number(t[1]?.value ?? 0),
      pageViews: Number(t[2]?.value ?? 0),
      topPages: (pages[0].rows ?? []).map((r) => ({
        path: r.dimensionValues?.[0]?.value ?? "",
        views: Number(r.metricValues?.[0]?.value ?? 0),
      })),
      channels: (channels[0].rows ?? []).map((r) => ({
        channel: r.dimensionValues?.[0]?.value ?? "(未分類)",
        sessions: Number(r.metricValues?.[0]?.value ?? 0),
      })),
    };
  } catch (err) {
    return {
      ...base,
      configured: true,
      error: err instanceof Error ? err.message : "GA4 查詢失敗",
    };
  }
}
