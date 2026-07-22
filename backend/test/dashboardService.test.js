import { beforeEach, describe, expect, it, vi } from "vitest";

/*
|--------------------------------------------------------------------------
| Mock Risk Model
|--------------------------------------------------------------------------
*/

vi.mock("../model/riskModel.js", () => ({
  getRiskRecords: vi.fn(),
}));

/*
|--------------------------------------------------------------------------
| Mock Recommendation Model
|--------------------------------------------------------------------------
*/

vi.mock("../model/recommendationModel.js", () => ({
  getRecommendations: vi.fn(),
}));

import { getRiskRecords } from "../model/riskModel.js";

import { getRecommendations } from "../model/recommendationModel.js";

import { fetchDashboardMetrics } from "../service/dashboardService.js";

describe("Dashboard Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getRiskRecords.mockResolvedValue([
      {
        riskLevel: "High",
      },
      {
        riskLevel: "Low",
      },
    ]);

    getRecommendations.mockResolvedValue([
      {
        status: "Active",
        priority: "High",
      },
      {
        status: "Inactive",
        priority: "Medium",
      },
    ]);
  });

  it("should calculate monthly revenue successfully", async () => {
    const payments = [
      {
        amount: 25000,
        status: "Paid",
      },
      {
        amount: 30000,
        status: "Paid",
      },
      {
        amount: 35000,
        status: "Paid",
      },
      {
        amount: 35000,
        status: "Late",
      },
    ];

    const result = await fetchDashboardMetrics({
      rooms: [],

      tenants: [],

      payments,
    });

    expect(result.monthlyRevenue).toBe("₱125,000");
  });

  it("should calculate occupancy rate successfully", async () => {
    const rooms = [
      ...Array.from(
        {
          length: 19,
        },
        () => ({
          status: "Occupied",
        }),
      ),

      {
        status: "Vacant",
      },
    ];

    const result = await fetchDashboardMetrics({
      rooms,

      tenants: [],

      payments: [],
    });

    expect(result.occupancy).toBe("95%");
  });

  it("should calculate active tenants successfully", async () => {
    const tenants = Array.from(
      {
        length: 32,
      },
      () => ({
        status: "Active",
      }),
    );

    const result = await fetchDashboardMetrics({
      rooms: [],

      tenants,

      payments: [],
    });

    expect(result.activeTenants).toBe(32);
  });

  it("should calculate late payments successfully", async () => {
    const payments = [
      {
        amount: 25000,
        status: "Paid",
      },

      {
        amount: 30000,
        status: "Late",
      },

      {
        amount: 35000,
        status: "Paid",
      },

      {
        amount: 35000,
        status: "Late",
      },
    ];

    const result = await fetchDashboardMetrics({
      rooms: [],

      tenants: [],

      payments,
    });

    expect(result.latePayments).toBe(2);
  });

  it("should return all dashboard metrics successfully", async () => {
    const rooms = [
      ...Array.from(
        {
          length: 19,
        },
        () => ({
          status: "Occupied",
        }),
      ),

      {
        status: "Vacant",
      },
    ];

    const tenants = Array.from(
      {
        length: 32,
      },
      () => ({
        status: "Active",
      }),
    );

    const payments = [
      {
        amount: 25000,
        status: "Paid",
      },

      {
        amount: 30000,
        status: "Paid",
      },

      {
        amount: 35000,
        status: "Paid",
      },

      {
        amount: 35000,
        status: "Late",
      },
    ];

    const result = await fetchDashboardMetrics({
      rooms,

      tenants,

      payments,
    });

    expect(result).toEqual({
      monthlyRevenue: "₱125,000",

      occupancy: "95%",

      activeTenants: 32,

      latePayments: 1,

      riskSummary: {
        total: 2,
        high: 1,
        medium: 0,
        low: 1,
      },

      recommendationSummary: {
        total: 2,
        active: 1,
        highPriority: 1,
        mediumPriority: 1,
        lowPriority: 0,
      },
    });
  });
});
