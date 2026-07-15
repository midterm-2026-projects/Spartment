import { useState } from "react";

export default function AdminNotificationDropdown({
  notifications = [],
  onMarkAsRead,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        Admin Notifications
      </button>

      {isOpen && (
        <div>
          <h3>Admin Notifications</h3>

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