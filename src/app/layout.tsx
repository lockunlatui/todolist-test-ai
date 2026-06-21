import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Next.js font optimization — self-hosts Inter for a consistent, professional
// typeface across the landing page (no layout shift, no external request).
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Khoá Học Lập Trình Web Fullstack | Đăng Ký Ngay",
  description:
    "Khoá học lập trình web fullstack toàn diện — từ React, Next.js đến Node.js. Học cùng chuyên gia, có việc ngay sau khoá học. Đăng ký ngay hôm nay!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
