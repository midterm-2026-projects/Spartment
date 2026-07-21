import { describe, it, expect, vi } from "vitest";

vi.mock("../service/billingService.js", () => ({
  getAllBilling: vi.fn(),

  generateBilling: vi.fn(),

  getBillingByTenant: vi.fn(),

  updateBillingStatus: vi.fn(),
}));

import { getAllBilling } from "../service/billingService.js";

import { getBillingRecords } from "../controller/billingController.js";

function mockResponse() {
  return {
    status: vi.fn().mockReturnThis(),

    json: vi.fn(),
  };
}

describe("Billing Controller", () => {
  it("should retrieve billing information successfully", async () => {
    getAllBilling.mockResolvedValue({
      summary: {
        rent: 5000,

        water: 200,

        electricity: 500,
      },
    });

    const req = {};

    const res = mockResponse();

    await getBillingRecords(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalled();
  });

  it("should return billing data correctly", async () => {
    const billing = {
      id: 1,

      tenantId: 1,

      totalAmount: 5700,
    };

    getAllBilling.mockResolvedValue(billing);

    const res = mockResponse();

    await getBillingRecords({}, res);

    expect(res.json.mock.calls[0][0].data).toEqual(billing);
  });

  it("should return an internal server error when billing retrieval fails", async () => {
    getAllBilling.mockRejectedValue(
      new Error("Failed to retrieve billing information."),
    );

    const res = mockResponse();

    await getBillingRecords({}, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json.mock.calls[0][0].message).toBe(
      "Failed to retrieve billing information.",
    );
  });
});
