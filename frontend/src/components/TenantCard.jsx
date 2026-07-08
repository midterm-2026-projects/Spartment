export default function TenantCard({
  tenant = {
    name: "John Doe",
    email: "john@email.com",
    room: "Room 101",
    rent: "₱5,000",
  },
}) {
  return (
    <div className="rounded-xl border bg-white shadow p-5">
      <h2 className="text-xl font-bold">{tenant.name}</h2>

      <div className="mt-3 space-y-1">
        <p>
          <span className="font-semibold">Email:</span>{" "}
          {tenant.email}
        </p>

        <p>
          <span className="font-semibold">Room:</span>{" "}
          {tenant.room}
        </p>

        <p>
          <span className="font-semibold">Rent:</span>{" "}
          {tenant.rent}
        </p>
      </div>
    </div>
  );
}