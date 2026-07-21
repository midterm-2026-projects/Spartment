function normalizeRiskLevel(risk) {
  const rawRiskLevel =
    risk?.riskLevel ?? risk?.risk_level ?? risk?.level ?? "Low";

  const value = String(rawRiskLevel).trim();

  if (!value) {
    return "Low Risk";
  }

  if (/risk$/i.test(value)) {
    return value;
  }

  return `${value} Risk`;
}

function getRiskClass(riskLevel) {
  const normalized = riskLevel.toLowerCase();

  if (normalized.includes("high")) {
    return "bg-red-100 text-red-700";
  }

  if (normalized.includes("medium")) {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-green-100 text-green-700";
}

export default function RiskStatusCard({ risk }) {
  const riskLevel = normalizeRiskLevel(risk);

  const riskClass = getRiskClass(riskLevel);

  return (
    <section className="rounded-xl bg-white p-5 shadow">
      <h2 className="text-lg font-bold">Tenant Risk Status</h2>

      <div className={`mt-4 rounded-lg px-4 py-2 font-bold ${riskClass}`}>
        {riskLevel}
      </div>

      {risk?.score !== undefined ? (
        <p className="mt-3 text-sm text-gray-600">Risk score: {risk.score}</p>
      ) : null}
    </section>
  );
}
