export default function SmartRecommendations({
  recommendations = [],
  loading = false,
  error = null,
  onRefresh,
}) {
  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Smart Recommendations</h2>

        <p className="text-gray-500">Loading recommendations...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Smart Recommendations</h2>

        <p className="text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Smart Recommendations</h2>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="
                px-3
                py-2
                rounded-lg
                bg-blue-600
                text-white
                text-sm
              "
          >
            Refresh
          </button>
        )}
      </div>

      {recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div
              key={
                recommendation.id ?? recommendation.recommendation_id ?? index
              }
              className="
                    border
                    rounded-lg
                    p-4
                  "
            >
              <h3 className="font-bold text-lg">
                {recommendation.title ?? "Recommendation"}
              </h3>

              <p className="text-gray-600 mt-2">
                {recommendation.description ??
                  recommendation.message ??
                  "No description available."}
              </p>

              <div className="mt-3 space-y-1 text-sm">
                {recommendation.priority && (
                  <p>
                    Priority:{" "}
                    <span className="font-semibold">
                      {recommendation.priority}
                    </span>
                  </p>
                )}

                {recommendation.category && (
                  <p>
                    Category:{" "}
                    <span className="font-semibold">
                      {recommendation.category}
                    </span>
                  </p>
                )}

                {recommendation.status && (
                  <p>Status: {recommendation.status}</p>
                )}

                {(recommendation.risk_condition ||
                  recommendation.source_condition) && (
                  <p>
                    Risk Condition:{" "}
                    <span>
                      {recommendation.risk_condition ??
                        recommendation.source_condition}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No recommendations available.</p>
      )}
    </section>
  );
}
