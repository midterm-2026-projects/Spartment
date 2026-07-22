import {
  getPaymentById,
  updatePaymentStatus,
  getPaymentsByTenant,
  getPayments,
} from "../model/paymentModel.js";

import { createPaymentTransaction } from "../model/paymentTransactionModel.js";

import { supabase } from "../config/supabaseClient.js";

/*
|--------------------------------------------------------------------------
| Submit Payment
|--------------------------------------------------------------------------
*/

export async function submitPayment(data) {
  const payment = await import("../model/paymentModel.js").then((module) =>
    module.createPaymentRecord(data),
  );

  return payment;
}

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
*/

export async function verifyPayment(paymentId, verifiedBy) {
  const { data, error } = await supabase.rpc("verify_payment", {
    p_payment_id: paymentId,

    p_verified_by: verifiedBy,
  });

  if (error) {
    throw new Error(error.message);
  }

  await createPaymentTransaction({
    paymentId,

    transactionType: "Verified",

    amount: 0,

    description: "Payment verified",
  });

  return data;
}

/*
|--------------------------------------------------------------------------
| Reject Payment
|--------------------------------------------------------------------------
*/

export async function rejectPayment(paymentId, rejectedBy) {
  const { data, error } = await supabase.rpc("reject_payment", {
    p_payment_id: paymentId,

    p_rejected_by: rejectedBy,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Payment History
|--------------------------------------------------------------------------
*/

export async function getPaymentHistory(tenantId) {
  return await getPaymentsByTenant(tenantId);
}

/*
|--------------------------------------------------------------------------
| Revenue Metrics
|--------------------------------------------------------------------------
*/

export async function getPaymentMetrics() {
  const payments = await getPayments();

  const verifiedPayments = payments.filter(
    (payment) => payment.verification_status === "Verified",
  );

  const collectedRevenue = verifiedPayments.reduce(
    (total, payment) => total + Number(payment.amount),

    0,
  );

  return {
    collectedRevenue,

    verifiedPayments: verifiedPayments.length,

    pendingPayments: payments.filter(
      (payment) => payment.verification_status === "Pending",
    ).length,

    rejectedPayments: payments.filter(
      (payment) => payment.verification_status === "Rejected",
    ).length,
  };
}
