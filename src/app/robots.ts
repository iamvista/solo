import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/settings/",
          "/auth/",
          "/api/",
          "/r/",  // 診斷結果短連結（個人資料）
        ],
      },
    ],
    sitemap: "https://www.solo.tw/sitemap.xml",
  };
}
