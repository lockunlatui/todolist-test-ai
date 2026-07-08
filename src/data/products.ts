import type { Product } from "@/types"

/**
 * Sample phone product data.
 * TODO: Replace placeholder imageUrl values with official product photos.
 * Each placehold.co URL is a temporary stand-in — the colour/text conveys
 * only the model name for development reference.
 */
export const products: Product[] = [
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "Apple",
    price: 27990000,
    originalPrice: 31990000,
    // TODO: replace with official Apple product image
    imageUrl: "https://placehold.co/400x500/1e293b/f8fafc?text=iPhone+15+Pro",
    description:
      "Thiết kế titan. iPhone mạnh mẽ nhất từ trước đến nay với chip A17 Pro và hệ thống camera chuyên nghiệp 48MP.",
    specs: {
      screen: '6.1" Super Retina XDR OLED, 120Hz',
      camera: "48MP + 12MP + 12MP (Telephoto)",
      battery: "3274 mAh, Sạc nhanh 27W",
      storage: "256GB",
      chip: "Apple A17 Pro",
    },
    badge: "hot",
    colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
  },
  {
    id: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 33990000,
    // TODO: replace with official Samsung product image
    imageUrl: "https://placehold.co/400x500/0f172a/f8fafc?text=Galaxy+S24+Ultra",
    description:
      "Điện thoại AI mạnh nhất với S Pen tích hợp, camera 200MP đỉnh cao và màn hình Dynamic AMOLED 2X sắc nét.",
    specs: {
      screen: '6.8" Dynamic AMOLED 2X, 120Hz',
      camera: "200MP + 12MP + 50MP + 10MP",
      battery: "5000 mAh, Sạc nhanh 45W",
      storage: "256GB",
      chip: "Snapdragon 8 Gen 3",
    },
    badge: "new",
    colors: ["Titanium Black", "Titanium Gray", "Titanium Violet", "Titanium Yellow"],
  },
  {
    id: "google-pixel-9-pro",
    name: "Google Pixel 9 Pro",
    brand: "Google",
    price: 24990000,
    originalPrice: 27990000,
    // TODO: replace with official Google product image
    imageUrl: "https://placehold.co/400x500/1e3a5f/f8fafc?text=Pixel+9+Pro",
    description:
      "Camera AI tốt nhất trên Android, tích hợp Google AI trực tiếp trên thiết bị với trải nghiệm chụp ảnh vượt trội.",
    specs: {
      screen: '6.3" LTPO OLED, 1-120Hz',
      camera: "50MP + 48MP + 48MP (Telephoto)",
      battery: "4700 mAh, Sạc nhanh 30W",
      storage: "128GB",
      chip: "Google Tensor G4",
    },
    badge: "sale",
    colors: ["Obsidian", "Porcelain", "Hazel", "Rose Quartz"],
  },
  {
    id: "xiaomi-14-ultra",
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    price: 21990000,
    // TODO: replace with official Xiaomi product image
    imageUrl: "https://placehold.co/400x500/1a1a2e/f8fafc?text=Xiaomi+14+Ultra",
    description:
      "Hợp tác cùng Leica, mang đến chất lượng ảnh professional grade ngay trên điện thoại với 4 camera 50MP.",
    specs: {
      screen: '6.73" LTPO AMOLED, 1-120Hz',
      camera: "50MP + 50MP + 50MP + 50MP Leica",
      battery: "5300 mAh, Sạc nhanh 90W",
      storage: "256GB",
      chip: "Snapdragon 8 Gen 3",
    },
    colors: ["Black", "White", "Dragon Crystal Blue"],
  },
  {
    id: "oppo-find-x7-pro",
    name: "OPPO Find X7 Pro",
    brand: "OPPO",
    price: 19990000,
    originalPrice: 22990000,
    // TODO: replace with official OPPO product image
    imageUrl: "https://placehold.co/400x500/162032/f8fafc?text=OPPO+Find+X7+Pro",
    description:
      "Thiết kế sang trọng với sạc siêu nhanh 100W, camera Hasselblad chuyên nghiệp và pin dung lượng lớn 5000mAh.",
    specs: {
      screen: '6.82" LTPO AMOLED, 1-120Hz',
      camera: "50MP + 64MP Periscope + 50MP Hasselblad",
      battery: "5000 mAh, Sạc nhanh 100W",
      storage: "256GB",
      chip: "Snapdragon 8 Gen 3",
    },
    badge: "sale",
    colors: ["Black", "Blue", "Sepia Brown"],
  },
  {
    id: "vivo-x100-pro",
    name: "Vivo X100 Pro",
    brand: "Vivo",
    price: 18990000,
    // TODO: replace with official Vivo product image
    imageUrl: "https://placehold.co/400x500/0d1b2a/f8fafc?text=Vivo+X100+Pro",
    description:
      "Camera ZEISS tiên tiến, màn hình 3D curved sắc nét, hiệu năng flagship với chip Dimensity 9300.",
    specs: {
      screen: '6.78" AMOLED, 120Hz',
      camera: "50MP + 50MP + 64MP ZEISS",
      battery: "5400 mAh, Sạc nhanh 120W",
      storage: "256GB",
      chip: "Dimensity 9300",
    },
    colors: ["Asteroid Black", "Starlite Blue"],
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
