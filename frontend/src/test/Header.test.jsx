import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "../components/Header";

describe("Header", () => {

  it("should render the header title", () => {

    // Arrange
    render(<Header />);

    // Act
    const title = screen.getByRole("heading", {
      name: /spartment/i,
    });

    // Assert
    expect(title).toBeInTheDocument();
  });

});