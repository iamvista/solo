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
  name: "solo.tw",
  alternateName: "用 AI 放大你的一人事業",
  url: "https://www.solo.tw",
  description:
    "Vista Cheng 的個人品牌網站。提供 AI 工作坊、1-on-1 諮詢、線上課程，幫助自由工作者、講師和顧問用 AI 放大一人事業的產出。",
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
    "Vista Cheng 的個人品牌網站。AI 工作坊、1-on-1 諮詢、線上課程，幫助自由工作者用 AI 放大一人事業的產出。",
  publisher: { "@type": "Organization", name: "solo.tw" },
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
      name: "solo.tw 是什麼？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "solo.tw 是臺灣第一個一人事業作業系統，由 Vista Cheng 創辦。提供活動報名系統、名單磁鐵、問卷調查等 SaaS 工具，搭配 SOLO 四階段方法論（Set up → Operate → Leverage → Outgrow）、系統化課程與一人創業者社群，幫助講師、顧問、教練等自由工作者打造可擴展的一人事業。",
      },
    },
    {
      "@type": "Question",
      name: "solo.tw 適合哪些人？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "solo.tw 適合所有想經營一人事業的專業人士，特別是講師、顧問、教練、自由接案者、內容創作者。不論你是剛起步的新手，還是想用工具放大影響力的資深專家，都能在這裡找到適合的工具與成長路徑。",
      },
    },
    {
      "@type": "Question",
      name: "免費事業健檢是什麼？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "免費事業健檢是一個 3 分鐘的線上快速診斷工具。填寫問卷後，系統會根據你的回答產生專屬的競爭力雷達圖，幫助你了解目前的事業定位，找出你是哪一種 Solo 類型（獅子、狐狸、大象、老鷹、烏龜、小雞），並提供對應的行動建議。完全免費。",
      },
    },
    {
      "@type": "Question",
      name: "solo.tw 提供哪些工具？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "solo.tw 提供三大核心 SaaS 工具：(1) 活動報名系統——辦工作坊、講座，管理報名、候補、確認信；(2) 名單磁鐵系統——用電子書、免費諮詢等吸引潛在客戶，自動收集名單；(3) 問卷調查系統——課後問卷、市場調查、NPS 評分，即時統計分析。工具之間可自動串接，形成完整的客戶獲取漏斗。",
      },
    },
    {
      "@type": "Question",
      name: "solo.tw 的會員方案怎麼收費？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "solo.tw 提供三種會員方案：Explorer 探索者（免費）可體驗核心功能；Pro 實踐者（NT$399/月）包含名單磁鐵、活動報名、問卷系統各 3 個額度，加上社群與專屬內容；Premium 事業家（NT$999/月）全部工具無限使用，含 1-on-1 諮詢、Mastermind 小組等進階服務。創始會員享終身優惠價。",
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
  title: "solo.tw | 用 AI 放大你的一人事業",
  description:
    "Vista Cheng 幫助自由工作者、講師和顧問用 AI 放大一人事業的產出。AI 工作坊、1-on-1 諮詢、線上課程、SOLO 方法論。",
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
    icon: "/solo-icon.png",
    apple: "/solo-icon.png",
  },
  metadataBase: new URL("https://solo.tw"),
  openGraph: {
    title: "solo.tw | 用 AI 放大你的一人事業",
    description: "Vista Cheng 幫助自由工作者、講師和顧問用 AI 放大一人事業的產出。AI 工作坊、諮詢、線上課程。",
    url: "https://solo.tw",
    siteName: "solo.tw",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "solo.tw — 一人事業作業系統",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "solo.tw | 用 AI 放大你的一人事業",
    description: "Vista Cheng 幫助自由工作者用 AI 放大一人事業的產出。工作坊、諮詢、線上課程。",
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
