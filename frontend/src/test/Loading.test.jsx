import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Loading from "../components/Loading";

describe("Loading", () => {
  it("should display the default loading message", () => {
    // Arrange
    render(<Loading />);

    // Assert
    expect(
      screen.getByText("Loading...")
    ).toBeInTheDocument();
  });

  it("should display a custom loading message", () => {
    // Arrange
    render(
      <Loading message="Loading tenant information..." />
    );

    // Assert
    expect(
      screen.getByText(
        "Loading tenant information..."
      )
    ).toBeInTheDocument();
  });
});