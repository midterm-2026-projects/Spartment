export default function BillingManagementTable({
  billings = [],
  onGenerateBilling,
}) {
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">Billing Management</h2>

        {onGenerateBilling && (
          <button
            onClick={onGenerateBilling}
            className="
              bg-blue-600
              text-white
              px-4
              py-2
              rounded-lg
            "
          >
            Generate Billing
          </button>
        )}
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Tenant</th>

            <th className="text-left">Type</th>

            <th className="text-left">Amount</th>

            <th className="text-left">Balance</th>

            <th className="text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {billings.length > 0 ? (
            billings.map((billing) => (
              <tr key={billing.id}>
                <td>{billing.tenant_id}</td>

                <td>{billing.billing_type ?? "Rent"}</td>

                <td>₱{billing.total_amount ?? 0}</td>

                <td>₱{billing.remaining_balance ?? 0}</td>

                <td>
                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-gray-100
                      font-semibold
                    "
                  >
                    {billing.status ?? "Unpaid"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No billing records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
