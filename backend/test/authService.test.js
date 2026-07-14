import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

vi.mock("../model/authModel.js", () => ({
  getUserByEmail: vi.fn(),
}));

vi.mock("../validation/authValidation.js", () => ({
  validateLoginCredentials: vi.fn(),
}));

import { getUserByEmail } from "../model/authModel.js";

import { validateLoginCredentials } from "../validation/authValidation.js";

import { authenticateUser } from "../service/authService.js";

describe("Authentication Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should authenticate an admin successfully", async () => {
    // Arrange
    const email = "admin@email.com";
    const password = "admin123";

    const mockAdmin = {
      id: 1,
      name: "System Administrator",
      email,
      password,
      role: "admin",
    };

    getUserByEmail.mockResolvedValue(mockAdmin);

    // Act
    const result = await authenticateUser(
      email,
      password
    );

    // Assert
    expect(validateLoginCredentials).toHaveBeenCalledWith(
      email,
      password
    );

    expect(getUserByEmail).toHaveBeenCalledWith(
      email
    );

    expect(result).toEqual({
      id: 1,
      name: "System Administrator",
      email,
      role: "admin",
    });
  });

  it("should authenticate a tenant successfully", async () => {
    // Arrange
    const email = "tenant@email.com";
    const password = "tenant123";

    const mockTenant = {
      id: 2,
      name: "Juan Dela Cruz",
      email,
      password,
      role: "tenant",
    };

    getUserByEmail.mockResolvedValue(mockTenant);

    // Act
    const result = await authenticateUser(
      email,
      password
    );

    // Assert
    expect(validateLoginCredentials).toHaveBeenCalledWith(
      email,
      password
    );

    expect(getUserByEmail).toHaveBeenCalledWith(
      email
    );

    expect(result).toEqual({
      id: 2,
      name: "Juan Dela Cruz",
      email,
      role: "tenant",
    });
  });

  it("should throw an error when the password is incorrect", async () => {
    // Arrange
    const email = "admin@email.com";

    getUserByEmail.mockResolvedValue({
      id: 1,
      name: "System Administrator",
      email,
      password: "admin123",
      role: "admin",
    });

    // Act & Assert
    await expect(
      authenticateUser(email, "wrongpassword")
    ).rejects.toThrow("Invalid password.");

    expect(validateLoginCredentials).toHaveBeenCalledWith(
      email,
      "wrongpassword"
    );

    expect(getUserByEmail).toHaveBeenCalledWith(
      email
    );
  });

  it("should throw an error when the user does not exist", async () => {
    // Arrange
    const email = "unknown@email.com";
    const password = "password123";

    getUserByEmail.mockRejectedValue(
      new Error("User not found.")
    );

    // Act & Assert
    await expect(
      authenticateUser(email, password)
    ).rejects.toThrow("User not found.");

    expect(validateLoginCredentials).toHaveBeenCalledWith(
      email,
      password
    );

    expect(getUserByEmail).toHaveBeenCalledWith(
      email
    );
  });

  it("should throw an error when the password is provided but the email is empty", async () => {
    // Arrange
    const email = "";
    const password = "admin123";

    validateLoginCredentials.mockImplementation(() => {
      throw new Error("Email is required.");
    });

    // Act & Assert
    await expect(
      authenticateUser(email, password)
    ).rejects.toThrow("Email is required.");

    expect(validateLoginCredentials).toHaveBeenCalledWith(
      email,
      password
    );

    expect(getUserByEmail).not.toHaveBeenCalled();
  });

  it("should throw an error when the email is provided but the password is empty", async () => {
    // Arrange
    const email = "admin@email.com";
    const password = "";

    validateLoginCredentials.mockImplementation(() => {
      throw new Error("Password is required.");
    });

    // Act & Assert
    await expect(
      authenticateUser(email, password)
    ).rejects.toThrow("Password is required.");

    expect(validateLoginCredentials).toHaveBeenCalledWith(
      email,
      password
    );

    expect(getUserByEmail).not.toHaveBeenCalled();
  });

  it("should not retrieve the user when the email format is invalid", async () => {
    // Arrange
    const email = "adminemail.com";
    const password = "admin123";

    validateLoginCredentials.mockImplementation(() => {
      throw new Error("Invalid email format.");
    });

    // Act & Assert
    await expect(
      authenticateUser(email, password)
    ).rejects.toThrow("Invalid email format.");

    expect(validateLoginCredentials).toHaveBeenCalledWith(
      email,
      password
    );

    expect(getUserByEmail).not.toHaveBeenCalled();
  });
});