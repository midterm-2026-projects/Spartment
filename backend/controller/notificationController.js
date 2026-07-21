import {
  fetchUserNotifications,
  fetchUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationById,
} from "../service/notificationService.js";

/*
|--------------------------------------------------------------------------
| Get User Notifications
|--------------------------------------------------------------------------
| Returns notifications belonging to the authenticated user.
|--------------------------------------------------------------------------
*/

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required",
      });
    }

    const notifications = await fetchUserNotifications(userId);

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Unread Notification Count
|--------------------------------------------------------------------------
*/

export const getUnreadNotificationCount = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required",
      });
    }

    const count = await fetchUnreadNotificationCount(userId);

    return res.status(200).json({
      success: true,
      data: {
        count,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Mark One Notification as Read
|--------------------------------------------------------------------------
*/

export const readNotification = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required",
      });
    }

    const notification = await markNotificationAsRead(req.params.id, userId);

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    const statusCode = error.message === "Notification not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Mark All Notifications as Read
|--------------------------------------------------------------------------
*/

export const readAllNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required",
      });
    }

    const notifications = await markAllNotificationsAsRead(userId);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: notifications,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
*/

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required",
      });
    }

    await deleteNotificationById(req.params.id, userId);

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    const statusCode = error.message === "Notification not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
