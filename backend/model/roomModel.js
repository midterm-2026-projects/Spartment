const roomList = [
  {
    id: 1,
    roomNumber: "Room 101",
    status: "Occupied",
    tenant: "Maria Santos",
    rent: 6500,
  },
  {
    id: 2,
    roomNumber: "Room 102",
    status: "Vacant",
    tenant: "None",
    rent: 5500,
  },
  {
    id: 3,
    roomNumber: "Room 103",
    status: "Maintenance",
    tenant: "Juan Dela Cruz",
    rent: 7000,
  },
];

export async function getRoomList() {
  return roomList;
}