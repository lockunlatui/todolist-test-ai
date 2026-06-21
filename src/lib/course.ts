export interface CourseStat {
  label: string;
  value: string;
}

export interface CourseBenefit {
  icon: string;
  title: string;
  desc: string;
}

export interface CourseModule {
  module: number;
  title: string;
  lessons: number;
  duration: string;
}

export interface CourseInstructor {
  name: string;
  title: string;
  bio: string;
  avatar: string;
}

export interface CourseTestimonial {
  name: string;
  role: string;
  text: string;
}

export interface CoursePrice {
  original: number;
  discounted: number;
  discount: number;
}

export interface Course {
  name: string;
  tagline: string;
  description: string;
  price: CoursePrice;
  stats: CourseStat[];
  benefits: CourseBenefit[];
  curriculum: CourseModule[];
  instructors: CourseInstructor[];
  testimonials: CourseTestimonial[];
}

/**
 * Destination for the "Đăng ký ngay" CTA (AC-2).
 *
 * The ticket left the target as "[form đăng ký / trang thanh toán] tại URL
 * [điền URL]" — the concrete URL was never filled in by the PO. Pending that
 * explicit confirmation, the CTA points at the in-repo registration form route
 * `/dang-ky` (implemented in `src/app/dang-ky/page.tsx`) because it is the only
 * registration destination that actually exists in this codebase.
 *
 * Centralising it here gives a single source of truth: the CTA href and its
 * tests can no longer drift apart, and the destination can be switched to e.g.
 * `/checkout` in exactly one place once the PO decides.
 */
export const REGISTRATION_URL = "/dang-ky";

/**
 * Guard for the CTA destination. An empty/whitespace/nullish URL is treated as
 * invalid so the CTA can degrade gracefully instead of navigating to a broken
 * route (TOD-005 exception test case #19: "URL rỗng hoặc null → Không điều
 * hướng").
 */
export function isValidRegistrationUrl(
  url: string | null | undefined
): url is string {
  return typeof url === "string" && url.trim().length > 0;
}

export const DEFAULT_COURSE: Course = {
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

/**
 * Fetch course data for the landing page.
 *
 * When `COURSE_API_URL` is configured the data is loaded from the real backend
 * over HTTP (App Router server-side fetch with ISR caching). If the request
 * fails the error propagates so the App Router `error.tsx` boundary renders a
 * recovery UI instead of a blank page (TOD-005 exception case "API trả lỗi
 * 500"). When no API URL is configured we fall back to the bundled sample data
 * so the page still renders in local/preview environments.
 *
 * Keeping this in a server module (called from the `page.tsx` Server Component)
 * means `CourseLandingPage` stays a pure presentational component that receives
 * its data via props — which is exactly what makes the "API trả dữ liệu đầy đủ"
 * test scenario expressible (the test injects a course object directly).
 */
export async function getCourse(): Promise<Course> {
  const apiUrl = process.env.COURSE_API_URL;

  if (!apiUrl) {
    return DEFAULT_COURSE;
  }

  const res = await fetch(apiUrl, {
    // Revalidate hourly so marketing edits show up without a redeploy.
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(
      `Không tải được dữ liệu khoá học (HTTP ${res.status}) từ ${apiUrl}`
    );
  }

  return (await res.json()) as Course;
}
