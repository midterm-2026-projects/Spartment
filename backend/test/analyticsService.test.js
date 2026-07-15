import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

vi.mock(
  "../model/billingModel.js",
  () => ({
    fetchBillingRecords: vi.fn(),
  })
);

vi.mock(
  "../model/roomModel.js",
  () => ({
    fetchRooms: vi.fn(),
  })
);

vi.mock(
  "../model/tenantModel.js",
  () => ({
    fetchTenants: vi.fn(),
  })
);

import {
  fetchBillingRecords,
} from "../model/billingModel.js";

import {
  fetchRooms,
} from "../model/roomModel.js";

import {
  fetchTenants,
} from "../model/tenantModel.js";

import {
  fetchAnalyticsData,
} from "../service/analyticsService.js";


describe("Analytics Service", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("should calculate analytics successfully", async () => {

    fetchBillingRecords.mockResolvedValue([
      {
        id: 1,
        amount: 5000,
        status: "Paid",
        month: "January",
      },
      {
        id: 2,
        amount: 3000,
        status: "Pending",
        month: "February",
      },
      {
        id: 3,
        amount: 2000,
        status: "Overdue",
        month: "March",
      },
    ]);

    fetchRooms.mockResolvedValue([
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
        status: "Vacant",
      },
    ]);

    fetchTenants.mockResolvedValue([
      {
        id: 1,
        name: "Maria Santos",
      },
      {
        id: 2,
        name: "Juan Cruz",
      },
    ]);


    const result =
      await fetchAnalyticsData();


    expect(
      result.totalRevenue
    ).toBe(10000);

    expect(
      result.occupancyRate
    ).toBe(66.67);

    expect(
      result.totalTenants
    ).toBe(2);

    expect(
      result.paymentStatus
    ).toEqual({
      paid: 1,
      pending: 1,
      overdue: 1,
    });

    expect(
      result.revenueTrend
    ).toEqual([
      {
        month: "January",
        amount: 5000,
      },
      {
        month: "February",
        amount: 3000,
      },
      {
        month: "March",
        amount: 2000,
      },
    ]);

  });


  it("should return default analytics when no records exist", async () => {

    fetchBillingRecords.mockResolvedValue([]);

    fetchRooms.mockResolvedValue([]);

    fetchTenants.mockResolvedValue([]);


    const result =
      await fetchAnalyticsData();


    expect(
      result.totalRevenue
    ).toBe(0);

    expect(
      result.occupancyRate
    ).toBe(0);

    expect(
      result.totalTenants
    ).toBe(0);

    expect(
      result.paymentStatus
    ).toEqual({
      paid: 0,
      pending: 0,
      overdue: 0,
    });

  });


  it("should throw error when billing retrieval fails", async () => {

    fetchBillingRecords.mockRejectedValue(
      new Error("Database Error")
    );


    await expect(
      fetchAnalyticsData()
    ).rejects.toThrow(
      "Failed to retrieve analytics information."
    );

  });


  it("should throw error when room retrieval fails", async () => {

    fetchBillingRecords.mockResolvedValue([]);

    fetchRooms.mockRejectedValue(
      new Error("Room Database Error")
    );


    await expect(
      fetchAnalyticsData()
    ).rejects.toThrow(
      "Failed to retrieve analytics information."
    );

  });


  it("should throw error when tenant retrieval fails", async () => {

    fetchBillingRecords.mockResolvedValue([]);

    fetchRooms.mockResolvedValue([]);

    fetchTenants.mockRejectedValue(
      new Error("Tenant Database Error")
    );


    await expect(
      fetchAnalyticsData()
    ).rejects.toThrow(
      "Failed to retrieve analytics information."
    );

  });

});