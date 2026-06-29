import { render, screen } from "@testing-library/react";
import DestinationsSection from "@/components/DestinationsSection";

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

describe("DestinationsSection", () => {
  beforeEach(() => {
    render(<DestinationsSection />);
  });

  it("renders the section", () => {
    expect(screen.getByTestId("destinations-section")).toBeInTheDocument();
  });

  it("renders all four destination cards", () => {
    expect(screen.getByTestId("destination-card-ha-long")).toBeInTheDocument();
    expect(screen.getByTestId("destination-card-hoi-an")).toBeInTheDocument();
    expect(screen.getByTestId("destination-card-sapa")).toBeInTheDocument();
    expect(
      screen.getByTestId("destination-card-phu-quoc")
    ).toBeInTheDocument();
  });

  it("each destination card has a 'Đặt ngay' link to /booking", () => {
    const bookLinks = screen.getAllByTestId(/^book-/);
    expect(bookLinks).toHaveLength(4);
    bookLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/booking");
    });
  });

  it("renders the section heading", () => {
    expect(
      screen.getByRole("heading", { name: /điểm đến/i })
    ).toBeInTheDocument();
  });
});
