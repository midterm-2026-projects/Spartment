import {
  getRooms as getRoomRecords,
  getAvailableRooms as getAvailableRoomRecords,
  getRoomById,
} from "../model/roomModel.js";

/*
|--------------------------------------------------------------------------
| Get All Rooms
|--------------------------------------------------------------------------
*/

export async function getRooms() {
  return getRoomRecords();
}

/*
|--------------------------------------------------------------------------
| Get Available Rooms
|--------------------------------------------------------------------------
*/

export async function getAvailableRooms() {
  return getAvailableRoomRecords();
}

/*
|--------------------------------------------------------------------------
| Get Room by ID
|--------------------------------------------------------------------------
*/

export async function fetchRoomById(roomId) {
  if (!roomId) {
    throw new Error("Room ID is required");
  }

  const room = await getRoomById(roomId);

  if (!room) {
    throw new Error("Room not found");
  }

  return room;
}

/*
|--------------------------------------------------------------------------
| Search Room
|--------------------------------------------------------------------------
*/

export async function searchRoom(search) {
  if (!search || !String(search).trim()) {
    throw new Error("Room search is required");
  }

  const rooms = await getRoomRecords();

  const keyword = String(search).trim().toLowerCase();

  const room = rooms.find((item) => {
    const roomNumber = item.room_number?.toLowerCase() || "";

    const roomType = item.room_type?.toLowerCase() || "";

    const status = item.status?.toLowerCase() || "";

    return (
      roomNumber.includes(keyword) ||
      roomType.includes(keyword) ||
      status.includes(keyword)
    );
  });

  if (!room) {
    throw new Error("Room not found");
  }

  return room;
}

/*
|--------------------------------------------------------------------------
| Compatibility Function
|--------------------------------------------------------------------------
*/

export async function fetchRoomList() {
  return getRooms();
}
