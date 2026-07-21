const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const API_URL = `${API_BASE_URL}/inquiries`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function parseResponse(response, fallbackMessage) {
  const result = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || fallbackMessage,
    );
  }

  return result;
}

export async function getCustomerRequests() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return parseResponse(
    response,
    "Failed to retrieve customer requests.",
  );
}

export async function getCustomerRequestById(
  inquiryId,
) {
  if (!inquiryId) {
    throw new Error("Inquiry ID is required.");
  }

  const response = await fetch(
    `${API_URL}/${inquiryId}`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    },
  );

  return parseResponse(
    response,
    "Failed to retrieve customer request.",
  );
}

export async function approveRequest(
  inquiryId,
) {
  if (!inquiryId) {
    throw new Error("Inquiry ID is required.");
  }

  const response = await fetch(
    `${API_URL}/${inquiryId}/approve`,
    {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(),
      },
    },
  );

  return parseResponse(
    response,
    "Failed to approve request.",
  );
}

export async function rejectRequest(
  inquiryId,
) {
  if (!inquiryId) {
    throw new Error("Inquiry ID is required.");
  }

  const response = await fetch(
    `${API_URL}/${inquiryId}/reject`,
    {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(),
      },
    },
  );

  return parseResponse(
    response,
    "Failed to reject request.",
  );
}