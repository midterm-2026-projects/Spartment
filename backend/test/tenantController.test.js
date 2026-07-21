import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../service/tenantService.js", () => ({
  fetchTenants: vi.fn(),
  fetchTenantById: vi.fn(),
  updateTenantPassword: vi.fn(),
}));

import {
  fetchTenants,
  fetchTenantById,
  updateTenantPassword,
} from "../service/tenantService.js";

import {
  getTenants,
  getTenantById,
  changeTenantPassword,
} from "../controller/tenantController.js";

function createResponseMock() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
}

describe("Tenant Controller", () => {
  const tenantId = "44444444-4444-4444-8444-444444444444";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all tenants", async () => {
    const tenants = [
      {
        id: tenantId,
        full_name: "Juan Dela Cruz",
        email: "juan@gmail.com",
      },
    ];

    fetchTenants.mockResolvedValue(tenants);

    const req = {};
    const res = createResponseMock();

    await getTenants(req, res);

    expect(fetchTenants).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: tenants,
    });
  });

  it("should retrieve one tenant", async () => {
    const tenant = {
      id: tenantId,
      full_name: "Juan Dela Cruz",
      email: "juan@gmail.com",
    };

    fetchTenantById.mockResolvedValue(tenant);

    const req = {
      params: {
        id: tenantId,
      },
      user: {
        id: "11111111-1111-4111-8111-111111111111",
        role: "admin",
      },
    };

    const res = createResponseMock();

    await getTenantById(req, res);

    expect(fetchTenantById).toHaveBeenCalledWith(tenantId);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: tenant,
    });
  });

  it("should update the tenant password", async () => {
    const updatedRecord = {
      tenantId,
      user: {
        id: "55555555-5555-4555-8555-555555555555",
        email: "juan@gmail.com",
      },
    };

    updateTenantPassword.mockResolvedValue(updatedRecord);

    const req = {
      params: {
        id: tenantId,
      },
      body: {
        password: "newpassword123",
      },
      user: {
        id: "11111111-1111-4111-8111-111111111111",
        role: "admin",
      },
    };

    const res = createResponseMock();

    await changeTenantPassword(req, res);

    expect(updateTenantPassword).toHaveBeenCalledWith(
      tenantId,
      "newpassword123",
    );

    expect(res.status).toHaveBeenCalledWith(200);

    const response = res.json.mock.calls[0][0];

    expect(response.success).toBe(true);
    expect(response.data).toEqual(updatedRecord);
  });

  it("should return an error when the tenant is missing", async () => {
    fetchTenantById.mockRejectedValue(new Error("Tenant not found"));

    const req = {
      params: {
        id: tenantId,
      },
      user: {
        role: "admin",
      },
    };

    const res = createResponseMock();

    await getTenantById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Tenant not found",
    });
  });
});
