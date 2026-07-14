export function validateLoginCredentials(email, password) {
  if (!email || email.trim() === "") {
    throw new Error("Email is required.");
  }

  if (!password || password.trim() === "") {
    throw new Error("Password is required.");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new Error("Invalid email format.");
  }
}