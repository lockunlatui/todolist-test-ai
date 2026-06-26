import { render, screen } from "@testing-library/react";
import ProductGrid from "./ProductGrid";
import { Product } from "@/types/product";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Sản phẩm 1",
    description: "Mô tả sản phẩm 1",
    price: 100000,
    image: "/img/1.jpg",
    category: "Thời trang",
    slug: "san-pham-1",
  },
  {
    id: "2",
    name: "Sản phẩm 2",
    description: "Mô tả sản phẩm 2",
    price: 200000,
    image: "/img/2.jpg",
    category: "Phụ kiện",
    slug: "san-pham-2",
  },
];

describe("ProductGrid", () => {
  it("renders the section with correct id for anchor navigation", () => {
    render(<ProductGrid products={mockProducts} />);
    const section = screen.getByTestId("product-grid-section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("id", "san-pham");
  });

  it("renders default title", () => {
    render(<ProductGrid products={mockProducts} />);
    expect(screen.getByTestId("product-grid-title")).toHaveTextContent(
      "Sản phẩm nổi bật"
    );
  });

  it("accepts custom title prop", () => {
    render(<ProductGrid products={mockProducts} title="Flash Sale" />);
    expect(screen.getByTestId("product-grid-title")).toHaveTextContent(
      "Flash Sale"
    );
  });

  it("renders all product cards", () => {
    render(<ProductGrid products={mockProducts} />);
    const cards = screen.getAllByTestId("product-card");
    expect(cards).toHaveLength(2);
  });

  it("shows empty state when products list is empty", () => {
    render(<ProductGrid products={[]} />);
    expect(screen.getByTestId("product-grid-empty")).toBeInTheDocument();
    expect(screen.queryByTestId("product-grid-list")).not.toBeInTheDocument();
  });

  it("does not show empty state when products exist", () => {
    render(<ProductGrid products={mockProducts} />);
    expect(screen.queryByTestId("product-grid-empty")).not.toBeInTheDocument();
    expect(screen.getByTestId("product-grid-list")).toBeInTheDocument();
  });
});
