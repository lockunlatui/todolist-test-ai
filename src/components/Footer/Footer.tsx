import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gray-900 text-gray-400 py-12"
      data-testid="footer"
      aria-label="Footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <p className="text-white font-extrabold text-xl mb-3">🏪 ShopVN</p>
            <p className="text-sm leading-relaxed">
              Nền tảng mua sắm trực tuyến hàng đầu Việt Nam với hàng ngàn sản
              phẩm chất lượng.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Thời trang
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Giày dép
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Phụ kiện
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Công nghệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-3">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">Liên hệ</h3>
            <ul className="space-y-2 text-sm">
              <li>📞 1800 1234 (Miễn phí)</li>
              <li>✉️ support@shopvn.vn</li>
              <li>🕐 8:00 – 22:00 hằng ngày</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>© {currentYear} ShopVN. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  );
}
