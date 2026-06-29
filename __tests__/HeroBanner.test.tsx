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

jest.mock("next/image", () => {
  const MockImage = ({
    src,
    alt,
    // Strip Next.js-specific props so they don't pass to <img>
    fill: _fill,
    priority: _priority,
    sizes: _sizes,
    quality: _quality,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    sizes?: string;
    quality?: number;
    placeholder?: string;
    blurDataURL?: string;
    [key: string]: unknown;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />;
  };
  MockImage.displayName = "MockImage";
  return MockImage;
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

  it("has a hero banner image with non-empty alt text (N-026)", () => {
    const images = screen.queryAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
    const heroImg = images.find(
      (img) => img.getAttribute("alt") && img.getAttribute("alt") !== ""
    );
    expect(heroImg).toBeDefined();
    expect(heroImg).toHaveAttribute("alt");
    expect(heroImg!.getAttribute("alt")).not.toBe("");
  });
});
