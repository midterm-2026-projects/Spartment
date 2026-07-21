import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import GuestRooms from "../pages/GuestRooms";

import useRooms from "../hooks/useRooms";
import useInquiry from "../hooks/useInquiry";

vi.mock("../hooks/useRooms", () => ({
  default: vi.fn(),
}));

vi.mock("../hooks/useInquiry", () => ({
  default: vi.fn(),
}));

describe("Guest Rooms Page", () => {
  const roomId = "22222222-2222-4222-8222-222222222222";

  const availableRoom = {
    id: roomId,
    roomNumber: "101",
    status: "Available",
    monthlyRent: 5000,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    useInquiry.mockReturnValue({
      createInquiry: vi.fn(),
      loading: false,
      error: "",
      success: "",
      reset: vi.fn(),
    });
  });

  it("should display available rooms successfully", () => {
    useRooms.mockReturnValue({
      rooms: [availableRoom],
      loading: false,
      error: "",
    });

    render(<GuestRooms />);

    expect(
      screen.getByRole("heading", {
        name: /guest rooms/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /available rooms/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /room 101/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Available")).toBeInTheDocument();

    expect(screen.getByText(/5,000/)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /send inquiry/i,
      }),
    ).toBeInTheDocument();
  });

  it("should display loading state", () => {
    useRooms.mockReturnValue({
      rooms: [],
      loading: true,
      error: "",
    });

    render(<GuestRooms />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should display error message when rooms fail", () => {
    useRooms.mockReturnValue({
      rooms: [],
      loading: false,
      error: "Failed to retrieve rooms.",
    });

    render(<GuestRooms />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to retrieve rooms.",
    );
  });

  it("should open the inquiry form when Send Inquiry is clicked", async () => {
    const user = userEvent.setup();
    const reset = vi.fn();

    useRooms.mockReturnValue({
      rooms: [availableRoom],
      loading: false,
      error: "",
    });

    useInquiry.mockReturnValue({
      createInquiry: vi.fn(),
      loading: false,
      error: "",
      success: "",
      reset,
    });

    render(<GuestRooms />);

    await user.click(
      screen.getByRole("button", {
        name: /send inquiry/i,
      }),
    );

    expect(reset).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole("heading", {
        name: /room inquiry/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/preferred room/i)).toHaveValue(roomId);
  });

  it("should return to the room list when Back is clicked", async () => {
    const user = userEvent.setup();
    const reset = vi.fn();

    useRooms.mockReturnValue({
      rooms: [availableRoom],
      loading: false,
      error: "",
    });

    useInquiry.mockReturnValue({
      createInquiry: vi.fn(),
      loading: false,
      error: "",
      success: "",
      reset,
    });

    render(<GuestRooms />);

    await user.click(
      screen.getByRole("button", {
        name: /send inquiry/i,
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: /room inquiry/i,
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /^back$/i,
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: /available rooms/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /room 101/i,
      }),
    ).toBeInTheDocument();

    expect(reset).toHaveBeenCalledTimes(2);
  });

  it("should submit an inquiry", async () => {
    const user = userEvent.setup();

    const createInquiry = vi.fn().mockResolvedValue({
      success: true,
    });

    useRooms.mockReturnValue({
      rooms: [availableRoom],
      loading: false,
      error: "",
    });

    useInquiry.mockReturnValue({
      createInquiry,
      loading: false,
      error: "",
      success: "",
      reset: vi.fn(),
    });

    render(<GuestRooms />);

    await user.click(
      screen.getByRole("button", {
        name: /send inquiry/i,
      }),
    );

    await user.type(screen.getByLabelText(/full name/i), "Juan Dela Cruz");

    await user.type(screen.getByLabelText(/^email$/i), "juan@gmail.com");

    await user.type(screen.getByLabelText(/contact/i), "09123456789");

    expect(screen.getByLabelText(/preferred room/i)).toHaveValue(roomId);

    await user.selectOptions(
      screen.getByLabelText(/inquiry type/i),
      "Room Inquiry",
    );

    await user.type(
      screen.getByLabelText(/preferred move-in date/i),
      "2026-08-01",
    );

    await user.type(
      screen.getByLabelText(/message/i),
      "I would like to rent this room.",
    );

    await user.click(
      screen.getByRole("button", {
        name: /submit inquiry/i,
      }),
    );

    expect(createInquiry).toHaveBeenCalledTimes(1);

    expect(createInquiry).toHaveBeenCalledWith({
      name: "Juan Dela Cruz",
      email: "juan@gmail.com",
      contact: "09123456789",
      roomId,
      type: "Room Inquiry",
      moveInDate: "2026-08-01",
      message: "I would like to rent this room.",
    });

    expect(
      screen.getByRole("heading", {
        name: /available rooms/i,
      }),
    ).toBeInTheDocument();
  });

  it("should display inquiry success message", () => {
    useRooms.mockReturnValue({
      rooms: [availableRoom],
      loading: false,
      error: "",
    });

    useInquiry.mockReturnValue({
      createInquiry: vi.fn(),
      loading: false,
      error: "",
      success: "Inquiry submitted successfully.",
      reset: vi.fn(),
    });

    render(<GuestRooms />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Inquiry submitted successfully.",
    );
  });

  it("should display inquiry error when the form is closed", () => {
    useRooms.mockReturnValue({
      rooms: [availableRoom],
      loading: false,
      error: "",
    });

    useInquiry.mockReturnValue({
      createInquiry: vi.fn(),
      loading: false,
      error: "Failed to submit inquiry.",
      success: "",
      reset: vi.fn(),
    });

    render(<GuestRooms />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to submit inquiry.",
    );
  });

  it("should display the inquiry error inside the form", async () => {
    const user = userEvent.setup();

    useRooms.mockReturnValue({
      rooms: [availableRoom],
      loading: false,
      error: "",
    });

    useInquiry.mockReturnValue({
      createInquiry: vi.fn(),
      loading: false,
      error: "Failed to submit inquiry.",
      success: "",
      reset: vi.fn(),
    });

    render(<GuestRooms />);

    await user.click(
      screen.getByRole("button", {
        name: /send inquiry/i,
      }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to submit inquiry.",
    );
  });
});
