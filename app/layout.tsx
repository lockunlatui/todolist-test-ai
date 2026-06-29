import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VietTravel - Khám phá vẻ đẹp Việt Nam",
  description:
    "Dịch vụ du lịch hàng đầu Việt Nam - Đặt tour, khách sạn và trải nghiệm du lịch tuyệt vời nhất.",
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
