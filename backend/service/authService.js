import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { getUserByIdentifier, getUserById } from "../model/authModel.js";

/*
|--------------------------------------------------------------------------
| Generate JWT
|--------------------------------------------------------------------------
*/

function generateAccessToken(user) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error(
      "JWT_SECRET is missing from the backend environment variables",
    );
  }

  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
  );
}

/*
|--------------------------------------------------------------------------
| Remove Sensitive User Fields
|--------------------------------------------------------------------------
*/

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
    status: user.status,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
| Supports either email or username.
|--------------------------------------------------------------------------
*/

export async function loginUser({ identifier, password }) {
  if (!identifier || !String(identifier).trim()) {
    throw new Error("Email or username is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  const user = await getUserByIdentifier(String(identifier).trim());

  if (!user) {
    throw new Error("Invalid email, username, or password");
  }

  const passwordIsValid = await bcrypt.compare(password, user.password_hash);

  if (!passwordIsValid) {
    throw new Error("Invalid email, username, or password");
  }

  if (user.status === "Suspended") {
    throw new Error("Account is suspended");
  }

  if (user.status !== "Active") {
    throw new Error("Account is inactive");
  }

  const token = generateAccessToken(user);

  return {
    token,
    tokenType: "Bearer",
    user: sanitizeUser(user),
  };
}

/*
|--------------------------------------------------------------------------
| Get Authenticated User
|--------------------------------------------------------------------------
*/

export async function fetchAuthenticatedUser(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return sanitizeUser(user);
}

/*
|--------------------------------------------------------------------------
| Logout User
|--------------------------------------------------------------------------
| JWT authentication is stateless. Logout is completed by removing the
| token from the frontend.
|--------------------------------------------------------------------------
*/

export async function logoutUser() {
  return true;
}

/*
|--------------------------------------------------------------------------
| Compatibility Authentication Function
|--------------------------------------------------------------------------
| Retained in case an older controller or test imports authenticateUser.
|--------------------------------------------------------------------------
*/

export async function authenticateUser(email, password) {
  return loginUser({
    identifier: email,
    password,
  });
}
