import CourseLandingPage from "@/components/CourseLandingPage";
import { getCourse } from "@/lib/course";

// Server Component: fetch course data on the server (real API when
// COURSE_API_URL is set, bundled sample data otherwise) and pass it into the
// presentational CourseLandingPage via props. A failed fetch bubbles up to
// app/error.tsx so users never see a blank page.
export default async function Home() {
  const course = await getCourse();
  return <CourseLandingPage course={course} />;
}
