import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TenantInfoCards from "../components/TenantInfoCards";

describe("TenantInfoCards", () => {
  const room = {
    roomNumber: "Room 201",
    monthlyRent: "₱7,500",
    nextDue: "August 5, 2026",
  };

  it("should render the My Room, Monthly Rent, and Next Due cards", () => {
    // Arrange
    render(<TenantInfoCards room={room} />);

    // Assert
    expect(screen.getByText(/my room/i)).toBeInTheDocument();
    expect(screen.getByText(/monthly rent/i)).toBeInTheDocument();
    expect(screen.getByText(/next due/i)).toBeInTheDocument();
  });

  it("should display the provided card values correctly", () => {
    // Arrange
    render(<TenantInfoCards room={room} />);

    // Assert
    expect(screen.getByText("Room 201")).toBeInTheDocument();
    expect(screen.getByText("₱7,500")).toBeInTheDocument();
    expect(screen.getByText("August 5, 2026")).toBeInTheDocument();
  });

  it("should display 0 when card values are not provided", () => {
    // Arrange
    render(
      <TenantInfoCards
        room={{
          roomNumber: "",
          monthlyRent: "",
          nextDue: "",
        }}
      />
    );

    // Assert
    const zeros = screen.getAllByText("0");
    expect(zeros).toHaveLength(3);
  });
});