import { describe, expect, it } from "vitest";

import { validateInquiry } from "../validation/inquiryValidation.js";

describe("Inquiry Validation", () => {
  const validInquiry = {
    name: "Juan Dela Cruz",
    email: "juan@gmail.com",
    roomId: "22222222-2222-4222-8222-222222222222",
    type: "Room Inquiry",
    message: "I am interested.",
  };

  it("should accept a valid inquiry", () => {
    expect(validateInquiry(validInquiry)).toBe(true);
  });

  it("should require the tenant name", () => {
    expect(() =>
      validateInquiry({
        ...validInquiry,
        name: "",
      }),
    ).toThrow("Name is required.");
  });

  it("should reject an invalid email", () => {
    expect(() =>
      validateInquiry({
        ...validInquiry,
        email: "invalid-email",
      }),
    ).toThrow("Invalid email format.");
  });

  it("should require roomId", () => {
    expect(() =>
      validateInquiry({
        ...validInquiry,
        roomId: null,
      }),
    ).toThrow("Room is required.");
  });

  it("should require an inquiry message", () => {
    expect(() =>
      validateInquiry({
        ...validInquiry,
        message: "",
      }),
    ).toThrow("Message is required.");
  });
});
