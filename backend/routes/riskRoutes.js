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
| GET
| /api/risk/tenant/:tenantId
|
| Generates risk assessment from:
|
| - payment history
| - billing status
| - unpaid balance
| - payment behavior
|
|--------------------------------------------------------------------------
*/

router.get("/tenant/:tenantId", analyzeTenantRiskController);

/*
|--------------------------------------------------------------------------
| Get High Risk Tenants
|--------------------------------------------------------------------------
|
| GET
| /api/risk/high-risk
|
|--------------------------------------------------------------------------
*/

router.get("/high-risk", getHighRiskTenantList);

export default router;
