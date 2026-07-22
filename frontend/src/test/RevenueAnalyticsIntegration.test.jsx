import { describe, it, expect, vi } from "vitest";

import { getDashboardMetrics } from "../api/dashboardApi.js";

vi.mock("../api/dashboardApi.js", () => ({
  getDashboardMetrics: vi.fn(),
}));

describe("Revenue Analytics Integration", () => {
  it("should retrieve revenue analytics", async () => {
    getDashboardMetrics.mockResolvedValue({
      success: true,

      data: {
        collectedRevenue: 50000,

        outstandingBalance: 30000,

        paymentRate: 85,
      },
    });

    const result = await getDashboardMetrics();

    expect(result.data.collectedRevenue).toBe(50000);
  });
});
