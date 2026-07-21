import express from "express";

import {
  login,
  logout,
  getCurrentUser,
} from "../controller/authController.js";

import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

router.post(
  "/login",
  login
);

/*
|--------------------------------------------------------------------------
| Current Authenticated User
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  authenticateUser,
  getCurrentUser
);

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

router.post(
  "/logout",
  authenticateUser,
  logout
);

export default router;