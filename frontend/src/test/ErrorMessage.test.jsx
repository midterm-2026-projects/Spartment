import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ErrorMessage from "../components/ErrorMessage";

describe("ErrorMessage", () => {
  it("should display the default error message", () => {
    // Arrange
    render(<ErrorMessage />);

    // Assert
    expect(
      screen.getByText("Something went wrong.")
    ).toBeInTheDocument();
  });

  it("should display a custom error message", () => {
    // Arrange
    render(
      <ErrorMessage message="Tenant information unavailable." />
    );

    // Assert
    expect(
      screen.getByText(
        "Tenant information unavailable."
      )
    ).toBeInTheDocument();
  });
});