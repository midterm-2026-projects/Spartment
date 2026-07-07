import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../model/tenantModel.js", () => ({
  getTenantInformation: vi.fn(),
}));

import { getTenantInformation } from "../model/tenantModel.js";
import { fetchTenantInformation } from "../service/tenantService.js";

describe("Tenant Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve the tenant information successfully", async () => {
    // Arrange
    const tenantId = 1;

    const mockTenant = {
      id: tenantId,

      tenant: {
        name: "Juan Dela Cruz",
        contact: "09123456789",
        email: "juan@email.com",
      },

      room: {
        roomNumber: "Room 101",
        monthlyRent: 5000,
        nextDue: "July 15, 2026",
      },

      payments: [
        {
          month: "January",
          amount: 5000,
          status: "Paid",
        },
        {
          month: "February",
          amount: 5000,
          status: "Paid",
        },
        {
          month: "March",
          amount: 5000,
          status: "Pending",
        },
      ],
    };

    getTenantInformation.mockResolvedValue(mockTenant);

    // Act
    const result = await fetchTenantInformation(tenantId);

    // Assert
    expect(getTenantInformation).toHaveBeenCalledTimes(1);
    expect(getTenantInformation).toHaveBeenCalledWith(tenantId);

    expect(result).toEqual(mockTenant);

    expect(result.tenant.name).toBe("Juan Dela Cruz");
    expect(result.room.roomNumber).toBe("Room 101");
    expect(result.room.monthlyRent).toBe(5000);
    expect(result.room.nextDue).toBe("July 15, 2026");

    expect(result.payments).toHaveLength(3);
    expect(result.payments[0].month).toBe("January");
    expect(result.payments[2].status).toBe("Pending");
  });

  it("should throw an error when the tenant cannot be found", async () => {
    // Arrange
    const tenantId = 99;

    getTenantInformation.mockRejectedValue(new Error("Tenant not found."));

    // Act & Assert
    await expect(fetchTenantInformation(tenantId)).rejects.toThrow(
      "Tenant not found."
    );

    expect(getTenantInformation).toHaveBeenCalledTimes(1);
    expect(getTenantInformation).toHaveBeenCalledWith(tenantId);
  });
});