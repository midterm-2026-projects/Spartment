const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const API_URL = `${API_BASE_URL}/tenants`;

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

export async function createTenant(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Tenant information is required.");
  }

  const payload = {
    inquiryId: data.inquiryId,
    fullName: data.fullName?.trim(),
    email: data.email?.trim(),
    contact: data.contact?.trim(),
    roomId: data.roomId,
    username: data.username?.trim(),
    password: data.password,
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response, "Failed to create tenant.");
}
