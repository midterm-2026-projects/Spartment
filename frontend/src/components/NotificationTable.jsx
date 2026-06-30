export default function NotificationTable({
  notifications = [
    {
      type: "Payment Due",
      message: "Tenant payment due tomorrow",
      timestamp: "2026-06-23",
    },
    {
      type: "Lease Expiry",
      message: "Lease expires in 7 days",
      timestamp: "2026-06-22",
    },
  ],
}) {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Notification Type</th>
          <th>Message</th>
          <th>Timestamp</th>
        </tr>
      </thead>

      <tbody>
        {notifications.map((notification, index) => (
          <tr key={index}>
            <td>{notification.type}</td>
            <td>{notification.message}</td>
            <td>{notification.timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}