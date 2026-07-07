import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../model/roomModel.js", () => ({
  getRoomList: vi.fn(),
}));

import { getRoomList } from "../model/roomModel.js";
import { fetchRoomList } from "../service/roomService.js";

describe("Room Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve room records successfully", async () => {
    // Arrange
    const mockRooms = [
      {
        id: 1,
        roomNumber: "Room 101",
        status: "Occupied",
        tenant: "Maria Santos",
        rent: 6500,
      },
      {
        id: 2,
        roomNumber: "Room 102",
        status: "Vacant",
        tenant: "None",
        rent: 5500,
      },
      {
        id: 3,
        roomNumber: "Room 103",
        status: "Maintenance",
        tenant: "Juan Dela Cruz",
        rent: 7000,
      },
    ];

    getRoomList.mockResolvedValue(mockRooms);

    // Act
    const result = await fetchRoomList();

    // Assert
    expect(result).toEqual(mockRooms);
    expect(result).toHaveLength(3);
  });

  it("should return an empty room list when no records exist", async () => {
    // Arrange
    getRoomList.mockResolvedValue([]);

    // Act
    const result = await fetchRoomList();

    // Assert
    expect(result).toHaveLength(0);
  });

  it("should throw an error when retrieving room records fails", async () => {
    // Arrange
    getRoomList.mockRejectedValue(new Error("Database Error"));

    // Act & Assert
    await expect(fetchRoomList()).rejects.toThrow(
      "Failed to retrieve room records."
    );
  });
});