import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Loading from "../components/Loading";

describe("Loading", () => {
  it("should display the loading message", () => {
    // Arrange
    render(<Loading />);

    // Assert
    expect(
      screen.getByText("Loading...")
    ).toBeInTheDocument();
  });
});