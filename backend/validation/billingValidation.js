import { body } from "express-validator";

/*
|--------------------------------------------------------------------------
| Create Billing Validation
|--------------------------------------------------------------------------
|
| Used for:
| POST /api/billing
|
|--------------------------------------------------------------------------
*/

export const validateCreateBilling = [
  body("tenantId")
    .notEmpty()
    .withMessage("Tenant ID is required.")
    .isUUID()
    .withMessage("Invalid tenant ID."),

  body("roomId")
    .notEmpty()
    .withMessage("Room ID is required.")
    .isUUID()
    .withMessage("Invalid room ID."),

  body("billingPeriod")
    .notEmpty()
    .withMessage("Billing period is required.")
    .isISO8601()
    .withMessage("Invalid billing period."),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required.")
    .isISO8601()
    .withMessage("Invalid due date."),

  body("totalAmount")
    .notEmpty()
    .withMessage("Total amount is required.")
    .isFloat({
      min: 0,
    })
    .withMessage("Billing amount cannot be negative."),

  body("billingType")
    .optional()
    .isIn(["Rent", "Utility", "Combined"])
    .withMessage("Invalid billing type."),
];

/*
|--------------------------------------------------------------------------
| Update Billing Status Validation
|--------------------------------------------------------------------------
|
| Used for:
| PATCH /api/billing/:id/status
|
|--------------------------------------------------------------------------
*/

export const validateBillingStatusUpdate = [
  body("status")
    .notEmpty()
    .withMessage("Billing status is required.")
    .isIn(["Unpaid", "Partially Paid", "Paid", "Overdue", "Cancelled"])
    .withMessage("Invalid billing status."),
];
