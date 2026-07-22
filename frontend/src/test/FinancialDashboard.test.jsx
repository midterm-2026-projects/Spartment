import { render, screen, waitFor } from "@testing-library/react";

import { describe, it, expect, vi } from "vitest";

import FinancialDashboard from "../pages/FinancialDashboard.jsx";

vi.mock("../hooks/useFinancialDashboard.js", () => ({
  default: () => ({
    dashboard: {
      collectedRevenue: 50000,

      outstandingBalance: 30000,
    },

    loading: false,

    error: null,
  }),
}));

describe("Financial Dashboard", () => {
  it("should display financial dashboard", async () => {
    render(<FinancialDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Financial Dashboard/i)).toBeInTheDocument();
    });
  });
});
