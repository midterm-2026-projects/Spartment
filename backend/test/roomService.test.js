import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

vi.mock("../model/roomModel.js", () => ({
  getRoomList: vi.fn(),
}));

vi.mock("../validation/roomValidation.js", () => ({
  validateRoomSearch: vi.fn(),
}));

import { getRoomList } from "../model/roomModel.js";

import { validateRoomSearch } from "../validation/roomValidation.js";

import {
  fetchRoomList,
  searchRoom,
} from "../service/roomService.js";

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
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it("should search room records using the room number", async () => {
    // Arrange
    const search = "Room 101";

    const mockRooms = [
      {
        id: 1,
        roomNumber: "Room 101",
        status: "Occupied",
        tenant: "Maria Santos",
        rent: 6500,
      },
    ];

    getRoomList.mockResolvedValue(mockRooms);

    // Act
    const result = await searchRoom(search);

    // Assert
    expect(validateRoomSearch).toHaveBeenCalledWith(
      search
    );

    expect(result).toEqual(mockRooms);
    expect(result).toHaveLength(1);
  });

  it("should search room records using the room status", async () => {
    // Arrange
    const search = "Vacant";

    const mockRooms = [
      {
        id: 2,
        roomNumber: "Room 102",
        status: "Vacant",
        tenant: "None",
        rent: 5500,
      },
    ];

    getRoomList.mockResolvedValue(mockRooms);

    // Act
    const result = await searchRoom(search);

    // Assert
    expect(validateRoomSearch).toHaveBeenCalledWith(
      search
    );

    expect(result).toEqual(mockRooms);
    expect(result).toHaveLength(1);
  });

  it("should retrieve a room regardless of the search letter casing", async () => {
    // Arrange
    const search = "occupied";

    const mockRooms = [
      {
        id: 1,
        roomNumber: "Room 101",
        status: "Occupied",
        tenant: "Maria Santos",
        rent: 6500,
      },
    ];

    getRoomList.mockResolvedValue(mockRooms);

    // Act
    const result = await searchRoom(search);

    // Assert
    expect(validateRoomSearch).toHaveBeenCalledWith(
      search
    );

    expect(result).toEqual(mockRooms);
    expect(result).toHaveLength(1);
  });

  it("should throw an error when no room is found", async () => {
    // Arrange
    const search = "Room 999";

    getRoomList.mockResolvedValue([]);

    // Act & Assert
    await expect(
      searchRoom(search)
    ).rejects.toThrow("Room not found.");
  });

  it("should throw an error when the room search is invalid", async () => {
    // Arrange
    const search = "";

    validateRoomSearch.mockImplementation(() => {
      throw new Error("Room search is required.");
    });

    // Act & Assert
    await expect(
      searchRoom(search)
    ).rejects.toThrow("Room search is required.");

    expect(getRoomList).not.toHaveBeenCalled();
  });

  it("should throw an error when retrieving room records fails", async () => {
    // Arrange
    getRoomList.mockRejectedValue(
      new Error("Database Error")
    );

    // Act & Assert
    await expect(fetchRoomList()).rejects.toThrow(
      "Failed to retrieve room records."
    );
  });
});