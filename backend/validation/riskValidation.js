import { param } from "express-validator";

/*
|--------------------------------------------------------------------------
| Validate Tenant Risk Analysis
|--------------------------------------------------------------------------
|
| Used:
| GET /api/risk/tenant/:tenantId
|
|--------------------------------------------------------------------------
*/

export const validateTenantRisk = [
  param("tenantId")
    .notEmpty()

    .withMessage("Tenant ID is required.")

    .isUUID()

    .withMessage("Invalid tenant ID."),
];

/*
|--------------------------------------------------------------------------
| Validate High Risk Request
|--------------------------------------------------------------------------
|
| GET /api/risk/high-risk
|
|--------------------------------------------------------------------------
*/

export const validateHighRiskRequest = [];
