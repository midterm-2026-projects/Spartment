/*
|--------------------------------------------------------------------------
| Room Validation
|--------------------------------------------------------------------------
*/

export function validateRoomSearch(
  search,
) {
  if (
    !search ||
    !String(search).trim()
  ) {
    throw new Error(
      "Room search is required.",
    );
  }

  return true;
}