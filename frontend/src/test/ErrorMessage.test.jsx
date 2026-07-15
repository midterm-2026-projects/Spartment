import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ErrorMessage from "../components/ErrorMessage";

describe("ErrorMessage", () => {
  it("should display the error message", () => {
    // Arrange
    render(<ErrorMessage />);

    // Assert
    expect(
      screen.getByText("Something went wrong.")
    ).toBeInTheDocument();
  });
});