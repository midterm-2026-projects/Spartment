import express from "express";

import {
  createPayment,
  verifyPaymentStatus,
  rejectPaymentStatus,
  getTenantPayments,
  getRevenueMetrics,
} from "../controller/paymentController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Submit Payment
|--------------------------------------------------------------------------
|
| POST
| /api/payment
|
| Tenant submits payment
|
| Example:
|
| {
|   billingId,
|   tenantId,
|   amount,
|   paymentMethod,
|   paymentReference
| }
|
|--------------------------------------------------------------------------
*/

router.post("/", createPayment);

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
|
| PATCH
| /api/payment/:id/verify
|
| Admin approves payment
|
| Actions:
| - Update payment status
| - Recalculate billing balance
| - Update revenue
| - Create notification
|
|--------------------------------------------------------------------------
*/

router.patch("/:id/verify", verifyPaymentStatus);

/*
|--------------------------------------------------------------------------
| Reject Payment
|--------------------------------------------------------------------------
|
| PATCH
| /api/payment/:id/reject
|
| Actions:
| - Mark payment rejected
| - Exclude from revenue
| - Create notification
|
|--------------------------------------------------------------------------
*/

router.patch("/:id/reject", rejectPaymentStatus);

/*
|--------------------------------------------------------------------------
| Tenant Payment History
|--------------------------------------------------------------------------
|
| GET
| /api/payment/tenant/:tenantId
|
|--------------------------------------------------------------------------
*/

router.get("/tenant/:tenantId", getTenantPayments);

/*
|--------------------------------------------------------------------------
| Revenue Metrics
|--------------------------------------------------------------------------
|
| GET
| /api/payment/metrics
|
| Used by:
| - Revenue Dashboard
| - Analytics Dashboard
|
|--------------------------------------------------------------------------
*/

router.get("/metrics", getRevenueMetrics);

export default router;
