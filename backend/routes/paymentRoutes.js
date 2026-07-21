import express from "express";


import {
  confirmPaymentStatus,
  getTenantPayments,
  getRevenueMetrics,
} from "../controller/paymentController.js";



const router =
express.Router();





/*
|--------------------------------------------------------------------------
| Confirm Payment
|--------------------------------------------------------------------------
| Admin manually confirms tenant payment.
|
| Example:
| PATCH /api/payment/1/confirm
|
| Body:
| {
|   "paymentMethod": "Cash"
| }
|--------------------------------------------------------------------------
*/


router.patch(

"/:id/confirm",

confirmPaymentStatus

);







/*
|--------------------------------------------------------------------------
| Get Tenant Payment History
|--------------------------------------------------------------------------
| Example:
| GET /api/payment/tenant/101
|--------------------------------------------------------------------------
*/


router.get(

"/tenant/:tenantId",

getTenantPayments

);








/*
|--------------------------------------------------------------------------
| Revenue Metrics
|--------------------------------------------------------------------------
| Used for admin dashboard analytics.
|
| Example:
| GET /api/payment/metrics
|--------------------------------------------------------------------------
*/


router.get(

"/metrics",

getRevenueMetrics

);







export default router;