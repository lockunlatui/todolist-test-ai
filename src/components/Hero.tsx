import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 text-white">
      {/* Decorative circles */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span>🔥</span>
            <span>Flash Sale — Giảm giá lên đến 30%</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Điện Thoại
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Hàng Đầu
            </span>
            <br />
            Giá Tốt Nhất
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
            Khám phá bộ sưu tập điện thoại cao cấp từ Apple, Samsung, Google và nhiều thương
            hiệu hàng đầu. Bảo hành chính hãng 12 tháng, giao hàng toàn quốc miễn phí.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#products"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg shadow-lg shadow-blue-600/25"
            >
              <span>Mua Ngay</span>
              <span>🛒</span>
            </Link>
            <Link
              href="#products"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg backdrop-blur-sm"
            >
              <span>Xem Sản Phẩm</span>
              <span>↓</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Bảo hành 12 tháng chính hãng</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Giao hàng miễn phí toàn quốc</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Đổi trả trong 7 ngày</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
