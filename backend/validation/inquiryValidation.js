export function validateInquiry(data) {
  if (!data) {
    throw new Error("Inquiry information is required.");
  }

  if (!data.name || !String(data.name).trim()) {
    throw new Error("Name is required.");
  }

  if (!data.email || !String(data.email).trim()) {
    throw new Error("Email is required.");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(String(data.email).trim())) {
    throw new Error("Invalid email format.");
  }

  if (!data.roomId) {
    throw new Error("Room is required.");
  }

  if (!data.type || !String(data.type).trim()) {
    throw new Error("Inquiry type is required.");
  }

  if (!data.message || !String(data.message).trim()) {
    throw new Error("Message is required.");
  }

  return true;
}
