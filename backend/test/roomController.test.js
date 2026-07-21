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

vi.mock("../service/roomService.js", () => ({
  getRooms: vi.fn(),
  getAvailableRooms: vi.fn(),
}));

import { getRooms, getAvailableRooms } from "../service/roomService.js";

import roomRoutes from "../routes/roomRoutes.js";

const app = express();

app.use(express.json());
app.use("/api/rooms", roomRoutes);

describe("Room Controller API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all rooms successfully", async () => {
    const rooms = [
      {
        id: "11111111-2222-4333-8444-555555555555",
        room_number: "101",
        room_type: "Single",
        monthly_rent: 6500,
        status: "Occupied",
      },
      {
        id: "22222222-3333-4444-8555-666666666666",
        room_number: "102",
        room_type: "Single",
        monthly_rent: 6500,
        status: "Available",
      },
    ];

    getRooms.mockResolvedValue(rooms);

    const response = await request(app).get("/api/rooms");

    expect(response.status).toBe(200);
    expect(getRooms).toHaveBeenCalledTimes(1);

    expect(response.body).toEqual({
      success: true,
      data: rooms,
    });
  });

  it("should retrieve available rooms successfully", async () => {
    const availableRooms = [
      {
        id: "22222222-3333-4444-8555-666666666666",
        room_number: "102",
        room_type: "Single",
        monthly_rent: 6500,
        status: "Available",
      },
    ];

    getAvailableRooms.mockResolvedValue(availableRooms);

    const response = await request(app).get("/api/rooms/available");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      data: availableRooms,
    });
  });

  it("should return an error when the room service fails", async () => {
    getRooms.mockRejectedValue(new Error("Room service error"));

    const response = await request(app).get("/api/rooms");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Room service error");
  });
});
