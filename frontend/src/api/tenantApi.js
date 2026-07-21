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

export async function getTenants() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return parseResponse(response, "Failed to retrieve tenants.");
}

export async function getTenantInformation(tenantId) {
  if (!tenantId) {
    throw new Error("Tenant ID is required.");
  }

  const response = await fetch(`${API_URL}/${tenantId}`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return parseResponse(response, "Failed to retrieve tenant information.");
}

export async function updateTenant(tenantId, data) {
  if (!tenantId) {
    throw new Error("Tenant ID is required.");
  }

  const response = await fetch(`${API_URL}/${tenantId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  return parseResponse(response, "Failed to update tenant.");
}
