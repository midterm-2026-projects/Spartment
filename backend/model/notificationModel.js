import { supabase } from "../config/supabaseClient.js";

/*
|--------------------------------------------------------------------------
| Notification Model
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Get Notifications by User
|--------------------------------------------------------------------------
*/

export async function getNotifications(userId) {
  const { data, error } = await supabase
    .from("notifications")
    .select(
      `
      id,
      user_id,
      tenant_id,
      inquiry_id,
      title,
      message,
      type,
      is_read,
      created_at,
      updated_at
    `,
    )
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(`Failed to retrieve notifications: ${error.message}`);
  }

  return data ?? [];
}

/*
|--------------------------------------------------------------------------
| Get Unread Notification Count
|--------------------------------------------------------------------------
*/

export async function getUnreadNotificationCount(userId) {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    throw new Error(`Failed to retrieve unread count: ${error.message}`);
  }

  return count ?? 0;
}

/*
|--------------------------------------------------------------------------
| Update One Notification Status
|--------------------------------------------------------------------------
*/

export async function updateNotificationStatus(
  notificationId,
  userId,
  isRead = true,
) {
  const { data, error } = await supabase
    .from("notifications")
    .update({
      is_read: isRead,
    })
    .eq("id", notificationId)
    .eq("user_id", userId)
    .select(
      `
      id,
      user_id,
      tenant_id,
      inquiry_id,
      title,
      message,
      type,
      is_read,
      created_at,
      updated_at
    `,
    )
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update notification: ${error.message}`);
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Mark All Notifications as Read
|--------------------------------------------------------------------------
*/

export async function updateAllNotificationStatuses(userId) {
  const { data, error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
    })
    .eq("user_id", userId)
    .eq("is_read", false).select(`
      id,
      user_id,
      title,
      message,
      type,
      is_read,
      created_at,
      updated_at
    `);

  if (error) {
    throw new Error(`Failed to update notifications: ${error.message}`);
  }

  return data ?? [];
}

/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
*/

export async function deleteNotificationRecord(notificationId, userId) {
  const { data, error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to delete notification: ${error.message}`);
  }

  return data;
}
