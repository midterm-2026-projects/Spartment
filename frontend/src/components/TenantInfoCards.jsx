export default function TenantInfoCards({
  room = {
    roomNumber: "",
    monthlyRent: "",
    nextDue: "",
    riskLevel: "",
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

    {
      title: "Risk Level",
      value: room.riskLevel || "Low",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold">{card.title}</h2>

          <p className="text-lg font-bold mt-2">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
