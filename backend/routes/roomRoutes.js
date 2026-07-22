import express from "express";

import {
  fetchRooms,
  fetchAvailableRooms,
  updateRoom,
  createRoom,
} from "../controller/roomController.js";

import authenticateUser from "../middleware/authMiddleware.js";

import {
  requireAdmin,
} from "../middleware/roleMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Get All Rooms
|--------------------------------------------------------------------------
| Admin only
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticateUser,
  requireAdmin,
  fetchRooms
);

router.post("/", authenticateUser, requireAdmin, createRoom);

router.patch("/:id", authenticateUser, requireAdmin, updateRoom);

/*
|--------------------------------------------------------------------------
| Get Available Rooms
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.get(
  "/available",
  fetchAvailableRooms
);

export default router;
