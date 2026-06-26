import { render, screen } from "@testing-library/react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

const mockProduct: Product = {
  id: "1",
  name: "Áo Thun Premium Cotton",
  description: "Chất liệu cotton cao cấp, thoáng mát.",
  price: 299000,
  originalPrice: 450000,
  image: "/images/product-tshirt.jpg",
  category: "Thời trang",
  badge: "Bán chạy",
  slug: "ao-thun-premium-cotton",
};

describe("ProductCard", () => {
  it("renders product name", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Áo Thun Premium Cotton")).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    render(<ProductCard product={mockProduct} />);
    const priceEl = screen.getByTestId("product-price");
    expect(priceEl).toHaveTextContent("299");
  });

  it("renders original price with strikethrough when provided", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByTestId("product-original-price")).toBeInTheDocument();
  });

  it("renders discount percentage badge", () => {
    render(<ProductCard product={mockProduct} />);
    const discount = screen.getByTestId("product-discount");
    expect(discount).toHaveTextContent("-34%");
  });

  it("renders product badge when provided", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByTestId("product-badge")).toHaveTextContent("Bán chạy");
  });

  it("does not render badge when not provided", () => {
    const productWithoutBadge = { ...mockProduct, badge: undefined };
    render(<ProductCard product={productWithoutBadge} />);
    expect(screen.queryByTestId("product-badge")).not.toBeInTheDocument();
  });

  it("buy button links to product detail page", () => {
    render(<ProductCard product={mockProduct} />);
    const buyButton = screen.getByTestId("product-buy-button");
    expect(buyButton).toHaveAttribute(
      "href",
      "/products/ao-thun-premium-cotton"
    );
  });

  it("buy button has accessible aria-label", () => {
    render(<ProductCard product={mockProduct} />);
    const buyButton = screen.getByTestId("product-buy-button");
    expect(buyButton).toHaveAttribute("aria-label", "Mua Áo Thun Premium Cotton");
  });

  it("renders category label", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Thời trang")).toBeInTheDocument();
  });

  it("does not render original price when not provided", () => {
    const productWithoutOriginalPrice = {
      ...mockProduct,
      originalPrice: undefined,
    };
    render(<ProductCard product={productWithoutOriginalPrice} />);
    expect(
      screen.queryByTestId("product-original-price")
    ).not.toBeInTheDocument();
  });
});
