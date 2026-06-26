import { render, screen } from "@testing-library/react";
import HeroBanner from "./HeroBanner";

describe("HeroBanner", () => {
  it("renders the hero section", () => {
    render(<HeroBanner />);
    expect(screen.getByTestId("hero-banner")).toBeInTheDocument();
  });

  it("displays default title and subtitle", () => {
    render(<HeroBanner />);
    expect(
      screen.getByText("Mua sắm thông minh – Sống đẹp mỗi ngày")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Khám phá hàng ngàn sản phẩm/)
    ).toBeInTheDocument();
  });

  it("renders primary CTA button linking to #san-pham by default", () => {
    render(<HeroBanner />);
    const primaryCta = screen.getByTestId("hero-cta-primary");
    expect(primaryCta).toBeInTheDocument();
    expect(primaryCta).toHaveAttribute("href", "#san-pham");
    expect(primaryCta).toHaveTextContent("Mua ngay");
  });

  it("renders secondary CTA button", () => {
    render(<HeroBanner />);
    const secondaryCta = screen.getByTestId("hero-cta-secondary");
    expect(secondaryCta).toBeInTheDocument();
    expect(secondaryCta).toHaveAttribute("href", "/products");
  });

  it("accepts custom title and ctaLabel props", () => {
    render(
      <HeroBanner title="Custom Title" ctaLabel="Shop Now" ctaHref="/cart" />
    );
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    const cta = screen.getByTestId("hero-cta-primary");
    expect(cta).toHaveTextContent("Shop Now");
    expect(cta).toHaveAttribute("href", "/cart");
  });

  it("renders the flash sale badge", () => {
    render(<HeroBanner />);
    expect(
      screen.getByText(/Flash Sale – Giảm đến 50%/)
    ).toBeInTheDocument();
  });

  it("renders trust badge list", () => {
    render(<HeroBanner />);
    expect(screen.getByText("Giao hàng miễn phí")).toBeInTheDocument();
    expect(screen.getByText("Đổi trả 30 ngày")).toBeInTheDocument();
    expect(screen.getByText("Thanh toán an toàn")).toBeInTheDocument();
  });
});
