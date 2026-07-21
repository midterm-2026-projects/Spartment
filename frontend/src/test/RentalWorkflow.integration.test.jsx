import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import CustomerRequests from "../pages/CustomerRequests";

import {
  approveRequest,
  getCustomerRequests,
  rejectRequest,
} from "../api/customerRequestApi";

import { getAvailableRooms, getRooms } from "../api/roomApi";

import { createTenant } from "../api/tenantCreationApi";

vi.mock("../api/customerRequestApi", () => ({
  getCustomerRequests: vi.fn(),
  approveRequest: vi.fn(),
  rejectRequest: vi.fn(),
}));

vi.mock("../api/roomApi", () => ({
  getRooms: vi.fn(),
  getAvailableRooms: vi.fn(),
}));

vi.mock("../api/tenantCreationApi", () => ({
  createTenant: vi.fn(),
}));

describe("Rental Workflow Integration", () => {
  const inquiryId = "11111111-1111-4111-8111-111111111111";

  const roomId = "22222222-2222-4222-8222-222222222222";

  const tenantId = "33333333-3333-4333-8333-333333333333";

  const billingId = "44444444-4444-4444-8444-444444444444";

  const adminId = "55555555-5555-4555-8555-555555555555";

  const pendingInquiry = {
    id: inquiryId,
    name: "Juan Dela Cruz",
    email: "juan@example.com",
    contact: "09123456789",
    roomId,

    room: {
      id: roomId,
      roomNumber: "Room 101",
    },

    moveInDate: "2026-08-01",
    message: "I would like to rent this room.",
    status: "Pending",
  };

  const approvedInquiry = {
    ...pendingInquiry,
    status: "Approved",
    reviewedBy: adminId,
    reviewedAt: "2026-07-21T10:00:00.000Z",
  };

  const inquiryWithTenant = {
    ...approvedInquiry,
    tenantId,
  };

  const rejectedInquiry = {
    ...pendingInquiry,
    status: "Rejected",
    reviewedBy: adminId,
    reviewedAt: "2026-07-21T10:00:00.000Z",
  };

  const availableRoom = {
    id: roomId,
    roomNumber: "Room 101",
    status: "Available",
    monthlyRent: 6500,
    capacity: 2,
  };

  const createdTenant = {
    id: tenantId,
    inquiryId,
    fullName: "Juan Dela Cruz",
    email: "juan@example.com",
    contact: "09123456789",
    roomId,
    username: "juan101",
    status: "Active",
  };

  const createdBilling = {
    id: billingId,
    tenantId,
    roomId,
    totalAmount: 6500,
    dueDate: "2026-08-01",
    status: "Pending",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => "mock-admin-token"),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      configurable: true,
    });

    getRooms.mockResolvedValue({
      success: true,
      data: [availableRoom],
    });

    getAvailableRooms.mockResolvedValue([availableRoom]);

    approveRequest.mockResolvedValue({
      success: true,
      message: "Inquiry approved successfully.",
      data: approvedInquiry,
    });

    rejectRequest.mockResolvedValue({
      success: true,
      message: "Inquiry rejected successfully.",
      data: rejectedInquiry,
    });

    createTenant.mockResolvedValue({
      success: true,
      message: "Tenant created successfully.",

      data: {
        tenant: createdTenant,
        billing: createdBilling,

        credentials: {
          username: "juan101",
          email: "juan@example.com",
          password: "Tenant123",
        },
      },
    });
  });

  it("completes the rental workflow from inquiry approval to tenant creation", async () => {
    const user = userEvent.setup();

    getCustomerRequests
      .mockResolvedValueOnce({
        success: true,
        data: [pendingInquiry],
      })
      .mockResolvedValueOnce({
        success: true,
        data: [approvedInquiry],
      })
      .mockResolvedValueOnce({
        success: true,
        data: [inquiryWithTenant],
      });

    render(<CustomerRequests />);

    expect(
      await screen.findByRole("heading", {
        name: /customer requests/i,
      }),
    ).toBeInTheDocument();

    expect(await screen.findByText("Juan Dela Cruz")).toBeInTheDocument();

    expect(screen.getByText("Pending")).toBeInTheDocument();

    const approveButton = screen.getByRole("button", {
      name: /^approve$/i,
    });

    const rejectButton = screen.getByRole("button", {
      name: /^reject$/i,
    });

    expect(approveButton).toBeEnabled();
    expect(rejectButton).toBeEnabled();

    await user.click(approveButton);

    await waitFor(() => {
      expect(approveRequest).toHaveBeenCalledTimes(1);
    });

    expect(approveRequest).toHaveBeenCalledWith(inquiryId);

    expect(await screen.findByText("Approved")).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /^approve$/i,
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /^reject$/i,
      }),
    ).not.toBeInTheDocument();

    const addTenantButton = await screen.findByRole("button", {
      name: /add tenant/i,
    });

    expect(addTenantButton).toBeEnabled();

    await user.click(addTenantButton);

    const modal = await screen.findByRole("dialog");

    expect(
      within(modal).getByRole("heading", {
        name: /add tenant/i,
      }),
    ).toBeInTheDocument();

    const fullNameInput = within(modal).getByLabelText(/full name/i);

    const emailInput = within(modal).getByLabelText(/^email$/i);

    const contactInput = within(modal).getByLabelText(/contact/i);

    const roomSelect = within(modal).getByLabelText(/assigned room/i);

    const usernameInput = within(modal).getByLabelText(/username/i);

    const passwordInput = within(modal).getByLabelText(/default password/i);

    expect(fullNameInput).toHaveValue("Juan Dela Cruz");

    expect(emailInput).toHaveValue("juan@example.com");

    expect(contactInput).toHaveValue("09123456789");

    expect(roomSelect).toHaveValue(roomId);

    expect(
      within(roomSelect).getByRole("option", {
        name: /room 101/i,
      }),
    ).toBeInTheDocument();

    await user.type(usernameInput, "juan101");

    await user.type(passwordInput, "Tenant123");

    await user.click(
      within(modal).getByRole("button", {
        name: /create tenant/i,
      }),
    );

    await waitFor(() => {
      expect(createTenant).toHaveBeenCalledTimes(1);
    });

    expect(createTenant).toHaveBeenCalledWith({
      inquiryId,
      fullName: "Juan Dela Cruz",
      email: "juan@example.com",
      contact: "09123456789",
      roomId,
      username: "juan101",
      password: "Tenant123",
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    const credentialsHeading = await screen.findByRole("heading", {
      name: /tenant account created/i,
    });

    expect(credentialsHeading).toBeInTheDocument();

    const credentialsSection = credentialsHeading.closest("section");

    expect(credentialsSection).not.toBeNull();

    expect(within(credentialsSection).getByText("juan101")).toBeInTheDocument();

    /*
     * The email also appears in the customer
     * request table. Scope this assertion to
     * the credentials section to avoid a
     * multiple-elements error.
     */
    expect(
      within(credentialsSection).getByText("juan@example.com"),
    ).toBeInTheDocument();

    expect(
      within(credentialsSection).getByText("Tenant123"),
    ).toBeInTheDocument();

    const billingHeading = screen.getByRole("heading", {
      name: /initial billing created/i,
    });

    expect(billingHeading).toBeInTheDocument();

    const billingSection = billingHeading.closest("section");

    expect(billingSection).not.toBeNull();

    expect(within(billingSection).getByText(/6,500/)).toBeInTheDocument();

    expect(within(billingSection).getByText("2026-08-01")).toBeInTheDocument();

    await waitFor(() => {
      expect(getCustomerRequests).toHaveBeenCalledTimes(3);
    });
  });

  it("only approves the inquiry and does not create a tenant automatically", async () => {
    const user = userEvent.setup();

    getCustomerRequests
      .mockResolvedValueOnce({
        success: true,
        data: [pendingInquiry],
      })
      .mockResolvedValueOnce({
        success: true,
        data: [approvedInquiry],
      });

    render(<CustomerRequests />);

    await user.click(
      await screen.findByRole("button", {
        name: /^approve$/i,
      }),
    );

    await waitFor(() => {
      expect(approveRequest).toHaveBeenCalledWith(inquiryId);
    });

    expect(await screen.findByText("Approved")).toBeInTheDocument();

    expect(createTenant).not.toHaveBeenCalled();

    expect(
      screen.getByRole("button", {
        name: /add tenant/i,
      }),
    ).toBeInTheDocument();
  });

  it("allows the admin to reject a pending inquiry", async () => {
    const user = userEvent.setup();

    getCustomerRequests
      .mockResolvedValueOnce({
        success: true,
        data: [pendingInquiry],
      })
      .mockResolvedValueOnce({
        success: true,
        data: [rejectedInquiry],
      });

    render(<CustomerRequests />);

    expect(await screen.findByText("Juan Dela Cruz")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /^reject$/i,
      }),
    );

    await waitFor(() => {
      expect(rejectRequest).toHaveBeenCalledTimes(1);
    });

    expect(rejectRequest).toHaveBeenCalledWith(inquiryId);

    expect(await screen.findByText("Rejected")).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /add tenant/i,
      }),
    ).not.toBeInTheDocument();

    expect(createTenant).not.toHaveBeenCalled();
  });

  it("does not show Add Tenant for a pending inquiry", async () => {
    getCustomerRequests.mockResolvedValue({
      success: true,
      data: [pendingInquiry],
    });

    render(<CustomerRequests />);

    expect(await screen.findByText("Pending")).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /add tenant/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("does not create a tenant when required credentials are missing", async () => {
    const user = userEvent.setup();

    getCustomerRequests.mockResolvedValue({
      success: true,
      data: [approvedInquiry],
    });

    render(<CustomerRequests />);

    await user.click(
      await screen.findByRole("button", {
        name: /add tenant/i,
      }),
    );

    const modal = await screen.findByRole("dialog");

    const createTenantButton = within(modal).getByRole("button", {
      name: /create tenant/i,
    });

    fireEvent.click(createTenantButton);

    expect(createTenant).not.toHaveBeenCalled();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows the tenant creation error and keeps the modal open", async () => {
    const user = userEvent.setup();

    getCustomerRequests.mockResolvedValue({
      success: true,
      data: [approvedInquiry],
    });

    createTenant.mockRejectedValue(
      new Error("A tenant already exists for this inquiry."),
    );

    render(<CustomerRequests />);

    await user.click(
      await screen.findByRole("button", {
        name: /add tenant/i,
      }),
    );

    const modal = await screen.findByRole("dialog");

    const usernameInput = within(modal).getByLabelText(/username/i);

    const passwordInput = within(modal).getByLabelText(/default password/i);

    await user.type(usernameInput, "juan101");

    await user.type(passwordInput, "Tenant123");

    await user.click(
      within(modal).getByRole("button", {
        name: /create tenant/i,
      }),
    );

    await waitFor(() => {
      expect(createTenant).toHaveBeenCalledTimes(1);
    });

    expect(createTenant).toHaveBeenCalledWith({
      inquiryId,
      fullName: "Juan Dela Cruz",
      email: "juan@example.com",
      contact: "09123456789",
      roomId,
      username: "juan101",
      password: "Tenant123",
    });

    /*
     * The same error may appear in both the
     * page-level alert and modal-level alert.
     * Scope the main assertion to the dialog.
     */
    const modalAlert = await within(modal).findByRole("alert");

    expect(modalAlert).toHaveTextContent(
      "A tenant already exists for this inquiry.",
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    expect(usernameInput).toHaveValue("juan101");

    expect(passwordInput).toHaveValue("Tenant123");
  });

  it("allows the admin to cancel tenant creation", async () => {
    const user = userEvent.setup();

    getCustomerRequests.mockResolvedValue({
      success: true,
      data: [approvedInquiry],
    });

    render(<CustomerRequests />);

    await user.click(
      await screen.findByRole("button", {
        name: /add tenant/i,
      }),
    );

    const modal = await screen.findByRole("dialog");

    expect(modal).toBeInTheDocument();

    await user.click(
      within(modal).getByRole("button", {
        name: /cancel/i,
      }),
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    expect(createTenant).not.toHaveBeenCalled();
  });

  it("shows an inquiry loading error", async () => {
    getCustomerRequests.mockRejectedValue(
      new Error("Failed to load customer requests."),
    );

    render(<CustomerRequests />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Failed to load customer requests.",
    );
  });
});
