function getPriorityStyle(priority) {
  const value = String(priority ?? "").toLowerCase();

  if (value === "high") {
    return "bg-red-100 text-red-700";
  }

  if (value === "medium") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-green-100 text-green-700";
}

function getStatusStyle(status) {
  const value = String(status ?? "").toLowerCase();

  if (value === "active") {
    return "bg-blue-100 text-blue-700";
  }

  if (value === "resolved" || value === "inactive") {
    return "bg-gray-100 text-gray-700";
  }

  return "bg-gray-100 text-gray-700";
}

export default function RecommendationCards({ recommendation, recommendations }) {
  if (Array.isArray(recommendations)) {
    if (recommendations.length === 0) {
      return <p className="text-gray-500">No recommendations available.</p>;
    }

    return (
      <div className="space-y-4">
        {recommendations.map((item, index) => (
          <RecommendationCards
            key={item.id ?? item.recommendation_id ?? index}
            recommendation={item}
          />
        ))}
      </div>
    );
  }

  if (!recommendation) {
    return <p className="text-gray-500">No recommendations available.</p>;
  }

  const title = recommendation.title ?? "Recommendation";

  const description =
    recommendation.description ??
    recommendation.message ??
    "No description available.";

  const priority = recommendation.priority ?? "Low";

  const category = recommendation.category ?? "General";

  const status = recommendation.status ?? "Active";

  const riskCondition =
    recommendation.risk_condition ??
    recommendation.source_condition ??
    "No risk condition";

  const tenant = recommendation.tenant_id ?? "N/A";

  const room = recommendation.room_id ?? "N/A";

  return (
    <div
      className="
        bg-white
        rounded-xl
        shadow
        p-5
        space-y-3
      "
    >
      <div
        className="
          flex
          justify-between
          items-start
        "
      >
        <h3
          className="
            text-lg
            font-bold
          "
        >
          {title}
        </h3>

        <span
          className={`
            px-3
            py-1
            rounded-full
            text-sm
            font-semibold
            ${getPriorityStyle(priority)}
          `}
        >
          {priority}
        </span>
      </div>

      <p
        className="
          text-gray-600
        "
      >
        {description}
      </p>

      <div
        className="
          grid
          grid-cols-2
          gap-3
          text-sm
        "
      >
        <p>
          <strong>Category:</strong> {category}
        </p>

        <p>
          <strong>Status:</strong>

          <span
            className={`
              ml-2
              px-2
              py-1
              rounded
              ${getStatusStyle(status)}
            `}
          >
            {status}
          </span>
        </p>

        <p>
          <strong>Risk Condition:</strong> {riskCondition}
        </p>

        <p>
          <strong>Tenant:</strong> {tenant}
        </p>

        <p>
          <strong>Room:</strong> {room}
        </p>
      </div>

      {recommendation.generated_date && (
        <p
          className="
              text-xs
              text-gray-500
            "
        >
          Generated:{" "}
          {new Date(recommendation.generated_date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
