import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";

export const metadata: Metadata = {
  title: "solo.tw | 用 AI 放大你的一人事業 — Vista Cheng",
  description:
    "Vista Cheng 幫助自由工作者、講師和顧問用 AI 放大一人事業的產出。1-on-1 諮詢、AI 工作坊、線上課程、SOLO 方法論。",
  alternates: { canonical: "https://www.solo.tw" },
};
import { PainPointSection } from "@/components/home/PainPointSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { DiagnoseEntrySection } from "@/components/home/DiagnoseEntrySection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { SOLOMethodSection } from "@/components/home/SOLOMethodSection";
import { LatestContentSection } from "@/components/home/LatestContentSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PainPointSection />
      <ServicesSection />
      <DiagnoseEntrySection />
      <SocialProofSection />
      <SOLOMethodSection />
      <LatestContentSection />
      <NewsletterSection />
      <CTASection />
    </>
  );
}
