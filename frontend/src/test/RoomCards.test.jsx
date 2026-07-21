import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RoomCards from "../components/RoomCards";

describe("RoomCards", () => {
  it("displays room details correctly", () => {
    const room = {
      id: "room-001",
      roomNumber: "Room 101",
      status: "Occupied",
      monthlyRent: 6500,
      tenant: {
        id: "tenant-001",
        fullName: "Maria Santos",
      },
    };

    render(<RoomCards room={room} onEdit={vi.fn()} />);

    expect(screen.getByText("Room 101")).toBeInTheDocument();

    expect(screen.getByText("Occupied")).toBeInTheDocument();

    expect(screen.getByText("Maria Santos")).toBeInTheDocument();

    expect(screen.getByText(/6,500/)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /edit/i,
      }),
    ).toBeInTheDocument();
  });

  it("supports snake_case room data", () => {
    const room = {
      id: "room-002",
      room_number: "Room 102",
      status: "Available",
      monthly_rent: 5200,
      tenant: null,
    };

    render(<RoomCards room={room} onEdit={vi.fn()} />);

    expect(screen.getByText("Room 102")).toBeInTheDocument();

    expect(screen.getByText("Available")).toBeInTheDocument();

    expect(screen.getByText("No tenant")).toBeInTheDocument();

    expect(screen.getByText(/5,200/)).toBeInTheDocument();
  });

  it("calls onEdit with the room", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    const room = {
      id: "room-003",
      roomNumber: "Room 103",
      status: "Available",
      monthlyRent: 5000,
    };

    render(<RoomCards room={room} onEdit={onEdit} />);

    await user.click(
      screen.getByRole("button", {
        name: /edit/i,
      }),
    );

    expect(onEdit).toHaveBeenCalledWith(room);
  });
});
