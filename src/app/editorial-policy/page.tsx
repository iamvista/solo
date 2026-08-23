import type { Metadata } from "next";
import { TrustPage } from "@/components/content/TrustPage";
import { editorialPolicyContent } from "@/data/trust-content";

export const metadata: Metadata = {
  title: "編輯與更正政策 | solo.tw",
  description: editorialPolicyContent.description,
  alternates: { canonical: "https://www.solo.tw/editorial-policy" },
  openGraph: {
    title: editorialPolicyContent.title,
    description: editorialPolicyContent.description,
    url: "https://www.solo.tw/editorial-policy",
    type: "website",
  },
};

export default function EditorialPolicyPage() {
  return <TrustPage content={editorialPolicyContent} />;
}
