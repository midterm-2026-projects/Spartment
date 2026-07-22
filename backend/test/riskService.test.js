import { describe, it, expect, vi, beforeEach } from "vitest";

/*
|--------------------------------------------------------------------------
| Mock Tenant Model
|--------------------------------------------------------------------------
*/

vi.mock("../model/tenantModel.js", () => ({
  getTenantById: vi.fn(),
}));

/*
|--------------------------------------------------------------------------
| Mock Payment Model
|--------------------------------------------------------------------------
*/

vi.mock("../model/paymentModel.js", () => ({
  getPaymentsByTenant: vi.fn(),
}));

/*
|--------------------------------------------------------------------------
| Mock Risk Model
|--------------------------------------------------------------------------
*/

vi.mock("../model/riskModel.js", () => ({
  createRiskRecord: vi.fn(async (data) => ({
    id: "risk-001",

    ...data,
  })),

  getHighRiskRecords: vi.fn().mockResolvedValue([
    {
      tenantId: "tenant-001",

      riskLevel: "High",
    },
  ]),
}));

import { getTenantById } from "../model/tenantModel.js";

import { getPaymentsByTenant } from "../model/paymentModel.js";

import { createRiskRecord } from "../model/riskModel.js";

import {
  analyzeTenantRisk,
  getHighRiskTenants,
} from "../service/riskService.js";

describe("Risk Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should detect high-risk tenant with repeated late payments", async () => {
    /*
        Arrange
        */

    getTenantById.mockResolvedValue({
      id: "tenant-001",

      status: "Active",
    });

    getPaymentsByTenant.mockResolvedValue([
      {
        amount: 30000,

        remaining_balance: 30000,

        status: "Late",
      },

      {
        amount: 30000,

        remaining_balance: 30000,

        status: "Late",
      },

      {
        amount: 30000,

        remaining_balance: 30000,

        status: "Late",
      },

      {
        amount: 30000,

        remaining_balance: 30000,

        status: "Pending",
      },
    ]);

    /*
        Act
        */

    const result = await analyzeTenantRisk("tenant-001");

    /*
        Assert
        */

    expect(result.riskLevel).toBe("High");

    expect(result.riskScore).toBeGreaterThanOrEqual(70);

    expect(createRiskRecord).toHaveBeenCalled();
  });

  it("should detect unpaid balance correctly", async () => {
    /*
        Arrange
        */

    getTenantById.mockResolvedValue({
      id: "tenant-001",

      status: "Active",
    });

    getPaymentsByTenant.mockResolvedValue([
      {
        amount: 50000,

        remaining_balance: 50000,

        pending_amount: 50000,

        status: "Pending",
      },
    ]);

    /*
        Act
        */

    const result = await analyzeTenantRisk("tenant-001");

    /*
        Assert
        */

    expect(result.unpaidBalance).toBe(50000);
  });

  it("should generate low risk for good payment history", async () => {
    getTenantById.mockResolvedValue({
      id: "tenant-001",

      status: "Active",
    });

    getPaymentsByTenant.mockResolvedValue([
      {
        amount: 5000,

        remaining_balance: 0,

        status: "Paid",
      },
    ]);

    const result = await analyzeTenantRisk("tenant-001");

    expect(result.riskLevel).toBe("Low");
  });

  it("should retrieve high risk tenants", async () => {
    const result = await getHighRiskTenants();

    expect(result.length).toBeGreaterThan(0);

    expect(result[0].riskLevel).toBe("High");
  });
});
