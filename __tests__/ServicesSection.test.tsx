import { render, screen } from "@testing-library/react";
import ServicesSection from "@/components/ServicesSection";

describe("ServicesSection", () => {
  beforeEach(() => {
    render(<ServicesSection />);
  });

  it("renders the section", () => {
    expect(screen.getByTestId("services-section")).toBeInTheDocument();
  });

  it("renders all four service cards", () => {
    expect(screen.getByTestId("service-card-tours")).toBeInTheDocument();
    expect(screen.getByTestId("service-card-hotels")).toBeInTheDocument();
    expect(screen.getByTestId("service-card-flights")).toBeInTheDocument();
    expect(screen.getByTestId("service-card-guide")).toBeInTheDocument();
  });

  it("renders a heading for the section", () => {
    expect(
      screen.getByRole("heading", { name: /dịch vụ/i })
    ).toBeInTheDocument();
  });
});
