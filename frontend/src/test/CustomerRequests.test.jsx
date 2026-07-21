import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import CustomerRequests from "../pages/CustomerRequests";

import useCustomerRequests from "../hooks/useCustomerRequests";
import useTenantCreation from "../hooks/useTenantCreation";
import useRooms from "../hooks/useRooms";

vi.mock("../hooks/useCustomerRequests", () => ({
  default: vi.fn(),
}));

vi.mock("../hooks/useTenantCreation", () => ({
  default: vi.fn(),
}));

vi.mock("../hooks/useRooms", () => ({
  default: vi.fn(),
}));

describe("Customer Requests Page", () => {
  const inquiryId =
    "11111111-1111-4111-8111-111111111111";

  const roomId =
    "22222222-2222-4222-8222-222222222222";

  const pendingRequest = {
    id: inquiryId,
    name: "Juan Dela Cruz",
    fullName: "Juan Dela Cruz",
    email: "juan@gmail.com",
    contact: "09123456789",
    roomId,
    room: {
      id: roomId,
      roomNumber: "101",
    },
    moveInDate: "2026-08-01",
    message: "I want to rent this room.",
    status: "Pending",
  };

  const approvedRequest = {
    ...pendingRequest,
    status: "Approved",
  };

  const availableRoom = {
    id: roomId,
    roomNumber: "101",
    monthlyRent: 5000,
    status: "Available",
  };

  let approve;
  let reject;
  let refetchRequests;
  let refetchRooms;
  let registerTenant;
  let clearTenantCreation;

  beforeEach(() => {
    vi.clearAllMocks();

    approve = vi.fn().mockResolvedValue({
      success: true,
    });

    reject = vi.fn().mockResolvedValue({
      success: true,
    });

    refetchRequests = vi.fn().mockResolvedValue({
      success: true,
    });

    refetchRooms = vi.fn().mockResolvedValue({
      success: true,
    });

    registerTenant = vi.fn().mockResolvedValue({
      success: true,
    });

    clearTenantCreation = vi.fn();

    useCustomerRequests.mockReturnValue({
      requests: [],
      loading: false,
      processingId: null,
      error: "",
      approve,
      reject,
      refetch: refetchRequests,
    });

    useRooms.mockReturnValue({
      rooms: [availableRoom],
      loading: false,
      error: "",
      refetch: refetchRooms,
    });

    useTenantCreation.mockReturnValue({
      registerTenant,
      credentials: null,
      billing: null,
      loading: false,
      error: "",
      clear: clearTenantCreation,
    });
  });

  it("should display customer requests successfully", () => {
    useCustomerRequests.mockReturnValue({
      requests: [pendingRequest],
      loading: false,
      processingId: null,
      error: "",
      approve,
      reject,
      refetch: refetchRequests,
    });

    render(<CustomerRequests />);

    expect(
      screen.getByRole("heading", {
        name: /customer requests/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Juan Dela Cruz"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("juan@gmail.com"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Pending"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /^approve$/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /^reject$/i,
      }),
    ).toBeInTheDocument();
  });

  it("should approve request successfully", async () => {
    const user = userEvent.setup();

    useCustomerRequests.mockReturnValue({
      requests: [pendingRequest],
      loading: false,
      processingId: null,
      error: "",
      approve,
      reject,
      refetch: refetchRequests,
    });

    render(<CustomerRequests />);

    await user.click(
      screen.getByRole("button", {
        name: /^approve$/i,
      }),
    );

    await waitFor(() => {
      expect(approve).toHaveBeenCalledTimes(1);
    });

    expect(approve).toHaveBeenCalledWith(
      inquiryId,
    );
  });

  it("should reject request successfully", async () => {
    const user = userEvent.setup();

    useCustomerRequests.mockReturnValue({
      requests: [pendingRequest],
      loading: false,
      processingId: null,
      error: "",
      approve,
      reject,
      refetch: refetchRequests,
    });

    render(<CustomerRequests />);

    await user.click(
      screen.getByRole("button", {
        name: /^reject$/i,
      }),
    );

    await waitFor(() => {
      expect(reject).toHaveBeenCalledTimes(1);
    });

    expect(reject).toHaveBeenCalledWith(
      inquiryId,
    );
  });

  it("should display loading state", () => {
    useCustomerRequests.mockReturnValue({
      requests: [],
      loading: true,
      processingId: null,
      error: "",
      approve,
      reject,
      refetch: refetchRequests,
    });

    render(<CustomerRequests />);

    expect(
      screen.getByText(/loading/i),
    ).toBeInTheDocument();
  });

  it("should display request loading error", () => {
    useCustomerRequests.mockReturnValue({
      requests: [],
      loading: false,
      processingId: null,
      error: "Failed to load requests.",
      approve,
      reject,
      refetch: refetchRequests,
    });

    render(<CustomerRequests />);

    expect(
      screen.getByRole("alert"),
    ).toHaveTextContent(
      "Failed to load requests.",
    );
  });

  it("should display room loading error", () => {
    useRooms.mockReturnValue({
      rooms: [],
      loading: false,
      error: "Failed to load rooms.",
      refetch: refetchRooms,
    });

    render(<CustomerRequests />);

    expect(
      screen.getByRole("alert"),
    ).toHaveTextContent(
      "Failed to load rooms.",
    );
  });

  it("should display approval error", async () => {
    const user = userEvent.setup();

    approve.mockRejectedValue(
      new Error("Failed to approve request."),
    );

    useCustomerRequests.mockReturnValue({
      requests: [pendingRequest],
      loading: false,
      processingId: null,
      error: "",
      approve,
      reject,
      refetch: refetchRequests,
    });

    render(<CustomerRequests />);

    await user.click(
      screen.getByRole("button", {
        name: /^approve$/i,
      }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(
      "Failed to approve request.",
    );
  });

  it("should display rejection error", async () => {
    const user = userEvent.setup();

    reject.mockRejectedValue(
      new Error("Failed to reject request."),
    );

    useCustomerRequests.mockReturnValue({
      requests: [pendingRequest],
      loading: false,
      processingId: null,
      error: "",
      approve,
      reject,
      refetch: refetchRequests,
    });

    render(<CustomerRequests />);

    await user.click(
      screen.getByRole("button", {
        name: /^reject$/i,
      }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(
      "Failed to reject request.",
    );
  });

  it("should open Add Tenant modal for an approved inquiry", async () => {
    const user = userEvent.setup();

    useCustomerRequests.mockReturnValue({
      requests: [approvedRequest],
      loading: false,
      processingId: null,
      error: "",
      approve,
      reject,
      refetch: refetchRequests,
    });

    render(<CustomerRequests />);

    await user.click(
      screen.getByRole("button", {
        name: /add tenant/i,
      }),
    );

    expect(
      screen.getByRole("dialog"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /add tenant/i,
      }),
    ).toBeInTheDocument();

    expect(
      clearTenantCreation,
    ).toHaveBeenCalledTimes(1);

    expect(
      screen.getByLabelText(/full name/i),
    ).toHaveValue("Juan Dela Cruz");

    expect(
      screen.getByLabelText(/^email$/i),
    ).toHaveValue("juan@gmail.com");

    expect(
      screen.getByLabelText(/assigned room/i),
    ).toHaveValue(roomId);
  });

  it("should close Add Tenant modal when Cancel is clicked", async () => {
    const user = userEvent.setup();

    useCustomerRequests.mockReturnValue({
      requests: [approvedRequest],
      loading: false,
      processingId: null,
      error: "",
      approve,
      reject,
      refetch: refetchRequests,
    });

    render(<CustomerRequests />);

    await user.click(
      screen.getByRole("button", {
        name: /add tenant/i,
      }),
    );

    expect(
      screen.getByRole("dialog"),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /cancel/i,
      }),
    );

    expect(
      screen.queryByRole("dialog"),
    ).not.toBeInTheDocument();
  });

  it("should create a tenant from an approved inquiry", async () => {
    const user = userEvent.setup();

    useCustomerRequests.mockReturnValue({
      requests: [approvedRequest],
      loading: false,
      processingId: null,
      error: "",
      approve,
      reject,
      refetch: refetchRequests,
    });

    render(<CustomerRequests />);

    await user.click(
      screen.getByRole("button", {
        name: /add tenant/i,
      }),
    );

    await user.type(
      screen.getByLabelText(/username/i),
      "juan101",
    );

    await user.type(
      screen.getByLabelText(
        /default password/i,
      ),
      "Tenant123",
    );

    await user.click(
      screen.getByRole("button", {
        name: /create tenant/i,
      }),
    );

    await waitFor(() => {
      expect(
        registerTenant,
      ).toHaveBeenCalledTimes(1);
    });

    expect(
      registerTenant,
    ).toHaveBeenCalledWith({
      inquiryId,
      fullName: "Juan Dela Cruz",
      email: "juan@gmail.com",
      contact: "09123456789",
      roomId,
      username: "juan101",
      password: "Tenant123",
    });

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog"),
      ).not.toBeInTheDocument();
    });

    expect(
      refetchRequests,
    ).toHaveBeenCalledTimes(1);

    expect(
      refetchRooms,
    ).toHaveBeenCalledTimes(1);
  });

  it("should keep modal open and display tenant creation error", async () => {
    const user = userEvent.setup();

    registerTenant.mockRejectedValue(
      new Error(
        "A tenant already exists for this inquiry.",
      ),
    );

    useCustomerRequests.mockReturnValue({
      requests: [approvedRequest],
      loading: false,
      processingId: null,
      error: "",
      approve,
      reject,
      refetch: refetchRequests,
    });

    render(<CustomerRequests />);

    await user.click(
      screen.getByRole("button", {
        name: /add tenant/i,
      }),
    );

    await user.type(
      screen.getByLabelText(/username/i),
      "juan101",
    );

    await user.type(
      screen.getByLabelText(
        /default password/i,
      ),
      "Tenant123",
    );

    await user.click(
      screen.getByRole("button", {
        name: /create tenant/i,
      }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(
      "A tenant already exists for this inquiry.",
    );

    expect(
      screen.getByRole("dialog"),
    ).toBeInTheDocument();

    expect(
      refetchRequests,
    ).not.toHaveBeenCalled();

    expect(
      refetchRooms,
    ).not.toHaveBeenCalled();
  });

  it("should display generated tenant credentials", () => {
    useTenantCreation.mockReturnValue({
      registerTenant,
      credentials: {
        username: "juan101",
        email: "juan@gmail.com",
        password: "Tenant123",
      },
      billing: null,
      loading: false,
      error: "",
      clear: clearTenantCreation,
    });

    render(<CustomerRequests />);

    const credentialsHeading =
      screen.getByRole("heading", {
        name: /tenant account created/i,
      });

    const credentialsSection =
      credentialsHeading.closest("section");

    expect(credentialsSection).not.toBeNull();

    expect(
      credentialsSection,
    ).toHaveTextContent("juan101");

    expect(
      credentialsSection,
    ).toHaveTextContent(
      "juan@gmail.com",
    );

    expect(
      credentialsSection,
    ).toHaveTextContent("Tenant123");
  });

  it("should display initial billing details", () => {
    useTenantCreation.mockReturnValue({
      registerTenant,
      credentials: null,
      billing: {
        totalAmount: 5000,
        status: "Pending",
        dueDate: "2026-08-05",
      },
      loading: false,
      error: "",
      clear: clearTenantCreation,
    });

    render(<CustomerRequests />);

    const billingHeading =
      screen.getByRole("heading", {
        name: /initial billing created/i,
      });

    const billingSection =
      billingHeading.closest("section");

    expect(billingSection).not.toBeNull();

    expect(
      billingSection,
    ).toHaveTextContent("5,000");

    expect(
      billingSection,
    ).toHaveTextContent("Pending");

    expect(
      billingSection,
    ).toHaveTextContent("2026-08-05");
  });
});