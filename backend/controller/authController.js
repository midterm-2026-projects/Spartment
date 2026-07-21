import {
  loginUser,
  fetchAuthenticatedUser,
  logoutUser,
} from "../service/authService.js";

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
| Authenticates an administrator or tenant using email/username
| and password.
|--------------------------------------------------------------------------
*/

export const login = async (req, res) => {
  try {
    const { identifier, email, username, password } = req.body;

    const loginIdentifier =
      identifier?.trim() || email?.trim() || username?.trim();

    if (!loginIdentifier) {
      return res.status(400).json({
        success: false,
        message: "Email or username is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const result = await loginUser({
      identifier: loginIdentifier,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const statusCode =
      error.message === "Invalid email, username, or password" ||
      error.message === "Account is inactive" ||
      error.message === "Account is suspended"
        ? 401
        : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Authenticated User
|--------------------------------------------------------------------------
| Returns the currently authenticated user's safe profile.
|--------------------------------------------------------------------------
*/

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required",
      });
    }

    const user = await fetchAuthenticatedUser(userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    const statusCode = error.message === "User not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
| For token-based authentication, the frontend normally removes the token.
| This service may also revoke or invalidate a stored session if implemented.
|--------------------------------------------------------------------------
*/

export const logout = async (req, res) => {
  try {
    const token = req.token || req.headers.authorization;

    await logoutUser(token);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
