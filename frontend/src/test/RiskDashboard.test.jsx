import { render, screen, waitFor } from "@testing-library/react";

import { describe, it, expect } from "vitest";

import RiskDashboard from "../pages/RiskDashboard.jsx";

describe("RiskDashboard", () => {
  it("should display risk monitoring page", async () => {
    render(<RiskDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Tenant Risk Monitoring/i)).toBeInTheDocument();
    });
  });

  it("should display high risk tenants", async () => {
    render(<RiskDashboard />);

    await waitFor(() => {
      expect(screen.getByText("High Risk Tenants")).toBeInTheDocument();
    });
  });
});
