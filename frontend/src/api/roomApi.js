const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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
  const result = await getRooms();

  const rooms = Array.isArray(result) ? result : result?.data || [];

  return rooms.filter((room) => {
    const status = String(room.status || "").toLowerCase();

    return status === "available";
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
