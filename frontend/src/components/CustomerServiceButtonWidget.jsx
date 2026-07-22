export default function CustomerServiceButtonWidget({ onClick, open = false }) {
  return (
    <button className="support-launcher" type="button" onClick={onClick} aria-label={open ? "Minimize customer service" : "Open customer service"} aria-expanded={open}>
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 0 1-8.5 8A8.7 8.7 0 0 1 8 18.7L3.5 20l1.2-4A8 8 0 1 1 20 11.5Z" /></svg>
      <span className="support-launcher__label">Customer Service</span>
    </button>
  );
}
