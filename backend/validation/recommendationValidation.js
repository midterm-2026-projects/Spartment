import { param, query } from "express-validator";

/*
|--------------------------------------------------------------------------
| Recommendation Tenant Filter
|--------------------------------------------------------------------------
|
| GET /api/recommendation/tenant/:tenantId
|
|--------------------------------------------------------------------------
*/

export const validateTenantRecommendation = [
  param("tenantId")
    .notEmpty()

    .withMessage("Tenant ID is required.")

    .isUUID()

    .withMessage("Invalid tenant ID."),
];

/*
|--------------------------------------------------------------------------
| Recommendation Query Filters
|--------------------------------------------------------------------------
|
| Used for:
| GET /api/recommendation
|
|--------------------------------------------------------------------------
*/

export const validateRecommendationQuery = [
  query("priority")
    .optional()

    .isIn(["Low", "Medium", "High", "Critical"])

    .withMessage("Invalid recommendation priority."),

  query("category")
    .optional()

    .isString()

    .trim()

    .withMessage("Invalid recommendation category."),
];
