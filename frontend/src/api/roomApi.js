const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

const API_URL = `${API_BASE_URL}/rooms`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function parseResponse(response, fallbackMessage) {
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || fallbackMessage);
  }

  return result;
}

export async function getRooms() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return parseResponse(response, "Failed to retrieve rooms.");
}

export async function getRoomById(roomId) {
  if (!roomId) {
    throw new Error("Room ID is required.");
  }

  const response = await fetch(`${API_URL}/${roomId}`, {
    method: "GET",
  });

  return parseResponse(response, "Failed to retrieve room.");
}

export async function getAvailableRooms() {
  const response = await fetch(`${API_URL}/available`, {
    method: "GET",
  });

  const result = await parseResponse(
    response,
    "Failed to retrieve available rooms.",
  );

  const rooms = Array.isArray(result) ? result : result?.data || [];

  return rooms.filter((room) => {
    const status = String(room.status || "").trim().toLowerCase();

    return status === "available" || status === "vacant";
  });
}

export async function updateRoom(roomId, data) {
  if (!roomId) {
    throw new Error("Room ID is required.");
  }

  const response = await fetch(`${API_URL}/${roomId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  return parseResponse(response, "Failed to update room.");
}

export async function createRoom(data) {
  const response = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json", ...getAuthHeaders() }, body: JSON.stringify(data) });
  return parseResponse(response, "Failed to create room.");
}

export async function getPublicRoomCatalogue() {
  const response = await fetch(`${API_URL}/available`, { method: "GET" });
  const result = await parseResponse(response, "Failed to retrieve room catalogue.");
  return Array.isArray(result) ? result : result?.data || [];
}
