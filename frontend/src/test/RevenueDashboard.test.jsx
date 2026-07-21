import { render, screen, waitFor } from "@testing-library/react";

import { describe, it, expect, vi } from "vitest";

import RevenueDashboard from "../pages/RevenueDashboard";

import { getDashboardMetrics } from "../api/dashboardApi";

vi.mock("../api/dashboardApi", () => ({
  getDashboardMetrics: vi.fn(),
}));

describe("Revenue Dashboard", () => {
  it("should retrieve dashboard KPI metrics from backend successfully", async () => {
    getDashboardMetrics.mockResolvedValue({
      collectedRevenue: 50000,

      pendingPayments: 5,

      latePayments: 2,
    });

    render(<RevenueDashboard />);

    await waitFor(() => {
      expect(getDashboardMetrics).toHaveBeenCalled();
    });
  });

  it("should display KPI values correctly", async () => {
    getDashboardMetrics.mockResolvedValue({
      collectedRevenue: 50000,

      pendingPayments: 5,

      latePayments: 2,
    });

    render(<RevenueDashboard />);

    await waitFor(() => {
      expect(screen.getByText("₱50000")).toBeInTheDocument();

      expect(screen.getByText("5")).toBeInTheDocument();

      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  it("should display error message when API fails", async () => {
    getDashboardMetrics.mockRejectedValue(new Error("Something went wrong."));

    render(<RevenueDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    });
  });
});
