export default function RoomAvailabilityBadge({ status = "Unknown" }) {
  const normalizedStatus = String(status).toLowerCase();

  const styles = {
    available: "bg-green-100 text-green-700",
    occupied: "bg-red-100 text-red-700",
    reserved: "bg-yellow-100 text-yellow-700",
    maintenance: "bg-orange-100 text-orange-700",
    inactive: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
        styles[normalizedStatus] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
