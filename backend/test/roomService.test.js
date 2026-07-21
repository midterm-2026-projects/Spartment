import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../model/roomModel.js", () => ({
  getRooms: vi.fn(),
  getAvailableRooms: vi.fn(),
  getRoomById: vi.fn(),
}));

import {
  getRooms as getRoomRecords,
  getAvailableRooms as getAvailableRoomRecords,
  getRoomById,
} from "../model/roomModel.js";

import {
  getRooms,
  getAvailableRooms,
  fetchRoomById,
  fetchRoomList,
  searchRoom,
} from "../service/roomService.js";

describe("Room Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all room records", async () => {
    const rooms = [
      {
        id: "11111111-2222-4333-8444-555555555555",
        room_number: "101",
        room_type: "Single",
        status: "Available",
        monthly_rent: 5000,
      },
    ];

    getRoomRecords.mockResolvedValue(rooms);

    const result = await getRooms();

    expect(result).toEqual(rooms);
    expect(getRoomRecords).toHaveBeenCalledTimes(1);
  });

  it("should retrieve available room records", async () => {
    const rooms = [
      {
        room_number: "101",
        status: "Available",
      },
    ];

    getAvailableRoomRecords.mockResolvedValue(rooms);

    const result = await getAvailableRooms();

    expect(result).toEqual(rooms);
  });

  it("should retrieve a room by UUID", async () => {
    const roomId = "11111111-2222-4333-8444-555555555555";

    const room = {
      id: roomId,
      room_number: "101",
    };

    getRoomById.mockResolvedValue(room);

    const result = await fetchRoomById(roomId);

    expect(result).toEqual(room);
    expect(getRoomById).toHaveBeenCalledWith(roomId);
  });

  it("should return an empty room list", async () => {
    getRoomRecords.mockResolvedValue([]);

    const result = await fetchRoomList();

    expect(result).toEqual([]);
  });

  it("should search using room number", async () => {
    getRoomRecords.mockResolvedValue([
      {
        room_number: "101",
        room_type: "Single",
        status: "Available",
      },
    ]);

    const result = await searchRoom("101");

    expect(result.room_number).toBe("101");
  });

  it("should search using room type", async () => {
    getRoomRecords.mockResolvedValue([
      {
        room_number: "101",
        room_type: "Single",
        status: "Available",
      },
    ]);

    const result = await searchRoom("single");

    expect(result.room_type).toBe("Single");
  });

  it("should search using room status regardless of case", async () => {
    getRoomRecords.mockResolvedValue([
      {
        room_number: "101",
        room_type: "Single",
        status: "Available",
      },
    ]);

    const result = await searchRoom("AVAILABLE");

    expect(result.status).toBe("Available");
  });

  it("should throw when a room cannot be found", async () => {
    getRoomRecords.mockResolvedValue([]);

    await expect(searchRoom("999")).rejects.toThrow("Room not found");
  });

  it("should throw when search is empty", async () => {
    await expect(searchRoom("")).rejects.toThrow("Room search is required");

    expect(getRoomRecords).not.toHaveBeenCalled();
  });
});
