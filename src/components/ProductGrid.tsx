import type { Product } from "@/types"
import ProductCard from "@/components/ProductCard"

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section id="products" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">
            Bộ sưu tập
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Sản Phẩm Nổi Bật
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Những chiếc điện thoại được yêu thích nhất, đánh giá cao nhất tháng này.
          </p>
        </div>

        {/* Responsive grid: 1 col mobile → 2 col tablet → 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
