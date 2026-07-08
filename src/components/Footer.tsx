import Link from "next/link"

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <span className="text-2xl">📱</span>
              <span>PhoneStore</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Cung cấp điện thoại chính hãng, chất lượng cao với giá tốt nhất thị trường.
              Bảo hành uy tín, dịch vụ tận tâm.
            </p>
            <div className="mt-4 flex gap-4">
              {["Facebook", "Zalo", "YouTube"].map((platform) => (
                <Link
                  key={platform}
                  href="#"
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  {platform}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Trang chủ", href: "/" },
                { label: "Sản phẩm", href: "#products" },
                { label: "Khuyến mãi", href: "#promo" },
                { label: "Hướng dẫn mua hàng", href: "#" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>123 Đường Công Nghệ, Q.1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <Link href="tel:18001234" className="hover:text-white transition-colors">
                  1800 1234
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <Link href="mailto:support@phonestore.vn" className="hover:text-white transition-colors">
                  support@phonestore.vn
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span>
                <span>8:00 – 22:00 mỗi ngày</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 PhoneStore. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-slate-300 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
