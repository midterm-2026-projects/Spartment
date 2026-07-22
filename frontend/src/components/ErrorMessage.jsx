export default function ErrorMessage({
  message = "Something went wrong.",
  retry,
}) {
  return (
    <div
      role="alert"
      className="
        bg-red-50
        border
        border-red-200
        text-red-700
        rounded-lg
        p-4
      "
    >
      <p>{message}</p>

      {retry && (
        <button
          onClick={retry}
          className="
              mt-3
              px-4
              py-2
              bg-red-600
              text-white
              rounded-lg
            "
        >
          Retry
        </button>
      )}
    </div>
  );
}
