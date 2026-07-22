import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import GuestRooms from "../pages/GuestRooms";
import useRooms from "../hooks/useRooms";
import useInquiry from "../hooks/useInquiry";

vi.mock("../hooks/useRooms", () => ({ default: vi.fn() }));
vi.mock("../hooks/useInquiry", () => ({ default: vi.fn() }));

describe("Guest room inquiry routing", () => {
  it("opens customer service with the selected room", async () => {
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
    const listener = vi.fn();
    window.addEventListener("spartment:room-inquiry", listener);

    render(<GuestRooms />);
    await userEvent.click(screen.getByRole("button", { name: /inquire/i }));

    expect(reset).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0].detail.room).toEqual(room);
    window.removeEventListener("spartment:room-inquiry", listener);
  });
});
