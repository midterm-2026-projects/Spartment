import { getUserByEmail } from "../model/authModel.js";
import { validateLoginCredentials } from "../validation/authValidation.js";

export async function authenticateUser(email, password) {
  try {
    // Validate login input
    validateLoginCredentials(email, password);

    // Retrieve user
    const user = await getUserByEmail(email);

    // Check if the user exists
    if (!user) {
      throw new Error("User not found.");
    }

    // Validate password
    if (user.password !== password) {
      throw new Error("Invalid password.");
    }

    // Return authenticated user
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}