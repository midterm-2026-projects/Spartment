export default function RentBillingCards({
  billed = "₱0",
  collected = "₱0",
  pending = "₱0",
  late = "₱0",
}) {
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-5">Rent Billing</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm text-gray-500">Billed</h3>

          <p className="text-xl font-bold">{billed}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm text-gray-500">Collected</h3>

          <p className="text-xl font-bold">{collected}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm text-gray-500">Pending</h3>

          <p className="text-xl font-bold">{pending}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm text-gray-500">Late</h3>

          <p className="text-xl font-bold">{late}</p>
        </div>
      </div>
    </section>
  );
}
