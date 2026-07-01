import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import InquiryForm from "../components/InquiryForm";

describe("InquiryForm", () => {
  it("should render the Inquiry form with all required input fields", () => {
    // Arrange
    render(<InquiryForm />);

    // Assert
    expect(
      screen.getByRole("heading", {
        name: /spartment assistant/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/full name/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/email/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/contact/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/preferred room/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/move-in date/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/message/i)
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
    render(<InquiryForm />);

    const fullName = screen.getByLabelText(/full name/i);
    const email = screen.getByLabelText(/email/i);
    const contact = screen.getByLabelText(/contact/i);
    const room = screen.getByLabelText(/preferred room/i);
    const message = screen.getByLabelText(/message/i);

    // Act
    await user.type(fullName, "Juan Dela Cruz");
    await user.type(email, "juan@gmail.com");
    await user.type(contact, "09123456789");
    await user.type(room, "102");
    await user.type(message, "I would like to inquire about room availability.");

    // Assert
    expect(fullName).toHaveValue("Juan Dela Cruz");
    expect(email).toHaveValue("juan@gmail.com");
    expect(contact).toHaveValue("09123456789");
    expect(room).toHaveValue("102");
    expect(message).toHaveValue(
      "I would like to inquire about room availability."
    );
  });

  it("should allow the user to delete all entered text", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<InquiryForm />);

    const fullName = screen.getByLabelText(/full name/i);
    const email = screen.getByLabelText(/email/i);
    const contact = screen.getByLabelText(/contact/i);
    const room = screen.getByLabelText(/preferred room/i);
    const message = screen.getByLabelText(/message/i);

    await user.type(fullName, "Juan Dela Cruz");
    await user.type(email, "juan@gmail.com");
    await user.type(contact, "09123456789");
    await user.type(room, "102");
    await user.type(message, "Inquiry message");

    // Act
    await user.clear(fullName);
    await user.clear(email);
    await user.clear(contact);
    await user.clear(room);
    await user.clear(message);

    // Assert
    expect(fullName).toHaveValue("");
    expect(email).toHaveValue("");
    expect(contact).toHaveValue("");
    expect(room).toHaveValue("");
    expect(message).toHaveValue("");
  });
});