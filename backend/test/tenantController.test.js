import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../service/tenantService.js", () => ({
  createTenantAccount: vi.fn(),

  updateTenantPassword: vi.fn(),
}));

vi.mock("../service/billingService.js", () => ({
  generateBilling: vi.fn(),
}));

import {
  createTenantAccount,
  updateTenantPassword,
} from "../service/tenantService.js";

import { generateBilling } from "../service/billingService.js";

import {
  createTenant,
  changeTenantPassword,
} from "../controller/tenantController.js";

function responseMock() {
  return {
    status: vi.fn().mockReturnThis(),

    json: vi.fn(),
  };
}

describe("Tenant Controller API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create tenant account successfully", async () => {
    const mockTenant = {
      id: 1,

      fullName: "Juan Dela Cruz",

      email: "juan@gmail.com",

      contact: "09123456789",

      room: "101",

      username: "juan101",
    };

    const mockBilling = {
      id: 1,

      tenantId: 1,

      billingType: "initial",

      rentAmount: 5000,

      waterBill: 200,

      electricityBill: 0,

      totalAmount: 5200,

      status: "Pending",
    };

    createTenantAccount.mockResolvedValue(mockTenant);

    generateBilling.mockResolvedValue(mockBilling);

    const req = {
      body: {
        fullName: "Juan Dela Cruz",

        email: "juan@gmail.com",

        contact: "09123456789",

        room: "101",

        username: "juan101",
      },
    };

    const res = responseMock();

    await createTenant(
      req,

      res,
    );

    expect(createTenantAccount).toHaveBeenCalledTimes(1);

    expect(generateBilling).toHaveBeenCalledWith({
      tenantId: 1,

      billingType: "initial",
    });

    expect(res.status).toHaveBeenCalledWith(201);

    const response = res.json.mock.calls[0][0];

    expect(response.message).toBe("Tenant created successfully");

    expect(response.data.tenant.email).toBe("juan@gmail.com");

    expect(response.data.billing.totalAmount).toBe(5200);

    expect(response.data.billing.status).toBe("Pending");
  });

  it("should update tenant password successfully", async () => {
    const updatedTenant = {
      id: 1,

      password: "newpass",
    };

    updateTenantPassword.mockResolvedValue(updatedTenant);

    const req = {
      params: {
        id: 1,
      },

      body: {
        password: "newpass",
      },
    };

    const res = responseMock();

    await changeTenantPassword(
      req,

      res,
    );

    expect(updateTenantPassword).toHaveBeenCalledWith(
      1,

      "newpass",
    );

    expect(res.status).toHaveBeenCalledWith(200);

    const response = res.json.mock.calls[0][0];

    expect(response.message).toBe("Password updated successfully");

    expect(response.data.password).toBe("newpass");
  });

  it("should return error when tenant creation fails", async () => {
    createTenantAccount.mockRejectedValue(new Error("Tenant already exists."));

    const req = {
      body: {},
    };

    const res = responseMock();

    await createTenant(
      req,

      res,
    );

    expect(res.status).toHaveBeenCalledWith(400);

    const response = res.json.mock.calls[0][0];

    expect(response.message).toBe("Tenant already exists.");
  });
});
