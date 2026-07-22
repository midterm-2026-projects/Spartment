export default function HighRiskTenantTable({ tenants = [] }) {
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">High Risk Tenants</h2>

      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Tenant</th>

            <th className="text-left">Risk Level</th>

            <th className="text-left">Late Payments</th>

            <th className="text-left">Balance</th>
          </tr>
        </thead>

        <tbody>
          {tenants.length > 0 ? (
            tenants.map((tenant, index) => (
              <tr key={tenant.id ?? tenant.tenantId ?? index}>
                <td>{tenant.tenantId ?? "N/A"}</td>

                <td>
                  <span
                    className="
                    px-3
                    py-1
                    rounded-full
                    bg-red-100
                    text-red-700
                    font-semibold
                    "
                  >
                    {tenant.riskLevel ?? "High"}
                  </span>
                </td>

                <td>{tenant.latePayments ?? 0}</td>

                <td>₱{tenant.unpaidBalance ?? 0}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No high risk tenants found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
