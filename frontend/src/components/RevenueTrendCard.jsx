export default function RevenueTrendCard({ revenueTrend = [] }) {
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>

      {revenueTrend.length > 0 ? (
        revenueTrend.map((item, index) => (
          <p key={index}>
            {item.month}: ₱{item.amount}
          </p>
        ))
      ) : (
        <p>No revenue data available.</p>
      )}
    </section>
  );
}
