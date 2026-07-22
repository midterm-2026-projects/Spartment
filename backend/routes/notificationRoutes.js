import { Router } from "express";
import authenticateUser from "../middleware/authMiddleware.js";
import { getNotifications, readNotification, getUnreadNotificationCount } from "../controller/notificationController.js";
const router = Router();
router.get("/", authenticateUser, getNotifications);
router.get("/unread-count", authenticateUser, getUnreadNotificationCount);
router.patch("/:id/read", authenticateUser, readNotification);
export default router;
