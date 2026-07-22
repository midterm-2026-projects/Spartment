import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../model/billingModel.js", () => ({
  createBillingRecord: vi.fn(),

  getBillingInformation: vi.fn(),

  getTenantBilling: vi.fn(),

  getBillingById: vi.fn(),

  updateBillingRecord: vi.fn(),
}));

import {
  createBillingRecord,
  getBillingInformation,
  getTenantBilling,
  updateBillingRecord,
} from "../model/billingModel.js";

import {
  generateBilling,
  fetchBillingInformation,
  getBillingByTenant,
  updateBillingPaymentStatus,
} from "../service/billingService.js";

describe("Billing Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create billing record successfully", async () => {
    createBillingRecord.mockResolvedValue({
      id: "billing-001",

      tenant_id: "tenant-001",

      total_amount: 6500,

      status: "Unpaid",
    });

    const result = await generateBilling({
      tenantId: "tenant-001",

      roomId: "room-001",

      billingType: "Rent",

      totalAmount: 6500,

      billingPeriod: "2026-01-01",

      dueDate: "2026-01-15",
    });

    expect(createBillingRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId: "tenant-001",

        roomId: "room-001",

        totalAmount: 6500,

        status: "Unpaid",
      }),
    );

    expect(result.total_amount).toBe(6500);
  });

  it("should retrieve all billing records", async () => {
    getBillingInformation.mockResolvedValue([
      {
        id: "billing-001",

        status: "Paid",
      },
    ]);

    const result = await fetchBillingInformation();

    expect(result).toHaveLength(1);

    expect(getBillingInformation).toHaveBeenCalled();
  });

  it("should retrieve tenant billing history", async () => {
    getTenantBilling.mockResolvedValue([
      {
        tenant_id: "tenant-001",

        status: "Unpaid",
      },
    ]);

    const result = await getBillingByTenant("tenant-001");

    expect(getTenantBilling).toHaveBeenCalledWith("tenant-001");

    expect(result[0].tenant_id).toBe("tenant-001");
  });

  it("should update billing status", async () => {
    updateBillingRecord.mockResolvedValue({
      id: "billing-001",

      status: "Paid",
    });

    const result = await updateBillingPaymentStatus(
      "billing-001",

      "Paid",
    );

    expect(updateBillingRecord).toHaveBeenCalledWith(
      "billing-001",

      {
        status: "Paid",
      },
    );

    expect(result.status).toBe("Paid");
  });
});
