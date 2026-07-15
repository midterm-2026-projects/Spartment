export default function EmptyState({
  message = "No records found.",
}) {
  return (
    <div>
      <p>{message}</p>
    </div>
  );
}