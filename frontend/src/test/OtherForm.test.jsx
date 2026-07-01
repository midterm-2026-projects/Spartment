import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import OtherForm from "../components/OtherForm";

describe("OtherForm", () => {
  it("should render the Other form with all required input fields", () => {
    // Arrange
    render(<OtherForm />);

    // Assert
    expect(
      screen.getByRole("heading", {
        name: /spartment assistant/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/subject/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/message/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /back/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /send/i,
      })
    ).toBeInTheDocument();
  });

  it("should allow the user to fill all text fields", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<OtherForm />);

    const subject = screen.getByLabelText(/subject/i);
    const message = screen.getByLabelText(/message/i);

    // Act
    await user.type(subject, "Parking Concern");
    await user.type(
      message,
      "I would like to ask about the available parking spaces."
    );

    // Assert
    expect(subject).toHaveValue("Parking Concern");
    expect(message).toHaveValue(
      "I would like to ask about the available parking spaces."
    );
  });

  it("should allow the user to delete all entered text", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<OtherForm />);

    const subject = screen.getByLabelText(/subject/i);
    const message = screen.getByLabelText(/message/i);

    await user.type(subject, "Parking Concern");
    await user.type(
      message,
      "I would like to ask about the available parking spaces."
    );

    // Act
    await user.clear(subject);
    await user.clear(message);

    // Assert
    expect(subject).toHaveValue("");
    expect(message).toHaveValue("");
  });
});