import express from "express";
import request from "supertest";

import { describe, expect, it, vi } from "vitest";

vi.mock("../service/analyticsService.js", () => ({
  fetchAnalyticsData: vi.fn(),
}));

vi.mock("../middleware/authMiddleware.js", () => ({
  default: (req, res, next) => next(),
}));

vi.mock("../middleware/roleMiddleware.js", () => ({
  requireAdmin: (req, res, next) => next(),
}));

import { fetchAnalyticsData } from "../service/analyticsService.js";

import analyticsRoutes from "../routes/analyticsRoutes.js";

const app = express();

app.use(express.json());

app.use("/analytics", analyticsRoutes);

describe("Analytics Controller", () => {
  const mockResponse = {
    totalRevenue: 80000,

    totalTenants: 2,

    occupancyRate: 50,

    paymentStatus: {
      paid: 1,
      pending: 1,
      overdue: 1,
    },

    revenueTrend: [],

    recommendations: [],
  };

  it("should retrieve analytics successfully", async () => {
    fetchAnalyticsData.mockResolvedValue(mockResponse);

    const response = await request(app).get("/analytics");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,

      data: mockResponse,
    });

    expect(fetchAnalyticsData).toHaveBeenCalledTimes(1);
  });

  it("should return error when analytics retrieval fails", async () => {
    fetchAnalyticsData.mockRejectedValue(
      new Error("Failed to retrieve analytics information."),
    );

    const response = await request(app).get("/analytics");

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      success: false,

      message: "Failed to retrieve analytics information.",
    });
  });
});
