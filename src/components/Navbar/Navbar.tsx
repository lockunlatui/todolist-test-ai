import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
      aria-label="Điều hướng chính"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-2xl text-primary-600 hover:text-primary-700 transition-colors"
            aria-label="ShopVN – Trang chủ"
          >
            🏪 ShopVN
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#san-pham"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Sản phẩm
            </Link>
            <Link
              href="/products"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Danh mục
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Về chúng tôi
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              aria-label="Giỏ hàng"
              data-testid="navbar-cart-link"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </Link>

            <Link
              href="#san-pham"
              className="hidden sm:inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
              data-testid="navbar-cta"
            >
              Mua ngay
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
