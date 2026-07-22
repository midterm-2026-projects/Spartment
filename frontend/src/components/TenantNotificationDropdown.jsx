import { useState } from "react";
import UiIcon from "./UiIcon";

const unread = (item) => item.status === "Unread" || item.is_read === false;

export default function TenantNotificationDropdown({ notifications = [], onMarkAsRead = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(unread).length;
  return <div className="tenant-notifications">
    <button className="tenant-notice" type="button" aria-label="Tenant Notifications" aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}>
      <UiIcon name="notification" size={22} /><span className="support-visually-hidden">Tenant Notifications</span>{unreadCount > 0 && <i aria-label={`${unreadCount} unread notifications`} />}
    </button>
    {isOpen && <section className="tenant-notification-menu">
      <header><div><h3>Tenant Notifications</h3><small>{unreadCount ? `${unreadCount} unread` : "You're all caught up"}</small></div><a href="/tenant/notifications">View all</a></header>
      {notifications.length === 0 ? <p className="tenant-notification-empty">No notifications found.</p> : <ul>{notifications.slice(0, 5).map((notification) => <li key={notification.id} className={unread(notification) ? "unread" : ""}>
        {unread(notification) && <span data-testid="unread-indicator" />}
        <div><strong>{notification.category || "Update"}</strong><p>{notification.message}</p></div>
        {unread(notification) && <button type="button" onClick={() => onMarkAsRead(notification.id)}>Mark as Read</button>}
      </li>)}</ul>}
    </section>}
  </div>;
}
