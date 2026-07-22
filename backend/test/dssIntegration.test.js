import { describe, it, expect, vi, beforeEach } from "vitest";

/*
|--------------------------------------------------------------------------
| Mock Dependencies
|--------------------------------------------------------------------------
*/

vi.mock("../service/riskService.js", () => ({
  analyzeTenantRisk: vi.fn(),

  analyzeSystemRisk: vi.fn(),
}));

vi.mock("../service/recommendationService.js", () => ({
  generateRecommendations: vi.fn(),
}));

vi.mock("../model/riskModel.js", () => ({
  getRiskRecords: vi.fn(),
}));

import {
  refreshTenantDSS,
  refreshSystemDSS,
  refreshAllDSS,
} from "../service/dssRefreshService.js";

import {
  analyzeTenantRisk,
  analyzeSystemRisk,
} from "../service/riskService.js";

import { generateRecommendations } from "../service/recommendationService.js";

import { getRiskRecords } from "../model/riskModel.js";

describe("DSS Integration Workflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /*
    |--------------------------------------------------------------------------
    | Tenant DSS Workflow
    |--------------------------------------------------------------------------
    */

  it("should refresh tenant DSS successfully", async () => {
    /*
        Arrange
        */

    analyzeTenantRisk.mockResolvedValue({
      tenantId: 101,

      riskScore: 70,

      riskLevel: "High",

      riskCategory: "Critical",
    });

    generateRecommendations.mockResolvedValue([
      {
        id: 1,

        title: "Payment Reminder",

        priority: "High",
      },
    ]);

    /*
        Act
        */

    const result = await refreshTenantDSS(101);

    /*
        Assert
        */

    expect(analyzeTenantRisk).toHaveBeenCalledWith(101);

    expect(generateRecommendations).toHaveBeenCalled();

    expect(result.success).toBe(true);

    expect(result.tenantId).toBe(101);

    expect(result.risk.riskLevel).toBe("High");

    expect(result.recommendations).toHaveLength(1);
  });

  /*
    |--------------------------------------------------------------------------
    | System DSS Workflow
    |--------------------------------------------------------------------------
    */

  it("should refresh system DSS successfully", async () => {
    /*
        Arrange
        */

    analyzeSystemRisk.mockResolvedValue({
      riskScore: 40,

      riskLevel: "Medium",

      riskCategory: "Warning",
    });

    generateRecommendations.mockResolvedValue([
      {
        id: 1,

        title: "Improve Revenue Collection",
      },
    ]);

    /*
        Act
        */

    const result = await refreshSystemDSS();

    /*
        Assert
        */

    expect(analyzeSystemRisk).toHaveBeenCalled();

    expect(result.success).toBe(true);

    expect(result.risk.riskLevel).toBe("Medium");

    expect(result.recommendations).toHaveLength(1);
  });

  /*
    |--------------------------------------------------------------------------
    | Full DSS Refresh
    |--------------------------------------------------------------------------
    */

  it("should refresh all DSS records successfully", async () => {
    /*
        Arrange
        */

    getRiskRecords.mockResolvedValue([
      {
        tenantId: 101,
        riskLevel: "High",
      },

      {
        tenantId: 102,
        riskLevel: "Low",
      },
    ]);

    generateRecommendations.mockResolvedValue([
      {
        id: 1,
      },

      {
        id: 2,
      },
    ]);

    /*
        Act
        */

    const result = await refreshAllDSS();

    /*
        Assert
        */

    expect(getRiskRecords).toHaveBeenCalled();

    expect(result.success).toBe(true);

    expect(result.totalRiskRecords).toBe(2);

    expect(result.totalRecommendations).toBe(2);
  });

  /*
    |--------------------------------------------------------------------------
    | Error Handling
    |--------------------------------------------------------------------------
    */

  it("should throw error when DSS refresh fails", async () => {
    /*
        Arrange
        */

    analyzeTenantRisk.mockRejectedValue(new Error("Risk calculation failed"));

    /*
        Act + Assert
        */

    await expect(refreshTenantDSS(101)).rejects.toThrow(
      "Failed to refresh tenant DSS",
    );
  });
});
