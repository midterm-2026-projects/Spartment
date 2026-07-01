import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import UtilityBillingCards from "../components/UtilityBillingCards";

describe("UtilityBillingCards", () => {
  it("should render the Electricity, Water, and Combined Utilities cards successfully", () => {
    // Arrange
    render(<UtilityBillingCards />);

    // Act
    const electricity = screen.getByText(/electricity/i);
    const water = screen.getByText(/^water$/i);
    const combined = screen.getByText(
      /combined utilities/i
    );

    // Assert
    expect(electricity).toBeInTheDocument();
    expect(water).toBeInTheDocument();
    expect(combined).toBeInTheDocument();
  });

  it("should display the correct utility billing values", () => {
    // Arrange
    render(
      <UtilityBillingCards
        electricity="₱3,500"
        water="₱1,200"
        combined="₱4,700"
      />
    );

    // Assert
    expect(
      screen.getByText("₱3,500")
    ).toBeInTheDocument();

    expect(
      screen.getByText("₱1,200")
    ).toBeInTheDocument();

    expect(
      screen.getByText("₱4,700")
    ).toBeInTheDocument();
  });

  it("should display ₱0 when utility billing values are not provided", () => {
    // Arrange
    render(<UtilityBillingCards />);

    // Act
    const defaultValues = screen.getAllByText("₱0");

    // Assert
    expect(defaultValues).toHaveLength(3);
  });
});