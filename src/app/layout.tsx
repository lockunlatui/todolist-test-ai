import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todolist",
  description: "Ứng dụng quản lý công việc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
