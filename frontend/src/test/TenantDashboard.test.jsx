import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";

import TenantDashboard from "../pages/TenantDashboard";

import { getTenantInformation } from "../api/tenantApi";

import { useTenantRisk } from "../hooks/useRiskAnalysis";

vi.mock("../api/tenantApi", () => ({
  getTenantInformation: vi.fn(),
}));

vi.mock("../hooks/useRiskAnalysis", () => ({
  useTenantRisk: vi.fn(),
}));

const tenantId = "11111111-1111-4111-8111-111111111111";

const tenantResponse = {
  success: true,

  data: {
    tenant: {
      id: tenantId,
      fullName: "Juan Dela Cruz",
      email: "juan@email.com",
      contact: "09123456789",
      status: "Active",
      moveInDate: "2026-07-01",
    },

    room: {
      id: "room-001",
      roomNumber: "Room 101",
      monthlyRent: 6500,
    },

    billing: {
      id: "billing-001",
      totalAmount: 6500,
      dueDate: "August 5, 2026",
      status: "Pending",
    },

    payments: [
      {
        id: "payment-001",
        amount: 6500,
        paymentDate: "7/20/2026",
        paymentMethod: "Cash",
        status: "Paid",
      },
    ],
  },
};

describe("Tenant Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getTenantInformation.mockResolvedValue(tenantResponse);

    useTenantRisk.mockReturnValue({
      risk: {
        riskLevel: "High Risk",
        indicators: ["One overdue payment"],
      },

      loading: false,
      error: "",
    });
  });

  it("requests tenant information using the supplied UUID", async () => {
    render(<TenantDashboard tenantId={tenantId} />);

    await waitFor(() => {
      expect(getTenantInformation).toHaveBeenCalledWith(tenantId);
    });
  });

  it("displays tenant information", async () => {
    render(<TenantDashboard tenantId={tenantId} />);

    expect(await screen.findByText("Juan Dela Cruz")).toBeInTheDocument();

    expect(screen.getByText("09123456789")).toBeInTheDocument();

    expect(screen.getByText("juan@email.com")).toBeInTheDocument();

    expect(screen.getByText("Room 101")).toBeInTheDocument();

    expect(screen.getByText("₱6,500")).toBeInTheDocument();

    expect(screen.getByText("August 5, 2026")).toBeInTheDocument();
  });

  it("displays payment history", async () => {
    render(<TenantDashboard tenantId={tenantId} />);

    expect(await screen.findByText("7/20/2026")).toBeInTheDocument();

    expect(screen.getByText("Cash")).toBeInTheDocument();

    expect(screen.getByText("Paid")).toBeInTheDocument();

    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === "td" &&
          content.replace(/\s/g, "").includes("₱6500")
        );
      }),
    ).toBeInTheDocument();
  });

  it("displays tenant risk information", async () => {
    render(<TenantDashboard tenantId={tenantId} />);

    expect(await screen.findAllByText("High Risk")).toHaveLength(2);

    expect(screen.getByText("One overdue payment")).toBeInTheDocument();
  });

  it("displays risk loading state", async () => {
    useTenantRisk.mockReturnValue({
      risk: null,
      loading: true,
      error: "",
    });

    render(<TenantDashboard tenantId={tenantId} />);

    expect(
      await screen.findByText(/loading risk analysis/i),
    ).toBeInTheDocument();
  });

  it("displays the tenant request error", async () => {
    getTenantInformation.mockRejectedValue(
      new Error("Failed to load tenant information."),
    );

    render(<TenantDashboard tenantId={tenantId} />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Failed to load tenant information.",
    );
  });

  it("displays an error when no tenant ID exists", async () => {
    localStorage.removeItem("tenantId");
    localStorage.removeItem("user");

    render(<TenantDashboard tenantId="" />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Tenant ID was not found",
    );

    expect(getTenantInformation).not.toHaveBeenCalled();
  });
});
