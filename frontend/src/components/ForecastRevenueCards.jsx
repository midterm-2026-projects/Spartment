export default function ForecastRevenueCards({
  forecast = "₱0",
  actual = "₱0",
}) {
  return (
    <div>
      <h2>Forecast vs Actual Revenue</h2>

      <div>
        <div>
          <h3>Forecast</h3>
          <p>{forecast}</p>
        </div>

        <div>
          <h3>Actual</h3>
          <p>{actual}</p>
        </div>
      </div>
    </div>
  );
}