import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import ProductGrid from "@/components/ProductGrid"
import Footer from "@/components/Footer"
import { products } from "@/data/products"

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProductGrid products={products} />
      <Footer />
    </main>
  )
}
