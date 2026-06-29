import { render, screen } from "@testing-library/react";
import HeroBanner from "@/components/HeroBanner";

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

describe("HeroBanner", () => {
  beforeEach(() => {
    render(<HeroBanner />);
  });

  it("renders the section", () => {
    expect(screen.getByTestId("hero-banner")).toBeInTheDocument();
  });

  it("has an h1 heading", () => {
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("'Đặt ngay' button links to /booking", () => {
    expect(screen.getByTestId("cta-booking")).toHaveAttribute(
      "href",
      "/booking"
    );
  });

  it("'Đăng ký' button links to /signup", () => {
    expect(screen.getByTestId("cta-signup")).toHaveAttribute(
      "href",
      "/signup"
    );
  });
});
