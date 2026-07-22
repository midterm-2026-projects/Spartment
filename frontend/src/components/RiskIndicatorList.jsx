export default function RiskIndicatorList({ indicators = [] }) {
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Risk Indicators</h2>

      {indicators.length > 0 ? (
        <ul className="space-y-3">
          {indicators.map((item, index) => (
            <li
              key={index}
              className="
                    bg-red-50
                    text-red-700
                    px-4
                    py-3
                    rounded-lg
                  "
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No risk indicators detected.</p>
      )}
    </section>
  );
}
