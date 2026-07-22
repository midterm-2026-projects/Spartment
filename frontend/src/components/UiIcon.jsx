const icons = {
  logo: <><path d="M4 21V6.5A1.5 1.5 0 0 1 5.5 5h9A1.5 1.5 0 0 1 16 6.5V21"/><path d="M8 9h4M8 13h4M8 17h4M16 10h2.5a1.5 1.5 0 0 1 1.5 1.5V21M2 21h20"/></>,
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  room: <><path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5V21"/><path d="M8 8h4M8 12h4M8 16h4M16 10h2.5a1.5 1.5 0 0 1 1.5 1.5V21M2 21h20"/></>,
  tenant: <><circle cx="9" cy="7" r="4"/><path d="M2 21v-2a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v2M17 4.5a4 4 0 0 1 0 7M22 21v-2a5 5 0 0 0-3-4.58"/></>,
  billing: <><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M7 15h3"/></>,
  requests: <><path d="M9 5h6M9 3h6v4H9z"/><path d="M7 5H5.5A1.5 1.5 0 0 0 4 6.5v14h16v-14A1.5 1.5 0 0 0 18.5 5H17M8 12h8M8 16h6"/></>,
  analytics: <><path d="M3 3v18h18"/><path d="M7 17v-4M12 17V8M17 17v-7M6 8l4-3 4 2 5-4"/></>,
  notification: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
};

export default function UiIcon({ name, size = 21, className = "" }) {
  return <svg className={`ui-icon ${className}`} aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[name] || icons.dashboard}</svg>;
}
