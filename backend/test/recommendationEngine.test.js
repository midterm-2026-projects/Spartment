import { describe, it, expect, beforeEach, vi } from "vitest";

/*
|--------------------------------------------------------------------------
| Mock Models
|--------------------------------------------------------------------------
*/

vi.mock("../model/recommendationModel.js", () => ({
  createRecommendation: vi.fn(),

  getActiveRecommendations: vi.fn(),
}));

vi.mock("../model/riskModel.js", () => ({
  getHighRiskRecords: vi.fn(),
}));

import {
  createRecommendation,
  getActiveRecommendations,
} from "../model/recommendationModel.js";

import { getHighRiskRecords } from "../model/riskModel.js";

import {
  generateRecommendations,
  getRecommendations,
} from "../service/recommendationEngineService.js";

describe("Recommendation Engine Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /*
    |--------------------------------------------------------------------------
    | Generate Recommendations
    |--------------------------------------------------------------------------
    */

  it("should generate recommendation for high risk tenant", async () => {
    /*
        Arrange
        */

    getHighRiskRecords.mockResolvedValue([
      {
        id: 1,

        tenantId: 101,

        riskLevel: "High",

        indicators: ["Late payment detected"],
      },
    ]);

    createRecommendation.mockResolvedValue({
      id: 1,

      title: "Payment Follow Up",

      priority: "High",

      category: "Payment",
    });

    /*
        Act
        */

    const result = await generateRecommendations();

    /*
        Assert
        */

    expect(getHighRiskRecords).toHaveBeenCalled();

    expect(createRecommendation).toHaveBeenCalled();

    expect(result.length).toBeGreaterThan(0);

    expect(result[0].priority).toBe("High");
  });

  it("should return empty recommendation when no risk exists", async () => {
    /*
        Arrange
        */

    getHighRiskRecords.mockResolvedValue([]);

    /*
        Act
        */

    const result = await generateRecommendations();

    /*
        Assert
        */

    expect(result).toEqual([]);

    expect(createRecommendation).not.toHaveBeenCalled();
  });

  it("should retrieve active recommendations", async () => {
    /*
        Arrange
        */

    getActiveRecommendations.mockResolvedValue([
      {
        id: 1,

        title: "Payment Reminder",

        status: "Active",
      },
    ]);

    /*
        Act
        */

    const result = await getRecommendations();

    /*
        Assert
        */

    expect(getActiveRecommendations).toHaveBeenCalled();

    expect(result).toHaveLength(1);

    expect(result[0].status).toBe("Active");
  });

  it("should throw error when recommendation generation fails", async () => {
    /*
        Arrange
        */

    getHighRiskRecords.mockRejectedValue(new Error("Database error"));

    /*
        Act + Assert
        */

    await expect(generateRecommendations()).rejects.toThrow();
  });
});
