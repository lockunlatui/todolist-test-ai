import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { products, getProductById } from "@/data/products"
import { formatPrice, getDiscountPercent } from "@/utils/formatPrice"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

interface Props {
  params: Promise<{ id: string }>
}

/** Pre-generate static routes for all products at build time. */
export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = getProductById(id)
  if (!product) return { title: "Không tìm thấy sản phẩm" }
  return {
    title: `${product.name} — PhoneStore`,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  const {
    name,
    brand,
    price,
    originalPrice,
    imageUrl,
    description,
    specs,
    badge,
    colors,
  } = product

  const discountPercent = originalPrice ? getDiscountPercent(price, originalPrice) : 0

  const BADGE_LABELS: Record<NonNullable<typeof badge>, string> = {
    hot: "🔥 Hot",
    new: "✨ Mới",
    sale: "🏷️ Sale",
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <span>›</span>
            <Link href="/#products" className="hover:text-blue-600 transition-colors">
              Sản phẩm
            </Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">{name}</span>
          </nav>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

              {/* Product image */}
              <div className="relative bg-gray-50 flex items-center justify-center p-8 min-h-80 md:min-h-[500px]">
                <div className="relative w-full max-w-xs aspect-[4/5] mx-auto">
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover rounded-xl"
                    priority
                  />
                </div>
                {badge && (
                  <span
                    className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full ${
                      badge === "hot"
                        ? "bg-red-500 text-white"
                        : badge === "new"
                        ? "bg-green-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {BADGE_LABELS[badge]}
                  </span>
                )}
              </div>

              {/* Product info */}
              <div className="p-6 md:p-8 flex flex-col">
                <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-1">
                  {brand}
                </p>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                  {name}
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-extrabold text-blue-700">
                      {formatPrice(price)}
                    </span>
                    {discountPercent > 0 && (
                      <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>
                  {originalPrice && originalPrice > price && (
                    <p className="text-gray-400 text-sm line-through mt-0.5">
                      {formatPrice(originalPrice)}
                    </p>
                  )}
                </div>

                {/* Colors */}
                {colors.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Màu sắc:</p>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <span
                          key={color}
                          className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 bg-gray-50"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specs */}
                <div className="mb-8">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Thông số kỹ thuật:</p>
                  <dl className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                    {[
                      { label: "Màn hình", value: specs.screen },
                      { label: "Camera", value: specs.camera },
                      { label: "Pin", value: specs.battery },
                      { label: "Bộ nhớ", value: specs.storage },
                      { label: "Chip xử lý", value: specs.chip },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex py-2.5 px-3 text-sm">
                        <dt className="w-32 shrink-0 font-medium text-gray-500">{label}</dt>
                        <dd className="text-gray-800">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  {/* TODO: replace href with real checkout/cart URL */}
                  <a
                    href="#"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-base shadow-lg shadow-blue-600/25"
                    aria-label={`Mua ngay ${name}`}
                  >
                    <span>🛒</span>
                    <span>Mua Ngay</span>
                  </a>
                  <Link
                    href="/#products"
                    className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 font-semibold px-6 py-3.5 rounded-xl transition-colors text-base"
                  >
                    ← Xem Thêm Sản Phẩm
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
