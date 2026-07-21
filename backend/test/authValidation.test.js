import { describe, expect, it } from "vitest";

import { validateLoginCredentials } from "../validation/authValidation.js";

describe("Authentication Validation", () => {
  it("should accept an email and valid password", () => {
    expect(validateLoginCredentials("admin@email.com", "admin123")).toBe(true);
  });

  it("should accept a username and valid password", () => {
    expect(validateLoginCredentials("administrator", "admin123")).toBe(true);
  });

  it("should reject an empty identifier", () => {
    expect(() => validateLoginCredentials("", "admin123")).toThrow(
      "Email or username is required.",
    );
  });

  it("should reject an empty password", () => {
    expect(() => validateLoginCredentials("admin@email.com", "")).toThrow(
      "Password is required.",
    );
  });

  it("should reject a password shorter than eight characters", () => {
    expect(() => validateLoginCredentials("admin@email.com", "short")).toThrow(
      "Password must contain at least 8 characters.",
    );
  });
});
