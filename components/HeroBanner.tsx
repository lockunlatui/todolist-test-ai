import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section
      data-testid="hero-banner"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-teal-500 overflow-hidden"
    >
      {/* Hero background image */}
      <Image
        src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1440&q=80"
        alt="Cảnh đẹp Việt Nam — bãi biển và thiên nhiên hùng vĩ"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        data-testid="hero-image"
      />

      {/* Background overlay pattern */}
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

      {/* Decorative circles */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5"
        aria-hidden="true"
      />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          Khám Phá Vẻ Đẹp{" "}
          <span className="text-yellow-400">Việt Nam</span>
        </h1>
        <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
          Hàng trăm tour du lịch hấp dẫn, trải nghiệm văn hóa đặc sắc và
          dịch vụ chuyên nghiệp — tất cả chỉ trong một nơi.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/booking"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-8 py-4 rounded-full text-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-yellow-300"
            data-testid="cta-booking"
          >
            Đặt ngay
          </Link>
          <Link
            href="/signup"
            className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full text-lg border-2 border-white/50 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-white/50"
            data-testid="cta-signup"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </section>
  );
}
