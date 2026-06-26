import { render, screen } from "@testing-library/react";
import LandingPage from "./page";

describe("LandingPage – Integration", () => {
  it("renders hero banner section (AC1)", () => {
    render(<LandingPage />);
    expect(screen.getByTestId("hero-banner")).toBeInTheDocument();
  });

  it("renders product grid with featured products (AC1)", () => {
    render(<LandingPage />);
    const section = screen.getByTestId("product-grid-section");
    expect(section).toBeInTheDocument();
    // Expects at least one product card
    const cards = screen.getAllByTestId("product-card");
    expect(cards.length).toBeGreaterThan(0);
  });

  it("renders CTA section with buy buttons (AC1)", () => {
    render(<LandingPage />);
    expect(screen.getByTestId("cta-section")).toBeInTheDocument();
  });

  it("hero primary CTA links to product section (AC2 – scroll anchor)", () => {
    render(<LandingPage />);
    const cta = screen.getByTestId("hero-cta-primary");
    expect(cta).toHaveAttribute("href", "#san-pham");
  });

  it("product buy buttons link to product detail pages (AC2)", () => {
    render(<LandingPage />);
    const buyButtons = screen.getAllByTestId("product-buy-button");
    buyButtons.forEach((btn) => {
      expect(btn.getAttribute("href")).toMatch(/^\/products\//);
    });
  });

  it("CTA primary button links to product section (AC2)", () => {
    render(<LandingPage />);
    const ctaBtn = screen.getByTestId("cta-primary-button");
    expect(ctaBtn).toHaveAttribute("href", "#san-pham");
  });

  it("CTA secondary button links to cart (AC2)", () => {
    render(<LandingPage />);
    const cartBtn = screen.getByTestId("cta-secondary-button");
    expect(cartBtn).toHaveAttribute("href", "/cart");
  });

  it("navbar is present for site navigation", () => {
    render(<LandingPage />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("footer is present", () => {
    render(<LandingPage />);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("page has proper landmark structure for accessibility (AC3)", () => {
    render(<LandingPage />);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Điều hướng chính" })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
