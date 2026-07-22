function normalizeRiskLevel(risk) {
  const level = risk?.riskLevel ?? risk?.risk_level ?? risk?.level ?? "Low";

  if (String(level).toLowerCase().includes("risk")) {
    return level;
  }

  return `${level} Risk`;
}

function getRiskClass(level) {
  const value = level.toLowerCase();

  if (value.includes("high")) {
    return "bg-red-100 text-red-700";
  }

  if (value.includes("medium")) {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-green-100 text-green-700";
}

export default function RiskStatusCard({ risk }) {
  if (!risk) {
    return (
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold">Tenant Risk Status</h2>

        <p className="text-gray-500 mt-3">No risk information available.</p>
      </section>
    );
  }

  const riskLevel = normalizeRiskLevel(risk);

  return (
    <section className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold">Tenant Risk Status</h2>

      <div
        className={`
          mt-4
          px-4
          py-2
          rounded-lg
          font-bold
          ${getRiskClass(riskLevel)}
        `}
      >
        {riskLevel}
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        {risk.riskScore !== undefined && <p>Risk Score: {risk.riskScore}</p>}

        {risk.riskCategory && <p>Category: {risk.riskCategory}</p>}

        {risk.latePayments !== undefined && (
          <p>Late Payments: {risk.latePayments}</p>
        )}

        {risk.unpaidBalance !== undefined && (
          <p>Unpaid Balance: ₱{risk.unpaidBalance}</p>
        )}
      </div>
    </section>
  );
}
