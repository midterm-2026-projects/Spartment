import { useEffect, useState } from "react";

import {
  getNotifications,
  updateNotification,
} from "../api/notificationApi";

import TenantNotificationDropdown from "../components/TenantNotificationDropdown";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

export default function TenantNotificationDashboard() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const data = await getNotifications();

      setNotifications(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(id) {
    try {
      await updateNotification(id);

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                status: "Read",
              }
            : notification
        )
      );
    } catch (error) {
      setError(error.message);
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  if (notifications.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <TenantNotificationDropdown
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  );
}