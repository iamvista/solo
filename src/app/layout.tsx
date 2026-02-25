import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/* ── JSON-LD 結構化數據 ── */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "自由人學院",
  alternateName: "solo.tw",
  url: "https://www.solo.tw",
  description:
    "自由工作者的成長平臺。提供免費診斷、實用工具、課程資源，幫助講師、顧問、教練建立穩定的個人事業。",
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
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "自由人學院 | 把專業變成事業",
  url: "https://www.solo.tw",
  description:
    "自由工作者的成長平臺。提供免費診斷、實用工具、課程資源，幫助講師、顧問、教練建立穩定的個人事業。",
  publisher: { "@type": "Organization", name: "自由人學院" },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.solo.tw/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "自由人學院是什麼？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "自由人學院（solo.tw）是台灣領先的自由工作者成長平臺，由 Vista Cheng 創辦。專為講師、顧問、教練設計，提供免費事業健檢、實用工具箱、系統化課程與專家社群，幫助專業人士把專業變成事業。",
      },
    },
    {
      "@type": "Question",
      name: "自由人學院適合哪些人？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "自由人學院適合所有想要發展個人事業的專業人士，特別是講師、顧問、教練、自由接案者。無論你是剛起步的新手，還是想擴大影響力的資深專家，都能在這裡找到適合的資源與成長路徑。",
      },
    },
    {
      "@type": "Question",
      name: "免費事業健檢是什麼？怎麼使用？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "免費事業健檢是一個 3 分鐘的線上快速診斷工具。填寫完問卷後，系統會根據你的回答提供個人化的競爭力分析報告，幫助你了解目前的事業定位與可改善的方向。完全免費，無需付費即可使用。",
      },
    },
    {
      "@type": "Question",
      name: "自由人學院有哪些學習資源？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "自由人學院提供多元的學習資源：(1) 系統化課程——從客戶開發到專案交付的完整培訓；(2) 工具箱——服務包裝與定價的模板與計算工具；(3) 資源庫——文章、案例研究與市場趨勢；(4) 模板下載——提案書、合約、報價單等實用格式；(5) 部落格——涵蓋個人品牌、內容行銷、AI 應用等主題。",
      },
    },
    {
      "@type": "Question",
      name: "自由人學院的課程要收費嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "自由人學院提供免費與付費兩種資源。免費資源包括事業健檢、部落格文章、部分模板下載。付費資源則包括系統化課程、進階工具與專家社群。具體費用請參考 solo.tw 網站上的課程頁面。",
      },
    },
    {
      "@type": "Question",
      name: "如何加入自由人學院的社群？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "你可以透過 Skool 平臺加入自由人學院的專家社群，與同業夥伴交流互助。也可以訂閱電子報（16,000+ 訂閱者）獲取最新資訊。社群媒體方面，可以在 Facebook、Instagram、YouTube、Threads 上關注自由人學院。",
      },
    },
  ],
};

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "solo.tw | 把專業變成事業",
  description:
    "自由工作者的成長平臺。提供免費診斷、實用工具、課程資源，幫助講師、顧問、教練建立穩定的個人事業。",
  keywords: [
    "自由工作者",
    "講師",
    "顧問",
    "教練",
    "個人品牌",
    "接案",
    "freelancer",
  ],
  icons: {
    icon: "/solo-icon.png",
    apple: "/solo-icon.png",
  },
  metadataBase: new URL("https://solo.tw"),
  openGraph: {
    title: "solo.tw | 把專業變成事業",
    description: "自由工作者的成長平臺。提供免費診斷、實用工具、課程資源。",
    url: "https://solo.tw",
    siteName: "solo.tw",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "solo.tw - 自由人學院",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "solo.tw | 把專業變成事業",
    description: "自由工作者的成長平臺。提供免費診斷、實用工具、課程資源。",
    images: ["/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            __html: JSON.stringify(faqSchema),
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
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
