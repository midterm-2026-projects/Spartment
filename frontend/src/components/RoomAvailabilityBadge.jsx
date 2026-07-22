export default function RoomAvailabilityBadge({ status = "Unknown" }) {
  const normalized = String(status).toLowerCase();
  return <span className={`room-badge room-badge--${normalized}`}><i />{status}</span>;
}
