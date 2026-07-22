import {
  getPaymentsByTenant,
  getPayments,
  createPaymentRecord,
} from "../model/paymentModel.js";

import { createPaymentTransaction } from "../model/paymentTransactionModel.js";

import { supabase } from "../config/supabaseClient.js";

import { refreshTenantDSS } from "./dssRefreshService.js";

/*
|--------------------------------------------------------------------------
| Submit Payment
|--------------------------------------------------------------------------
*/

export async function submitPayment(data) {
  const payment = await createPaymentRecord(data);

  return payment;
}

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
|
| Actions:
|
| - Verify payment
| - Update billing balance
| - Create transaction history
| - Refresh DSS
|
|--------------------------------------------------------------------------
*/

export async function verifyPayment(
  paymentId,

  verifiedBy,
) {
  const {
    data,

    error,
  } = await supabase.rpc(
    "verify_payment",

    {
      p_payment_id: paymentId,

      p_verified_by: verifiedBy,
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  /*
  |--------------------------------------------------------------------------
  | Get Tenant Information
  |--------------------------------------------------------------------------
  */

  const { data: payment } = await supabase

    .from("payments")

    .select("tenant_id")

    .eq("id", paymentId)

    .single();

  /*
  |--------------------------------------------------------------------------
  | Payment Transaction
  |--------------------------------------------------------------------------
  */

  await createPaymentTransaction({
    paymentId,

    transactionType: "Verified",

    amount: 0,

    description: "Payment verified",
  });

  /*
  |--------------------------------------------------------------------------
  | Refresh DSS
  |--------------------------------------------------------------------------
  */

  if (payment?.tenant_id) {
    await refreshTenantDSS(payment.tenant_id);
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Reject Payment
|--------------------------------------------------------------------------
|
| Actions:
|
| - Reject payment
| - Save transaction
| - Refresh DSS
|
|--------------------------------------------------------------------------
*/

export async function rejectPayment(
  paymentId,

  rejectedBy,
) {
  const {
    data,

    error,
  } = await supabase.rpc(
    "reject_payment",

    {
      p_payment_id: paymentId,

      p_rejected_by: rejectedBy,
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  const { data: payment } = await supabase

    .from("payments")

    .select("tenant_id")

    .eq("id", paymentId)

    .single();

  await createPaymentTransaction({
    paymentId,

    transactionType: "Rejected",

    amount: 0,

    description: "Payment rejected",
  });

  /*
  |--------------------------------------------------------------------------
  | Refresh DSS
  |--------------------------------------------------------------------------
  */

  if (payment?.tenant_id) {
    await refreshTenantDSS(payment.tenant_id);
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
    (
      total,

      payment,
    ) => total + Number(payment.amount),

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
