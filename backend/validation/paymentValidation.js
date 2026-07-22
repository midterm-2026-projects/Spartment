import { body, param } from "express-validator";

/*
|--------------------------------------------------------------------------
| Create Payment Validation
|--------------------------------------------------------------------------
|
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

    .isIn(["Cash", "GCash", "Bank Transfer", "Online Payment"])

    .withMessage("Invalid payment method."),

  body("paymentReference")
    .notEmpty()

    .withMessage("Payment reference is required.")

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
| PATCH /api/payment/:id/verify
|
|--------------------------------------------------------------------------
*/

export const validateVerifyPayment = [
  param("id")
    .notEmpty()

    .withMessage("Payment ID is required.")

    .isUUID()

    .withMessage("Invalid payment ID."),

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
| PATCH /api/payment/:id/reject
|
|--------------------------------------------------------------------------
*/

export const validateRejectPayment = [
  param("id")
    .notEmpty()

    .withMessage("Payment ID is required.")

    .isUUID()

    .withMessage("Invalid payment ID."),

  body("rejectedBy")
    .notEmpty()

    .withMessage("Rejector ID is required.")

    .isUUID()

    .withMessage("Invalid rejector ID."),
];
