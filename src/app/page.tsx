import { HeroSection } from "@/components/home/HeroSection";
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
