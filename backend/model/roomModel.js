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
    .order("room_number", {
      ascending: true,
    });

  if (error) {
    throw new Error(`Failed to retrieve public room catalogue: ${error.message}`);
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

export async function updateRoomRecord(roomId, updates) {
  const payload = {};
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.monthlyRent !== undefined) payload.monthly_rent = Number(updates.monthlyRent);
  const { data, error } = await supabase.from("rooms").update(payload).eq("id", roomId).select("*").maybeSingle();
  if (error) throw new Error(`Failed to update room: ${error.message}`);
  if (!data) throw new Error("Room not found");
  return data;
}

export async function createRoomRecord(data) {
  const { data: room, error } = await supabase.from("rooms").insert({
    room_number: String(data.roomNumber).trim(),
    room_type: String(data.roomType || "Standard").trim(),
    description: String(data.description || "Apartment room").trim(),
    monthly_rent: Number(data.monthlyRent),
    status: data.status || "Available",
  }).select("*").single();
  if (error) throw new Error(error.code === "23505" ? "Room number already exists" : `Failed to create room: ${error.message}`);
  return room;
}
