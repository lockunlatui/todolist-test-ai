import Link from "next/link";
import { DEFAULT_COURSE, type Course } from "@/lib/course";

export type { Course };

function formatPrice(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

interface CourseLandingPageProps {
  /**
   * Course data to render. Defaults to the bundled sample data, but can be
   * injected (e.g. from an API response / server component) so the page is
   * testable with "API trả dữ liệu đầy đủ" and reusable across courses.
   */
  course?: Course;
}

export default function CourseLandingPage({
  course = DEFAULT_COURSE,
}: CourseLandingPageProps = {}) {
  return (
    <main>
      {/* ── HERO ── */}
      <section
        data-testid="hero-section"
        className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white py-20 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1
            data-testid="course-name"
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            {course.name}
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 mb-8">
            {course.tagline}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {course.stats.map((s) => (
              <div
                key={s.label}
                className="bg-white/10 rounded-xl p-4"
              >
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-sm text-blue-200">{s.label}</div>
              </div>
            ))}
          </div>

          <Link
            href="/dang-ky"
            data-testid="cta-button"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg px-10 py-4 rounded-full transition-colors"
          >
            Đăng ký ngay
          </Link>
        </div>
      </section>

      {/* ── DESCRIPTION ── */}
      <section
        data-testid="course-description"
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Giới thiệu khoá học
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {course.description}
          </p>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">
            Tại sao chọn khoá học này?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {course.benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-4xl mb-3">{b.icon}</div>
                <h3 className="font-semibold text-gray-800 text-lg mb-2">
                  {b.title}
                </h3>
                <p className="text-gray-600 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRICULUM ── */}
      <section
        data-testid="curriculum-section"
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">
            Nội dung chương trình
          </h2>
          <div className="space-y-4">
            {course.curriculum.map((m) => (
              <details
                key={m.module}
                className="border border-gray-200 rounded-xl p-5"
              >
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-800">
                  <span>
                    Module {m.module}: {m.title}
                  </span>
                  <span className="text-sm text-gray-500 ml-4 shrink-0">
                    {m.lessons} bài · {m.duration}
                  </span>
                </summary>
                <p className="mt-3 text-gray-600 text-sm">
                  {m.lessons} bài học thực hành, tổng thời lượng {m.duration}.
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTRUCTORS ── */}
      <section
        data-testid="instructors-section"
        className="py-16 px-4 bg-gray-50"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">
            Giảng viên
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {course.instructors.map((ins) => (
              <div
                key={ins.name}
                data-testid="instructor-card"
                className="bg-white rounded-xl p-6 shadow-sm flex gap-4"
              >
                <div
                  role="img"
                  aria-label={`Ảnh đại diện của ${ins.name}`}
                  className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0"
                >
                  {ins.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {ins.name}
                  </h3>
                  <p className="text-blue-600 text-sm mb-2">{ins.title}</p>
                  <p className="text-gray-600 text-sm">{ins.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">
            Học viên nói gì?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course.testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500"
              >
                <p className="text-gray-700 italic mb-4">&ldquo;{t.text}&rdquo;</p>
                <footer>
                  <strong className="text-gray-800">{t.name}</strong>
                  <span className="text-gray-500 text-sm"> — {t.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        data-testid="pricing-section"
        className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-blue-50"
      >
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
            Học phí & Đăng ký
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-2 text-gray-400 line-through text-lg">
              {formatPrice(course.price.original)}
            </div>
            <div
              data-testid="course-price"
              className="text-4xl font-bold text-blue-700 mb-1"
            >
              {formatPrice(course.price.discounted)}
            </div>
            <div className="inline-block bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full mb-6">
              Tiết kiệm {course.price.discount}%
            </div>
            <ul className="text-left text-gray-600 text-sm space-y-2 mb-8">
              <li>✅ Truy cập vĩnh viễn tất cả nội dung</li>
              <li>✅ Tham gia cộng đồng học viên</li>
              <li>✅ Chứng chỉ hoàn thành</li>
              <li>✅ Hỗ trợ 1-1 với giảng viên</li>
            </ul>
            <Link
              href="/dang-ky"
              data-testid="cta-button-pricing"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl transition-colors text-center"
            >
              Đăng ký ngay
            </Link>
            <p className="text-gray-400 text-xs mt-4">
              Hoàn tiền 100% trong 7 ngày nếu không hài lòng.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="bg-blue-700 text-white py-12 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Sẵn sàng bắt đầu hành trình lập trình?
        </h2>
        <p className="text-blue-100 mb-6 text-lg">
          Hơn 2.400 học viên đã thay đổi sự nghiệp — đến lượt bạn!
        </p>
        <Link
          href="/dang-ky"
          className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg px-10 py-4 rounded-full transition-colors"
        >
          Đăng ký ngay
        </Link>
      </section>
    </main>
  );
}
