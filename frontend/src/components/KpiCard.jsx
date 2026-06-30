function KpiCard({ title, value, subtitle }) {
  const displayValue = value || "0";
  const showSubtitle = displayValue !== "0";

  return (
    <div>
      {title && <h3>{title}</h3>}

      <h1>{displayValue}</h1>

      {showSubtitle && <small>{subtitle}</small>}
    </div>
  );
}

export default KpiCard;