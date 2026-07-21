import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../model/billingModel.js", () => ({
  getBillingInformation: vi.fn(),
}));

import { getBillingInformation } from "../model/billingModel.js";

import { fetchBillingInformation } from "../service/billingService.js";

describe("Billing Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBilling = {
    summary: {
      electricity: 850,
      water: 220,
      totalUtilities: 1070,
    },

    rentStatements: [
      {
        period: "May 2026",
        dueDate: "2026-05-15",
        amount: 6500,
        status: "Paid",
      },
      {
        period: "Apr 2026",
        dueDate: "2026-04-15",
        amount: 6500,
        status: "Paid",
      },
    ],

    utilityStatements: [
      {
        period: "May 2026",
        dueDate: "2026-05-20",
        electricity: 850,
        water: 220,
        total: 1070,
        status: "Paid",
      },
      {
        period: "Apr 2026",
        dueDate: "2026-04-20",
        electricity: 782,
        water: 209,
        total: 991,
        status: "Paid",
      },
    ],
  };

  it("should retrieve billing information successfully", async () => {
    // Arrange
    getBillingInformation.mockResolvedValue(mockBilling);

    // Act
    const result = await fetchBillingInformation();

    // Assert
    expect(getBillingInformation).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockBilling);
  });

  it("should return the billing summary correctly", async () => {
    // Arrange
    getBillingInformation.mockResolvedValue(mockBilling);

    // Act
    const result = await fetchBillingInformation();

    // Assert
    expect(result.summary.electricity).toBe(850);

    expect(result.summary.water).toBe(220);

    expect(result.summary.totalUtilities).toBe(1070);
  });

  it("should return the rent statements correctly", async () => {
    // Arrange
    getBillingInformation.mockResolvedValue(mockBilling);

    // Act
    const result = await fetchBillingInformation();

    // Assert
    expect(result.rentStatements).toHaveLength(2);

    expect(result.rentStatements[0].period).toBe("May 2026");

    expect(result.rentStatements[0].status).toBe("Paid");
  });

  it("should return the utility statements correctly", async () => {
    // Arrange
    getBillingInformation.mockResolvedValue(mockBilling);

    // Act
    const result = await fetchBillingInformation();

    // Assert
    expect(result.utilityStatements).toHaveLength(2);

    expect(result.utilityStatements[0].electricity).toBe(850);

    expect(result.utilityStatements[0].water).toBe(220);

    expect(result.utilityStatements[0].total).toBe(1070);
  });

  it("should return null when no billing information exists", async () => {
    // Arrange
    getBillingInformation.mockResolvedValue(null);

    // Act
    const result = await fetchBillingInformation();

    // Assert
    expect(result).toBeNull();
  });

  it("should throw an error when billing information cannot be retrieved", async () => {
    // Arrange
    getBillingInformation.mockRejectedValue(new Error("Database Error"));

    // Act & Assert
    await expect(fetchBillingInformation()).rejects.toThrow(
      "Failed to retrieve billing information.",
    );
  });
});
