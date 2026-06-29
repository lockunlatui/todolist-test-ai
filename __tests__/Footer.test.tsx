import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

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

describe("Footer", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it("renders the footer element", () => {
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("'Liên hệ' CTA button links to /contact", () => {
    expect(screen.getByTestId("cta-contact")).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("renders quick links to /booking, /contact, /signup", () => {
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/booking");
    expect(hrefs).toContain("/contact");
    expect(hrefs).toContain("/signup");
  });
});
