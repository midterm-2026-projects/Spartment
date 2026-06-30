import { useState } from "react";

export default function AdminNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    {
      message: "Tenant payment is overdue.",
      unread: true,
    },
    {
      message: "Lease expires in 7 days.",
      unread: true,
    },
    {
      message: "New maintenance request submitted.",
      unread: false,
    },
  ];

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        Admin Notifications
      </button>

      {isOpen && (
        <div>
          <h3>Admin Notifications</h3>

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