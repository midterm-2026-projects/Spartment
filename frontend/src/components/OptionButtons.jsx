export default function OptionButtons({ onSelect = () => {} }) {
  const options = [["Inquiry", "📩"], ["Maintenance", "🛠"], ["Other", "💬"]];
  return <div className="support-options" aria-label="Quick support topics">
    {options.map(([label, icon]) => <button type="button" key={label} onClick={() => onSelect(label)}><i>{icon}</i><span>{label}</span></button>)}
  </div>;
}
