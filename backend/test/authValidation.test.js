import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { validateLoginCredentials } from "../validation/authValidation.js";

describe("Authentication Validation", () => {
  beforeEach(() => {});

  it("should validate login credentials successfully", () => {
    // Arrange
    const email = "admin@email.com";
    const password = "admin123";

    // Act & Assert
    expect(() =>
      validateLoginCredentials(email, password)
    ).not.toThrow();
  });

  it("should throw an error when the email is empty", () => {
    // Arrange
    const email = "";
    const password = "admin123";

    // Act & Assert
    expect(() =>
      validateLoginCredentials(email, password)
    ).toThrow("Email is required.");
  });

  it("should throw an error when the password is empty", () => {
    // Arrange
    const email = "admin@email.com";
    const password = "";

    // Act & Assert
    expect(() =>
      validateLoginCredentials(email, password)
    ).toThrow("Password is required.");
  });

  it("should throw an error when both email and password are empty", () => {
    // Arrange
    const email = "";
    const password = "";

    // Act & Assert
    expect(() =>
      validateLoginCredentials(email, password)
    ).toThrow("Email is required.");
  });

  it("should throw an error when the email format is invalid", () => {
    // Arrange
    const email = "adminemail.com";
    const password = "admin123";

    // Act & Assert
    expect(() =>
      validateLoginCredentials(email, password)
    ).toThrow("Invalid email format.");
  });

  it("should throw an error when the email contains only spaces", () => {
    // Arrange
    const email = "   ";
    const password = "admin123";

    // Act & Assert
    expect(() =>
      validateLoginCredentials(email, password)
    ).toThrow("Email is required.");
  });

  it("should throw an error when the password contains only spaces", () => {
    // Arrange
    const email = "admin@email.com";
    const password = "   ";

    // Act & Assert
    expect(() =>
      validateLoginCredentials(email, password)
    ).toThrow("Password is required.");
  });
});