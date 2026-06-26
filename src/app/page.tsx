import Navbar from "@/components/Navbar/Navbar";
import HeroBanner from "@/components/HeroBanner/HeroBanner";
import ProductGrid from "@/components/ProductGrid/ProductGrid";
import CTASection from "@/components/CTASection/CTASection";
import Footer from "@/components/Footer/Footer";
import { featuredProducts } from "@/data/products";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1" id="main-content">
        {/* AC1: Hero banner section */}
        <HeroBanner />

        {/* AC1: Featured products list */}
        <ProductGrid products={featuredProducts} />

        {/* AC1 & AC2: Call-to-action section with buy buttons */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
