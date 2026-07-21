import { render, screen, waitFor } from "@testing-library/react";

import { describe, it, expect } from "vitest";

import TenantDashboard from "../pages/TenantDashboard";

describe("Tenant Dashboard", () => {
  it("should display tenant information", async () => {
    render(<TenantDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Juan Dela Cruz")).toBeInTheDocument();
    });
  });

  it("should display payment history correctly", async () => {
    render(<TenantDashboard />);

    await waitFor(() => {
      expect(screen.getByText("7/20/2026")).toBeInTheDocument();

      expect(screen.getAllByText("₱5000")).toHaveLength(2);

      expect(screen.getAllByText("Cash")).toHaveLength(2);

      expect(screen.getAllByText("Paid")).toHaveLength(2);
    });
  });

  it("should display tenant risk information", async () => {
    render(<TenantDashboard />);

    await waitFor(() => {
      expect(screen.getByText("High Risk")).toBeInTheDocument();

      expect(
        screen.getByText("Repeated late payments detected."),
      ).toBeInTheDocument();
    });
  });
});
 