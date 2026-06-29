import HeroBanner from "@/components/HeroBanner";
import ServicesSection from "@/components/ServicesSection";
import DestinationsSection from "@/components/DestinationsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main data-testid="landing-page">
      <HeroBanner />
      <ServicesSection />
      <DestinationsSection />
      <Footer />
    </main>
  );
}
