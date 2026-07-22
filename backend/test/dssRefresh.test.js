import { describe, it, expect, beforeEach, vi } from "vitest";

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
  analyzeTenantRisk,
  analyzeSystemRisk,
} from "../service/riskService.js";

import { generateRecommendations } from "../service/recommendationService.js";

import { getRiskRecords } from "../model/riskModel.js";

import {
  refreshTenantDSS,
  refreshSystemDSS,
  refreshAllDSS,
} from "../service/dssRefreshService.js";

describe("DSS Refresh Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should refresh tenant DSS successfully", async () => {
    analyzeTenantRisk.mockResolvedValue({
      tenantId: 101,

      riskLevel: "High",
    });

    generateRecommendations.mockResolvedValue([
      {
        title: "Payment Follow Up",
      },
    ]);

    const result = await refreshTenantDSS(101);

    expect(result.success).toBe(true);

    expect(result.tenantId).toBe(101);

    expect(result.recommendations).toHaveLength(1);
  });

  it("should refresh system DSS successfully", async () => {
    analyzeSystemRisk.mockResolvedValue({
      riskLevel: "Medium",
    });

    generateRecommendations.mockResolvedValue([]);

    const result = await refreshSystemDSS();

    expect(result.success).toBe(true);

    expect(result.risk.riskLevel).toBe("Medium");
  });

  it("should refresh all DSS records successfully", async () => {
    getRiskRecords.mockResolvedValue([
      {
        id: 1,
      },

      {
        id: 2,
      },
    ]);

    generateRecommendations.mockResolvedValue([
      {
        id: 1,
      },
    ]);

    const result = await refreshAllDSS();

    expect(result.success).toBe(true);

    expect(result.totalRiskRecords).toBe(2);

    expect(result.totalRecommendations).toBe(1);
  });

  it("should throw error when tenant DSS refresh fails", async () => {
    analyzeTenantRisk.mockRejectedValue(new Error("Risk failed"));

    await expect(refreshTenantDSS(101)).rejects.toThrow(
      "Failed to refresh tenant DSS",
    );
  });
});
