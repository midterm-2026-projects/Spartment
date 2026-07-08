import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

vi.mock("../model/tenantModel.js", () => ({
  getTenantInformation: vi.fn(),
  searchTenantByName: vi.fn(),
}));

vi.mock("../validation/tenantValidation.js", () => ({
  validateTenantId: vi.fn(),
  validateTenantName: vi.fn(),
}));

import {
  getTenantInformation,
  searchTenantByName,
} from "../model/tenantModel.js";

import {
  validateTenantId,
  validateTenantName,
} from "../validation/tenantValidation.js";

import {
  fetchTenantInformation,
  findTenantByName,
} from "../service/tenantService.js";

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
      payments: [],
    };

    getTenantInformation.mockResolvedValue(mockTenant);

    // Act
    const result = await fetchTenantInformation(tenantId);

    // Assert
    expect(validateTenantId).toHaveBeenCalledWith(
      tenantId
    );
    expect(getTenantInformation).toHaveBeenCalledWith(
      tenantId
    );
    expect(result).toEqual(mockTenant);
  });

  it("should search tenant by name successfully", async () => {
    // Arrange
    const tenantName = "Juan Dela Cruz";

    const mockTenant = {
      id: 1,
      tenant: {
        name: tenantName,
      },
    };

    searchTenantByName.mockResolvedValue(mockTenant);

    // Act
    const result = await findTenantByName(
      tenantName
    );

    // Assert
    expect(validateTenantName).toHaveBeenCalledWith(
      tenantName
    );
    expect(searchTenantByName).toHaveBeenCalledWith(
      tenantName
    );
    expect(result).toEqual(mockTenant);
  });

  it("should throw an error when tenant cannot be found", async () => {
    // Arrange
    searchTenantByName.mockRejectedValue(
      new Error("Tenant not found.")
    );

    // Act & Assert
    await expect(
      findTenantByName("Pedro")
    ).rejects.toThrow("Tenant not found.");
  });
});