export default function RecommendationHeader({
  title = "Smart Recommendations",
  description = "Suggested actions to improve operations",
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      <h3 className="text-gray-600 mt-2">{description}</h3>
    </div>
  );
}
