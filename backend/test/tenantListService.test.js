import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../model/tenantListModel.js", () => ({
  getTenantList: vi.fn(),
}));

import { getTenantList } from "../model/tenantListModel.js";

import { fetchTenantList } from "../service/tenantListService.js";

describe("Tenant List Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve tenant list successfully", async () => {
    const tenants = [
      {
        id: "11111111-1111-4111-8111-111111111111",
        full_name: "Juan Dela Cruz",
        email: "juan@gmail.com",
        status: "Active",
      },
      {
        id: "22222222-2222-4222-8222-222222222222",
        full_name: "Maria Santos",
        email: "maria@gmail.com",
        status: "Active",
      },
    ];

    getTenantList.mockResolvedValue(tenants);

    const result = await fetchTenantList();

    expect(getTenantList).toHaveBeenCalledTimes(1);

    expect(result).toEqual(tenants);
    expect(result).toHaveLength(2);
  });

  it("should return an empty array when no tenant records exist", async () => {
    getTenantList.mockResolvedValue([]);

    const result = await fetchTenantList();

    expect(result).toEqual([]);
  });

  it("should return an empty array when the model returns null", async () => {
    getTenantList.mockResolvedValue(null);

    const result = await fetchTenantList();

    expect(result).toEqual([]);
  });

  it("should return an empty array when the model returns undefined", async () => {
    getTenantList.mockResolvedValue(undefined);

    const result = await fetchTenantList();

    expect(result).toEqual([]);
  });

  it("should propagate an error when retrieving tenant list fails", async () => {
    getTenantList.mockRejectedValue(new Error("Database error"));

    await expect(fetchTenantList()).rejects.toThrow("Database error");

    expect(getTenantList).toHaveBeenCalledTimes(1);
  });
});
