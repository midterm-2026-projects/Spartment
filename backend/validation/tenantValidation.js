export function validateTenantId(id) {
  if (id === undefined || id === null) {
    throw new Error("Tenant ID is required.");
  }

  if (typeof id !== "number") {
    throw new Error("Tenant ID must be a number.");
  }
}

export function validateTenantName(name) {
  if (!name || name.trim() === "") {
    throw new Error("Tenant name is required.");
  }
}