import Link from "next/link";
import { Product, formatPrice, getDiscountPercent } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountPercent =
    product.originalPrice
      ? getDiscountPercent(product.price, product.originalPrice)
      : 0;

  return (
    <article
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
      data-testid="product-card"
    >
      {/* Image area */}
      <div className="relative bg-gray-100 aspect-square overflow-hidden">
        {/* Placeholder for product image */}
        <div
          className="w-full h-full flex items-center justify-center text-gray-300 text-6xl group-hover:scale-105 transition-transform duration-300"
          role="img"
          aria-label={product.name}
        >
          🛍️
        </div>

        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-lg"
            data-testid="product-badge"
          >
            {product.badge}
          </span>
        )}

        {/* Discount bubble */}
        {discountPercent > 0 && (
          <span
            className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
            data-testid="product-discount"
          >
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs text-primary-600 font-medium mb-1 uppercase tracking-wide">
          {product.category}
        </p>

        <h3 className="text-gray-900 font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-4">
          <span
            className="text-primary-600 font-bold text-xl"
            data-testid="product-price"
          >
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span
              className="text-gray-400 text-sm line-through"
              data-testid="product-original-price"
            >
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/products/${product.slug}`}
          className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
          data-testid="product-buy-button"
          aria-label={`Mua ${product.name}`}
        >
          Mua ngay
        </Link>
      </div>
    </article>
  );
}
