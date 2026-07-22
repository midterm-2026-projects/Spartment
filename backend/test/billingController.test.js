import { describe, it, expect, vi } from "vitest";

vi.mock("../service/billingService.js", () => ({
  fetchBillingInformation: vi.fn(),

  generateBilling: vi.fn(),

  getBillingByTenant: vi.fn(),

  fetchBillingById: vi.fn(),

  updateBillingPaymentStatus: vi.fn(),
}));

import { fetchBillingInformation } from "../service/billingService.js";

import { getBillingRecords } from "../controller/billingController.js";

function mockResponse() {
  return {
    status: vi.fn().mockReturnThis(),

    json: vi.fn(),
  };
}

describe("Billing Controller", () => {
  it("should retrieve billing records successfully", async () => {
    fetchBillingInformation.mockResolvedValue([
      {
        id: "billing-001",
        status: "Unpaid",
      },
    ]);

    const res = mockResponse();

    await getBillingRecords({}, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,

      data: [
        {
          id: "billing-001",
          status: "Unpaid",
        },
      ],
    });
  });

  it("should return error when billing retrieval fails", async () => {
    fetchBillingInformation.mockRejectedValue(
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
