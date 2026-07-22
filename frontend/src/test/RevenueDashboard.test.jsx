import { render, screen, waitFor } from "@testing-library/react";

import { describe, it, expect, vi } from "vitest";

import RevenueDashboard from "../pages/RevenueDashboard.jsx";

import { getDashboardMetrics } from "../api/dashboardApi.js";

vi.mock("../api/dashboardApi.js", () => ({
  getDashboardMetrics: vi.fn(),
}));

describe("Revenue Dashboard", () => {
  it("should retrieve dashboard metrics successfully", async () => {
    getDashboardMetrics.mockResolvedValue({
      collectedRevenue: 50000,

      outstandingBalance: 30000,

      paymentRate: 85,
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

  it("should display error message", async () => {
    getDashboardMetrics.mockRejectedValue(new Error("Something went wrong."));

    render(<RevenueDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    });
  });
});
