export default function EmptyState({
  title = "No records found.",
  message = "There is currently no available information.",
}) {
  return (
    <div
      className="
        bg-white
        rounded-xl
        shadow
        p-6
        text-center
      "
    >
      <h3 className="font-bold text-lg">{title}</h3>

      <p className="text-gray-500 mt-2">{message}</p>
    </div>
  );
}
