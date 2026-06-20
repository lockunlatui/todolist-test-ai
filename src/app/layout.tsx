import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
