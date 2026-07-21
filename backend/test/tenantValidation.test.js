import { describe, expect, it } from "vitest";

import {
  validateTenantId,
  validateTenantName,
  validateTenantPassword,
  validateCreateTenant,
} from "../validation/tenantValidation.js";

describe("Tenant Validation", () => {
  const validTenantId = "11111111-1111-4111-8111-111111111111";

  const validInquiryId = "22222222-2222-4222-8222-222222222222";

  const validRoomId = "33333333-3333-4333-8333-333333333333";

  const validTenantData = {
    inquiryId: validInquiryId,
    fullName: "Juan Dela Cruz",
    email: "juan@gmail.com",
    contact: "09123456789",
    roomId: validRoomId,
    username: "juan101",
    password: "Spartment2026",
  };

  describe("validateTenantId", () => {
    it("should accept a valid tenant UUID", () => {
      expect(() => validateTenantId(validTenantId)).not.toThrow();
    });

    it("should reject an undefined tenant ID", () => {
      expect(() => validateTenantId(undefined)).toThrow(
        "Tenant ID is required.",
      );
    });

    it("should reject a null tenant ID", () => {
      expect(() => validateTenantId(null)).toThrow("Tenant ID is required.");
    });

    it("should reject an empty tenant ID", () => {
      expect(() => validateTenantId("")).toThrow("Tenant ID is required.");
    });

    it("should reject a numeric tenant ID", () => {
      expect(() => validateTenantId(1)).toThrow(
        "Tenant ID must be a UUID string.",
      );
    });

    it("should reject an invalid UUID string", () => {
      expect(() => validateTenantId("not-a-valid-uuid")).toThrow(
        "Invalid tenant ID.",
      );
    });
  });

  describe("validateTenantName", () => {
    it("should accept a valid tenant name", () => {
      expect(() => validateTenantName("Juan Dela Cruz")).not.toThrow();
    });

    it("should reject an empty tenant name", () => {
      expect(() => validateTenantName("")).toThrow("Tenant name is required.");
    });

    it("should reject a whitespace-only tenant name", () => {
      expect(() => validateTenantName("   ")).toThrow(
        "Tenant name is required.",
      );
    });
  });

  describe("validateTenantPassword", () => {
    it("should accept a valid tenant password", () => {
      expect(() => validateTenantPassword("Spartment2026")).not.toThrow();
    });

    it("should reject an empty password", () => {
      expect(() => validateTenantPassword("")).toThrow("Password is required.");
    });

    it("should reject a whitespace-only password", () => {
      expect(() => validateTenantPassword("   ")).toThrow(
        "Password is required.",
      );
    });

    it("should reject a password shorter than eight characters", () => {
      expect(() => validateTenantPassword("short")).toThrow(
        "Password must contain at least 8 characters.",
      );
    });
  });

  describe("validateCreateTenant", () => {
    it("should accept valid tenant creation data", () => {
      expect(() => validateCreateTenant(validTenantData)).not.toThrow();
    });

    it("should reject missing tenant information", () => {
      expect(() => validateCreateTenant(null)).toThrow(
        "Tenant information is required.",
      );
    });

    it("should require an inquiry ID", () => {
      expect(() =>
        validateCreateTenant({
          ...validTenantData,
          inquiryId: null,
        }),
      ).toThrow("Inquiry ID is required.");
    });

    it("should require a full name", () => {
      expect(() =>
        validateCreateTenant({
          ...validTenantData,
          fullName: "",
        }),
      ).toThrow("Full name is required.");
    });

    it("should require an email", () => {
      expect(() =>
        validateCreateTenant({
          ...validTenantData,
          email: "",
        }),
      ).toThrow("Email is required.");
    });

    it("should reject an invalid email", () => {
      expect(() =>
        validateCreateTenant({
          ...validTenantData,
          email: "invalid-email",
        }),
      ).toThrow("Invalid email format.");
    });

    it("should require a room ID", () => {
      expect(() =>
        validateCreateTenant({
          ...validTenantData,
          roomId: null,
        }),
      ).toThrow("Room is required.");
    });

    it("should require a username", () => {
      expect(() =>
        validateCreateTenant({
          ...validTenantData,
          username: "",
        }),
      ).toThrow("Username is required.");
    });

    it("should require a password", () => {
      expect(() =>
        validateCreateTenant({
          ...validTenantData,
          password: "",
        }),
      ).toThrow("Password is required.");
    });

    it("should reject a short default password", () => {
      expect(() =>
        validateCreateTenant({
          ...validTenantData,
          password: "short",
        }),
      ).toThrow("Password must contain at least 8 characters.");
    });
  });
});
