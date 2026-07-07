import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RoomListHeader from "../components/RoomListHeader";

describe("RoomListHeader", () => {
  it("should render the Room List Header and Sub-Header correctly", () => {
    // Arrange
    render(<RoomListHeader />);

    // Assert
    expect(
      screen.getByRole("heading", {
        name: /room list/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/view and manage all apartment rooms/i)
    ).toBeInTheDocument();
  });
});