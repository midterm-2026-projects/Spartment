export function validateRoomSearch(search) {
  if (!search || search.trim() === "") {
    throw new Error("Room search is required.");
  }
}