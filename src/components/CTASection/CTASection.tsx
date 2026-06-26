import Link from "next/link";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export default function CTASection({
  title = "Đừng bỏ lỡ ưu đãi hôm nay!",
  subtitle = "Hàng ngàn khách hàng đã tin tưởng lựa chọn chúng tôi. Tham gia ngay để nhận ưu đãi độc quyền và miễn phí vận chuyển cho đơn hàng đầu tiên.",
  primaryCtaLabel = "Mua hàng ngay",
  primaryCtaHref = "#san-pham",
  secondaryCtaLabel = "Xem giỏ hàng",
  secondaryCtaHref = "/cart",
}: CTASectionProps) {
  return (
    <section
      className="bg-gradient-to-r from-accent-500 to-accent-600 py-16 sm:py-20"
      data-testid="cta-section"
      aria-label="Call to action"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="text-5xl mb-6" aria-hidden="true">
          🛒
        </div>

        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight"
          data-testid="cta-title"
        >
          {title}
        </h2>

        <p className="text-lg sm:text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryCtaHref}
            className="inline-flex items-center justify-center bg-white text-accent-600 hover:bg-orange-50 font-bold text-lg px-10 py-4 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            data-testid="cta-primary-button"
          >
            {primaryCtaLabel}
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </Link>

          <Link
            href={secondaryCtaHref}
            className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-10 py-4 rounded-xl transition-colors duration-200"
            data-testid="cta-secondary-button"
          >
            {secondaryCtaLabel}
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-3 gap-6 text-white border-t border-white/20 pt-10">
          <div data-testid="cta-stat">
            <p className="text-3xl sm:text-4xl font-extrabold">50K+</p>
            <p className="text-sm sm:text-base text-orange-100 mt-1">
              Khách hàng hài lòng
            </p>
          </div>
          <div data-testid="cta-stat">
            <p className="text-3xl sm:text-4xl font-extrabold">1000+</p>
            <p className="text-sm sm:text-base text-orange-100 mt-1">
              Sản phẩm đa dạng
            </p>
          </div>
          <div data-testid="cta-stat">
            <p className="text-3xl sm:text-4xl font-extrabold">4.9★</p>
            <p className="text-sm sm:text-base text-orange-100 mt-1">
              Đánh giá trung bình
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
