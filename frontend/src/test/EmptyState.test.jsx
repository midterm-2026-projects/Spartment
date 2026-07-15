import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EmptyState from "../components/EmptyState";

describe("EmptyState", () => {
  it("should display the default empty state message", () => {
    // Arrange
    render(<EmptyState />);

    // Assert
    expect(
      screen.getByText("No records found.")
    ).toBeInTheDocument();
  });

  it("should display a custom empty state message", () => {
    // Arrange
    render(
      <EmptyState message="No tenant information found." />
    );

    // Assert
    expect(
      screen.getByText(
        "No tenant information found."
      )
    ).toBeInTheDocument();
  });
});