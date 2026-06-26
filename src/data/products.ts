import { Product } from "@/types/product";

export const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Áo Thun Premium Cotton",
    description: "Chất liệu cotton cao cấp, thoáng mát, phù hợp mọi dịp.",
    price: 299000,
    originalPrice: 450000,
    image: "/images/product-tshirt.jpg",
    category: "Thời trang",
    badge: "Bán chạy",
    slug: "ao-thun-premium-cotton",
  },
  {
    id: "2",
    name: "Giày Sneaker Classic",
    description: "Thiết kế hiện đại, đế êm, phù hợp đi dạo và thể thao.",
    price: 850000,
    originalPrice: 1200000,
    image: "/images/product-sneaker.jpg",
    category: "Giày dép",
    badge: "Mới",
    slug: "giay-sneaker-classic",
  },
  {
    id: "3",
    name: "Túi Xách Da Thật",
    description: "Da bò thật 100%, sang trọng và bền bỉ theo thời gian.",
    price: 1490000,
    originalPrice: 2100000,
    image: "/images/product-bag.jpg",
    category: "Phụ kiện",
    badge: "Giảm 30%",
    slug: "tui-xach-da-that",
  },
  {
    id: "4",
    name: "Đồng Hồ Thông Minh",
    description: "Theo dõi sức khoẻ, nhận thông báo, pin 7 ngày.",
    price: 2990000,
    originalPrice: 3990000,
    image: "/images/product-smartwatch.jpg",
    category: "Công nghệ",
    badge: "Hot deal",
    slug: "dong-ho-thong-minh",
  },
  {
    id: "5",
    name: "Quần Jeans Slim Fit",
    description: "Form dáng hiện đại, vải co giãn 4 chiều, thoải mái vận động.",
    price: 450000,
    originalPrice: 650000,
    image: "/images/product-jeans.jpg",
    category: "Thời trang",
    slug: "quan-jeans-slim-fit",
  },
  {
    id: "6",
    name: "Kính Mát Phân Cực",
    description: "Chống tia UV 400, chống lóa, phù hợp lái xe và dã ngoại.",
    price: 380000,
    originalPrice: 550000,
    image: "/images/product-sunglasses.jpg",
    category: "Phụ kiện",
    badge: "Phổ biến",
    slug: "kinh-mat-phan-cuc",
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getDiscountPercent(
  price: number,
  originalPrice: number
): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
