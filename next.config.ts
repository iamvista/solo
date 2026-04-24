import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  outputFileTracingIncludes: {
    "/api/download/ai-coach-kit": ["./private/ai-coach-kit.zip"],
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
      // non-www → www 301 redirect（SEO 網域統一）
      {
        source: "/:path*",
        has: [{ type: "host", value: "solo.tw" }],
        destination: "https://www.solo.tw/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    // Content Security Policy — 涵蓋 Google Analytics、Cal.com embed、Supabase、Vercel
    // 注意：Next.js + React 需要 'unsafe-inline' 和 'unsafe-eval' 才能執行 hydration。
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://app.cal.com https://embed.cal.com https://*.vercel-insights.com https://*.vercel-scripts.com https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' https:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://*.vercel-insights.com https://app.cal.com https://api.cal.com https://api.recur.tw https://*.recur.tw",
      "frame-src 'self' https://app.cal.com https://embed.cal.com https://www.youtube.com https://www.youtube-nocookie.com",
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
