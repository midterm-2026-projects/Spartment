import { supabase } from "../config/supabaseClient.js";

/*
|--------------------------------------------------------------------------
| Room Model
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Get All Rooms
|--------------------------------------------------------------------------
*/

export async function getRooms() {
  const { data, error } = await supabase
    .from("rooms")
    .select(
      `
      id,
      room_number,
      room_type,
      description,
      monthly_rent,
      status,
      created_at,
      updated_at
    `,
    )
    .order("room_number", {
      ascending: true,
    });

  if (error) {
    throw new Error(`Failed to retrieve rooms: ${error.message}`);
  }

  return data ?? [];
}

/*
|--------------------------------------------------------------------------
| Get Available Rooms
|--------------------------------------------------------------------------
*/

export async function getAvailableRooms() {
  const { data, error } = await supabase
    .from("rooms")
    .select(
      `
      id,
      room_number,
      room_type,
      description,
      monthly_rent,
      status,
      created_at,
      updated_at
    `,
    )
    .eq("status", "Available")
    .order("room_number", {
      ascending: true,
    });

  if (error) {
    throw new Error(`Failed to retrieve available rooms: ${error.message}`);
  }

  return data ?? [];
}

/*
|--------------------------------------------------------------------------
| Get Room by ID
|--------------------------------------------------------------------------
*/

export async function getRoomById(roomId) {
  const { data, error } = await supabase
    .from("rooms")
    .select(
      `
      id,
      room_number,
      room_type,
      description,
      monthly_rent,
      status,
      created_at,
      updated_at
    `,
    )
    .eq("id", roomId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to retrieve room: ${error.message}`);
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Update Room Status
|--------------------------------------------------------------------------
*/

export async function updateRoomStatus(roomId, status) {
  const { data, error } = await supabase
    .from("rooms")
    .update({
      status,
    })
    .eq("id", roomId)
    .select(
      `
      id,
      room_number,
      room_type,
      description,
      monthly_rent,
      status,
      created_at,
      updated_at
    `,
    )
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update room status: ${error.message}`);
  }

  return data;
}
