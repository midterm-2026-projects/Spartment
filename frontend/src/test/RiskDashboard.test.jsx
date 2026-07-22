import { render, screen } from "@testing-library/react";

import { describe, it, expect, vi } from "vitest";

import RiskDashboard from "../pages/RiskDashboard.jsx";

vi.mock("../hooks/useRiskAnalysis", () => ({
  useHighRiskTenants: vi.fn(),
}));

import { useHighRiskTenants } from "../hooks/useRiskAnalysis";

describe("RiskDashboard", () => {
  it("should display loading state", () => {
    useHighRiskTenants.mockReturnValue({
      tenants: [],

      loading: true,

      error: null,

      reload: vi.fn(),
    });

    render(<RiskDashboard />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should display error state", () => {
    useHighRiskTenants.mockReturnValue({
      tenants: [],

      loading: false,

      error: "Failed to retrieve high risk tenants.",

      reload: vi.fn(),
    });

    render(<RiskDashboard />);

    expect(
      screen.getByText("Failed to retrieve high risk tenants."),
    ).toBeInTheDocument();
  });

  it("should display empty state when no high risk tenants exist", () => {
    useHighRiskTenants.mockReturnValue({
      tenants: [],

      loading: false,

      error: null,

      reload: vi.fn(),
    });

    render(<RiskDashboard />);

    expect(screen.getByText(/No records found/i)).toBeInTheDocument();
  });

  it("should display high risk tenants successfully", () => {
    useHighRiskTenants.mockReturnValue({
      tenants: [
        {
          id: "risk-001",

          tenantId: "tenant-001",

          riskLevel: "High",

          latePayments: 5,

          unpaidBalance: 50000,

          indicators: ["Repeated late payments", "Unpaid balance"],
        },
      ],

      loading: false,

      error: null,

      reload: vi.fn(),
    });

    render(<RiskDashboard />);

    expect(screen.getByText("Tenant Risk Monitoring")).toBeInTheDocument();

    expect(screen.getByText("High Risk Tenants")).toBeInTheDocument();

    expect(screen.getByText("tenant-001")).toBeInTheDocument();

    expect(screen.getByText("Repeated late payments")).toBeInTheDocument();
  });
});
