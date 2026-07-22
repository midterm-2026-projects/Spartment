import express from "express";

import {
  getAnalytics,
} from "../controller/analyticsController.js";
import authenticateUser from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";


const router =
  express.Router();


router.get(
  "/",
  authenticateUser,
  requireAdmin,
  getAnalytics
);


export default router;
