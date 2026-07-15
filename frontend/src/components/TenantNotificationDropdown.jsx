import { useState } from "react";

export default function TenantNotificationDropdown({
  notifications = [],
  onMarkAsRead,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        Tenant Notifications
      </button>

      {isOpen && (
        <div>
          <h3>Tenant Notifications</h3>

          {notifications.length === 0 ? (
            <p>No notifications found.</p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id}>
                  {notification.status === "Unread" && (
                    <span data-testid="unread-indicator">
                      ●{" "}
                    </span>
                  )}

                  <strong>
                    [{notification.category}]
                  </strong>{" "}
                  {notification.message}

                  {notification.status === "Unread" && (
                    <button
                      onClick={() =>
                        onMarkAsRead(notification.id)
                      }
                    >
                      Mark as Read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}