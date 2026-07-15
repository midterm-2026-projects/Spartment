import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EmptyState from "../components/EmptyState";

describe("EmptyState", () => {
  it("should display the empty state message", () => {
    // Arrange
    render(<EmptyState />);

    // Assert
    expect(
      screen.getByText("No records found.")
    ).toBeInTheDocument();
  });
});