import { describe, it, expect, vi } from "vitest";

/*
|--------------------------------------------------------------------------
| Mock Payment Service
|--------------------------------------------------------------------------
*/

vi.mock("../service/paymentService.js", () => ({
  submitPayment: vi.fn(),

  verifyPayment: vi.fn(),

  rejectPayment: vi.fn(),

  getPaymentHistory: vi.fn(),

  getPaymentMetrics: vi.fn(),
}));

/*
|--------------------------------------------------------------------------
| Mock DSS Refresh Service
|--------------------------------------------------------------------------
*/

vi.mock("../service/dssRefreshService.js", () => ({
  refreshRiskAfterPaymentChange: vi.fn(),
}));

import {
  verifyPayment,
  rejectPayment,
  getPaymentHistory,
  getPaymentMetrics,
} from "../service/paymentService.js";

import { refreshRiskAfterPaymentChange } from "../service/dssRefreshService.js";

import {
  verifyPaymentStatus,
  rejectPaymentStatus,
  getTenantPayments,
  getRevenueMetrics,
} from "../controller/paymentController.js";

function responseMock() {
  return {
    status: vi.fn().mockReturnThis(),

    json: vi.fn(),
  };
}

describe("Payment Controller", () => {
  it("should verify payment successfully", async () => {
    verifyPayment.mockResolvedValue({
      payment_id: "payment-001",

      tenant_id: "tenant-001",

      status: "Verified",
    });

    refreshRiskAfterPaymentChange.mockResolvedValue({
      success: true,
    });

    const req = {
      params: {
        id: "payment-001",
      },

      body: {
        verifiedBy: "admin-001",
      },
    };

    const res = responseMock();

    await verifyPaymentStatus(req, res);

    expect(verifyPayment).toHaveBeenCalledWith("payment-001", "admin-001");

    expect(refreshRiskAfterPaymentChange).toHaveBeenCalledWith("tenant-001");

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should reject payment successfully", async () => {
    rejectPayment.mockResolvedValue({
      payment_id: "payment-001",

      tenant_id: "tenant-001",

      status: "Rejected",
    });

    refreshRiskAfterPaymentChange.mockResolvedValue({
      success: true,
    });

    const req = {
      params: {
        id: "payment-001",
      },

      body: {
        rejectedBy: "admin-001",
      },
    };

    const res = responseMock();

    await rejectPaymentStatus(req, res);

    expect(rejectPayment).toHaveBeenCalledWith("payment-001", "admin-001");

    expect(refreshRiskAfterPaymentChange).toHaveBeenCalledWith("tenant-001");

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should retrieve tenant payments", async () => {
    getPaymentHistory.mockResolvedValue([]);

    const req = {
      params: {
        tenantId: "tenant-001",
      },
    };

    const res = responseMock();

    await getTenantPayments(req, res);

    expect(getPaymentHistory).toHaveBeenCalledWith("tenant-001");

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return revenue metrics", async () => {
    getPaymentMetrics.mockResolvedValue({
      collectedRevenue: 6500,
    });

    const res = responseMock();

    await getRevenueMetrics({}, res);

    expect(getPaymentMetrics).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
