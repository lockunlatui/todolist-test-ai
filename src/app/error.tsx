"use client";

import { useEffect } from "react";

/**
 * App Router error boundary. Catches render/runtime errors (e.g. an API
 * returning 500 while loading course data) so the user sees a recovery UI
 * instead of a blank white page. Covers TOD-005 exception test case "API
 * trả lỗi 500 → Error boundary → Hiển thị trang lỗi, không crash trắng".
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log so failures are observable rather than silently swallowed.
    console.error("CourseLandingPage error boundary:", error);
  }, [error]);

  return (
    <main
      data-testid="error-boundary"
      className="min-h-screen flex items-center justify-center bg-blue-50 px-4"
    >
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Đã có lỗi xảy ra
        </h1>
        <p className="text-gray-600 mb-6">
          Không thể tải nội dung khoá học lúc này. Vui lòng thử lại.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Thử lại
        </button>
      </div>
    </main>
  );
}
