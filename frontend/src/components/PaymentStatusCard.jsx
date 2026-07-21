export default function PaymentStatusCard({ metrics = {} }) {
  return (
    <div>
      <h3>Payment Status</h3>

      <p>
        Collected Revenue: <span>₱{metrics.collectedRevenue ?? 0}</span>
      </p>

      <p>
        Pending Payments: <span>{metrics.pendingPayments ?? 0}</span>
      </p>

      <p>
        Late Payments: <span>{metrics.latePayments ?? 0}</span>
      </p>
    </div>
  );
}
