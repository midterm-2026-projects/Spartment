import express from "express";

import {
  createBilling,
  getTenantBilling,
  getBillingRecords,
  updateBillingStatus,
  updateUtilityBilling,
} from "../controller/billingController.js";
import authenticateUser from "../middleware/authMiddleware.js";
import { requireAdmin, requireAdminOrTenant } from "../middleware/roleMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Create Billing
|--------------------------------------------------------------------------
|
| POST
| /api/billing
|
| Creates tenant billing record
|
|--------------------------------------------------------------------------
*/

router.post("/", authenticateUser, requireAdmin, createBilling);

/*
|--------------------------------------------------------------------------
| Get All Billing Records
|--------------------------------------------------------------------------
|
| GET
| /api/billing
|
| Used by:
| - Admin dashboard
| - Revenue analytics
|
|--------------------------------------------------------------------------
*/

router.get("/", authenticateUser, requireAdmin, getBillingRecords);

/*
|--------------------------------------------------------------------------
| Get Tenant Billing History
|--------------------------------------------------------------------------
|
| GET
| /api/billing/tenant/:tenantId
|
| Used by:
| - Tenant dashboard
| - Billing statements
|
|--------------------------------------------------------------------------
*/

router.get("/tenant/:tenantId", authenticateUser, requireAdminOrTenant, getTenantBilling);

/*
|--------------------------------------------------------------------------
| Update Billing Status
|--------------------------------------------------------------------------
|
| PATCH
| /api/billing/:id/status
|
| Status:
| - Unpaid
| - Partially Paid
| - Paid
| - Overdue
| - Cancelled
|
|--------------------------------------------------------------------------
*/

router.patch("/:id/status", authenticateUser, requireAdmin, updateBillingStatus);
router.patch("/:id/utility", authenticateUser, requireAdmin, updateUtilityBilling);

export default router;
