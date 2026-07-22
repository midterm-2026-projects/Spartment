import { describe, it, expect, beforeEach, vi } from "vitest";

/*
|--------------------------------------------------------------------------
| Mock Models
|--------------------------------------------------------------------------
*/

vi.mock("../model/paymentModel.js", () => ({
  getPaymentsByTenant: vi.fn(),

  getPayments: vi.fn(),
}));

vi.mock("../model/tenantModel.js", () => ({
  getTenantById: vi.fn(),

  getTenants: vi.fn(),
}));

vi.mock("../model/billingModel.js", () => ({
  fetchBillingRecords: vi.fn(),
}));

vi.mock("../model/roomModel.js", () => ({
  fetchRooms: vi.fn(),
}));

import { getPaymentsByTenant } from "../model/paymentModel.js";

import { getTenantById } from "../model/tenantModel.js";

import { fetchBillingRecords } from "../model/billingModel.js";

import { fetchRooms } from "../model/roomModel.js";

import {
  generateTenantRiskAssessment,
  generateSystemRiskAssessment,
} from "../service/riskAnalysisService.js";

describe("Risk Analysis Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /*
    |--------------------------------------------------------------------------
    | Tenant Risk Assessment
    |--------------------------------------------------------------------------
    */

  it("should generate high risk tenant assessment", async () => {
    /*
        Arrange
        */

    getPaymentsByTenant.mockResolvedValue([
      {
        status: "Late",

        verification_status: "Rejected",

        amount: 5000,
      },

      {
        status: "Late",

        verification_status: "Pending",

        amount: 3000,
      },

      {
        status: "Late",

        verification_status: "Pending",

        amount: 2000,
      },
    ]);

    getTenantById.mockResolvedValue({
      id: 101,

      status: "Inactive",
    });

    /*
        Act
        */

    const result = await generateTenantRiskAssessment(101);

    /*
        Assert
        */

    expect(result.tenantId).toBe(101);

    expect(result.riskLevel).toBe("High");

    expect(result.riskScore).toBeGreaterThanOrEqual(60);

    expect(result.latePayments).toBe(3);

    expect(result.unpaidBalance).toBe(5000);

    expect(result.riskCategory).toBe("Critical");
  });

  it("should generate medium risk tenant assessment", async () => {
    /*
        Arrange
        */

    getPaymentsByTenant.mockResolvedValue([
      {
        status: "Late",

        verification_status: "Verified",

        amount: 5000,
      },
    ]);

    getTenantById.mockResolvedValue({
      id: 101,

      status: "Active",
    });

    /*
        Act
        */

    const result = await generateTenantRiskAssessment(101);

    /*
        Assert
        */

    expect(result.riskLevel).toBe("Low");

    expect(result.riskScore).toBe(20);
  });

  it("should generate low risk tenant assessment when payment is normal", async () => {
    /*
        Arrange
        */

    getPaymentsByTenant.mockResolvedValue([
      {
        status: "Paid",

        verification_status: "Verified",

        amount: 5000,
      },
    ]);

    getTenantById.mockResolvedValue({
      id: 101,

      status: "Active",
    });

    /*
        Act
        */

    const result = await generateTenantRiskAssessment(101);

    /*
        Assert
        */

    expect(result.riskLevel).toBe("Low");

    expect(result.riskCategory).toBe("Stable");

    expect(result.indicators[0].condition).toBe("No Risk Detected");
  });

  it("should throw error when tenant does not exist", async () => {
    /*
        Arrange
        */

    getPaymentsByTenant.mockResolvedValue([]);

    getTenantById.mockResolvedValue(null);

    /*
        Act + Assert
        */

    await expect(generateTenantRiskAssessment(999)).rejects.toThrow(
      "Tenant not found.",
    );
  });

  /*
    |--------------------------------------------------------------------------
    | System Risk Assessment
    |--------------------------------------------------------------------------
    */

  it("should generate system risk assessment", async () => {
    /*
        Arrange
        */

    fetchRooms.mockResolvedValue([
      {
        id: 1,

        status: "Available",
      },

      {
        id: 2,

        status: "Occupied",
      },
    ]);

    fetchBillingRecords.mockResolvedValue([
      {
        id: 1,

        status: "Overdue",
      },
    ]);

    /*
        Act
        */

    const result = await generateSystemRiskAssessment();

    /*
        Assert
        */

    expect(result.riskScore).toBe(50);

    expect(result.riskLevel).toBe("Medium");

    expect(result.riskCategory).toBe("Warning");

    expect(result.indicators).toHaveLength(2);
  });

  it("should generate low system risk when no issues exist", async () => {
    /*
        Arrange
        */

    fetchRooms.mockResolvedValue([
      {
        id: 1,

        status: "Occupied",
      },
    ]);

    fetchBillingRecords.mockResolvedValue([
      {
        id: 1,

        status: "Paid",
      },
    ]);

    /*
        Act
        */

    const result = await generateSystemRiskAssessment();

    /*
        Assert
        */

    expect(result.riskScore).toBe(0);

    expect(result.riskLevel).toBe("Low");

    expect(result.riskCategory).toBe("Stable");
  });
});
