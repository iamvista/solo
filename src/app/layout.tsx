import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { headers } from "next/headers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";

/* ── JSON-LD 結構化數據 ── */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "solo.tw",
  alternateName: "用 AI 放大你的一人事業",
  url: "https://www.solo.tw",
  description:
    "Vista Cheng 的個人品牌網站。提供 AI 工作坊、諮詢、線上課程，幫助自由工作者、講師和顧問用 AI 放大一人事業的產出。",
  founder: {
    "@type": "Person",
    name: "Vista Cheng",
    alternateName: "鄭緯筌",
    url: "https://www.vista.tw",
  },
  sameAs: [
    "https://www.facebook.com/vista.tw",
    "https://www.instagram.com/vista",
    "https://www.threads.com/@vista",
    "https://www.linkedin.com/in/vistacheng/",
    "https://x.com/vista",
    "https://www.youtube.com/@vistacheng",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "iamvista@gmail.com",
    contactType: "customer service",
    availableLanguage: ["zh-TW", "en"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "solo.tw | 用 AI 放大你的一人事業",
  url: "https://www.solo.tw",
  description:
    "Vista Cheng 的個人品牌網站。AI 工作坊、諮詢、線上課程，幫助自由工作者用 AI 放大一人事業的產出。",
  publisher: { "@type": "Organization", name: "solo.tw" },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.solo.tw/about#vista",
  name: "Vista Cheng",
  alternateName: "鄭緯筌",
  jobTitle: "AI 應用講師・一人事業教練・自由人學院創辦人",
  url: "https://www.solo.tw/about",
  image: "https://www.solo.tw/images/vista-profile.webp",
  description:
    "幫助自由工作者、講師和顧問用 AI 放大一人事業的產出。18,500+ 電子報讀者、50+ 場工作坊。提供 諮詢、線上課程與企業內訓。",
  worksFor: {
    "@type": "Organization",
    name: "solo.tw（自由人學院）",
    url: "https://www.solo.tw",
  },
  knowsAbout: [
    "AI 應用",
    "Vibe Coding",
    "Claude Code",
    "一人事業",
    "個人品牌",
    "內容策略",
    "工作坊設計",
    "AI 學術寫作",
    "Solo OS",
    "Solopreneur",
    "第二大腦",
  ],
  sameAs: [
    "https://www.facebook.com/iamvista",
    "https://www.instagram.com/vista",
    "https://www.threads.com/@vista",
    "https://www.linkedin.com/in/vistacheng/",
    "https://www.youtube.com/@vistacheng",
    "https://www.vista.tw",
    "https://iamvista.substack.com",
  ],
};


const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
  title: "solo.tw | 用 AI 放大你的一人事業",
  description:
    "Vista Cheng 幫助自由工作者、講師和顧問用 AI 放大一人事業的產出。AI 工作坊、諮詢、線上課程、SOLO 方法論。",
  keywords: [
    "一人公司",
    "一人創業",
    "自由工作者",
    "AI 工作坊",
    "AI 應用",
    "講師",
    "顧問",
    "教練",
    "個人品牌",
    "solopreneur",
    "Vista Cheng",
  ],
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/solo-icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://www.solo.tw"),
  openGraph: {
    title: "solo.tw | 用 AI 放大你的一人事業",
    description: "Vista Cheng 幫助自由工作者、講師和顧問用 AI 放大一人事業的產出。AI 工作坊、諮詢、線上課程。",
    url: "https://www.solo.tw",
    siteName: "solo.tw",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "https://www.solo.tw/og",
        width: 1200,
        height: 630,
        alt: "solo.tw — AI × 一人事業",
      },
      {
        url: "https://www.solo.tw/solo-icon.png",
        width: 512,
        height: 512,
        alt: "solo.tw",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "solo.tw | 用 AI 放大你的一人事業",
    description: "Vista Cheng 幫助自由工作者用 AI 放大一人事業的產出。工作坊、諮詢、線上課程。",
    images: ["https://www.solo.tw/og"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const isBrainSubdomain = host.startsWith("brain.");

  return (
    <html lang="zh-TW">
      <head>
        {/* JSON-LD 結構化數據 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YJCP6KGGCZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YJCP6KGGCZ');
          `}
        </Script>
      </head>
      <body className={`${notoSansTC.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          {!isBrainSubdomain && <Header />}
          <main className="flex-1">{children}</main>
          {!isBrainSubdomain && <Footer />}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
