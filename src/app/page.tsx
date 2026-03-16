import { HeroSection } from "@/components/home/HeroSection";
import { SOLOMethodSection } from "@/components/home/SOLOMethodSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ToolsShowcaseSection } from "@/components/home/ToolsShowcaseSection";
import { PricingPreviewSection } from "@/components/home/PricingPreviewSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SOLOMethodSection />
      <ToolsShowcaseSection />
      <FeaturesSection />
      <PricingPreviewSection />
      <NewsletterSection />
      <CTASection />
    </>
  );
}
