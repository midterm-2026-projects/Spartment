import express from "express";

import authenticateUser from "../middleware/authMiddleware.js";

import {
  requireAdmin,
  requireAdminOrTenant,
} from "../middleware/roleMiddleware.js";

import {
  createTenant,
  getTenants,
  getTenantById,
  changeTenantPassword,
  updateTenantStatus,
} from "../controller/tenantController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Admin manually creates tenant after inquiry approval
|--------------------------------------------------------------------------
*/

router.post("/", authenticateUser, requireAdmin, createTenant);

router.get("/", authenticateUser, requireAdmin, getTenants);

router.get("/:id", authenticateUser, requireAdminOrTenant, getTenantById);

router.patch(
  "/:id/password",
  authenticateUser,
  requireAdminOrTenant,
  changeTenantPassword,
);

router.patch("/:id/status", authenticateUser, requireAdmin, updateTenantStatus);

export default router;
