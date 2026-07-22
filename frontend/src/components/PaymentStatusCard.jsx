export default function PaymentStatusCard({ metrics = {} }) {
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-5">Payment Status</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <h3>Collected Revenue</h3>

          <p>₱{metrics.collectedRevenue ?? 0}</p>
        </div>

        <div>
          <h3>Verified Payments</h3>

          <p>{metrics.verifiedPayments ?? 0}</p>
        </div>

        <div>
          <h3>Pending Payments</h3>

          <p>{metrics.pendingPayments ?? 0}</p>
        </div>

        <div>
          <h3>Late Payments</h3>

          <p>{metrics.latePayments ?? 0}</p>
        </div>
      </div>
    </section>
  );
}
