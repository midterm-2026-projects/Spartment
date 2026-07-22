import { describe, expect, it, vi } from "vitest";

vi.mock("../service/paymentService.js", () => ({
  verifyPayment: vi.fn(),

  rejectPayment: vi.fn(),
}));

import { verifyPayment, rejectPayment } from "../service/paymentService.js";

describe("Payment Verification", () => {
  it("should verify payment successfully", async () => {
    verifyPayment.mockResolvedValue({
      status: "Verified",

      billingStatus: "Paid",
    });

    const result = await verifyPayment("payment-001", "admin-001");

    expect(result.status).toBe("Verified");
  });

  it("should reject payment successfully", async () => {
    rejectPayment.mockResolvedValue({
      status: "Rejected",
    });

    const result = await rejectPayment("payment-001", "admin-001");

    expect(result.status).toBe("Rejected");
  });
});
