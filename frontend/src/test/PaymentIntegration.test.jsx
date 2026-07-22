import { describe, it, expect } from "vitest";

import {
  confirmPayment,
  getPaymentHistory,
  getPaymentMetrics,
} from "../api/paymentApi.js";

describe("Payment API Integration", () => {
  it("should verify hand-to-hand payment", async () => {
    const result = await confirmPayment(1, {
      paymentMethod: "Cash",
    });

    expect(result.success).toBe(true);

    expect(result.data.payment_status).toBe("Paid");
  });

  it("should retrieve tenant payment history", async () => {
    const result = await getPaymentHistory(1);

    expect(result.success).toBe(true);

    expect(result.data).toHaveLength(1);
  });

  it("should retrieve payment metrics", async () => {
    const result = await getPaymentMetrics();

    expect(result.success).toBe(true);

    expect(result.data.collectedRevenue).toBe(50000);
  });
});
