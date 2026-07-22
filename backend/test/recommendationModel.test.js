import { describe, it, expect, beforeEach, vi } from "vitest";

const mockMaybeSingle = vi.fn();

const mockSingle = vi.fn();

const mockSelect = vi.fn();

const mockInsert = vi.fn();

const mockUpdate = vi.fn();

const mockEq = vi.fn();

const mockOrder = vi.fn();

const mockLt = vi.fn();

const chain = {
  select: mockSelect,

  insert: mockInsert,

  update: mockUpdate,

  eq: mockEq,

  order: mockOrder,

  lt: mockLt,

  maybeSingle: mockMaybeSingle,

  single: mockSingle,
};

vi.mock("../config/supabaseClient.js", () => ({
  supabase: {
    from: vi.fn(() => chain),
  },
}));

import {
  createRecommendation,
  getActiveRecommendations,
  getRecommendationsByTenant,
  updateRecommendationStatus,
  resolveOldRecommendations,
  getRecommendationHistory,
} from "../model/recommendationModel.js";

describe("Recommendation Model", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSelect.mockReturnValue(chain);

    mockInsert.mockReturnValue(chain);

    mockUpdate.mockReturnValue(chain);

    mockEq.mockReturnValue(chain);

    mockOrder.mockReturnValue(chain);

    mockLt.mockReturnValue(chain);
  });

  it("should create recommendation record", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: null,

      error: null,
    });

    mockSingle.mockResolvedValue({
      data: {
        id: "recommendation-001",

        title: "Payment Reminder",

        priority: "High",

        category: "Payment",

        status: "Active",
      },

      error: null,
    });

    const result = await createRecommendation({
      riskAssessmentId: "risk-001",

      tenantId: "tenant-001",

      roomId: "room-001",

      title: "Payment Reminder",

      description: "Tenant has overdue payment.",

      priority: "High",

      category: "Payment",

      sourceCondition: "Late Payment",
    });

    expect(result.id).toBe("recommendation-001");

    expect(mockInsert).toHaveBeenCalled();
  });

  it("should prevent duplicate active recommendation", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: {
        id: "existing-recommendation",
      },

      error: null,
    });

    const result = await createRecommendation({
      tenantId: "tenant-001",

      sourceCondition: "Late Payment",
    });

    expect(result.id).toBe("existing-recommendation");

    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("should retrieve active recommendations", async () => {
    mockOrder.mockResolvedValue({
      data: [
        {
          id: "recommendation-001",

          status: "Active",

          priority: "High",
        },
      ],

      error: null,
    });

    const result = await getActiveRecommendations();

    expect(result).toHaveLength(1);

    expect(result[0].status).toBe("Active");
  });

  it("should retrieve recommendations by tenant", async () => {
    mockOrder.mockResolvedValue({
      data: [
        {
          id: "recommendation-001",

          tenant_id: "tenant-001",
        },
      ],

      error: null,
    });

    const result = await getRecommendationsByTenant("tenant-001");

    expect(result[0].tenant_id).toBe("tenant-001");

    expect(mockEq).toHaveBeenCalledWith(
      "tenant_id",

      "tenant-001",
    );
  });

  it("should update recommendation status", async () => {
    mockSingle.mockResolvedValue({
      data: {
        id: "recommendation-001",

        status: "Resolved",
      },

      error: null,
    });

    const result = await updateRecommendationStatus(
      "recommendation-001",

      "Resolved",
    );

    expect(result.status).toBe("Resolved");

    expect(mockUpdate).toHaveBeenCalled();
  });

  it("should resolve old recommendations", async () => {
    mockSelect.mockResolvedValue({
      data: [
        {
          id: "recommendation-001",

          status: "Resolved",
        },
      ],

      error: null,
    });

    const result = await resolveOldRecommendations();

    expect(result).toHaveLength(1);
  });

  it("should retrieve recommendation history", async () => {
    mockOrder.mockResolvedValue({
      data: [
        {
          id: "recommendation-001",
        },
      ],

      error: null,
    });

    const result = await getRecommendationHistory();

    expect(result).toHaveLength(1);
  });
});
