export default function UtilityBillingCards({
  electricity = "₱0",
  water = "₱0",
  combined = "₱0",
}) {
  return (
    <div>
      <div>
        <h3>Electricity</h3>
        <h2>{electricity}</h2>
      </div>

      <div>
        <h3>Water</h3>
        <h2>{water}</h2>
      </div>

      <div>
        <h3>Combined Utilities</h3>
        <h2>{combined}</h2>
      </div>
    </div>
  );
}