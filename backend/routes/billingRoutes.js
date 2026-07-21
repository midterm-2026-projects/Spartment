import express from "express";

import {
  createBilling,
  getTenantBilling,
  getBillingRecords,
  updateBillingPaymentStatus,
} from "../controller/billingController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Generate Billing
|--------------------------------------------------------------------------
*/

router.post("/generate", createBilling);

/*
|--------------------------------------------------------------------------
| Get All Billing Records
|--------------------------------------------------------------------------
*/

router.get("/", getBillingRecords);

/*
|--------------------------------------------------------------------------
| Get Tenant Billing History
|--------------------------------------------------------------------------
*/

router.get("/tenant/:tenantId", getTenantBilling);

/*
|--------------------------------------------------------------------------
| Update Billing Status
|--------------------------------------------------------------------------
*/

router.patch("/:billingId/status", updateBillingPaymentStatus);

export default router;
