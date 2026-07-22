import { describe, it, expect, beforeEach, vi } from "vitest";

const mockSingle = vi.fn();

const mockOrder = vi.fn();

const mockLimit = vi.fn();

const mockEq = vi.fn();

const mockSelect = vi.fn();

const mockInsert = vi.fn();

const chain = {
  insert: mockInsert,

  select: mockSelect,

  single: mockSingle,

  eq: mockEq,

  order: mockOrder,

  limit: mockLimit,
};

vi.mock("../config/supabaseClient.js", () => ({
  supabase: {
    from: vi.fn(() => chain),
  },
}));

import {
  createRiskRecord,
  getRiskByTenant,
  getHighRiskRecords,
  getRiskRecords,
} from "../model/riskModel.js";

describe("Risk Model", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockInsert.mockReturnValue(chain);

    mockSelect.mockReturnValue(chain);

    mockEq.mockReturnValue(chain);

    mockOrder.mockReturnValue(chain);

    mockLimit.mockReturnValue(chain);
  });

  it("should create risk assessment record", async () => {
    mockSingle.mockResolvedValue({
      data: {
        id: "risk-001",

        tenant_id: "tenant-001",

        risk_level: "High",
      },

      error: null,
    });

    const result = await createRiskRecord({
      tenantId: "tenant-001",

      riskLevel: "High",

      riskScore: 85,

      riskCategory: "Payment",

      indicators: ["Late payment detected"],
    });

    expect(result.id).toBe("risk-001");

    expect(mockInsert).toHaveBeenCalled();
  });

  it("should retrieve risk record by tenant", async () => {
    mockSingle.mockResolvedValue({
      data: {
        id: "risk-001",

        tenant_id: "tenant-001",

        risk_level: "Medium",
      },

      error: null,
    });

    const result = await getRiskByTenant("tenant-001");

    expect(result.tenant_id).toBe("tenant-001");

    expect(mockEq).toHaveBeenCalledWith(
      "tenant_id",

      "tenant-001",
    );

    expect(mockLimit).toHaveBeenCalledWith(1);
  });

  it("should retrieve high risk records", async () => {
    mockOrder.mockResolvedValue({
      data: [
        {
          id: "risk-001",

          risk_level: "High",
        },
      ],

      error: null,
    });

    const result = await getHighRiskRecords();

    expect(result).toHaveLength(1);

    expect(result[0].risk_level).toBe("High");
  });

  it("should retrieve all risk records", async () => {
    mockOrder.mockResolvedValue({
      data: [
        {
          id: "risk-001",
        },

        {
          id: "risk-002",
        },
      ],

      error: null,
    });

    const result = await getRiskRecords();

    expect(result).toHaveLength(2);
  });

  it("should throw error when database fails", async () => {
    mockOrder.mockResolvedValue({
      data: null,

      error: {
        message: "Database error",
      },
    });

    await expect(getRiskRecords()).rejects.toThrow();
  });
});
