import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "solo.tw | 把專業變成事業",
  description: "自由工作者的成長平臺。提供免費診斷、實用工具、課程資源，幫助講師、顧問、教練建立穩定的個人事業。",
  keywords: ["自由工作者", "講師", "顧問", "教練", "個人品牌", "接案", "freelancer"],
  icons: {
    icon: "/solo-icon.png",
    apple: "/solo-icon.png",
  },
  openGraph: {
    title: "solo.tw | 把專業變成事業",
    description: "自由工作者的成長平臺。提供免費診斷、實用工具、課程資源。",
    url: "https://solo.tw",
    siteName: "solo.tw",
    locale: "zh_TW",
    type: "website",
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
