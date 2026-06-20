"use client";

import Link from "next/link";

const COURSE = {
  name: "Lập Trình Web Fullstack Chuyên Sâu",
  tagline: "Từ zero đến hero — thành thạo React, Next.js, Node.js & PostgreSQL",
  description:
    "Khoá học toàn diện dành cho người muốn trở thành lập trình viên Fullstack chuyên nghiệp. Bạn sẽ được học bài bản từ nền tảng HTML/CSS/JS đến xây dựng ứng dụng production-ready với React, Next.js 15, Node.js và PostgreSQL.",
  price: {
    original: 6000000,
    discounted: 3990000,
    discount: 33,
  },
  stats: [
    { label: "Học viên", value: "2.400+" },
    { label: "Giờ học", value: "120+" },
    { label: "Bài tập thực hành", value: "300+" },
    { label: "Tỉ lệ có việc", value: "94%" },
  ],
  benefits: [
    {
      icon: "🎯",
      title: "Lộ trình rõ ràng",
      desc: "Từng bước được thiết kế khoa học, phù hợp người mới bắt đầu.",
    },
    {
      icon: "💡",
      title: "Thực hành ngay",
      desc: "Mỗi bài học có bài tập thực hành ngay, củng cố kiến thức tức thì.",
    },
    {
      icon: "👨‍💼",
      title: "Giảng viên kinh nghiệm",
      desc: "Được giảng dạy bởi senior engineer với 10+ năm kinh nghiệm thực chiến.",
    },
    {
      icon: "🤝",
      title: "Cộng đồng hỗ trợ",
      desc: "Tham gia cộng đồng 2.400+ học viên, hỗ trợ 24/7.",
    },
    {
      icon: "📜",
      title: "Chứng chỉ hoàn thành",
      desc: "Nhận chứng chỉ được nhà tuyển dụng công nhận sau khi hoàn thành.",
    },
    {
      icon: "♾️",
      title: "Học trọn đời",
      desc: "Truy cập vĩnh viễn, bao gồm tất cả cập nhật nội dung trong tương lai.",
    },
  ],
  curriculum: [
    {
      module: 1,
      title: "Nền tảng Web & JavaScript hiện đại",
      lessons: 24,
      duration: "12 giờ",
    },
    {
      module: 2,
      title: "React 19 & State Management",
      lessons: 32,
      duration: "22 giờ",
    },
    {
      module: 3,
      title: "Next.js 15 — App Router & Server Components",
      lessons: 28,
      duration: "20 giờ",
    },
    {
      module: 4,
      title: "Backend với Node.js, Express & PostgreSQL",
      lessons: 26,
      duration: "18 giờ",
    },
    {
      module: 5,
      title: "DevOps, CI/CD & Deploy lên Production",
      lessons: 20,
      duration: "14 giờ",
    },
  ],
  instructors: [
    {
      name: "Nguyễn Văn Minh",
      title: "Senior Fullstack Engineer",
      bio: "10+ năm kinh nghiệm tại các công ty công nghệ hàng đầu Việt Nam và Singapore. Chuyên gia React & Node.js, đã đào tạo 1.500+ lập trình viên.",
      avatar: "NVM",
    },
    {
      name: "Trần Thị Lan",
      title: "Lead Frontend Engineer",
      bio: "8 năm kinh nghiệm frontend, hiện là Tech Lead tại một startup unicorn. Giảng viên yêu thích tại nhiều bootcamp lập trình uy tín.",
      avatar: "TTL",
    },
  ],
  testimonials: [
    {
      name: "Phạm Quang Huy",
      role: "Junior Developer tại FPT Software",
      text: "Sau 4 tháng học, mình đã pass phỏng vấn và có việc ngay. Khoá học cực kỳ thực tế, không học chay lý thuyết!",
    },
    {
      name: "Lê Thị Thu",
      role: "Frontend Developer tại Tiki",
      text: "Nội dung cập nhật, giảng viên nhiệt tình. Mình đã chuyển ngành thành công từ kế toán sang lập trình nhờ khoá học này.",
    },
  ],
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export default function CourseLandingPage() {
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
            {COURSE.name}
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 mb-8">
            {COURSE.tagline}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {COURSE.stats.map((s) => (
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
            {COURSE.description}
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
            {COURSE.benefits.map((b) => (
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
            {COURSE.curriculum.map((m) => (
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
            {COURSE.instructors.map((ins) => (
              <div
                key={ins.name}
                data-testid="instructor-card"
                className="bg-white rounded-xl p-6 shadow-sm flex gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
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
            {COURSE.testimonials.map((t) => (
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
              {formatPrice(COURSE.price.original)}
            </div>
            <div
              data-testid="course-price"
              className="text-4xl font-bold text-blue-700 mb-1"
            >
              {formatPrice(COURSE.price.discounted)}
            </div>
            <div className="inline-block bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full mb-6">
              Tiết kiệm {COURSE.price.discount}%
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
