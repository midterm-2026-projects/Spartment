import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import GuestRooms from "../pages/GuestRooms";
import useRooms from "../hooks/useRooms";
import useInquiry from "../hooks/useInquiry";

vi.mock("../hooks/useRooms", () => ({ default: vi.fn() }));
vi.mock("../hooks/useInquiry", () => ({ default: vi.fn() }));

describe("Guest room inquiry routing", () => {
  it("opens the inquiry form with the selected room", async () => {
    const room = {
      id: "room-101",
      roomNumber: "101",
      floor: 1,
      monthlyRent: 5000,
      status: "Available",
    };
    const reset = vi.fn();
    useRooms.mockReturnValue({ rooms: [room], loading: false, error: "", refetch: vi.fn() });
    useInquiry.mockReturnValue({ createInquiry: vi.fn(), loading: false, error: "", success: "", reset });
    render(<GuestRooms />);
    await userEvent.click(screen.getByRole("button", { name: /inquire/i }));

    expect(reset).toHaveBeenCalledOnce();
    expect(screen.getByLabelText(/preferred move-in date/i)).toBeVisible();
    expect(screen.getByLabelText(/preferred room/i)).toHaveValue(room.id);
  });
});
