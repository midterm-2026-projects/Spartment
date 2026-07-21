import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import TenantInfoCards from "../components/TenantInfoCards";

describe("TenantInfoCards", () => {
  it("displays room, rent, due date, and risk values", () => {
    render(
      <TenantInfoCards
        tenant={{
          id: "tenant-001",
          fullName: "Juan Dela Cruz",
        }}
        room={{
          id: "room-001",
          roomNumber: "Room 201",
          monthlyRent: 7500,
        }}
        billing={{
          id: "billing-001",
          dueDate: "August 5, 2026",
          totalAmount: 7500,
          status: "Pending",
        }}
        risk={{
          riskLevel: "High",
        }}
      />,
    );

    expect(screen.getByText("Room 201")).toBeInTheDocument();

    expect(screen.getByText(/7,500/)).toBeInTheDocument();

    expect(screen.getByText("August 5, 2026")).toBeInTheDocument();

    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("supports snake_case values", () => {
    render(
      <TenantInfoCards
        room={{
          room_number: "Room 301",
          monthly_rent: 6200,
        }}
        billing={{
          due_date: "September 5, 2026",
        }}
        risk={{
          risk_level: "Medium",
        }}
      />,
    );

    expect(screen.getByText("Room 301")).toBeInTheDocument();

    expect(screen.getByText(/6,200/)).toBeInTheDocument();

    expect(screen.getByText("September 5, 2026")).toBeInTheDocument();
  });

  it("displays fallback values when information is missing", () => {
    render(
      <TenantInfoCards tenant={null} room={null} billing={null} risk={null} />,
    );

    expect(screen.getByText("Not assigned")).toBeInTheDocument();

    expect(screen.getByText(/₱0/)).toBeInTheDocument();

    expect(screen.getByText("No billing record")).toBeInTheDocument();

    expect(screen.getByText("Low")).toBeInTheDocument();
  });
});
