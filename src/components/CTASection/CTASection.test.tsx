import { render, screen } from "@testing-library/react";
import CTASection from "./CTASection";

describe("CTASection", () => {
  it("renders the CTA section", () => {
    render(<CTASection />);
    expect(screen.getByTestId("cta-section")).toBeInTheDocument();
  });

  it("displays default title", () => {
    render(<CTASection />);
    expect(screen.getByTestId("cta-title")).toHaveTextContent(
      "Đừng bỏ lỡ ưu đãi hôm nay!"
    );
  });

  it("renders primary CTA button pointing to product section", () => {
    render(<CTASection />);
    const primaryBtn = screen.getByTestId("cta-primary-button");
    expect(primaryBtn).toHaveTextContent("Mua hàng ngay");
    expect(primaryBtn).toHaveAttribute("href", "#san-pham");
  });

  it("renders secondary CTA button pointing to cart", () => {
    render(<CTASection />);
    const secondaryBtn = screen.getByTestId("cta-secondary-button");
    expect(secondaryBtn).toHaveTextContent("Xem giỏ hàng");
    expect(secondaryBtn).toHaveAttribute("href", "/cart");
  });

  it("accepts custom props", () => {
    render(
      <CTASection
        title="Custom CTA"
        primaryCtaLabel="Buy Now"
        primaryCtaHref="/checkout"
        secondaryCtaLabel="View Cart"
        secondaryCtaHref="/cart"
      />
    );
    expect(screen.getByTestId("cta-title")).toHaveTextContent("Custom CTA");
    expect(screen.getByTestId("cta-primary-button")).toHaveAttribute(
      "href",
      "/checkout"
    );
    expect(screen.getByTestId("cta-secondary-button")).toHaveAttribute(
      "href",
      "/cart"
    );
  });

  it("renders all 3 stats", () => {
    render(<CTASection />);
    const stats = screen.getAllByTestId("cta-stat");
    expect(stats).toHaveLength(3);
  });

  it("renders stat values", () => {
    render(<CTASection />);
    expect(screen.getByText("50K+")).toBeInTheDocument();
    expect(screen.getByText("1000+")).toBeInTheDocument();
    expect(screen.getByText("4.9★")).toBeInTheDocument();
  });
});
