import { getRooms, getAvailableRooms } from "../service/roomService.js";
import { createRoomRecord, updateRoomRecord } from "../model/roomModel.js";

/*
|--------------------------------------------------------------------------
| Get All Rooms
|--------------------------------------------------------------------------
| Intended for the administrator.
|--------------------------------------------------------------------------
*/

export const fetchRooms = async (req, res) => {
  try {
    const rooms = await getRooms();

    return res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Available Rooms
|--------------------------------------------------------------------------
| Can be used by guests before submitting an inquiry.
|--------------------------------------------------------------------------
*/

export const fetchAvailableRooms = async (req, res) => {
  try {
    const rooms = await getAvailableRooms();

    return res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await updateRoomRecord(req.params.id, req.body);
    return res.status(200).json({ success: true, data: room });
  } catch (error) {
    return res.status(error.message === "Room not found" ? 404 : 400).json({ success: false, message: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    if (!req.body.roomNumber || req.body.monthlyRent === undefined) return res.status(400).json({ success: false, message: "Room number and monthly rent are required" });
    const room = await createRoomRecord(req.body);
    return res.status(201).json({ success: true, data: room });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
};
