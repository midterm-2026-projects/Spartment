export default function TenantInfoCards({
  room = {
    roomNumber: "",
    monthlyRent: "",
    nextDue: "",
  },
}) {
  const cards = [
    {
      title: "My Room",
      value: room.roomNumber || "0",
    },
    {
      title: "Monthly Rent",
      value: room.monthlyRent || "0",
    },
    {
      title: "Next Due",
      value: room.nextDue || "0",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow p-5"
        >
          <h2>{card.title}</h2>
          <p>{card.value}</p>
        </div>
      ))}
    </div>
  );
}