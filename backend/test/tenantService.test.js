import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../model/tenantModel.js", () => ({
  getTenants: vi.fn(),
  getTenantById: vi.fn(),
}));

import { getTenants, getTenantById } from "../model/tenantModel.js";

import {
  fetchTenantInformation,
  findTenantByName,
} from "../service/tenantService.js";

describe("Tenant Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve tenant information successfully", async () => {
    getTenantById.mockResolvedValue({
      id: 1,
      fullName: "Juan Dela Cruz",
      email: "juan@gmail.com",
    });

    const result = await fetchTenantInformation(1);

    expect(result.fullName).toBe("Juan Dela Cruz");
  });

  it("should search tenant by name successfully", async () => {
    getTenants.mockResolvedValue([
      {
        id: 1,
        fullName: "Juan Dela Cruz",
      },
    ]);

    const result = await findTenantByName("Juan Dela Cruz");

    expect(result.id).toBe(1);
  });

  it("should throw error when tenant cannot be found", async () => {
    getTenants.mockResolvedValue([]);

    await expect(findTenantByName("Pedro")).rejects.toThrow(
      "Tenant not found."
    );
  });
});
