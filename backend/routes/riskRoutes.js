import express from "express";

import {
  analyzeTenantRiskController,
  getHighRiskTenantList,
} from "../controller/riskController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Analyze Tenant Risk
|--------------------------------------------------------------------------
|
| Retrieves tenant payment history,
| detects late payments,
| checks unpaid balance,
| generates risk level.
|
| Example:
|
| GET /api/risk/tenant/101
|
|--------------------------------------------------------------------------
*/

router.get(
  "/tenant/:tenantId",

  analyzeTenantRiskController,
);

/*
|--------------------------------------------------------------------------
| Get High Risk Tenants
|--------------------------------------------------------------------------
|
| Returns all tenants classified as High Risk.
|
| Example:
|
| GET /api/risk/high-risk
|
|--------------------------------------------------------------------------
*/

router.get(
  "/high-risk",

  getHighRiskTenantList,
);

export default router;
