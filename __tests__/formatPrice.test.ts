import { formatPrice, getDiscountPercent } from "@/utils/formatPrice"

describe("formatPrice", () => {
  it("formats a whole VND amount with ₫ symbol and dots as thousands separators", () => {
    // vi-VN locale uses dots for thousands (27.990.000 ₫)
    const result = formatPrice(27990000)
    expect(result).toMatch(/27[.,]990[.,]000/)
    expect(result).toMatch(/₫|VND/)
  })

  it("formats zero correctly", () => {
    const result = formatPrice(0)
    expect(result).toMatch(/0/)
  })

  it("formats a small amount", () => {
    const result = formatPrice(1000000)
    expect(result).toMatch(/1[.,]000[.,]000/)
  })
})

describe("getDiscountPercent", () => {
  it("calculates the correct discount percentage", () => {
    expect(getDiscountPercent(27990000, 31990000)).toBe(13)
  })

  it("returns 0 when price equals originalPrice", () => {
    expect(getDiscountPercent(20000000, 20000000)).toBe(0)
  })

  it("returns 0 when price is greater than originalPrice", () => {
    expect(getDiscountPercent(25000000, 20000000)).toBe(0)
  })

  it("returns 0 when originalPrice is 0 (guard against division by zero)", () => {
    expect(getDiscountPercent(1000, 0)).toBe(0)
  })

  it("rounds to the nearest whole number", () => {
    // (19990000 → 22990000) → ~13.05% → rounds to 13
    expect(getDiscountPercent(19990000, 22990000)).toBe(13)
  })
})
