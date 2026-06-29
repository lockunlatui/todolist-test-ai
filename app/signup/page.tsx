import Link from "next/link";

export default function SignupPage() {
  return (
    <main
      data-testid="signup-page"
      className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-4"
    >
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <span className="text-5xl block mb-4">🙋</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Đăng Ký</h1>
        <p className="text-gray-500 mb-6">
          Tính năng đăng ký tài khoản đang được phát triển. Vui lòng quay lại
          sau.
        </p>
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
