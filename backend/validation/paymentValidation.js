import { body } from "express-validator";

/*
|--------------------------------------------------------------------------
| Create Payment Validation
|--------------------------------------------------------------------------
|
| Used for:
| POST /api/payment
|
|--------------------------------------------------------------------------
*/

export const validateCreatePayment = [
  body("billingId")
    .notEmpty()
    .withMessage("Billing ID is required.")
    .isUUID()
    .withMessage("Invalid billing ID."),

  body("tenantId")
    .notEmpty()
    .withMessage("Tenant ID is required.")
    .isUUID()
    .withMessage("Invalid tenant ID."),

  body("amount")
    .notEmpty()
    .withMessage("Payment amount is required.")
    .isFloat({
      min: 0.01,
    })
    .withMessage("Payment amount must be greater than zero."),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required.")
    .isIn(["Cash", "GCash", "Bank Transfer"])
    .withMessage("Invalid payment method."),

  body("paymentReference")
    .optional()
    .isString()
    .trim()
    .isLength({
      min: 3,
    })
    .withMessage("Invalid payment reference."),
];

/*
|--------------------------------------------------------------------------
| Verify Payment Validation
|--------------------------------------------------------------------------
|
| Used for:
| PATCH /api/payment/:id/verify
|
|--------------------------------------------------------------------------
*/

export const validateVerifyPayment = [
  body("verifiedBy")
    .notEmpty()
    .withMessage("Verifier ID is required.")
    .isUUID()
    .withMessage("Invalid verifier ID."),
];

/*
|--------------------------------------------------------------------------
| Reject Payment Validation
|--------------------------------------------------------------------------
|
| Used for:
| PATCH /api/payment/:id/reject
|
|--------------------------------------------------------------------------
*/

export const validateRejectPayment = [
  body("rejectedBy")
    .notEmpty()
    .withMessage("Rejector ID is required.")
    .isUUID()
    .withMessage("Invalid rejector ID."),
];
