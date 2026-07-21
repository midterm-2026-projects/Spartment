const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const API_URL = `${API_BASE_URL}/inquiries`;

async function parseResponse(response, fallbackMessage) {
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || fallbackMessage);
  }

  return result;
}

export async function submitInquiry(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Inquiry information is required.");
  }

  const payload = {
    name: data.name?.trim(),
    email: data.email?.trim(),
    contact: data.contact?.trim(),
    roomId: data.roomId,
    type: data.type?.trim(),
    moveInDate: data.moveInDate,
    message: data.message?.trim(),
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response, "Failed to submit inquiry.");
}
