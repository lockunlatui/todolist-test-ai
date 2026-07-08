/**
 * @jest-environment jsdom
 */
import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import ProductCard from "@/components/ProductCard"
import type { Product } from "@/types"

const mockProduct: Product = {
  id: "test-phone-pro",
  name: "Test Phone Pro",
  brand: "TestBrand",
  price: 15000000,
  originalPrice: 18000000,
  imageUrl: "https://placehold.co/400x500/000/fff?text=Test",
  description: "A test product description.",
  specs: {
    screen: '6.1" OLED',
    camera: "50MP",
    battery: "4000 mAh",
    storage: "128GB",
    chip: "TestChip X1",
  },
  badge: "sale",
  colors: ["Black", "White"],
}

describe("ProductCard", () => {
  it("renders the product name", () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText("Test Phone Pro")).toBeInTheDocument()
  })

  it("renders the brand name", () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText("TestBrand")).toBeInTheDocument()
  })

  it("renders the current price formatted in VND", () => {
    render(<ProductCard product={mockProduct} />)
    // The formatted price should appear somewhere in the document
    const priceEl = screen.getByText(/15[.,]000[.,]000/)
    expect(priceEl).toBeInTheDocument()
  })

  it("renders the original price (crossed out) when originalPrice is set", () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText(/18[.,]000[.,]000/)).toBeInTheDocument()
  })

  it("renders the badge label for 'sale'", () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText(/sale/i)).toBeInTheDocument()
  })

  it("renders the 'Xem Chi Tiết' call-to-action", () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText("Xem Chi Tiết")).toBeInTheDocument()
  })

  it("links to the product detail page", () => {
    render(<ProductCard product={mockProduct} />)
    const link = screen.getByRole("link", { name: /xem chi tiết test phone pro/i })
    expect(link).toHaveAttribute("href", "/products/test-phone-pro")
  })

  it("renders without badge when badge is undefined", () => {
    const noBadge: Product = { ...mockProduct, badge: undefined }
    render(<ProductCard product={noBadge} />)
    expect(screen.queryByText(/hot|mới|sale/i)).not.toBeInTheDocument()
  })

  it("does not render the original price when originalPrice is undefined", () => {
    const noOriginal: Product = { ...mockProduct, originalPrice: undefined }
    render(<ProductCard product={noOriginal} />)
    // Only one price should appear (the current price)
    const prices = screen.getAllByText(/15[.,]000[.,]000/)
    expect(prices).toHaveLength(1)
    expect(screen.queryByText(/18[.,]000[.,]000/)).not.toBeInTheDocument()
  })
})
