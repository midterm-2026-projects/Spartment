import { beforeEach, describe, expect, it, vi } from "vitest";

import express from "express";
import request from "supertest";

vi.mock("../middleware/authMiddleware.js", () => ({
  default: (req, res, next) => {
    req.user = {
      id: "11111111-1111-4111-8111-111111111111",
      role: "admin",
    };

    next();
  },
}));

vi.mock("../middleware/roleMiddleware.js", () => ({
  requireAdmin: (req, res, next) => next(),
  requireTenant: (req, res, next) => next(),
  requireAdminOrTenant: (req, res, next) => next(),
  authorizeRoles: () => (req, res, next) => next(),
}));

vi.mock("../service/inquiryService.js", () => ({
  createInquiry: vi.fn(),
  fetchInquiries: vi.fn(),
  fetchInquiryById: vi.fn(),
  approveInquiry: vi.fn(),
  rejectInquiry: vi.fn(),
}));

import {
  createInquiry,
  fetchInquiries,
  fetchInquiryById,
  approveInquiry,
  rejectInquiry,
} from "../service/inquiryService.js";

import inquiryRoutes from "../routes/inquiryRoutes.js";

const app = express();

app.use(express.json());
app.use("/api/inquiries", inquiryRoutes);

describe("Inquiry Controller API", () => {
  const adminId = "11111111-1111-4111-8111-111111111111";

  const inquiryId = "33333333-3333-4333-8333-333333333333";

  const roomId = "22222222-2222-4222-8222-222222222222";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an inquiry successfully", async () => {
    const createdInquiry = {
      id: inquiryId,
      name: "Juan Dela Cruz",
      email: "juan@gmail.com",
      room_id: roomId,
      type: "Room Inquiry",
      message: "I am interested.",
      status: "Pending",
    };

    const payload = {
      name: "Juan Dela Cruz",
      email: "juan@gmail.com",
      contact: "09123456789",
      roomId,
      type: "Room Inquiry",
      moveInDate: "2026-08-01",
      message: "I am interested.",
    };

    createInquiry.mockResolvedValue(createdInquiry);

    const response = await request(app).post("/api/inquiries").send(payload);

    expect(response.status).toBe(201);

    expect(createInquiry).toHaveBeenCalledWith(payload);

    expect(response.body).toEqual({
      success: true,
      message: "Inquiry submitted successfully",
      data: createdInquiry,
    });
  });

  it("should retrieve all inquiries successfully", async () => {
    const inquiries = [
      {
        id: inquiryId,
        status: "Pending",
      },
    ];

    fetchInquiries.mockResolvedValue(inquiries);

    const response = await request(app).get("/api/inquiries");

    expect(response.status).toBe(200);

    expect(fetchInquiries).toHaveBeenCalledTimes(1);

    expect(response.body).toEqual({
      success: true,
      data: inquiries,
    });
  });

  it("should retrieve one inquiry successfully", async () => {
    const inquiry = {
      id: inquiryId,
      room_id: roomId,
      status: "Pending",
    };

    fetchInquiryById.mockResolvedValue(inquiry);

    const response = await request(app).get(`/api/inquiries/${inquiryId}`);

    expect(response.status).toBe(200);

    expect(fetchInquiryById).toHaveBeenCalledWith(inquiryId);

    expect(response.body).toEqual({
      success: true,
      data: inquiry,
    });
  });

  it("should approve an inquiry successfully", async () => {
    const approvalResult = {
      inquiry_id: inquiryId,
      status: "Approved",
      reviewed_by: adminId,
    };

    approveInquiry.mockResolvedValue(approvalResult);

    const response = await request(app)
      .patch(`/api/inquiries/${inquiryId}/approve`)
      .send();

    expect(response.status).toBe(200);

    expect(approveInquiry).toHaveBeenCalledWith({
      inquiryId,
      reviewedBy: adminId,
    });

    expect(response.body).toEqual({
      success: true,
      message: "Inquiry approved successfully",
      data: approvalResult,
    });
  });

  it("should reject an inquiry successfully", async () => {
    const rejectionResult = {
      inquiry_id: inquiryId,
      status: "Rejected",
      reviewed_by: adminId,
    };

    rejectInquiry.mockResolvedValue(rejectionResult);

    const response = await request(app).patch(
      `/api/inquiries/${inquiryId}/reject`,
    );

    expect(response.status).toBe(200);

    expect(rejectInquiry).toHaveBeenCalledWith({
      inquiryId,
      reviewedBy: adminId,
    });

    expect(response.body).toEqual({
      success: true,
      message: "Inquiry rejected successfully",
      data: rejectionResult,
    });
  });

  it("should return 400 when inquiry creation fails validation", async () => {
    createInquiry.mockRejectedValue(new Error("Email is required."));

    const response = await request(app).post("/api/inquiries").send({
      name: "Juan Dela Cruz",
      roomId,
      type: "Room Inquiry",
      message: "Interested",
    });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "Email is required.",
    });
  });

  it("should return 404 when inquiry does not exist", async () => {
    fetchInquiryById.mockRejectedValue(new Error("Inquiry not found"));

    const response = await request(app).get(`/api/inquiries/${inquiryId}`);

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      message: "Inquiry not found",
    });
  });

  it("should return 400 when inquiry is already processed", async () => {
    approveInquiry.mockRejectedValue(
      new Error("Only pending inquiries can be approved"),
    );

    const response = await request(app).patch(
      `/api/inquiries/${inquiryId}/approve`,
    );

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "Only pending inquiries can be approved",
    });
  });

  it("should return 500 when retrieving inquiries fails", async () => {
    fetchInquiries.mockRejectedValue(new Error("Database Error"));

    const response = await request(app).get("/api/inquiries");

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      success: false,
      message: "Database Error",
    });
  });
});
