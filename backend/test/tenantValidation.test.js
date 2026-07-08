import { describe, expect, it } from "vitest";

import {
  validateTenantId,
  validateTenantName,
} from "../validation/tenantValidation.js";

describe("Tenant Validation", () => {
  it("should accept a valid tenant id", () => {
    // Arrange
    const id = 1;

    // Act & Assert
    expect(() => validateTenantId(id)).not.toThrow();
  });

  it("should reject an invalid tenant id", () => {
    // Arrange
    const id = null;

    // Act & Assert
    expect(() => validateTenantId(id)).toThrow(
      "Tenant ID is required."
    );
  });

  it("should accept a valid tenant name", () => {
    // Arrange
    const name = "Juan Dela Cruz";

    // Act & Assert
    expect(() => validateTenantName(name)).not.toThrow();
  });

  it("should reject an empty tenant name", () => {
    // Arrange
    const name = "";

    // Act & Assert
    expect(() => validateTenantName(name)).toThrow(
      "Tenant name is required."
    );
  });
});