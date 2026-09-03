import type { Metadata } from "next";
import { TrustPage } from "@/components/content/TrustPage";
import { trustPages } from "@/data/trust-content";

export const metadata: Metadata = {
  title: "內容方法 | solo.tw",
  description: trustPages.methodology.description,
  alternates: { canonical: "https://www.solo.tw/methodology" },
  openGraph: {
    title: trustPages.methodology.title,
    description: trustPages.methodology.description,
    url: "https://www.solo.tw/methodology",
    type: "website",
  },
};

export default function MethodologyPage() {
  return <TrustPage content={trustPages.methodology} />;
}
