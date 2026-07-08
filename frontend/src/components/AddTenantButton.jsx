export default function AddTenantButton({
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
    >
      Add Tenant
    </button>
  );
}