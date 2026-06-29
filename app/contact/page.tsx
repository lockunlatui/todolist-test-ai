import Link from "next/link";

export default function ContactPage() {
  return (
    <main
      data-testid="contact-page"
      className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4"
    >
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <span className="text-5xl block mb-4">📬</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Liên Hệ</h1>
        <p className="text-gray-500 mb-2">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn.
        </p>
        <ul className="text-gray-600 text-sm space-y-1 mb-6">
          <li>📞 1900 1234</li>
          <li>📧 info@viettravel.vn</li>
          <li>🕐 8:00 – 18:00 (T2–T7)</li>
        </ul>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          ← Về trang chủ
        </Link>
      </div>
    </main>
  );
}
