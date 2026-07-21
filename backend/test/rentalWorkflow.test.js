import { beforeEach, describe, expect, it, vi } from "vitest";

/*
|--------------------------------------------------------------------------
| MOCKS
|--------------------------------------------------------------------------
*/

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
  },
}));

vi.mock("../model/inquiryModel.js", () => ({
  createInquiryRecord: vi.fn(),

  getInquiryRecords: vi.fn(),

  getInquiryRecordById: vi.fn(),

  approveInquiryRecord: vi.fn(),

  rejectInquiryRecord: vi.fn(),

  updateInquiryRecord: vi.fn(),
}));

vi.mock("../model/roomModel.js", () => ({
  getRoomById: vi.fn(),
}));

vi.mock("../model/tenantModel.js", () => ({
  createTenant: vi.fn(),

  getTenants: vi.fn(),

  getTenantById: vi.fn(),

  getTenantByUserId: vi.fn(),

  getTenantByEmail: vi.fn(),

  getTenantByInquiryId: vi.fn(),

  updateTenantPassword: vi.fn(),

  updateTenantStatus: vi.fn(),
}));

vi.mock("../service/billingService.js", () => ({
  generateBilling: vi.fn(),
}));

/*
|--------------------------------------------------------------------------
| IMPORTS
|--------------------------------------------------------------------------
*/

import bcrypt from "bcryptjs";

import {
  createInquiryRecord,
  getInquiryRecordById,
  approveInquiryRecord,
} from "../model/inquiryModel.js";

import { getRoomById } from "../model/roomModel.js";

import {
  createTenant,
  getTenantByEmail,
  getTenantByInquiryId,
} from "../model/tenantModel.js";

import { generateBilling } from "../service/billingService.js";

import { createInquiry, approveInquiry } from "../service/inquiryService.js";

import { createTenantAccount } from "../service/tenantService.js";

/*
|--------------------------------------------------------------------------
| TEST SUITE
|--------------------------------------------------------------------------
*/

describe("Rental Workflow", () => {
  const inquiryId = "33333333-3333-4333-8333-333333333333";

  const roomId = "22222222-2222-4222-8222-222222222222";

  const adminId = "11111111-1111-4111-8111-111111111111";

  const tenantId = "44444444-4444-4444-8444-444444444444";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /*
    |--------------------------------------------------------------------------
    | CREATE INQUIRY
    |--------------------------------------------------------------------------
    */

  describe("Create Inquiry Workflow", () => {
    it("should submit a room inquiry successfully", async () => {
      getRoomById.mockResolvedValue({
        id: roomId,

        room_number: "101",

        status: "Available",
      });

      createInquiryRecord.mockResolvedValue({
        id: inquiryId,

        room_id: roomId,

        status: "Pending",
      });

      const inquiry = await createInquiry({
        name: "Juan Dela Cruz",

        email: "juan@gmail.com",

        contact: "09123456789",

        roomId,

        type: "Room Inquiry",

        message: "I am interested.",
      });

      expect(inquiry.status).toBe("Pending");

      expect(createInquiryRecord).toHaveBeenCalled();
    });
  });

  /*
    |--------------------------------------------------------------------------
    | APPROVE INQUIRY
    |--------------------------------------------------------------------------
    */

  describe("Approve Inquiry Workflow", () => {
    it("should approve pending inquiry successfully", async () => {
      getInquiryRecordById.mockResolvedValue({
        id: inquiryId,

        status: "Pending",
      });

      approveInquiryRecord.mockResolvedValue({
        inquiry_id: inquiryId,

        status: "Approved",
      });

      const approval = await approveInquiry({
        inquiryId,

        reviewedBy: adminId,
      });

      expect(approval.status).toBe("Approved");

      expect(approveInquiryRecord).toHaveBeenCalled();
    });
  });

  /*
    |--------------------------------------------------------------------------
    | TENANT CREATION
    |--------------------------------------------------------------------------
    */

  describe("Tenant Creation Workflow", () => {
    it("should create tenant and generate initial billing", async () => {
      /*
            IMPORTANT:
            Tenant creation requires
            approved inquiry
            */

      getInquiryRecordById.mockResolvedValue({
        id: inquiryId,

        status: "Approved",
      });

      getTenantByInquiryId.mockResolvedValue(null);

      getTenantByEmail.mockResolvedValue(null);

      getRoomById.mockResolvedValue({
        id: roomId,

        status: "Available",
      });

      bcrypt.hash.mockResolvedValue("hashed-password");

      createTenant.mockResolvedValue({
        tenant_id: tenantId,

        inquiry_id: inquiryId,

        room_id: roomId,

        room_status: "Occupied",
      });

      generateBilling.mockResolvedValue({
        id: "55555555-5555-4555-8555-555555555555",

        tenant_id: tenantId,

        total_amount: 5200,

        status: "Pending",
      });

      const account = await createTenantAccount({
        inquiryId,

        fullName: "Juan Dela Cruz",

        email: "juan@gmail.com",

        contact: "09123456789",

        roomId,

        username: "juan101",

        password: "Spartment2026",

        createdBy: adminId,
      });

      expect(account.tenant.room_status).toBe("Occupied");

      expect(account.billing.status).toBe("Pending");

      expect(generateBilling).toHaveBeenCalledWith({
        tenantId,

        billingType: "initial",
      });
    });
  });
});
