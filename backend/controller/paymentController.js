import {
  verifyPayment,
  rejectPayment,
  getPaymentHistory,
  getPaymentMetrics,
  submitPayment,
} from "../service/paymentService.js";

import { refreshRiskAfterPaymentChange } from "../service/dssRefreshService.js";

/*
|--------------------------------------------------------------------------
| Submit Payment
|--------------------------------------------------------------------------
*/

export const createPayment = async (req, res) => {
  try {
    const payment = await submitPayment(req.body);

    return res.status(201).json({
      success: true,

      message: "Payment submitted successfully.",

      data: payment,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
*/

export const verifyPaymentStatus = async (req, res) => {
  try {
    const result = await verifyPayment(
      req.params.id,

      req.body.verifiedBy,
    );

    await refreshRiskAfterPaymentChange(result.tenant_id);

    return res.status(200).json({
      success: true,

      message: "Payment verified successfully.",

      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Reject Payment
|--------------------------------------------------------------------------
*/

export const rejectPaymentStatus = async (req, res) => {
  try {
    const result = await rejectPayment(
      req.params.id,

      req.body.rejectedBy,
    );

    await refreshRiskAfterPaymentChange(result.tenant_id);

    return res.status(200).json({
      success: true,

      message: "Payment rejected successfully.",

      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Tenant Payment History
|--------------------------------------------------------------------------
*/

export const getTenantPayments = async (req, res) => {
  try {
    const payments = await getPaymentHistory(req.params.tenantId);

    return res.status(200).json({
      success: true,

      data: payments,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Payment Metrics
|--------------------------------------------------------------------------
*/

export const getRevenueMetrics = async (req, res) => {
  try {
    const metrics = await getPaymentMetrics();

    return res.status(200).json({
      success: true,

      data: metrics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
