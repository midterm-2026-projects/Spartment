import { Router } from "express";
import { getDashboardMetrics } from "../controller/dashboardController.js";
import authenticateUser from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
const router = Router();
router.get("/metrics", authenticateUser, requireAdmin, getDashboardMetrics);
export default router;
