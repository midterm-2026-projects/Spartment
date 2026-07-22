import express from "express";

import {
  createBilling,
  getTenantBilling,
  getBillingRecords,
  updateBillingStatus,
} from "../controller/billingController.js";

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

router.post("/", createBilling);

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

router.get("/", getBillingRecords);

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

router.get("/tenant/:tenantId", getTenantBilling);

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

router.patch("/:id/status", updateBillingStatus);

export default router;
