const tenantList = [
  {
    id: 1,
    name: "John Doe",
    email: "john@email.com",
    room: "Room 101",
    rent: "₱5,000",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@email.com",
    room: "Room 102",
    rent: "₱6,000",
  },
  {
    id: 3,
    name: "Michael Santos",
    email: "michael@email.com",
    room: "Room 103",
    rent: "₱5,500",
  },
];

export async function getTenantList() {
  return tenantList;
}