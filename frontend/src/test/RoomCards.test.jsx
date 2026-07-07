import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";

import RoomCards from "../components/RoomCards";
import RoomEditModal from "../components/RoomEditModal";

describe("RoomCards", () => {
  const room = {
    roomNumber: "Room 101",
    status: "Occupied",
    tenant: "Maria Santos",
    rent: 6500,
  };

  it("should render the room card", () => {
    // Arrange
    render(<RoomCards room={room} onEdit={vi.fn()} />);

    // Assert
    expect(screen.getByText("Room 101")).toBeInTheDocument();
  });

  it("should display the room number, room status, tenant name, monthly rent, and Edit button correctly", () => {
    // Arrange
    render(<RoomCards room={room} onEdit={vi.fn()} />);

    // Assert
    expect(screen.getByText("Room 101")).toBeInTheDocument();
    expect(screen.getByText("Occupied")).toBeInTheDocument();
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    expect(screen.getByText("₱6500")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /edit/i,
      })
    ).toBeInTheDocument();
  });

  it("should call onEdit when the Edit button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(<RoomCards room={room} onEdit={onEdit} />);

    // Act
    await user.click(
      screen.getByRole("button", {
        name: /edit/i,
      })
    );

    // Assert
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(room);
  });

  it("should open the Room Edit module when the Edit button is clicked", async () => {
    const user = userEvent.setup();

    function Wrapper() {
      const [open, setOpen] = useState(false);

      return (
        <>
          <RoomCards
            room={room}
            onEdit={() => setOpen(true)}
          />

          <RoomEditModal
            open={open}
            room={room}
            onClose={() => setOpen(false)}
            onSubmit={vi.fn()}
          />
        </>
      );
    }

    render(<Wrapper />);

    await user.click(
      screen.getByRole("button", {
        name: /edit/i,
      })
    );

    expect(
      screen.getByRole("heading", {
        name: /edit room 101/i,
      })
    ).toBeInTheDocument();
  });
});