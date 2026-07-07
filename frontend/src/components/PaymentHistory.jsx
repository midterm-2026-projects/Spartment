export default function PaymentHistory({
  payments = [],
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2>Payment History</h2>

      <table className="w-full">
        <thead>
          <tr>
            <th>Month</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.month}>
                <td>{payment.month}</td>
                <td>{payment.amount}</td>
                <td>{payment.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No payment history found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}