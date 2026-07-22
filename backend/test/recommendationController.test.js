import express from "express";

import request from "supertest";

import { describe, it, expect, vi } from "vitest";

vi.mock("../service/recommendationService.js", () => ({
  getAllRecommendations: vi.fn(),

  saveRecommendations: vi.fn(),
}));

import { getAllRecommendations } from "../service/recommendationService.js";

import recommendationRoutes from "../routes/recommendationRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/recommendation", recommendationRoutes);

describe("Recommendation Controller and Routes", () => {
  it("should retrieve recommendations successfully", async () => {
    const mockRecommendations = [
      {
        id: 1,

        title: "Overdue Payments Detected",

        message: "5 tenants have overdue balances.",

        priority: "High",

        category: "Payment",
      },
    ];

    getAllRecommendations.mockResolvedValue(mockRecommendations);

    const response = await request(app).get("/api/recommendation");

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toEqual(mockRecommendations);

    expect(response.body.data[0].priority).toBe("High");
  });

  it("should return empty recommendation list successfully", async () => {
    getAllRecommendations.mockResolvedValue([]);

    const response = await request(app).get("/api/recommendation");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,

      data: [],
    });
  });

  it("should return server error when service fails", async () => {
    getAllRecommendations.mockRejectedValue(
      new Error("Failed to retrieve recommendations."),
    );

    const response = await request(app).get("/api/recommendation");

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      success: false,

      message: "Failed to retrieve recommendations.",
    });
  });
});
