const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateTenantId(id) {
  if (id === undefined || id === null || id === "") {
    throw new Error("Tenant ID is required.");
  }

  if (typeof id !== "string") {
    throw new Error("Tenant ID must be a UUID string.");
  }

  if (!uuidPattern.test(id)) {
    throw new Error("Invalid tenant ID.");
  }

  return true;
}

export function validateTenantName(name) {
  if (!name || !String(name).trim()) {
    throw new Error("Tenant name is required.");
  }

  return true;
}

export function validateTenantPassword(password) {
  if (!password || !String(password).trim()) {
    throw new Error("Password is required.");
  }

  if (String(password).length < 8) {
    throw new Error("Password must contain at least 8 characters.");
  }

  return true;
}

export function validateCreateTenant(data) {
  if (!data) {
    throw new Error("Tenant information is required.");
  }

  if (!data.inquiryId) {
    throw new Error("Inquiry ID is required.");
  }

  if (!data.fullName || !String(data.fullName).trim()) {
    throw new Error("Full name is required.");
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

  if (!data.username || !String(data.username).trim()) {
    throw new Error("Username is required.");
  }

  validateTenantPassword(data.password);

  return true;
}
