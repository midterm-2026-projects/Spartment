import jwt from "jsonwebtoken";
import { supabase } from "../config/supabaseClient.js";

/*
|--------------------------------------------------------------------------
| Authentication Middleware
|--------------------------------------------------------------------------
| Validates the Bearer token, retrieves the matching active user from
| Supabase, and attaches the safe user profile and token to the request.
|--------------------------------------------------------------------------
*/

export const authenticateUser = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    const token = authorizationHeader
      .replace("Bearer ", "")
      .trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error(
        "JWT_SECRET is missing from the backend environment variables",
      );

      return res.status(500).json({
        success: false,
        message: "Authentication configuration error",
      });
    }

    let decodedToken;

    try {
      decodedToken = jwt.verify(token, jwtSecret);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Authentication token has expired",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    const userId =
      decodedToken.userId ||
      decodedToken.id ||
      decodedToken.sub;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token payload",
      });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select(
        `
          id,
          name,
          email,
          username,
          role,
          status,
          created_at,
          updated_at
        `,
      )
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error(
        "Failed to retrieve authenticated user:",
        error,
      );

      return res.status(500).json({
        success: false,
        message: "Unable to verify authenticated user",
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user was not found",
      });
    }

    if (user.status !== "Active") {
      return res.status(403).json({
        success: false,
        message:
          user.status === "Suspended"
            ? "Your account is suspended"
            : "Your account is inactive",
      });
    }

    req.user = user;
    req.token = token;

    return next();
  } catch (error) {
    console.error("Authentication middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default authenticateUser;