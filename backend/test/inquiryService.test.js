import { beforeEach, describe, expect, it, vi } from "vitest";

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

import {
  createInquiryRecord,
  getInquiryRecords,
  getInquiryRecordById,
  approveInquiryRecord,
  rejectInquiryRecord,
} from "../model/inquiryModel.js";

import { getRoomById } from "../model/roomModel.js";

import {
  createInquiry,
  fetchInquiries,
  approveInquiry,
  rejectInquiry,
} from "../service/inquiryService.js";

describe("Inquiry Service", () => {
  const inquiryId = "33333333-3333-4333-8333-333333333333";

  const roomId = "22222222-2222-4222-8222-222222222222";

  const adminId = "11111111-1111-4111-8111-111111111111";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an inquiry", async () => {
    getRoomById.mockResolvedValue({
      id: roomId,
      status: "Available",
    });

    createInquiryRecord.mockResolvedValue({
      id: inquiryId,
      status: "Pending",
    });

    const result = await createInquiry({
      name: "Juan Dela Cruz",
      email: "juan@gmail.com",
      roomId,
      type: "Room Inquiry",
      message: "Interested",
    });

    expect(result.status).toBe("Pending");
  });

  it("should retrieve inquiries", async () => {
    getInquiryRecords.mockResolvedValue([]);

    await expect(fetchInquiries()).resolves.toEqual([]);
  });

  it("should approve inquiry without creating a tenant", async () => {
    getInquiryRecordById.mockResolvedValue({
      id: inquiryId,
      status: "Pending",
    });

    approveInquiryRecord.mockResolvedValue({
      inquiry_id: inquiryId,
      status: "Approved",
    });

    const result = await approveInquiry({
      inquiryId,
      reviewedBy: adminId,
    });

    expect(approveInquiryRecord).toHaveBeenCalledWith({
      inquiryId,
      reviewedBy: adminId,
    });

    expect(result.status).toBe("Approved");
  });

  it("should reject a pending inquiry", async () => {
    getInquiryRecordById.mockResolvedValue({
      id: inquiryId,
      status: "Pending",
    });

    rejectInquiryRecord.mockResolvedValue({
      inquiry_id: inquiryId,
      status: "Rejected",
    });

    const result = await rejectInquiry({
      inquiryId,
      reviewedBy: adminId,
    });

    expect(result.status).toBe("Rejected");
  });

  it("should reject approval for a processed inquiry", async () => {
    getInquiryRecordById.mockResolvedValue({
      id: inquiryId,
      status: "Approved",
    });

    await expect(
      approveInquiry({
        inquiryId,
        reviewedBy: adminId,
      }),
    ).rejects.toThrow("Only pending inquiries can be approved");
  });
});
