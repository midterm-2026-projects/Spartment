import { getRoomList } from "../model/roomModel.js";

export async function fetchRoomList() {
  try {
    const rooms = await getRoomList();

    return rooms;
  } catch (error) {
    throw new Error("Failed to retrieve room records.");
  }
}