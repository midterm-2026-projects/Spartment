import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../model/paymentModel.js", () => ({
  createPaymentRecord: vi.fn(),

  getPaymentsByTenant: vi.fn(),

  getPayments: vi.fn(),
}));

vi.mock("../model/paymentTransactionModel.js", () => ({
  createPaymentTransaction: vi.fn(),
}));

vi.mock("../config/supabaseClient.js", () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

import {
  createPaymentRecord,
  getPaymentsByTenant,
  getPayments,
} from "../model/paymentModel.js";

import { createPaymentTransaction } from "../model/paymentTransactionModel.js";

import {
  submitPayment,
  verifyPayment,
  getPaymentHistory,
  getPaymentMetrics,
} from "../service/paymentService.js";

import { supabase } from "../config/supabaseClient.js";

describe("Payment Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should save payment successfully", async () => {
    createPaymentRecord.mockResolvedValue({
      id: "payment-001",

      amount: 5000,

      verification_status: "Pending",
    });

    const result = await submitPayment({
      tenantId: "tenant-001",

      billingId: "billing-001",

      amount: 5000,

      paymentMethod: "GCash",

      paymentReference: "PAY-001",
    });

    expect(createPaymentRecord).toHaveBeenCalled();

    expect(result.verification_status).toBe("Pending");
  });

  it("should verify payment successfully", async () => {
    supabase.rpc.mockResolvedValue({
      data: {
        payment_id: "payment-001",

        status: "Verified",
      },

      error: null,
    });

    createPaymentTransaction.mockResolvedValue({
      id: "transaction-001",
    });

    const result = await verifyPayment(
      "payment-001",

      "admin-001",
    );

    expect(supabase.rpc).toHaveBeenCalledWith(
      "verify_payment",

      {
        p_payment_id: "payment-001",

        p_verified_by: "admin-001",
      },
    );

    expect(createPaymentTransaction).toHaveBeenCalled();

    expect(result.status).toBe("Verified");
  });

  it("should retrieve tenant payment history", async () => {
    getPaymentsByTenant.mockResolvedValue([
      {
        tenant_id: "tenant-001",

        amount: 5000,
      },
    ]);

    const result = await getPaymentHistory("tenant-001");

    expect(getPaymentsByTenant).toHaveBeenCalledWith("tenant-001");

    expect(result).toHaveLength(1);
  });

  it("should calculate revenue metrics", async () => {
    getPayments.mockResolvedValue([
      {
        amount: 5000,

        verification_status: "Verified",
      },

      {
        amount: 2000,

        verification_status: "Pending",
      },
    ]);

    const result = await getPaymentMetrics();

    expect(result.collectedRevenue).toBe(5000);

    expect(result.verifiedPayments).toBe(1);

    expect(result.pendingPayments).toBe(1);
  });
});
