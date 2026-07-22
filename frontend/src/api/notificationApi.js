const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

const API_URL = `${API_BASE_URL}/notifications`;

async function parseResponse(response, fallbackMessage) {
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || fallbackMessage);
  }

  return result?.data ?? result;
}

export async function getNotifications() {
  const response = await fetch(API_URL, { headers: getAuthHeaders() });

  return parseResponse(response, "Failed to retrieve notifications.");
}

export async function updateNotification(id) {
  const response = await fetch(`${API_URL}/${id}/read`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  return parseResponse(response, "Failed to update notification.");
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
