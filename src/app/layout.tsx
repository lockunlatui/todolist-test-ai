import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "PhoneStore — Điện Thoại Hàng Đầu, Giá Tốt Nhất",
  description:
    "Mua điện thoại chính hãng từ Apple, Samsung, Google và nhiều thương hiệu hàng đầu. Bảo hành 12 tháng, giao hàng toàn quốc miễn phí.",
  keywords: ["mua điện thoại", "điện thoại giá tốt", "iPhone", "Samsung", "Google Pixel"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className="antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
