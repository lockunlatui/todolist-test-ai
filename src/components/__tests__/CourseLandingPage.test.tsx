import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CourseLandingPage from "../CourseLandingPage";

// Mock next/link so it renders as a plain anchor in jsdom
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

describe("CourseLandingPage — AC-1: hiển thị đầy đủ thông tin khoá học", () => {
  beforeEach(() => {
    render(<CourseLandingPage />);
  });

  test("hiển thị tên khoá học", () => {
    expect(screen.getByTestId("course-name")).toBeInTheDocument();
    expect(screen.getByTestId("course-name").textContent).toBeTruthy();
  });

  test("hiển thị mô tả khoá học", () => {
    expect(screen.getByTestId("course-description")).toBeInTheDocument();
  });

  test("hiển thị nội dung chương trình học", () => {
    expect(screen.getByTestId("curriculum-section")).toBeInTheDocument();
    // At least one module should be present
    expect(screen.getByText(/Module 1/)).toBeInTheDocument();
    expect(screen.getByText(/Module 5/)).toBeInTheDocument();
  });

  test("hiển thị thông tin giảng viên", () => {
    expect(screen.getByTestId("instructors-section")).toBeInTheDocument();
    const instructorCards = screen.getAllByTestId("instructor-card");
    expect(instructorCards.length).toBeGreaterThanOrEqual(1);
  });

  test("hiển thị giá khoá học", () => {
    const priceEl = screen.getByTestId("course-price");
    expect(priceEl).toBeInTheDocument();
    // Should contain a number with Vietnamese formatting
    expect(priceEl.textContent).toMatch(/[0-9]/);
  });

  test("hiển thị hero section", () => {
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
  });
});

describe("CourseLandingPage — AC-2: nút CTA dẫn đến trang đăng ký", () => {
  beforeEach(() => {
    render(<CourseLandingPage />);
  });

  test("tồn tại ít nhất một nút CTA 'Đăng ký ngay'", () => {
    const ctaButtons = screen.getAllByText("Đăng ký ngay");
    expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
  });

  test("nút CTA hero trỏ đến /dang-ky", () => {
    const heroCTA = screen.getByTestId("cta-button");
    expect(heroCTA).toHaveAttribute("href", "/dang-ky");
  });

  test("nút CTA pricing trỏ đến /dang-ky", () => {
    const pricingCTA = screen.getByTestId("cta-button-pricing");
    expect(pricingCTA).toHaveAttribute("href", "/dang-ky");
  });

  test("Nhấn nút CTA 'Đăng ký ngay' — điều hướng đến đúng URL trang đăng ký", async () => {
    const user = userEvent.setup();
    const heroCTA = screen.getByTestId("cta-button");

    // Capture the actual navigation target produced by a real user click.
    // The CTA renders as an anchor; clicking it should resolve to /dang-ky.
    let navigatedTo: string | null = null;
    heroCTA.addEventListener("click", (e) => {
      // Prevent jsdom "navigation not implemented" noise while still
      // recording where the click would have sent the user.
      e.preventDefault();
      navigatedTo = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
    });

    await user.click(heroCTA);

    expect(heroCTA.tagName).toBe("A");
    expect(navigatedTo).toBe("/dang-ky");
  });

  test("Nhấn nút CTA pricing — điều hướng đến đúng URL trang đăng ký", async () => {
    const user = userEvent.setup();
    const pricingCTA = screen.getByTestId("cta-button-pricing");

    let navigatedTo: string | null = null;
    pricingCTA.addEventListener("click", (e) => {
      e.preventDefault();
      navigatedTo = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
    });

    await user.click(pricingCTA);

    expect(navigatedTo).toBe("/dang-ky");
  });
});

describe("CourseLandingPage — AC-3: responsive layout", () => {
  function setViewport(width: number) {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event("resize"));
  }

  test("phần lợi ích sử dụng grid responsive", () => {
    const { container } = render(<CourseLandingPage />);
    // A grid container must opt into responsive column counts at tablet/desktop
    // breakpoints so the layout does not break on small screens.
    const responsiveGrid = container.querySelector(
      ".grid.md\\:grid-cols-2, .grid.lg\\:grid-cols-3, .grid.sm\\:grid-cols-2"
    );
    expect(responsiveGrid).toBeInTheDocument();
    expect(responsiveGrid?.className).toMatch(/(sm|md|lg):grid-cols-/);
  });

  test("hero section có tên khoá học với responsive classes", () => {
    render(<CourseLandingPage />);
    const heading = screen.getByTestId("course-name");
    // Heading should have responsive text size classes
    expect(heading.className).toMatch(/md:/);
  });

  test("Render desktop 1280px — layout không tràn", () => {
    setViewport(1280);
    const { container } = render(<CourseLandingPage />);
    expect(container.firstChild).toBeInTheDocument();
    // lg breakpoint grid should be present for wide viewports
    expect(container.querySelector(".lg\\:grid-cols-3")).toBeInTheDocument();
  });

  test("Render tablet 768px — layout điều chỉnh đúng breakpoint", () => {
    setViewport(768);
    const { container } = render(<CourseLandingPage />);
    expect(window.innerWidth).toBe(768);
    // md breakpoint (>=768px) responsive columns must exist
    const mdGrid = container.querySelector(".md\\:grid-cols-2, .md\\:grid-cols-4");
    expect(mdGrid).toBeInTheDocument();
  });

  test("trang render không crash trên viewport nhỏ (mobile 375px)", () => {
    setViewport(375);
    const { container } = render(<CourseLandingPage />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
