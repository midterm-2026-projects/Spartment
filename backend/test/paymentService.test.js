import { beforeEach, describe, expect, it, vi } from "vitest";

/*
|--------------------------------------------------------------------------
| Mock Payment Model
|--------------------------------------------------------------------------
*/

vi.mock("../model/paymentModel.js", () => ({
  createPaymentRecord: vi.fn(),

  getPaymentsByTenant: vi.fn(),

  getPayments: vi.fn(),
}));

/*
|--------------------------------------------------------------------------
| Mock Transaction Model
|--------------------------------------------------------------------------
*/

vi.mock("../model/paymentTransactionModel.js", () => ({
  createPaymentTransaction: vi.fn(),
}));

/*
|--------------------------------------------------------------------------
| Mock DSS Refresh
|--------------------------------------------------------------------------
*/

vi.mock("../service/dssRefreshService.js", () => ({
  refreshTenantDSS: vi.fn(),
}));

/*
|--------------------------------------------------------------------------
| Supabase Mock
|--------------------------------------------------------------------------
*/

const { rpcMock, fromMock } = vi.hoisted(() => ({
  rpcMock: vi.fn(),

  fromMock: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({
          data: {
            tenant_id: "tenant-001",
          },

          error: null,
        }),
      })),
    })),
  })),
}));

vi.mock("../config/supabaseClient.js", () => ({
  default: {
    rpc: rpcMock,
    from: fromMock,
  },

  supabase: {
    rpc: rpcMock,
    from: fromMock,
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
  rejectPayment,
  getPaymentHistory,
  getPaymentMetrics,
} from "../service/paymentService.js";

import { supabase } from "../config/supabaseClient.js";

describe("Payment Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should submit payment successfully", async () => {
    createPaymentRecord.mockResolvedValue({
      id: "payment-001",

      verification_status: "Pending",
    });

    const result = await submitPayment({
      tenantId: "tenant-001",

      billingId: "billing-001",

      amount: 6500,

      paymentMethod: "GCash",

      paymentReference: "PAY-001",
    });

    expect(createPaymentRecord).toHaveBeenCalled();

    expect(result.verification_status).toBe("Pending");
  });

  it("should verify payment successfully", async () => {
    rpcMock.mockResolvedValue({
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

  it("should reject payment successfully", async () => {
    rpcMock.mockResolvedValue({
      data: {
        payment_id: "payment-001",

        status: "Rejected",
      },

      error: null,
    });

    const result = await rejectPayment(
      "payment-001",

      "admin-001",
    );

    expect(supabase.rpc).toHaveBeenCalledWith(
      "reject_payment",

      {
        p_payment_id: "payment-001",

        p_rejected_by: "admin-001",
      },
    );

    expect(result.status).toBe("Rejected");
  });

  it("should return payment history", async () => {
    getPaymentsByTenant.mockResolvedValue([
      {
        id: "payment-001",

        tenant_id: "tenant-001",
      },
    ]);

    const result = await getPaymentHistory("tenant-001");

    expect(result).toHaveLength(1);
  });

  it("should calculate revenue metrics correctly", async () => {
    getPayments.mockResolvedValue([
      {
        amount: 5000,

        verification_status: "Verified",
      },

      {
        amount: 3000,

        verification_status: "Pending",
      },

      {
        amount: 2000,

        verification_status: "Rejected",
      },
    ]);

    const result = await getPaymentMetrics();

    expect(result.collectedRevenue).toBe(5000);

    expect(result.verifiedPayments).toBe(1);

    expect(result.pendingPayments).toBe(1);

    expect(result.rejectedPayments).toBe(1);
  });
});
