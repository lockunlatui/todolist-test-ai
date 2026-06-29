import Link from "next/link";

export default function Footer() {
  return (
    <footer
      data-testid="footer"
      className="bg-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-extrabold text-yellow-400 mb-3">
              VietTravel ✈️
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed">
              Đơn vị lữ hành uy tín hàng đầu Việt Nam. Mang đến những hành
              trình khó quên cho mọi gia đình.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-4">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/booking"
                  className="text-blue-200 hover:text-yellow-400 transition-colors"
                >
                  Đặt tour
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-blue-200 hover:text-yellow-400 transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-blue-200 hover:text-yellow-400 transition-colors"
                >
                  Đăng ký
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-4">
              Điểm đến
            </h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>Vịnh Hạ Long</li>
              <li>Phố Cổ Hội An</li>
              <li>Sa Pa</li>
              <li>Đảo Phú Quốc</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-4">
              Liên hệ
            </h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>📞 1900 1234</li>
              <li>📧 info@viettravel.vn</li>
              <li>🕐 8:00 – 18:00 (T2–T7)</li>
              <li>📍 Hà Nội, Việt Nam</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-blue-300 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} VietTravel. Bảo lưu mọi quyền.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-6 py-2 rounded-full text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            data-testid="cta-contact"
          >
            Liên hệ
          </Link>
        </div>
      </div>
    </footer>
  );
}
