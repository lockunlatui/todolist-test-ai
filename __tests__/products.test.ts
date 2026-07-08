import { products, getProductById } from "@/data/products"

describe("products data", () => {
  it("has at least one product", () => {
    expect(products.length).toBeGreaterThan(0)
  })

  it("every product has required fields: id, name, brand, price, imageUrl, description, specs, colors", () => {
    for (const p of products) {
      expect(p.id).toBeTruthy()
      expect(p.name).toBeTruthy()
      expect(p.brand).toBeTruthy()
      expect(p.price).toBeGreaterThan(0)
      expect(p.imageUrl).toBeTruthy()
      expect(p.description).toBeTruthy()
      expect(p.colors).toBeInstanceOf(Array)
      expect(p.specs.screen).toBeTruthy()
      expect(p.specs.camera).toBeTruthy()
      expect(p.specs.battery).toBeTruthy()
      expect(p.specs.storage).toBeTruthy()
      expect(p.specs.chip).toBeTruthy()
    }
  })

  it("product ids are unique", () => {
    const ids = products.map((p) => p.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it("badge values are one of hot | new | sale when present", () => {
    const validBadges = new Set(["hot", "new", "sale"])
    for (const p of products) {
      if (p.badge !== undefined) {
        expect(validBadges.has(p.badge)).toBe(true)
      }
    }
  })

  it("originalPrice is greater than price when both are defined", () => {
    for (const p of products) {
      if (p.originalPrice !== undefined) {
        expect(p.originalPrice).toBeGreaterThan(p.price)
      }
    }
  })
})

describe("getProductById", () => {
  it("returns the correct product for a known id", () => {
    const product = getProductById("iphone-15-pro")
    expect(product).toBeDefined()
    expect(product?.name).toBe("iPhone 15 Pro")
  })

  it("returns undefined for an unknown id", () => {
    expect(getProductById("does-not-exist")).toBeUndefined()
  })

  it("finds every product by its own id", () => {
    for (const p of products) {
      const found = getProductById(p.id)
      expect(found).toBe(p)
    }
  })
})
