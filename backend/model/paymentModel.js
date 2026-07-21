let payments = [];

/*
|--------------------------------------------------------------------------
| Create Payment Record
|--------------------------------------------------------------------------
*/

export async function createPaymentRecord(data) {
  const payment = {
    id: payments.length + 1,

    tenantId: data.tenantId,

    billingId: data.billingId,

    amount: data.amount,

    paymentMethod: data.paymentMethod || "Cash",

    paymentDate: null,

    status: "Pending",
  };

  payments.push(payment);

  return payment;
}

/*
|--------------------------------------------------------------------------
| Find Payment
|--------------------------------------------------------------------------
*/

export async function getPaymentById(id) {
  return payments.find((payment) => payment.id == id);
}

/*
|--------------------------------------------------------------------------
| Update Payment Status
|--------------------------------------------------------------------------
*/

export async function updatePaymentStatus(
  id,

  data,
) {
  const payment = payments.find((payment) => payment.id == id);

  if (!payment) {
    throw new Error("Payment not found.");
  }

  payment.status = data.status;

  payment.paymentMethod = data.paymentMethod;

  payment.paymentDate = data.paymentDate;

  return payment;
}

/*
|--------------------------------------------------------------------------
| Tenant Payment History
|--------------------------------------------------------------------------
|
| Used by:
| - Payment History
| - Risk Detection
|
|--------------------------------------------------------------------------
*/

export async function getPaymentsByTenant(tenantId) {
  return payments.filter((payment) => payment.tenantId == tenantId);
}

/*
|--------------------------------------------------------------------------
| All Payments
|--------------------------------------------------------------------------
|
| Used by:
| - Revenue Analytics
| - Risk Detection
|
|--------------------------------------------------------------------------
*/

export async function getPayments() {
  return payments;
}
