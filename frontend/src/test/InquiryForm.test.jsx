import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import InquiryForm from "../components/InquiryForm";

describe("InquiryForm", () => {
  const roomId = "22222222-2222-4222-8222-222222222222";

  const availableRooms = [
    {
      id: roomId,
      roomNumber: "Room 102",
      monthlyRent: 6500,
      status: "Available",
    },
  ];

  it("should render the Inquiry form with all required input fields", () => {
    render(<InquiryForm rooms={availableRooms} onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("heading", {
        name: /room inquiry/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/contact/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/preferred room/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/inquiry type/i)).toBeInTheDocument();

    expect(
      screen.getByLabelText(/preferred move-in date/i),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /submit inquiry/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Room 102",
      }),
    ).toBeInTheDocument();
  });

  it("should allow the user to fill all fields", async () => {
    const user = userEvent.setup();

    render(<InquiryForm rooms={availableRooms} onSubmit={vi.fn()} />);

    const fullName = screen.getByLabelText(/full name/i);

    const email = screen.getByLabelText(/^email$/i);

    const contact = screen.getByLabelText(/contact/i);

    const room = screen.getByLabelText(/preferred room/i);

    const inquiryType = screen.getByLabelText(/inquiry type/i);

    const moveIn = screen.getByLabelText(/preferred move-in date/i);

    const message = screen.getByLabelText(/message/i);

    await user.type(fullName, "Juan Dela Cruz");

    await user.type(email, "juan@gmail.com");

    await user.type(contact, "09123456789");

    await user.selectOptions(room, roomId);

    await user.selectOptions(inquiryType, "Reservation Inquiry");

    await user.type(moveIn, "2026-07-01");

    await user.type(
      message,
      "I would like to inquire about room availability.",
    );

    expect(fullName).toHaveValue("Juan Dela Cruz");

    expect(email).toHaveValue("juan@gmail.com");

    expect(contact).toHaveValue("09123456789");

    expect(room).toHaveValue(roomId);

    expect(inquiryType).toHaveValue("Reservation Inquiry");

    expect(moveIn).toHaveValue("2026-07-01");

    expect(message).toHaveValue(
      "I would like to inquire about room availability.",
    );
  });

  it("should allow the user to delete all entered values", async () => {
    const user = userEvent.setup();

    render(<InquiryForm rooms={availableRooms} onSubmit={vi.fn()} />);

    const fullName = screen.getByLabelText(/full name/i);

    const email = screen.getByLabelText(/^email$/i);

    const contact = screen.getByLabelText(/contact/i);

    const room = screen.getByLabelText(/preferred room/i);

    const inquiryType = screen.getByLabelText(/inquiry type/i);

    const moveIn = screen.getByLabelText(/preferred move-in date/i);

    const message = screen.getByLabelText(/message/i);

    await user.type(fullName, "Juan Dela Cruz");

    await user.type(email, "juan@gmail.com");

    await user.type(contact, "09123456789");

    await user.selectOptions(room, roomId);

    await user.selectOptions(inquiryType, "Reservation Inquiry");

    await user.type(moveIn, "2026-07-01");

    await user.type(message, "Inquiry message");

    await user.clear(fullName);
    await user.clear(email);
    await user.clear(contact);

    // Select elements cannot use user.clear().
    await user.selectOptions(room, "");

    await user.selectOptions(inquiryType, "Room Inquiry");

    await user.clear(moveIn);
    await user.clear(message);

    expect(fullName).toHaveValue("");
    expect(email).toHaveValue("");
    expect(contact).toHaveValue("");
    expect(room).toHaveValue("");

    expect(inquiryType).toHaveValue("Room Inquiry");

    expect(moveIn).toHaveValue("");
    expect(message).toHaveValue("");
  });

  it("should submit the form when all required fields are filled", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<InquiryForm rooms={availableRooms} onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/full name/i), "Juan Dela Cruz");

    await user.type(screen.getByLabelText(/^email$/i), "juan@gmail.com");

    await user.type(screen.getByLabelText(/contact/i), "09123456789");

    await user.selectOptions(screen.getByLabelText(/preferred room/i), roomId);

    await user.selectOptions(
      screen.getByLabelText(/inquiry type/i),
      "Room Inquiry",
    );

    await user.type(
      screen.getByLabelText(/preferred move-in date/i),
      "2026-07-01",
    );

    await user.type(
      screen.getByLabelText(/message/i),
      "I would like to inquire about room availability.",
    );

    await user.click(
      screen.getByRole("button", {
        name: /submit inquiry/i,
      }),
    );

    expect(handleSubmit).toHaveBeenCalledTimes(1);

    expect(handleSubmit).toHaveBeenCalledWith({
      name: "Juan Dela Cruz",
      email: "juan@gmail.com",
      contact: "09123456789",
      roomId,
      type: "Room Inquiry",
      moveInDate: "2026-07-01",
      message: "I would like to inquire about room availability.",
    });
  });

  it("should not submit the form when required fields are empty", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<InquiryForm rooms={availableRooms} onSubmit={handleSubmit} />);

    await user.click(
      screen.getByRole("button", {
        name: /submit inquiry/i,
      }),
    );

    expect(handleSubmit).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/full name/i)).toBeInvalid();

    expect(screen.getByLabelText(/preferred room/i)).toBeInvalid();

    expect(screen.getByLabelText(/preferred move-in date/i)).toBeInvalid();
  });

  it("should automatically select the selected room", () => {
    render(
      <InquiryForm
        selectedRoom={availableRooms[0]}
        rooms={availableRooms}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/preferred room/i)).toHaveValue(roomId);
  });

  it("should display an error message", () => {
    render(
      <InquiryForm
        rooms={availableRooms}
        onSubmit={vi.fn()}
        error="Failed to submit inquiry."
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to submit inquiry.",
    );
  });

  it("should disable the submit button while loading", () => {
    render(<InquiryForm rooms={availableRooms} onSubmit={vi.fn()} loading />);

    expect(
      screen.getByRole("button", {
        name: /submitting/i,
      }),
    ).toBeDisabled();
  });

  it("should call onBack when Back is clicked", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(
      <InquiryForm rooms={availableRooms} onSubmit={vi.fn()} onBack={onBack} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /^back$/i,
      }),
    );

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
