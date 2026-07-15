const notifications = [
  {
    id: 1,
    role: "admin",
    category: "Payment",
    message: "Tenant payment is overdue.",
    status: "Unread",
  },
  {
    id: 2,
    role: "admin",
    category: "Lease",
    message: "Lease expires in 7 days.",
    status: "Unread",
  },
  {
    id: 3,
    role: "admin",
    category: "Room",
    message: "Room 102 is now vacant.",
    status: "Read",
  },
  {
    id: 4,
    role: "admin",
    category: "Maintenance",
    message: "New maintenance request submitted.",
    status: "Unread",
  },
  {
    id: 5,
    role: "tenant",
    category: "Payment",
    message: "Your payment is due tomorrow.",
    status: "Unread",
  },
  {
    id: 6,
    role: "tenant",
    category: "Maintenance",
    message:
      "Your maintenance request is being processed.",
    status: "Read",
  },
  {
    id: 7,
    role: "tenant",
    category: "Lease",
    message:
      "Lease renewal is available.",
    status: "Unread",
  },
];

export async function getNotifications(role) {
  return notifications.filter(
    (notification) => notification.role === role
  );
}

export async function updateNotificationStatus(id) {
  const notification = notifications.find(
    (notification) => notification.id === id
  );

  if (!notification) {
    throw new Error("Notification not found.");
  }

  notification.status = "Read";

  return notification;
}