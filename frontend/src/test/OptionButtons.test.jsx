import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import OptionButtons from "../components/OptionButtons";

describe("OptionButtons", () => {
  it("should render the Inquiry button", () => {
    // Arrange
    render(<OptionButtons />);

    // Act
    const inquiryButton = screen.getByRole("button", {
      name: /inquiry/i,
    });

    // Assert
    expect(inquiryButton).toBeInTheDocument();
  });

  it("should render the Maintenance button", () => {
    // Arrange
    render(<OptionButtons />);

    // Act
    const maintenanceButton = screen.getByRole("button", {
      name: /maintenance/i,
    });

    // Assert
    expect(maintenanceButton).toBeInTheDocument();
  });

  it("should render the Other button", () => {
    // Arrange
    render(<OptionButtons />);

    // Act
    const otherButton = screen.getByRole("button", {
      name: /other/i,
    });

    // Assert
    expect(otherButton).toBeInTheDocument();
  });
});