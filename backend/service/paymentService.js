import {
  getPaymentById,
  updatePaymentStatus,
  getPaymentsByTenant,
  getPayments,
} from "../model/paymentModel.js";

import { updateBillingPaymentStatus } from "./billingService.js";

/*
|--------------------------------------------------------------------------
| Confirm Payment
|--------------------------------------------------------------------------
| Admin confirms manual payment.
|
| Cash / Hand-to-hand payment.
|--------------------------------------------------------------------------
*/

export async function confirmPayment(
  paymentId,

  paymentMethod = "Cash",
) {
  try {
    const payment = await getPaymentById(paymentId);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    const updatedPayment = await updatePaymentStatus(
      paymentId,

      {
        status: "Paid",

        paymentMethod,

        paymentDate: new Date(),
      },
    );

    if (payment.billingId) {
      await updateBillingPaymentStatus(
        payment.billingId,

        "Paid",
      );
    }

    return updatedPayment;
  } catch (error) {
    throw new Error(error.message);
  }
}

/*
|--------------------------------------------------------------------------
| Get Tenant Payment History
|--------------------------------------------------------------------------
*/

export async function getPaymentHistory(tenantId) {
  try {
    return await getPaymentsByTenant(tenantId);
  } catch (error) {
    throw new Error("Failed to retrieve payment history.");
  }
}

/*
|--------------------------------------------------------------------------
| Revenue Metrics
|--------------------------------------------------------------------------
*/

export async function getPaymentMetrics() {
  const payments = await getPayments();

  const collectedRevenue = payments

    .filter((payment) => payment.status === "Paid")

    .reduce(
      (total, payment) => total + payment.amount,

      0,
    );

  const pendingPayments = payments.filter(
    (payment) => payment.status === "Pending",
  );

  const latePayments = payments.filter((payment) => payment.status === "Late");

  return {
    collectedRevenue,

    pendingPayments: pendingPayments.length,

    latePayments: latePayments.length,
  };
}
