import { getRoomList } from "../model/roomModel.js";

import { validateRoomSearch } from "../validation/roomValidation.js";

export async function fetchRoomList() {
  try {
    const rooms = await getRoomList();

    return rooms;
  } catch (error) {
    throw new Error("Failed to retrieve room records.");
  }
}

export async function searchRoom(search) {
  try {
    // Validate search input
    validateRoomSearch(search);

    // Retrieve room records
    const rooms = await getRoomList();

    // Search by room number or room status
    const filteredRooms = rooms.filter(
      (room) =>
        room.roomNumber
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        room.status
          .toLowerCase()
          .includes(search.toLowerCase())
    );

    // Check if any room exists
    if (filteredRooms.length === 0) {
      throw new Error("Room not found.");
    }

    return filteredRooms;
  } catch (error) {
    throw new Error(error.message);
  }
}