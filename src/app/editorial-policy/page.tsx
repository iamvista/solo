import type { Metadata } from "next";
import { TrustPage } from "@/components/content/TrustPage";
import { trustPages } from "@/data/trust-content";

export const metadata: Metadata = {
  title: "編輯與更正政策 | solo.tw",
  description: trustPages["editorial-policy"].description,
  alternates: { canonical: "https://www.solo.tw/editorial-policy" },
  openGraph: {
    title: trustPages["editorial-policy"].title,
    description: trustPages["editorial-policy"].description,
    url: "https://www.solo.tw/editorial-policy",
    type: "website",
  },
};

export default function EditorialPolicyPage() {
  return <TrustPage content={trustPages["editorial-policy"]} />;
}
