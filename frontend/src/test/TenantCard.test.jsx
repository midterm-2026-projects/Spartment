import { describe, expect, it } from "vitest";

import { render, screen } from "@testing-library/react";

import TenantCard from "../components/TenantCard";

describe("TenantCard", () => {
  it("displays tenant information correctly", () => {
    const tenant = {
      id: "tenant-001",
      fullName: "John Doe",
      email: "john@email.com",
      status: "Active",
      moveInDate: "2026-07-20",

      room: {
        id: "room-001",
        roomNumber: "Room 101",
        monthlyRent: 5000,
      },
    };

    render(<TenantCard tenant={tenant} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();

    expect(screen.getByText("john@email.com")).toBeInTheDocument();

    expect(screen.getByText("Room 101")).toBeInTheDocument();

    expect(screen.getByText(/5,000/)).toBeInTheDocument();

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("supports snake_case tenant information", () => {
    const tenant = {
      id: "tenant-002",
      full_name: "Maria Santos",
      email: "maria@email.com",
      status: "Active",
      move_in_date: "2026-08-01",

      room: {
        id: "room-002",
        room_number: "Room 202",
        monthly_rent: 7500,
      },
    };

    render(<TenantCard tenant={tenant} />);

    expect(screen.getByText("Maria Santos")).toBeInTheDocument();

    expect(screen.getByText("maria@email.com")).toBeInTheDocument();

    expect(screen.getByText("Room 202")).toBeInTheDocument();

    expect(screen.getByText(/7,500/)).toBeInTheDocument();

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("displays fallback values when tenant data is missing", () => {
    const tenant = {
      id: "tenant-003",
      status: "Inactive",
      room: null,
    };

    render(<TenantCard tenant={tenant} />);

    expect(screen.getByText("Unknown tenant")).toBeInTheDocument();

    expect(screen.getByText("No email")).toBeInTheDocument();

    expect(screen.getByText("Not assigned")).toBeInTheDocument();

    expect(
      screen.getByText((content, element) => {
        const normalizedText = element?.textContent?.replace(/\s+/g, "").trim();

        return normalizedText === "MonthlyRent:₱0";
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Not available")).toBeInTheDocument();

    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });
});
