export default function PaymentHistory({ payments = [] }) {
  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const converted = new Date(date);

    return `${converted.getMonth() + 1}/${converted.getDate()}/${converted.getFullYear()}`;
  };

  const getPaymentDate = (payment) => {
    return payment.paymentDate ?? payment.payment_date ?? payment.date;
  };

  const getPaymentMethod = (payment) => {
    return (
      payment.paymentMethod ??
      payment.payment_method ??
      payment.method ??
      "Cash"
    );
  };

  const getPaymentStatus = (payment) => {
    return (
      payment.status ??
      payment.payment_status ??
      payment.verification_status ??
      "Pending"
    );
  };

  const statusStyle = {
    Paid: "bg-green-100 text-green-700",

    Pending: "bg-yellow-100 text-yellow-700",

    Late: "bg-red-100 text-red-700",

    Rejected: "bg-red-100 text-red-700",

    Verified: "bg-green-100 text-green-700",
  };

  return (
    <div
      className="
      bg-white
      rounded-xl
      shadow
      p-6
      "
    >
      <h2
        className="
        font-bold
        text-xl
        mb-4
        "
      >
        Payment History
      </h2>

      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Date</th>

            <th className="text-left">Amount</th>

            <th className="text-left">Method</th>

            <th className="text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {payments.length > 0 ? (
            payments.map((payment, index) => (
              <tr key={payment.id ?? index}>
                <td>{formatDate(getPaymentDate(payment))}</td>

                <td>₱{payment.amount ?? 0}</td>

                <td>{getPaymentMethod(payment)}</td>

                <td>
                  <span
                    className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-semibold

                    ${
                      statusStyle[getPaymentStatus(payment)] ??
                      "bg-gray-100 text-gray-700"
                    }

                    `}
                  >
                    {getPaymentStatus(payment)}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="
              text-center
              py-4
              "
              >
                No payment history found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
