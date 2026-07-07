import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ForecastRevenueCards from "../components/ForecastRevenueCards";

describe("ForecastRevenueCards", () => {
  it("should render the Forecast and Actual Revenue cards successfully", () => {
    // Arrange
    render(<ForecastRevenueCards />);

    // Assert
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /forecast vs actual revenue/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Forecast")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Actual")
    ).toBeInTheDocument();
  });

  it("should display the Forecast and Actual Revenue values", () => {
    // Arrange
    render(
      <ForecastRevenueCards
        forecast="₱482,500"
        actual="₱344,000"
      />
    );

    // Assert
    expect(
      screen.getByText("₱482,500")
    ).toBeInTheDocument();

    expect(
      screen.getByText("₱344,000")
    ).toBeInTheDocument();
  });

  it("should display ₱0 when Forecast and Actual Revenue values are not provided", () => {
    // Arrange
    render(<ForecastRevenueCards />);

    // Assert
    expect(
      screen.getAllByText("₱0")
    ).toHaveLength(2);
  });
});