import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Button from "../components/Button";

describe("Button", () => {

  it("should call onSubmit when button is clicked", async () => {

    // Arrange
    const mockSubmit = vi.fn();

    render(<Button onSubmit={mockSubmit} />);
    const signInButton = screen.getByRole("button", { name: /sign in/i });

    // Act
    await userEvent.click(signInButton);

    // Assert
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  it("should not call onSubmit if button is not clicked", () => {

    // Arrange
    const mockSubmit = vi.fn();

    render(<Button onSubmit={mockSubmit} />);

    // Act
    // (no action)

    // Assert
    expect(mockSubmit).not.toHaveBeenCalled();
  });

});