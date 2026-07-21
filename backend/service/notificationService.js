import {
  getNotifications,
  getUnreadNotificationCount,
  updateNotificationStatus,
  updateAllNotificationStatuses,
  deleteNotificationRecord,
} from "../model/notificationModel.js";

/*
|--------------------------------------------------------------------------
| Fetch User Notifications
|--------------------------------------------------------------------------
*/

export async function fetchUserNotifications(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return getNotifications(userId);
}

/*
|--------------------------------------------------------------------------
| Fetch Unread Notification Count
|--------------------------------------------------------------------------
*/

export async function fetchUnreadNotificationCount(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return getUnreadNotificationCount(userId);
}

/*
|--------------------------------------------------------------------------
| Mark One Notification as Read
|--------------------------------------------------------------------------
*/

export async function markNotificationAsRead(notificationId, userId) {
  if (!notificationId) {
    throw new Error("Notification ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const notification = await updateNotificationStatus(
    notificationId,
    userId,
    true,
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
}

/*
|--------------------------------------------------------------------------
| Mark All Notifications as Read
|--------------------------------------------------------------------------
*/

export async function markAllNotificationsAsRead(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return updateAllNotificationStatuses(userId);
}

/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
*/

export async function deleteNotificationById(notificationId, userId) {
  if (!notificationId) {
    throw new Error("Notification ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const notification = await deleteNotificationRecord(notificationId, userId);

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
}

/*
|--------------------------------------------------------------------------
| Compatibility Functions
|--------------------------------------------------------------------------
*/

export async function fetchNotifications(userId) {
  return fetchUserNotifications(userId);
}
