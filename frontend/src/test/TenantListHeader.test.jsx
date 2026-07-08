import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TenantListHeader from "../components/TenantListHeader";

describe("TenantListHeader", () => {
  it("should render the Tenant List Header and Sub-Header correctly", () => {
    // Arrange
    render(<TenantListHeader />);

    // Assert
    expect(
      screen.getByRole("heading", {
        name: /tenant list/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/view and manage all registered tenants/i)
    ).toBeInTheDocument();
  });
});