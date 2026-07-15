import {
  getNotifications,
  updateNotificationStatus,
} from "../model/notificationModel.js";

export async function fetchNotifications(role) {
  try {
    const notifications =
      await getNotifications(role);

    return notifications;
  } catch {
    throw new Error(
      "Failed to retrieve notifications."
    );
  }
}

export async function markNotificationAsRead(id) {
  try {
    return await updateNotificationStatus(id);
  } catch (error) {
    throw new Error(error.message);
  }
}