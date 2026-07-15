import {
  fetchNotifications,
  markNotificationAsRead,
} from "../../../backend/service/notificationService.js";

export async function getNotifications() {
  try {
    const notifications = await fetchNotifications();

    return notifications;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateNotification(id) {
  try {
    const notification = await markNotificationAsRead(id);

    return notification;
  } catch (error) {
    throw new Error(error.message);
  }
}