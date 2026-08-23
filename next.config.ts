import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24 hours（圖片很少更新，延長快取降低 Image Optimization 費用）
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      // 著作中樞遷移（2026-07-03）：canonical 移至 vista.tw/books（作者媒體站收讀者與名單，
      // solo.tw 專注課程轉化）。決策記錄：openspec/changes/add-books-hub/proposal.md
      {
        source: "/book",
        destination: "https://www.vista.tw/books",
        permanent: true,
      },
      {
        source: "/books",
        destination: "https://www.vista.tw/books",
        permanent: true,
      },
      {
        source: "/books/:slug*",
        destination: "https://www.vista.tw/books/:slug*",
        permanent: true,
      },
      // 已下架課程救流量（2026-06-29）：AI 變現研究院下架，舊網址 301 導到 Vista 作者頁把死流量變名單
      {
        source: "/courses/ai-monetization-institute",
        destination: "/teachers/vista",
        permanent: true,
      },
      // 已下架課程救流量（2026-06-17）：/courses/ai-social-content 已 404，
      // GA4 顯示每月仍有 ~230 次造訪，轉到 Susie 作者頁（含候補）把死流量變名單
      {
        source: "/courses/ai-social-content",
        destination: "/teachers/susie",
        permanent: true,
      },
      // 已下架產品（2026-07-11）：writing-os／ai-coach-kit 暫停販售，舊銷售頁 301 導到工具區。
      // 註：/products/ai-coach-kit/guide/* 為已購買者交付頁，source 無萬用字元故不受影響。
      {
        source: "/products/writing-os",
        destination: "/tools",
        permanent: true,
      },
      {
        source: "/products/ai-coach-kit",
        destination: "/tools",
        permanent: true,
      },
      // 講師頁網址統一（2026-06-17）：/t → /teachers、個別頁 /t/:slug → /teachers/:slug
      {
        source: "/t",
        destination: "/teachers",
        permanent: true,
      },
      {
        source: "/t/:slug*",
        destination: "/teachers/:slug*",
        permanent: true,
      },
      // non-www → www 301 redirect（SEO 網域統一）
      {
        source: "/:path*",
        has: [{ type: "host", value: "solo.tw" }],
        destination: "https://www.solo.tw/:path*",
        permanent: true,
      },
      // 產品命名遷移（2026-04-28）：Context Architecture → AI 個人脈絡庫
      {
        source: "/tools/context-architecture",
        destination: "/tools/ai-context-library",
        permanent: true,
      },
      {
        source: "/context-architecture-dfy",
        destination: "/tools/ai-context-library-dfy",
        permanent: true,
      },
      // 路徑一致性遷移（2026-05-01）：DFY 收進 /tools/ 底下與 ai-context-library 對齊
      {
        source: "/ai-context-library-dfy",
        destination: "/tools/ai-context-library-dfy",
        permanent: true,
      },
      // IA 整併（2026-05-01）：/products 著陸頁退役，/tools 為單一 hub。子路由 /products/:slug 不受影響。
      {
        source: "/products",
        destination: "/tools",
        permanent: true,
      },
      // 三頁下架（2026-07-12，A-010）：副腦計畫與兩門課下架，2026-07-12 線上驗收 13/13 通過後升 301。
      // 精確路徑，不用萬用字元：/brain/:path* 會斷已購用戶交付與證書路由；
      // /courses/innovation-workshop/ebook 是獨立磁鐵交付頁，不可被 innovation-workshop 萬用吃掉。
      {
        source: "/brain",
        destination: "/courses",
        permanent: true,
      },
      {
        source: "/courses/senior-asset-safety",
        destination: "/courses",
        permanent: true,
      },
      {
        source: "/courses/innovation-workshop",
        destination: "/courses",
        permanent: true,
      },
      // 概念變現陪跑營下架（2026-08-01，Vista 指示）：查過全部 153 筆訂單，
      // 這門課零報名，Recur 三個方案已改 active:false。同樣用精確路徑，
      // 不用萬用字元，避免吃掉 /assignments 等交付路由。
      {
        source: "/courses/concept-monetization-bootcamp",
        destination: "/courses",
        permanent: true,
      },
      {
        source: "/courses/concept-monetization-bootcamp/register",
        destination: "/courses",
        permanent: true,
      },
    ];
  },
  async headers() {
    // Content Security Policy — 涵蓋 Google Analytics、Cal.com embed、Supabase、Vercel
    // 注意：Next.js + React 需要 'unsafe-inline' 和 'unsafe-eval' 才能執行 hydration。
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://app.cal.com https://embed.cal.com https://*.vercel-insights.com https://*.vercel-scripts.com https://unpkg.com https://connect.facebook.net https://news.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' https:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://*.vercel-insights.com https://app.cal.com https://api.cal.com https://api.recur.tw https://*.recur.tw https://www.facebook.com https://connect.facebook.net",
      "frame-src 'self' https://app.cal.com https://embed.cal.com https://www.youtube.com https://www.youtube-nocookie.com https://news.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://buy.recur.tw https://*.recur.tw",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    // Link headers 指向 AI agent 可用資源（RFC 8288）
    const linkHeader = [
      '</llms.txt>; rel="describedby"; type="text/plain"',
      '</sitemap.xml>; rel="sitemap"; type="application/xml"',
    ].join(", ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
      {
        source: "/",
        headers: [{ key: "Link", value: linkHeader }],
      },
      {
        // API Catalog (RFC 9727) must be served as application/linkset+json
        source: "/.well-known/api-catalog",
        headers: [
          { key: "Content-Type", value: "application/linkset+json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ];
  },
};

export default nextConfig;
