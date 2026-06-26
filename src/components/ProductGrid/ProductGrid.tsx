import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard/ProductCard";

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function ProductGrid({
  products,
  title = "Sản phẩm nổi bật",
  subtitle = "Những sản phẩm được yêu thích nhất tuần này",
}: ProductGridProps) {
  return (
    <section
      id="san-pham"
      className="py-16 sm:py-20 bg-gray-50"
      data-testid="product-grid-section"
      aria-label="Danh sách sản phẩm nổi bật"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4"
            data-testid="product-grid-title"
          >
            {title}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">{subtitle}</p>
          <div className="mt-4 w-16 h-1 bg-primary-600 rounded-full mx-auto" />
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <p
            className="text-center text-gray-400 py-12"
            data-testid="product-grid-empty"
          >
            Chưa có sản phẩm nào.
          </p>
        ) : (
          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 list-none p-0"
            data-testid="product-grid-list"
          >
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
