import { useEffect, useState } from "react";
import { getNotifications, updateNotification } from "../api/notificationApi";
import TenantNotificationDropdown from "./TenantNotificationDropdown";
import UiIcon from "./UiIcon";

function nameOf(tenant = {}) { return tenant.fullName || tenant.full_name || tenant.name || "Tenant"; }

export default function TenantPortalNav({ tenant, active = "dashboard" }) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const name = nameOf(tenant);
  const email = tenant?.email || tenant?.user?.email || "";
  const initial = name.charAt(0).toUpperCase();
  const links = [["dashboard", "/tenant", "⌂", "My Dashboard"], ["billing", "/tenant/billing", "▧", "Billing"], ["settings", "/tenant/settings", "⚙", "Settings"]];

  useEffect(() => { getNotifications().then(setNotifications).catch(() => setNotifications([])); }, []);
  const markRead = async (id) => {
    await updateNotification(id);
    setNotifications((items) => items.map((item) => item.id === id ? { ...item, status: "Read", is_read: true } : item));
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tenantId");
    window.location.assign("/");
  };

  return <header className="tenant-nav">
    <a className="tenant-brand" href="/"><span><UiIcon name="logo" size={24} /></span><strong>Spartment</strong></a>
    <nav aria-label="Tenant navigation">{links.map(([key, href, icon, label]) => <a key={key} className={active === key ? "active" : ""} href={href}><i>{icon}</i>{label}</a>)}</nav>
    <div className="tenant-nav__profile">
      <TenantNotificationDropdown notifications={notifications} onMarkAsRead={markRead} />
      <button className="tenant-account" type="button" aria-label="Open account menu" aria-expanded={accountOpen} onClick={() => setAccountOpen((value) => !value)}>
        <span className="tenant-avatar">{initial}</span><span><strong>{name}</strong><small>Tenant</small></span>
      </button>
      {accountOpen && <div className="tenant-account-menu">
        {email && <strong>{email}</strong>}
        <a href="/tenant/settings"><span>♙</span>Account settings</a>
        <button type="button" onClick={logout}><span>↪</span>Log out</button>
      </div>}
    </div>
  </header>;
}
