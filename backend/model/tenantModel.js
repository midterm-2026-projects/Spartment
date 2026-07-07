const tenantData = [
  {
    id: 1,
    tenant: {
      name: "Juan Dela Cruz",
      contact: "09123456789",
      email: "juan@email.com",
    },

    room: {
      roomNumber: "Room 101",
      monthlyRent: 5000,
      nextDue: "July 15, 2026",
    },

    payments: [
      {
        month: "January",
        amount: 5000,
        status: "Paid",
      },
      {
        month: "February",
        amount: 5000,
        status: "Paid",
      },
      {
        month: "March",
        amount: 5000,
        status: "Pending",
      },
    ],
  },

  {
    id: 2,
    tenant: {
      name: "Maria Santos",
      contact: "09987654321",
      email: "maria@email.com",
    },

    room: {
      roomNumber: "Room 102",
      monthlyRent: 6500,
      nextDue: "July 20, 2026",
    },

    payments: [
      {
        month: "January",
        amount: 6500,
        status: "Paid",
      },
    ],
  },
];

export async function getTenantInformation(id) {
  const tenant = tenantData.find((tenant) => tenant.id === id);

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  return tenant;
}