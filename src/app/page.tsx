import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StatsBar } from "@/components/StatsBar";
import { ChaletsSection } from "@/components/ChaletsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { LocationSection } from "@/components/LocationSection";
import { QRSection } from "@/components/QRSection";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <ChaletsSection />
        <FeaturesSection />
        <PricingSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <LocationSection />
        <QRSection />
        <CtaSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
