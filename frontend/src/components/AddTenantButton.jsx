export default function AddTenantButton({
  onClick,
  disabled = false,
  label = "Add Tenant",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        disabled
          ? "cursor-not-allowed rounded-lg bg-gray-300 px-5 py-2 text-gray-600"
          : "rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
      }
    >
      {label}
    </button>
  );
}