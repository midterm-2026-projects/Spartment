export default function RentBillingCards({
  billed = "₱0",
  collected = "₱0",
  pending = "₱0",
  late = "₱0",
}) {
  return (
    <div>
      <div>
        <h3>Billed</h3>
        <h2>{billed}</h2>
      </div>

      <div>
        <h3>Collected</h3>
        <h2>{collected}</h2>
      </div>

      <div>
        <h3>Pending</h3>
        <h2>{pending}</h2>
      </div>

      <div>
        <h3>Late</h3>
        <h2>{late}</h2>
      </div>
    </div>
  );
}
