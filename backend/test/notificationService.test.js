import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

vi.mock("../model/notificationModel.js", () => ({
  getNotifications: vi.fn(),
  updateNotificationStatus: vi.fn(),
}));

import {
  getNotifications,
  updateNotificationStatus,
} from "../model/notificationModel.js";

import {
  fetchNotifications,
  markNotificationAsRead,
} from "../service/notificationService.js";

describe("Notification Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve admin notifications successfully", async () => {
    // Arrange
    const mockNotifications = [
      {
        id: 1,
        role: "admin",
        category: "Payment",
        message: "Tenant payment is overdue.",
        status: "Unread",
      },
      {
        id: 2,
        role: "admin",
        category: "Lease",
        message: "Lease expires in 7 days.",
        status: "Unread",
      },
    ];

    getNotifications.mockResolvedValue(
      mockNotifications
    );

    // Act
    const result =
      await fetchNotifications("admin");

    // Assert
    expect(
      getNotifications
    ).toHaveBeenCalledTimes(1);

    expect(
      getNotifications
    ).toHaveBeenCalledWith("admin");

    expect(result).toEqual(
      mockNotifications
    );
  });

  it("should retrieve tenant notifications successfully", async () => {
    // Arrange
    const mockNotifications = [
      {
        id: 5,
        role: "tenant",
        category: "Payment",
        message: "Your payment is due tomorrow.",
        status: "Unread",
      },
    ];

    getNotifications.mockResolvedValue(
      mockNotifications
    );

    // Act
    const result =
      await fetchNotifications("tenant");

    // Assert
    expect(
      getNotifications
    ).toHaveBeenCalledTimes(1);

    expect(
      getNotifications
    ).toHaveBeenCalledWith("tenant");

    expect(result).toEqual(
      mockNotifications
    );
  });

  it("should return an empty notification list", async () => {
    // Arrange
    getNotifications.mockResolvedValue([]);

    // Act
    const result =
      await fetchNotifications("admin");

    // Assert
    expect(
      getNotifications
    ).toHaveBeenCalledWith("admin");

    expect(result).toEqual([]);
  });

  it("should throw an error when retrieving notifications fails", async () => {
    // Arrange
    getNotifications.mockRejectedValue(
      new Error("Database Error")
    );

    // Act & Assert
    await expect(
      fetchNotifications("admin")
    ).rejects.toThrow(
      "Failed to retrieve notifications."
    );
  });

  it("should update the notification status successfully", async () => {
    // Arrange
    const updatedNotification = {
      id: 1,
      role: "admin",
      category: "Payment",
      message: "Tenant payment is overdue.",
      status: "Read",
    };

    updateNotificationStatus.mockResolvedValue(
      updatedNotification
    );

    // Act
    const result =
      await markNotificationAsRead(1);

    // Assert
    expect(
      updateNotificationStatus
    ).toHaveBeenCalledWith(1);

    expect(result.status).toBe("Read");
  });

  it("should throw an error when the notification does not exist", async () => {
    // Arrange
    updateNotificationStatus.mockRejectedValue(
      new Error("Notification not found.")
    );

    // Act & Assert
    await expect(
      markNotificationAsRead(99)
    ).rejects.toThrow(
      "Notification not found."
    );

    expect(
      updateNotificationStatus
    ).toHaveBeenCalledWith(99);
  });
});