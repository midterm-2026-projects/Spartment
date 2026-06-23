import { useState } from "react";

export default function TenantNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    {
      message: "Your payment is due tomorrow.",
      unread: true,
    },
    {
      message: "Your maintenance request is being processed.",
      unread: false,
    },
    {
      message: "Lease renewal is available.",
      unread: true,
    },
  ];

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        Tenant Notifications
      </button>

      {isOpen && (
        <div>
          <h3>Tenant Notifications</h3>

          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>
                {notification.unread && (
                  <span data-testid="unread-indicator">● </span>
                )}
                {notification.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}