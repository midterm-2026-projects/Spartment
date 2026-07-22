import { beforeEach, describe, expect, it, vi } from "vitest";

/*
|--------------------------------------------------------------------------
| Tenant Model Mock
|--------------------------------------------------------------------------
*/

vi.mock("../model/tenantModel.js", () => ({
  getTenantById: vi.fn(),

  fetchTenants: vi.fn(),
}));

/*
|--------------------------------------------------------------------------
| Payment Model Mock
|--------------------------------------------------------------------------
*/

vi.mock("../model/paymentModel.js", () => ({
  getPaymentsByTenant: vi.fn(),

  getPayments: vi.fn(),
}));

/*
|--------------------------------------------------------------------------
| Risk Model Mock
|--------------------------------------------------------------------------
*/

vi.mock("../model/riskModel.js", () => ({
  createRiskRecord: vi.fn(async (data) => ({
    id: "risk-001",

    ...data,
  })),

  getRiskRecords: vi.fn().mockResolvedValue([]),

  getHighRiskRecords: vi.fn().mockResolvedValue([
    {
      tenantId: "tenant-001",

      riskLevel: "High",
    },
  ]),
}));

/*
|--------------------------------------------------------------------------
| Supabase Mock
|--------------------------------------------------------------------------
*/

vi.mock("../config/supabaseClient.js", () => {
  const supabase = {
    from: vi.fn(() => ({
      select() {
        return this;
      },

      eq() {
        return this;
      },

      maybeSingle: vi.fn().mockResolvedValue({
        data: null,

        error: null,
      }),

      insert() {
        return {
          select() {
            return {
              single: vi.fn().mockResolvedValue({
                data: {
                  id: "risk-001",
                },

                error: null,
              }),
            };
          },
        };
      },
    })),
  };

  return {
    supabase,

    default: supabase,
  };
});

import { getTenantById } from "../model/tenantModel.js";

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

  it("should detect high risk tenant due to late and pending payments", async () => {
    /*
        |--------------------------------------------------------------------------
        | Arrange
        |--------------------------------------------------------------------------
        */

    getTenantById.mockResolvedValue({
      id: "tenant-001",

      name: "Juan Cruz",

      status: "Active",
    });

    getPaymentsByTenant.mockResolvedValue([
      {
        amount: 10000,

        status: "Late",
      },

      {
        amount: 12000,

        status: "Late",
      },

      {
        amount: 15000,

        status: "Late",
      },

      {
        amount: 8000,

        status: "Pending",
      },

      {
        amount: 9000,

        status: "Pending",
      },

      {
        amount: 7000,

        status: "Pending",
      },
    ]);

    /*
        |--------------------------------------------------------------------------
        | Act
        |--------------------------------------------------------------------------
        */

    const result = await analyzeTenantRisk("tenant-001");

    /*
        |--------------------------------------------------------------------------
        | Assert
        |--------------------------------------------------------------------------
        */

    expect(result.riskLevel).toBe("High");

    expect(result.riskScore).toBe(60);

    expect(createRiskRecord).toHaveBeenCalled();
  });

  it("should detect low risk tenant when payments are updated", async () => {
    getTenantById.mockResolvedValue({
      id: "tenant-001",

      name: "Juan Cruz",

      status: "Active",
    });

    getPaymentsByTenant.mockResolvedValue([
      {
        amount: 5000,

        status: "Paid",
      },
    ]);

    const result = await analyzeTenantRisk("tenant-001");

    expect(result.riskLevel).toBe("Low");
  });

  it("should return low risk when no payment records exist", async () => {
    getTenantById.mockResolvedValue({
      id: "tenant-001",

      name: "Juan Cruz",

      status: "Active",
    });

    getPaymentsByTenant.mockResolvedValue([]);

    const result = await analyzeTenantRisk("tenant-001");

    expect(result.riskLevel).toBe("Low");

    expect(result.riskScore).toBe(0);
  });

  it("should retrieve high risk tenants", async () => {
    const result = await getHighRiskTenants();

    expect(getHighRiskRecords).toHaveBeenCalled();

    expect(result.length).toBeGreaterThan(0);
  });
});
