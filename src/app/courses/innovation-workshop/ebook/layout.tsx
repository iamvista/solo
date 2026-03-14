import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免費電子書《創新不是天才，是方法》| solo.tw",
  description:
    "創新先生陳建銘 20 年實戰經驗，教你用「創新方程式」把問題變點子、把點子變成果。44 頁圖文電子書，免費下載。",
  openGraph: {
    title: "免費電子書《創新不是天才，是方法》",
    description:
      "創新先生陳建銘 20 年實戰經驗，教你用「創新方程式」把問題變點子、把點子變成果。44 頁圖文電子書，免費下載。",
  },
};

export default function EbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
