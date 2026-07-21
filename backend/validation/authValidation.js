/*
|--------------------------------------------------------------------------
| Authentication Validation
|--------------------------------------------------------------------------
*/

export function validateLoginCredentials(
  identifier,
  password,
) {
  if (
    !identifier ||
    !String(identifier).trim()
  ) {
    throw new Error(
      "Email or username is required.",
    );
  }

  if (
    !password ||
    !String(password).trim()
  ) {
    throw new Error(
      "Password is required.",
    );
  }

  if (String(password).length < 8) {
    throw new Error(
      "Password must contain at least 8 characters.",
    );
  }

  return true;
}