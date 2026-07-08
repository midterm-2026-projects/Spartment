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

  it("should retrieve all tenant records successfully", async () => {
    // Arrange
    const mockTenants = [
      {
        id: 1,
        name: "John Doe",
        email: "john@email.com",
        room: "Room 101",
        rent: "₱5,000",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@email.com",
        room: "Room 102",
        rent: "₱6,000",
      },
      {
        id: 3,
        name: "Michael Santos",
        email: "michael@email.com",
        room: "Room 103",
        rent: "₱5,500",
      },
    ];

    getTenantList.mockResolvedValue(mockTenants);

    // Act
    const result = await fetchTenantList();

    // Assert
    expect(result).toEqual(mockTenants);
    expect(result).toHaveLength(3);
  });

  it("should return an empty tenant list when no records exist", async () => {
    // Arrange
    getTenantList.mockResolvedValue([]);

    // Act
    const result = await fetchTenantList();

    // Assert
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it("should throw an error when retrieving the tenant list fails", async () => {
    // Arrange
    getTenantList.mockRejectedValue(new Error("Database Error"));

    // Act & Assert
    await expect(fetchTenantList()).rejects.toThrow(
      "Failed to retrieve tenant list."
    );
  });
});