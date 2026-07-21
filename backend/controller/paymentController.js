import {
  confirmPayment,
  getPaymentHistory,
  getPaymentMetrics,
} from "../service/paymentService.js";

/*
|--------------------------------------------------------------------------
| Admin Confirm Payment
|--------------------------------------------------------------------------
| Admin manually confirms tenant payment.
|
| Example:
| Tenant pays cash
| Admin clicks "Mark as Paid"
|--------------------------------------------------------------------------
*/

export const confirmPaymentStatus = async (req, res) => {
  try {
    const payment = await confirmPayment(
      req.params.id,

      req.body.paymentMethod || "Cash",
    );

    return res.status(200).json({
      message: "Payment confirmed successfully.",

      data: payment,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Tenant Payment History
|--------------------------------------------------------------------------
*/

export const getTenantPayments = async (req, res) => {
  try {
    const payments = await getPaymentHistory(req.params.tenantId);

    return res.status(200).json({
      message: "Payment history retrieved successfully.",

      data: payments,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Revenue Metrics
|--------------------------------------------------------------------------
*/

export const getRevenueMetrics = async (req, res) => {
  try {
    const metrics = await getPaymentMetrics();

    return res.status(200).json({
      data: metrics,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
