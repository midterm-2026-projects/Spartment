import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

vi.mock("../api/tenantApi", () => ({
  getTenantInformation: vi.fn(),
}));

import { getTenantInformation } from "../api/tenantApi";

import TenantDashboard from "../pages/TenantDashboard";

describe("Tenant Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve tenant information from the backend successfully", async () => {
    // Arrange
    getTenantInformation.mockResolvedValue({
      tenant: {
        name: "Juan Dela Cruz",
        contact: "09123456789",
        email: "juan@email.com",
      },
      room: {
        roomNumber: "Room 101",
        monthlyRent: 5000,
        nextDue: "July 15, 2026",
      },
      payments: [
        {
          month: "January",
          amount: 5000,
          status: "Paid",
        },
      ],
    });

    // Act
    render(<TenantDashboard />);

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText("Juan Dela Cruz")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Room 101")
      ).toBeInTheDocument();
    });
  });

  it("should display payment history using backend data correctly", async () => {
    // Arrange
    getTenantInformation.mockResolvedValue({
      tenant: {
        name: "Juan Dela Cruz",
        contact: "09123456789",
        email: "juan@email.com",
      },
      room: {
        roomNumber: "Room 101",
        monthlyRent: 5000,
        nextDue: "July 15, 2026",
      },
      payments: [
        {
          month: "January",
          amount: 5000,
          status: "Paid",
        },
        {
          month: "February",
          amount: 5000,
          status: "Paid",
        },
      ],
    });

    // Act
    render(<TenantDashboard />);

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText("January")
      ).toBeInTheDocument();

      expect(
        screen.getByText("February")
      ).toBeInTheDocument();

      expect(
        screen.getAllByText("Paid")
      ).toHaveLength(2);
    });
  });

  it("should display a message when no payment history exists", async () => {
    // Arrange
    getTenantInformation.mockResolvedValue({
      tenant: {
        name: "Juan Dela Cruz",
        contact: "09123456789",
        email: "juan@email.com",
      },
      room: {
        roomNumber: "Room 101",
        monthlyRent: 5000,
        nextDue: "July 15, 2026",
      },
      payments: [],
    });

    // Act
    render(<TenantDashboard />);

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText("No payment history found.")
      ).toBeInTheDocument();
    });
  });

  it("should display an appropriate message when tenant information is unavailable", async () => {
    // Arrange
    getTenantInformation.mockRejectedValue(
      new Error("Tenant not found.")
    );

    // Act
    render(<TenantDashboard />);

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText("Something went wrong.")
      ).toBeInTheDocument();
    });
  });

  it("should display a message when no tenant information exists", async () => {
    // Arrange
    getTenantInformation.mockResolvedValue(null);

    // Act
    render(<TenantDashboard />);

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText("No records found.")
      ).toBeInTheDocument();
    });
  });
});