import { describe, it, expect } from "vitest";

import {
  getAllBilling,
  getTenantBilling,
  generateBilling,
  updateBillingStatus,
} from "../api/billingApi.js";

describe("Billing API Integration", () => {
  it("should retrieve all billing records", async () => {
    const result = await getAllBilling();

    expect(result.success).toBe(true);

    expect(result.data).toHaveLength(1);

    expect(result.data[0].total_amount).toBe(6050);
  });

  it("should retrieve tenant billing", async () => {
    const result = await getTenantBilling(1);

    expect(result.success).toBe(true);

    expect(result.data.tenant_id).toBe(1);
  });

  it("should generate billing successfully", async () => {
    const result = await generateBilling({
      tenantId: 1,

      roomId: 101,

      totalAmount: 6050,
    });

    expect(result.success).toBe(true);

    expect(result.data.status).toBe("Unpaid");
  });

  it("should update billing status", async () => {
    const result = await updateBillingStatus(
      1,

      "Paid",
    );

    expect(result.success).toBe(true);

    expect(result.data.status).toBe("Paid");
  });
});
