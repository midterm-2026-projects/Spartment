import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../model/notificationModel.js", () => ({
  getNotifications: vi.fn(),
  getUnreadNotificationCount: vi.fn(),
  updateNotificationStatus: vi.fn(),
  updateAllNotificationStatuses: vi.fn(),
  deleteNotificationRecord: vi.fn(),
}));

import {
  getNotifications,
  getUnreadNotificationCount,
  updateNotificationStatus,
  updateAllNotificationStatuses,
  deleteNotificationRecord,
} from "../model/notificationModel.js";

import {
  fetchNotifications,
  fetchUserNotifications,
  fetchUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationById,
} from "../service/notificationService.js";

describe("Notification Service", () => {
  const userId = "11111111-1111-4111-8111-111111111111";

  const notificationId = "22222222-2222-4222-8222-222222222222";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve notifications successfully", async () => {
    const notifications = [
      {
        id: notificationId,
        user_id: userId,
        title: "Inquiry approved",
        message: "Your inquiry has been approved.",
        is_read: false,
      },
    ];

    getNotifications.mockResolvedValue(notifications);

    const result = await fetchNotifications(userId);

    expect(getNotifications).toHaveBeenCalledWith(userId);

    expect(result).toEqual(notifications);
  });

  it("should retrieve notifications using fetchUserNotifications", async () => {
    getNotifications.mockResolvedValue([]);

    const result = await fetchUserNotifications(userId);

    expect(result).toEqual([]);

    expect(getNotifications).toHaveBeenCalledWith(userId);
  });

  it("should require a user ID when retrieving notifications", async () => {
    await expect(fetchNotifications(null)).rejects.toThrow(
      "User ID is required",
    );

    expect(getNotifications).not.toHaveBeenCalled();
  });

  it("should propagate an error when retrieving notifications fails", async () => {
    getNotifications.mockRejectedValue(new Error("Database Error"));

    await expect(fetchNotifications(userId)).rejects.toThrow("Database Error");
  });

  it("should retrieve unread notification count", async () => {
    getUnreadNotificationCount.mockResolvedValue(3);

    const result = await fetchUnreadNotificationCount(userId);

    expect(getUnreadNotificationCount).toHaveBeenCalledWith(userId);

    expect(result).toBe(3);
  });

  it("should require a user ID when retrieving unread count", async () => {
    await expect(fetchUnreadNotificationCount(null)).rejects.toThrow(
      "User ID is required",
    );

    expect(getUnreadNotificationCount).not.toHaveBeenCalled();
  });

  it("should update notification status successfully", async () => {
    const updatedNotification = {
      id: notificationId,
      user_id: userId,
      is_read: true,
    };

    updateNotificationStatus.mockResolvedValue(updatedNotification);

    const result = await markNotificationAsRead(notificationId, userId);

    expect(updateNotificationStatus).toHaveBeenCalledWith(
      notificationId,
      userId,
      true,
    );

    expect(result).toEqual(updatedNotification);
  });

  it("should throw when notification does not exist", async () => {
    updateNotificationStatus.mockResolvedValue(null);

    await expect(
      markNotificationAsRead(notificationId, userId),
    ).rejects.toThrow("Notification not found");
  });

  it("should require a notification ID when marking as read", async () => {
    await expect(markNotificationAsRead(null, userId)).rejects.toThrow(
      "Notification ID is required",
    );

    expect(updateNotificationStatus).not.toHaveBeenCalled();
  });

  it("should require a user ID when marking as read", async () => {
    await expect(markNotificationAsRead(notificationId, null)).rejects.toThrow(
      "User ID is required",
    );

    expect(updateNotificationStatus).not.toHaveBeenCalled();
  });

  it("should mark all notifications as read", async () => {
    const notifications = [
      {
        id: notificationId,
        user_id: userId,
        is_read: true,
      },
    ];

    updateAllNotificationStatuses.mockResolvedValue(notifications);

    const result = await markAllNotificationsAsRead(userId);

    expect(updateAllNotificationStatuses).toHaveBeenCalledWith(userId);

    expect(result).toEqual(notifications);
  });

  it("should require a user ID when marking all as read", async () => {
    await expect(markAllNotificationsAsRead(null)).rejects.toThrow(
      "User ID is required",
    );

    expect(updateAllNotificationStatuses).not.toHaveBeenCalled();
  });

  it("should delete a notification successfully", async () => {
    deleteNotificationRecord.mockResolvedValue({
      id: notificationId,
      user_id: userId,
    });

    const result = await deleteNotificationById(notificationId, userId);

    expect(deleteNotificationRecord).toHaveBeenCalledWith(
      notificationId,
      userId,
    );

    expect(result).toEqual({
      id: notificationId,
      user_id: userId,
    });
  });

  it("should throw when notification to delete does not exist", async () => {
    deleteNotificationRecord.mockResolvedValue(null);

    await expect(
      deleteNotificationById(notificationId, userId),
    ).rejects.toThrow("Notification not found");
  });

  it("should require notification ID when deleting", async () => {
    await expect(deleteNotificationById(null, userId)).rejects.toThrow(
      "Notification ID is required",
    );

    expect(deleteNotificationRecord).not.toHaveBeenCalled();
  });

  it("should require user ID when deleting", async () => {
    await expect(deleteNotificationById(notificationId, null)).rejects.toThrow(
      "User ID is required",
    );

    expect(deleteNotificationRecord).not.toHaveBeenCalled();
  });
});
