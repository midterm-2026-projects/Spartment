import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}));

vi.mock("../model/authModel.js", () => ({
  getUserByIdentifier: vi.fn(),
  getUserById: vi.fn(),
}));

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { getUserByIdentifier, getUserById } from "../model/authModel.js";

import {
  loginUser,
  authenticateUser,
  fetchAuthenticatedUser,
  logoutUser,
} from "../service/authService.js";

describe("Authentication Service", () => {
  const previousJwtSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    vi.clearAllMocks();

    process.env.JWT_SECRET = "test-jwt-secret-key";

    process.env.JWT_EXPIRES_IN = "1d";
  });

  afterAll(() => {
    process.env.JWT_SECRET = previousJwtSecret;
  });

  it("should authenticate an administrator using email", async () => {
    const user = {
      id: "11111111-1111-4111-8111-111111111111",
      name: "System Administrator",
      email: "admin@email.com",
      username: "administrator",
      password_hash: "hashed-admin-password",
      role: "admin",
      status: "Active",
      created_at: "2026-07-21T00:00:00.000Z",
      updated_at: "2026-07-21T00:00:00.000Z",
    };

    getUserByIdentifier.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("generated-token");

    const result = await loginUser({
      identifier: "admin@email.com",
      password: "admin123",
    });

    expect(getUserByIdentifier).toHaveBeenCalledWith("admin@email.com");

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "admin123",
      "hashed-admin-password",
    );

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: user.id,
        role: "admin",
      },
      "test-jwt-secret-key",
      {
        expiresIn: "1d",
      },
    );

    expect(result).toEqual({
      token: "generated-token",
      tokenType: "Bearer",
      user: {
        id: user.id,
        name: "System Administrator",
        email: "admin@email.com",
        username: "administrator",
        role: "admin",
        status: "Active",
        createdAt: "2026-07-21T00:00:00.000Z",
        updatedAt: "2026-07-21T00:00:00.000Z",
      },
    });
  });

  it("should authenticate using a username", async () => {
    getUserByIdentifier.mockResolvedValue({
      id: "22222222-2222-4222-8222-222222222222",
      name: "Juan Dela Cruz",
      email: "tenant@email.com",
      username: "juan101",
      password_hash: "hashed-password",
      role: "tenant",
      status: "Active",
    });

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("tenant-token");

    const result = await loginUser({
      identifier: "juan101",
      password: "tenant123",
    });

    expect(getUserByIdentifier).toHaveBeenCalledWith("juan101");

    expect(result.token).toBe("tenant-token");
    expect(result.user.role).toBe("tenant");
  });

  it("should reject an incorrect password", async () => {
    getUserByIdentifier.mockResolvedValue({
      id: "11111111-1111-4111-8111-111111111111",
      password_hash: "hashed-password",
      role: "admin",
      status: "Active",
    });

    bcrypt.compare.mockResolvedValue(false);

    await expect(
      loginUser({
        identifier: "admin@email.com",
        password: "wrongpassword",
      }),
    ).rejects.toThrow("Invalid email, username, or password");

    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("should reject a missing user", async () => {
    getUserByIdentifier.mockResolvedValue(null);

    await expect(
      loginUser({
        identifier: "unknown@email.com",
        password: "password123",
      }),
    ).rejects.toThrow("Invalid email, username, or password");

    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it("should reject a suspended account", async () => {
    getUserByIdentifier.mockResolvedValue({
      id: "11111111-1111-4111-8111-111111111111",
      password_hash: "hashed-password",
      role: "admin",
      status: "Suspended",
    });

    bcrypt.compare.mockResolvedValue(true);

    await expect(
      loginUser({
        identifier: "admin@email.com",
        password: "admin123",
      }),
    ).rejects.toThrow("Account is suspended");

    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("should require an identifier", async () => {
    await expect(
      loginUser({
        identifier: "",
        password: "admin123",
      }),
    ).rejects.toThrow("Email or username is required");

    expect(getUserByIdentifier).not.toHaveBeenCalled();
  });

  it("should require a password", async () => {
    await expect(
      loginUser({
        identifier: "admin@email.com",
        password: "",
      }),
    ).rejects.toThrow("Password is required");

    expect(getUserByIdentifier).not.toHaveBeenCalled();
  });

  it("should support the compatibility authenticateUser function", async () => {
    getUserByIdentifier.mockResolvedValue({
      id: "11111111-1111-4111-8111-111111111111",
      name: "System Administrator",
      email: "admin@email.com",
      username: "administrator",
      password_hash: "hashed-password",
      role: "admin",
      status: "Active",
    });

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("generated-token");

    const result = await authenticateUser("admin@email.com", "admin123");

    expect(result.token).toBe("generated-token");
  });

  it("should retrieve the authenticated user", async () => {
    const userId = "11111111-1111-4111-8111-111111111111";

    getUserById.mockResolvedValue({
      id: userId,
      name: "System Administrator",
      email: "admin@email.com",
      username: "administrator",
      role: "admin",
      status: "Active",
      created_at: "2026-07-21",
      updated_at: "2026-07-21",
    });

    const result = await fetchAuthenticatedUser(userId);

    expect(getUserById).toHaveBeenCalledWith(userId);

    expect(result.password_hash).toBeUndefined();
    expect(result.role).toBe("admin");
  });

  it("should complete stateless logout", async () => {
    await expect(logoutUser()).resolves.toBe(true);
  });

  it("should throw when JWT_SECRET is missing", async () => {
    delete process.env.JWT_SECRET;

    getUserByIdentifier.mockResolvedValue({
      id: "11111111-1111-4111-8111-111111111111",
      password_hash: "hashed-password",
      role: "admin",
      status: "Active",
    });

    bcrypt.compare.mockResolvedValue(true);

    await expect(
      loginUser({
        identifier: "admin@email.com",
        password: "admin123",
      }),
    ).rejects.toThrow("JWT_SECRET is missing");
  });
});
