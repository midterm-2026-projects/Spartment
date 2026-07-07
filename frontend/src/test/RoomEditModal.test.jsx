import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import RoomEditModal from "../components/RoomEditModal";

describe("RoomEditModal", () => {
  const room = {
    roomNumber: "Room 101",
    status: "Occupied",
    tenant: "Maria Santos",
    rent: 6500,
  };

  it("should render the Room Edit module", () => {
    // Arrange
    render(
      <RoomEditModal
        open={true}
        room={room}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    // Assert
    expect(
      screen.getByRole("heading", {
        name: /edit room 101/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByDisplayValue("Occupied")).toBeInTheDocument();
    expect(screen.getByDisplayValue("6500")).toBeInTheDocument();
  });

  it("should allow changing the room status", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <RoomEditModal
        open={true}
        room={room}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const select = screen.getByRole("combobox");

    // Act
    await user.selectOptions(select, "Maintenance");

    // Assert
    expect(select).toHaveValue("Maintenance");
  });

  it("should allow changing the monthly rent", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <RoomEditModal
        open={true}
        room={room}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const input = screen.getByDisplayValue("6500");

    // Act
    await user.clear(input);
    await user.type(input, "7000");

    // Assert
    expect(input).toHaveValue(7000);
  });

  it("should call onSubmit when Save Edit is clicked", async () => {
    // Arrange
    const user = userEvent.setup();

    const onSubmit = vi.fn();

    render(
      <RoomEditModal
        open={true}
        room={room}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    await user.selectOptions(
      screen.getByRole("combobox"),
      "Maintenance"
    );

    const input = screen.getByDisplayValue("6500");

    await user.clear(input);
    await user.type(input, "7000");

    // Act
    await user.click(
      screen.getByRole("button", {
        name: /save edit/i,
      })
    );

    // Assert
    expect(onSubmit).toHaveBeenCalledTimes(1);

    expect(onSubmit).toHaveBeenCalledWith({
      roomNumber: "Room 101",
      status: "Maintenance",
      tenant: "Maria Santos",
      rent: "7000",
    });
  });
});