const users = [
  {
    id: 1,
    name: "System Administrator",
    email: "admin@email.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "Juan Dela Cruz",
    email: "tenant@email.com",
    password: "tenant123",
    role: "tenant",
  },
];

export async function getUserByEmail(email) {
  return users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}