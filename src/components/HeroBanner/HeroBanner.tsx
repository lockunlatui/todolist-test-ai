import Link from "next/link";

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export default function HeroBanner({
  title = "Mua sắm thông minh – Sống đẹp mỗi ngày",
  subtitle = "Khám phá hàng ngàn sản phẩm chất lượng cao với giá tốt nhất. Giao hàng nhanh toàn quốc, đổi trả dễ dàng trong 30 ngày.",
  ctaLabel = "Mua ngay",
  ctaHref = "#san-pham",
  secondaryCtaLabel = "Xem tất cả sản phẩm",
  secondaryCtaHref = "/products",
}: HeroBannerProps) {
  return (
    <section
      className="relative bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 text-white overflow-hidden"
      aria-label="Hero banner"
      data-testid="hero-banner"
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          {/* Badge */}
          <span className="inline-block bg-accent-500 text-white text-sm font-semibold px-4 py-1 rounded-full mb-6">
            🔥 Flash Sale – Giảm đến 50%
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            {title}
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-xl">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center bg-accent-500 hover:bg-accent-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
              data-testid="hero-cta-primary"
            >
              {ctaLabel}
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>

            <Link
              href={secondaryCtaHref}
              className="inline-flex items-center justify-center border-2 border-white/70 hover:border-white text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors duration-200 hover:bg-white/10"
              data-testid="hero-cta-secondary"
            >
              {secondaryCtaLabel}
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap gap-6 text-blue-100 text-sm">
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Giao hàng miễn phí
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Đổi trả 30 ngày
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Thanh toán an toàn
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
