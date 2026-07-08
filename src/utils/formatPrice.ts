/**
 * Format a number as Vietnamese Dong (VND) currency.
 * Example: 27990000 → "27.990.000 ₫"
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

/**
 * Calculate the discount percentage between original and current price.
 * Returns a whole-number percentage (e.g. 12 for 12%).
 */
export function getDiscountPercent(price: number, originalPrice: number): number {
  if (originalPrice <= 0 || price >= originalPrice) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}
