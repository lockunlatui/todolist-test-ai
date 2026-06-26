import {
  featuredProducts,
  formatPrice,
  getDiscountPercent,
} from "./products";

describe("products data", () => {
  describe("featuredProducts", () => {
    it("contains at least 1 product", () => {
      expect(featuredProducts.length).toBeGreaterThan(0);
    });

    it("every product has required fields", () => {
      featuredProducts.forEach((p) => {
        expect(p.id).toBeTruthy();
        expect(p.name).toBeTruthy();
        expect(p.description).toBeTruthy();
        expect(typeof p.price).toBe("number");
        expect(p.price).toBeGreaterThan(0);
        expect(p.slug).toBeTruthy();
        expect(p.category).toBeTruthy();
      });
    });

    it("all slugs are unique", () => {
      const slugs = featuredProducts.map((p) => p.slug);
      const unique = new Set(slugs);
      expect(unique.size).toBe(slugs.length);
    });
  });

  describe("formatPrice", () => {
    it("formats price in Vietnamese dong", () => {
      const result = formatPrice(299000);
      expect(result).toContain("299");
      expect(result).toContain("₫");
    });

    it("formats zero", () => {
      const result = formatPrice(0);
      expect(result).toContain("0");
    });
  });

  describe("getDiscountPercent", () => {
    it("calculates 33% discount correctly", () => {
      expect(getDiscountPercent(200000, 300000)).toBe(33);
    });

    it("calculates 50% discount", () => {
      expect(getDiscountPercent(100000, 200000)).toBe(50);
    });

    it("rounds to nearest integer", () => {
      const result = getDiscountPercent(299000, 450000);
      expect(Number.isInteger(result)).toBe(true);
    });
  });
});
