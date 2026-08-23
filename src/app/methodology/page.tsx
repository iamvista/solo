import type { Metadata } from "next";
import { TrustPage } from "@/components/content/TrustPage";
import { methodologyContent } from "@/data/trust-content";

export const metadata: Metadata = {
  title: "內容方法 | solo.tw",
  description: methodologyContent.description,
  alternates: { canonical: "https://www.solo.tw/methodology" },
  openGraph: {
    title: methodologyContent.title,
    description: methodologyContent.description,
    url: "https://www.solo.tw/methodology",
    type: "website",
  },
};

export default function MethodologyPage() {
  return <TrustPage content={methodologyContent} />;
}
