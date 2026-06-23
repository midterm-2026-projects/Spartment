import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import TextField from "../components/TextField";

describe("TextField", () => {
  it("should allow the user to enter an email", async () => {

    // Arrange
    render(<TextField />);
    const emailInput = screen.getByLabelText(/email/i);

    // Act
    await userEvent.type(emailInput, "juan@email.com");

    // Assert
    expect(emailInput).toHaveValue("juan@email.com");
  });

  it("should allow the user to enter a password", async () => {

    // Arrange
    render(<TextField />);
    const passwordInput = screen.getByLabelText(/password/i);

    // Act
    await userEvent.type(passwordInput, "Str0ngPass123!");

    // Assert
    expect(passwordInput).toHaveValue("Str0ngPass123!");
  });
});