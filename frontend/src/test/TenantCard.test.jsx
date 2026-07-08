import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TenantCard from "../components/TenantCard";

describe("TenantCard", () => {
  const tenant = {
    name: "John Doe",
    email: "john@email.com",
    room: "Room 101",
    rent: "₱5,000",
  };

  it("should render the tenant card", () => {
    // Arrange
    render(<TenantCard tenant={tenant} />);

    // Assert
    expect(screen.getByText(tenant.name)).toBeInTheDocument();
  });

  it("should display each tenant's name, email, room number, and rent price correctly", () => {
    // Arrange
    render(<TenantCard tenant={tenant} />);

    // Assert
    expect(screen.getByText(tenant.name)).toBeInTheDocument();
    expect(screen.getByText(tenant.email)).toBeInTheDocument();
    expect(screen.getByText(tenant.room)).toBeInTheDocument();
    expect(screen.getByText(tenant.rent)).toBeInTheDocument();
  });
});