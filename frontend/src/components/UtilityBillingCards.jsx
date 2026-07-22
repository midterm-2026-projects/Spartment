export default function UtilityBillingCards({
  electricity = "₱0",

  water = "₱0",

  combined = "₱0",
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold">Electricity</h3>

        <h2 className="text-2xl font-bold">{electricity}</h2>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold">Water</h3>

        <h2 className="text-2xl font-bold">{water}</h2>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold">Combined Utilities</h3>

        <h2 className="text-2xl font-bold">{combined}</h2>
      </div>
    </div>
  );
}
