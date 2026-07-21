import { getRooms, getAvailableRooms } from "../service/roomService.js";

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
