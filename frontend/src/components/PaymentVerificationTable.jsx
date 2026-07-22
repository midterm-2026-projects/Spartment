export default function PaymentVerificationTable({
  payments = [],
  onVerify,
  onReject,
}) {
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-5">Payment Verification</h2>

      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Tenant</th>

            <th className="text-left">Amount</th>

            <th className="text-left">Method</th>

            <th className="text-left">Status</th>

            <th className="text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.tenant_id}</td>

                <td>₱{payment.amount ?? 0}</td>

                <td>{payment.payment_method ?? "Cash"}</td>

                <td>{payment.verification_status}</td>

                <td>
                  {payment.verification_status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onVerify(payment.id)}
                        className="
                        bg-green-600
                        text-white
                        px-3
                        py-1
                        rounded
                        "
                      >
                        Verify
                      </button>

                      <button
                        onClick={() => onReject(payment.id)}
                        className="
                        bg-red-600
                        text-white
                        px-3
                        py-1
                        rounded
                        "
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No payments waiting for verification.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
