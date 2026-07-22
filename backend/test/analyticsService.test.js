import { beforeEach, describe, expect, it, vi } from "vitest";

/*
|--------------------------------------------------------------------------
| Mock Billing Model
|--------------------------------------------------------------------------
*/

vi.mock("../model/billingModel.js", () => ({
  getBillingInformation: vi.fn(),
}));

/*
|--------------------------------------------------------------------------
| Mock Room Model
|--------------------------------------------------------------------------
*/

vi.mock("../model/roomModel.js", () => ({
  getRooms: vi.fn(),
}));

/*
|--------------------------------------------------------------------------
| Mock Tenant Model
|--------------------------------------------------------------------------
*/

vi.mock("../model/tenantModel.js", () => ({
  getTenants: vi.fn(),
}));

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

import { getBillingInformation } from "../model/billingModel.js";

import { getRooms } from "../model/roomModel.js";

import { getTenants } from "../model/tenantModel.js";

import { getRiskRecords } from "../model/riskModel.js";

import { getRecommendations } from "../model/recommendationModel.js";

import { fetchAnalyticsData } from "../service/analyticsService.js";

describe("Analytics Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    /*
  Default successful mocks
  */

    getRiskRecords.mockResolvedValue([]);

    getRecommendations.mockResolvedValue([]);
  });

  it("should calculate analytics successfully", async () => {
    getBillingInformation.mockResolvedValue([
      {
        id: 1,
        total_amount: 5000,
        paid_amount: 5000,
        status: "Paid",
        billing_period: "2026-01-01",
      },
      {
        id: 2,
        total_amount: 3000,
        paid_amount: 0,
        status: "Pending",
        billing_period: "2026-02-01",
      },
      {
        id: 3,
        total_amount: 2000,
        paid_amount: 0,
        status: "Overdue",
        billing_period: "2026-03-01",
      },
    ]);

    getRooms.mockResolvedValue([
      {
        id: 101,
        status: "Occupied",
      },
      {
        id: 102,
        status: "Occupied",
      },
      {
        id: 103,
        status: "Available",
      },
    ]);

    getTenants.mockResolvedValue([
      {
        id: 1,
        status: "Active",
      },
      {
        id: 2,
        status: "Active",
      },
    ]);

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
    ]);

    const result = await fetchAnalyticsData();

    expect(result.totalRevenue).toBe(5000);

    expect(result.forecastRevenue).toBe(10000);

    expect(result.totalTenants).toBe(2);

    expect(result.occupancyRate).toBe(66.7);

    expect(result.paymentStatus).toEqual({
      Paid: 1,
      Pending: 1,
      Overdue: 1,
    });

    expect(result.revenueTrend).toEqual([
      {
        month: "2026-01",
        forecast: 5000,
        actual: 5000,
      },
      {
        month: "2026-02",
        forecast: 3000,
        actual: 0,
      },
      {
        month: "2026-03",
        forecast: 2000,
        actual: 0,
      },
    ]);

    expect(result.recommendations).toHaveLength(1);
  });

  it("should return default analytics when no records exist", async () => {
    getBillingInformation.mockResolvedValue([]);

    getRooms.mockResolvedValue([]);

    getTenants.mockResolvedValue([]);

    getRiskRecords.mockResolvedValue([]);

    getRecommendations.mockResolvedValue([]);

    const result = await fetchAnalyticsData();

    expect(result.totalRevenue).toBe(0);

    expect(result.totalTenants).toBe(0);

    expect(result.occupancyRate).toBe(0);

    expect(result.paymentStatus).toEqual({});

    expect(result.recommendations).toEqual([]);
  });

  it("should throw error when billing retrieval fails", async () => {
    getBillingInformation.mockRejectedValue(new Error("Database Error"));

    await expect(fetchAnalyticsData()).rejects.toThrow(
      "Failed to retrieve analytics information.",
    );
  });

  it("should throw error when room retrieval fails", async () => {
    getBillingInformation.mockResolvedValue([]);

    getRooms.mockRejectedValue(new Error("Room Error"));

    await expect(fetchAnalyticsData()).rejects.toThrow(
      "Failed to retrieve analytics information.",
    );
  });

  it("should throw error when tenant retrieval fails", async () => {
    getBillingInformation.mockResolvedValue([]);

    getRooms.mockResolvedValue([]);

    getTenants.mockRejectedValue(new Error("Tenant Error"));

    await expect(fetchAnalyticsData()).rejects.toThrow(
      "Failed to retrieve analytics information.",
    );
  });
});
