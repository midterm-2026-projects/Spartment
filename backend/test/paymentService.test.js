import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../model/paymentModel.js", () => ({
  getPaymentById: vi.fn(),

  updatePaymentStatus: vi.fn(),

  getPaymentsByTenant: vi.fn(),

  getPayments: vi.fn(),
}));

vi.mock("../service/billingService.js", () => ({
  updateBillingPaymentStatus: vi.fn(),
}));

import {
  confirmPayment,
  getPaymentHistory,
  getPaymentMetrics,
} from "../service/paymentService.js";

import {
  getPaymentById,
  updatePaymentStatus,
  getPaymentsByTenant,
  getPayments,
} from "../model/paymentModel.js";

import { updateBillingPaymentStatus } from "../service/billingService.js";

describe("Payment Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should confirm payment successfully", async () => {
    // Arrange

    getPaymentById.mockResolvedValue({
      id: 1,

      tenantId: 101,

      billingId: 50,

      amount: 5200,

      status: "Pending",
    });

    updatePaymentStatus.mockResolvedValue({
      id: 1,

      status: "Paid",

      paymentMethod: "Cash",
    });

    // Act

    const result = await confirmPayment(1);

    // Assert

    expect(getPaymentById).toHaveBeenCalledWith(1);

    expect(updatePaymentStatus).toHaveBeenCalledWith(
      1,

      expect.objectContaining({
        status: "Paid",
      }),
    );

    expect(updateBillingPaymentStatus).toHaveBeenCalledWith(
      50,

      "Paid",
    );

    expect(result.status).toBe("Paid");
  });

  it("should retrieve tenant payment history", async () => {
    // Arrange

    getPaymentsByTenant.mockResolvedValue([
      {
        id: 1,

        tenantId: 101,

        amount: 5200,

        status: "Paid",
      },
    ]);

    // Act

    const result = await getPaymentHistory(101);

    // Assert

    expect(getPaymentsByTenant).toHaveBeenCalledWith(101);

    expect(result).toHaveLength(1);
  });

  it("should calculate revenue metrics", async () => {
    // Arrange

    getPayments.mockResolvedValue([
      {
        amount: 5000,

        status: "Paid",
      },

      {
        amount: 2000,

        status: "Pending",
      },

      {
        amount: 1000,

        status: "Late",
      },
    ]);

    // Act

    const result = await getPaymentMetrics();

    // Assert

    expect(result.collectedRevenue).toBe(5000);

    expect(result.pendingPayments).toBe(1);

    expect(result.latePayments).toBe(1);
  });

  it("should retrieve payment history with late and pending payments", async () => {
    // Arrange

    getPaymentsByTenant.mockResolvedValue([
      {
        id: 1,
        tenantId: 101,
        amount: 5000,
        status: "Late",
      },

      {
        id: 2,
        tenantId: 101,
        amount: 5000,
        status: "Pending",
      },
    ]);

    // Act

    const result = await getPaymentHistory(101);

    // Assert

    expect(getPaymentsByTenant).toHaveBeenCalledWith(101);

    expect(result).toHaveLength(2);

    expect(result[0].status).toBe("Late");

    expect(result[1].status).toBe("Pending");
  });
});
