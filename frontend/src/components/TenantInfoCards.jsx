function formatCurrency(value) {
  const number = Number(value || 0);

  return `₱${number.toLocaleString()}`;
}

export default function TenantInfoCards({ tenant, room, billing, risk }) {
  const roomNumber =
    room?.roomNumber ||
    room?.room_number ||
    tenant?.room?.roomNumber ||
    tenant?.room?.room_number ||
    tenant?.roomNumber ||
    tenant?.room_number ||
    "Not assigned";

  const monthlyRent =
    room?.monthlyRent ??
    room?.monthly_rent ??
    tenant?.room?.monthlyRent ??
    tenant?.room?.monthly_rent ??
    tenant?.monthlyRent ??
    tenant?.monthly_rent ??
    0;

  const nextDue =
    billing?.nextDue ||
    billing?.next_due ||
    billing?.dueDate ||
    billing?.due_date ||
    "No billing record";

  const riskLevel =
    risk?.riskLevel ||
    risk?.risk_level ||
    tenant?.riskLevel ||
    tenant?.risk_level ||
    "Low";

  const cards = [
    {
      title: "My Room",
      value: roomNumber,
    },
    {
      title: "Monthly Rent",
      value: formatCurrency(monthlyRent),
    },
    {
      title: "Next Due",
      value: nextDue,
    },
    {
      title: "Risk Level",
      value: riskLevel,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-xl border bg-white p-5 shadow-sm"
        >
          <h2 className="font-medium text-gray-500">{card.title}</h2>

          <p className="mt-2 break-words text-lg font-bold text-gray-900">
            {card.value}
          </p>
        </article>
      ))}
    </div>
  );
}
