import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <span className="text-2xl">📱</span>
            <span>PhoneStore</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="#products"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Sản phẩm
            </Link>
            <Link
              href="#promo"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Khuyến mãi
            </Link>
            <Link
              href="#contact"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Liên hệ
            </Link>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="tel:1800xxxx"
              className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <span>📞</span>
              <span>1800 xxxx</span>
            </Link>
            <Link
              href="#products"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
            >
              Mua Ngay
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
