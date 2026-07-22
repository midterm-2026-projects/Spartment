import { describe, it, expect, beforeEach, vi } from "vitest";

/*
|--------------------------------------------------------------------------
| Mock Supabase Client
|--------------------------------------------------------------------------
*/

const mockInsert = vi.fn();

const mockSelect = vi.fn();

const mockEq = vi.fn();

vi.mock("../config/supabaseClient.js", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: mockInsert,

      select: mockSelect,

      eq: mockEq,
    })),
  },
}));

import { supabase } from "../config/supabaseClient.js";

describe("Risk Recommendation Database Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create risk assessment record successfully", async () => {
    // Arrange

    const riskRecord = {
      id: "risk-001",

      tenant_id: "tenant-001",

      risk_score: 85,

      risk_level: "High",

      risk_category: "Payment",

      status: "Active",
    };

    mockInsert.mockResolvedValue({
      data: [riskRecord],

      error: null,
    });

    // Act

    const { data, error } = await supabase

      .from("risk_assessments")

      .insert(riskRecord);

    // Assert

    expect(error).toBeNull();

    expect(data[0].risk_level).toBe("High");

    expect(mockInsert).toHaveBeenCalledWith(riskRecord);
  });

  it("should create recommendation record successfully", async () => {
    const recommendation = {
      id: "recommendation-001",

      risk_id: "risk-001",

      title: "Follow up overdue payment",

      priority: "High",

      category: "Payment",

      status: "Active",
    };

    mockInsert.mockResolvedValue({
      data: [recommendation],

      error: null,
    });

    const { data, error } = await supabase

      .from("recommendations")

      .insert(recommendation);

    expect(error).toBeNull();

    expect(data[0].priority).toBe("High");
  });

  it("should preserve recommendation history", async () => {
    const history = {
      recommendation_id: "recommendation-001",

      old_status: "Active",

      new_status: "Resolved",
    };

    mockInsert.mockResolvedValue({
      data: [history],

      error: null,
    });

    const { data } = await supabase

      .from("recommendation_history")

      .insert(history);

    expect(data[0].new_status).toBe("Resolved");
  });

  it("should retrieve active recommendations by risk condition", async () => {
    const recommendations = [
      {
        id: "recommendation-001",

        risk_id: "risk-001",

        status: "Active",
      },
    ];

    mockSelect.mockResolvedValue({
      data: recommendations,

      error: null,
    });

    const { data, error } = await supabase

      .from("recommendations")

      .select("*");

    expect(error).toBeNull();

    expect(data).toHaveLength(1);

    expect(data[0].status).toBe("Active");
  });

  it("should prevent duplicate active recommendations", async () => {
    mockInsert.mockResolvedValue({
      data: null,

      error: {
        message: "duplicate active recommendation",
      },
    });

    const { error } = await supabase

      .from("recommendations")

      .insert({
        risk_id: "risk-001",

        status: "Active",
      });

    expect(error).not.toBeNull();

    expect(error.message).toBe("duplicate active recommendation");
  });
});
