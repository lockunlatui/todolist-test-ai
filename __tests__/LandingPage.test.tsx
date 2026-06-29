import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// Mock Next.js Link so tests run without a router
jest.mock("next/link", () => {
  const MockLink = ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("Landing Page – sections present (AC-1)", () => {
  beforeEach(() => {
    render(<Home />);
  });

  it("renders the hero banner section", () => {
    expect(screen.getByTestId("hero-banner")).toBeInTheDocument();
  });

  it("renders the services section", () => {
    expect(screen.getByTestId("services-section")).toBeInTheDocument();
  });

  it("renders the destinations section", () => {
    expect(screen.getByTestId("destinations-section")).toBeInTheDocument();
  });

  it("renders the footer", () => {
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders all four service cards", () => {
    expect(screen.getByTestId("service-card-tours")).toBeInTheDocument();
    expect(screen.getByTestId("service-card-hotels")).toBeInTheDocument();
    expect(screen.getByTestId("service-card-flights")).toBeInTheDocument();
    expect(screen.getByTestId("service-card-guide")).toBeInTheDocument();
  });

  it("renders all four destination cards", () => {
    expect(screen.getByTestId("destination-card-ha-long")).toBeInTheDocument();
    expect(screen.getByTestId("destination-card-hoi-an")).toBeInTheDocument();
    expect(screen.getByTestId("destination-card-sapa")).toBeInTheDocument();
    expect(
      screen.getByTestId("destination-card-phu-quoc")
    ).toBeInTheDocument();
  });
});

describe("Landing Page – CTA buttons (AC-3)", () => {
  beforeEach(() => {
    render(<Home />);
  });

  it("'Đặt ngay' button in hero links to /booking", () => {
    const btn = screen.getByTestId("cta-booking");
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("href", "/booking");
  });

  it("'Đăng ký' button in hero links to /signup", () => {
    const btn = screen.getByTestId("cta-signup");
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("href", "/signup");
  });

  it("'Liên hệ' button in footer links to /contact", () => {
    const btn = screen.getByTestId("cta-contact");
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("href", "/contact");
  });

  it("destination 'Đặt ngay' cards link to /booking", () => {
    const bookBtns = screen.getAllByTestId(/^book-/);
    bookBtns.forEach((btn) => {
      expect(btn).toHaveAttribute("href", "/booking");
    });
  });
});

describe("Landing Page – hero content", () => {
  it("renders the main headline", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1 })
    ).toBeInTheDocument();
  });
});
