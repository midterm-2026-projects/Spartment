import { beforeEach, describe, expect, it, vi } from "vitest";

/*
|--------------------------------------------------------------------------
| Mock Payment Model
|--------------------------------------------------------------------------
*/

vi.mock("../model/paymentModel.js", () => ({
  getPaymentsByTenant: vi.fn(),

  getPayments: vi.fn(),
}));

/*
|--------------------------------------------------------------------------
| Mock Risk Model
|--------------------------------------------------------------------------
*/

vi.mock("../model/riskModel.js", () => ({
  createRiskRecord: vi.fn(),

  getHighRiskRecords: vi.fn(),
}));

import { getPaymentsByTenant } from "../model/paymentModel.js";

import { createRiskRecord, getHighRiskRecords } from "../model/riskModel.js";

import {
  analyzeTenantRisk,
  getHighRiskTenants,
} from "../service/riskService.js";

describe("Risk Detection Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /*
    |--------------------------------------------------------------------------
    | Analyze Tenant Risk
    |--------------------------------------------------------------------------
    */

  it("should detect high risk tenant due to late and pending payments", async () => {
    // Arrange

    getPaymentsByTenant.mockResolvedValue([
      {
        id: "payment-001",

        amount: 5000,

        status: "Late",
      },

      {
        id: "payment-002",

        amount: 5000,

        status: "Pending",
      },

      {
        id: "payment-003",

        amount: 3000,

        status: "Late",
      },
    ]);

    createRiskRecord.mockResolvedValue({
      tenantId: "tenant-001",

      riskLevel: "High",

      latePayments: 2,

      unpaidBalance: 5000,

      indicators: ["2 late payment(s) detected", "Outstanding balance of 5000"],
    });

    // Act

    const result = await analyzeTenantRisk("tenant-001");

    // Assert

    expect(getPaymentsByTenant).toHaveBeenCalledWith("tenant-001");

    expect(createRiskRecord).toHaveBeenCalled();

    expect(result.riskLevel).toBe("High");
  });

  /*
    |--------------------------------------------------------------------------
    | Analyze Low Risk Tenant
    |--------------------------------------------------------------------------
    */

  it("should detect low risk tenant when payments are updated", async () => {
    // Arrange

    getPaymentsByTenant.mockResolvedValue([
      {
        id: "payment-001",

        amount: 5000,

        status: "Paid",
      },
    ]);

    createRiskRecord.mockResolvedValue({
      tenantId: "tenant-001",

      riskLevel: "Low",

      indicators: ["Payments are up to date."],
    });

    // Act

    const result = await analyzeTenantRisk("tenant-001");

    // Assert

    expect(result.riskLevel).toBe("Low");
  });

  /*
    |--------------------------------------------------------------------------
    | No Payment Records
    |--------------------------------------------------------------------------
    */

  it("should throw error when no payment records exist", async () => {
    // Arrange

    getPaymentsByTenant.mockResolvedValue([]);

    // Act + Assert

    await expect(analyzeTenantRisk("tenant-001")).rejects.toThrow(
      "No payment records found.",
    );
  });

  /*
    |--------------------------------------------------------------------------
    | Get High Risk Tenants
    |--------------------------------------------------------------------------
    */

  it("should retrieve high risk tenants", async () => {
    // Arrange

    getHighRiskRecords.mockResolvedValue([
      {
        tenantId: "tenant-001",

        riskLevel: "High",
      },
    ]);

    // Act

    const result = await getHighRiskTenants();

    // Assert

    expect(getHighRiskRecords).toHaveBeenCalled();

    expect(result).toHaveLength(1);
  });
});
