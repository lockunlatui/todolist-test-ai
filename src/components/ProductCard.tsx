"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/types"
import { formatPrice, getDiscountPercent } from "@/utils/formatPrice"

interface ProductCardProps {
  product: Product
}

const BADGE_STYLES: Record<NonNullable<Product["badge"]>, string> = {
  hot: "bg-red-500 text-white",
  new: "bg-green-500 text-white",
  sale: "bg-orange-500 text-white",
}

const BADGE_LABELS: Record<NonNullable<Product["badge"]>, string> = {
  hot: "🔥 Hot",
  new: "✨ Mới",
  sale: "🏷️ Sale",
}

export default function ProductCard({ product }: ProductCardProps) {
  const { id, name, brand, price, originalPrice, imageUrl, badge } = product
  const discountPercent = originalPrice ? getDiscountPercent(price, originalPrice) : 0

  return (
    <Link
      href={`/products/${id}`}
      aria-label={`Xem chi tiết ${name}`}
      className="group flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {/* Image area */}
      <div className="relative bg-gray-50 overflow-hidden">
        <div className="relative w-full aspect-[4/5]">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Badge */}
        {badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${BADGE_STYLES[badge]}`}
          >
            {BADGE_LABELS[badge]}
          </span>
        )}

        {/* Discount chip */}
        {discountPercent > 0 && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-1">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{brand}</p>
        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2">{name}</h3>

        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            <p className="font-bold text-blue-700 text-lg leading-none">
              {formatPrice(price)}
            </p>
            {originalPrice && originalPrice > price && (
              <p className="text-gray-400 text-sm line-through mt-0.5">
                {formatPrice(originalPrice)}
              </p>
            )}
          </div>
          <span className="shrink-0 bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
            Xem Chi Tiết
          </span>
        </div>
      </div>
    </Link>
  )
}
