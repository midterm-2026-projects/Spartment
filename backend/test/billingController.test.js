import express from "express";
import request from "supertest";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import billingRoutes from "../routes/billingRoutes.js";

vi.mock("../service/billingService.js", () => ({
  fetchBillingInformation: vi.fn(),
}));

import {
  fetchBillingInformation,
} from "../service/billingService.js";

const app = express();

app.use(express.json());

app.use("/billing", billingRoutes);

describe("Billing Controller", () => {
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
        dueDate: "May 15, 2026",
        amount: 6500,
        status: "Paid",
      },
    ],

    utilityStatements: [
      {
        period: "May 2026",
        dueDate: "May 20, 2026",
        electricity: 850,
        water: 220,
        total: 1070,
        status: "Paid",
      },
    ],
  };

  it("should retrieve billing information successfully", async () => {
    // Arrange
    fetchBillingInformation.mockResolvedValue(
      mockBilling
    );

    // Act
    const response =
      await request(app).get("/billing");

    // Assert
    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      mockBilling
    );

    expect(
      fetchBillingInformation
    ).toHaveBeenCalledTimes(1);
  });

  it("should return billing summary correctly", async () => {
    // Arrange
    fetchBillingInformation.mockResolvedValue(
      mockBilling
    );

    // Act
    const response =
      await request(app).get("/billing");

    // Assert
    expect(response.status).toBe(200);

    expect(
      response.body.summary
    ).toEqual(mockBilling.summary);
  });

  it("should return rent statements correctly", async () => {
    // Arrange
    fetchBillingInformation.mockResolvedValue(
      mockBilling
    );

    // Act
    const response =
      await request(app).get("/billing");

    // Assert
    expect(response.status).toBe(200);

    expect(
      response.body.rentStatements
    ).toEqual(
      mockBilling.rentStatements
    );
  });

  it("should return utility statements correctly", async () => {
    // Arrange
    fetchBillingInformation.mockResolvedValue(
      mockBilling
    );

    // Act
    const response =
      await request(app).get("/billing");

    // Assert
    expect(response.status).toBe(200);

    expect(
      response.body.utilityStatements
    ).toEqual(
      mockBilling.utilityStatements
    );
  });

  it("should return an internal server error when billing retrieval fails", async () => {
    // Arrange
    fetchBillingInformation.mockRejectedValue(
      new Error(
        "Failed to retrieve billing information."
      )
    );

    // Act
    const response =
      await request(app).get("/billing");

    // Assert
    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      message:
        "Failed to retrieve billing information.",
    });
  });

  it("should call the billing service once", async () => {
    // Arrange
    fetchBillingInformation.mockResolvedValue(
      mockBilling
    );

    // Act
    await request(app).get("/billing");

    // Assert
    expect(
      fetchBillingInformation
    ).toHaveBeenCalledTimes(1);
  });
});