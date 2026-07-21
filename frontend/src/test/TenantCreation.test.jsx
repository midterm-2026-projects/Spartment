import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@testing-library/react";

import TenantCreation from "../pages/TenantCreation";
import useTenantCreation from "../hooks/useTenantCreation";
import useRooms from "../hooks/useRooms";

vi.mock("../hooks/useTenantCreation", () => ({
  default: vi.fn(),
}));

vi.mock("../hooks/useRooms", () => ({
  default: vi.fn(),
}));

vi.mock("../components/AddTenantModal", () => ({
  default: ({ open, loading, error }) =>
    open ? (
      <div role="dialog">
        <p>Add Tenant Modal</p>

        {loading && <p>Loading...</p>}

        {error && <p role="alert">{error}</p>}
      </div>
    ) : null,
}));

const approvedInquiry = {
  id: "inquiry-001",
  name: "Juan Dela Cruz",
  email: "juan101@email.com",
  contact: "09123456789",
  roomId: "room-001",
  status: "Approved",
};

const defaultRoomsHook = {
  rooms: [
    {
      id: "room-001",
      roomNumber: "Room 101",
      status: "Available",
      monthlyRent: 5200,
    },
  ],
  availableRooms: [],
  loading: false,
  error: "",
  refetch: vi.fn(),
};

const defaultTenantHook = {
  registerTenant: vi.fn(),
  tenant: null,
  billing: null,
  credentials: null,
  loading: false,
  error: "",
  clear: vi.fn(),
};

describe("Tenant Creation Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useRooms.mockReturnValue(defaultRoomsHook);

    useTenantCreation.mockReturnValue(defaultTenantHook);
  });

  it("displays tenant credentials and generated billing", () => {
    useTenantCreation.mockReturnValue({
      ...defaultTenantHook,

      tenant: {
        id: "tenant-001",
        fullName: "Juan Dela Cruz",
        email: "juan101@email.com",
        status: "Active",
      },

      credentials: {
        username: "juan101",
        email: "juan101@email.com",
        password: "Tenant123",
      },

      billing: {
        id: "billing-001",
        totalAmount: 5200,
        status: "Pending",
        dueDate: "2026-08-05",
      },
    });

    render(<TenantCreation inquiry={approvedInquiry} />);

    expect(screen.getByText("Juan Dela Cruz")).toBeInTheDocument();

    expect(screen.getAllByText("juan101@email.com").length).toBeGreaterThan(0);

    expect(screen.getByText("juan101")).toBeInTheDocument();

    expect(screen.getByText("Tenant123")).toBeInTheDocument();

    expect(screen.getByText(/5,200/)).toBeInTheDocument();

    expect(screen.getByText("Pending")).toBeInTheDocument();

    expect(screen.getByText("2026-08-05")).toBeInTheDocument();
  });

  it("displays tenant creation loading state", () => {
    useTenantCreation.mockReturnValue({
      ...defaultTenantHook,
      loading: true,
    });

    render(<TenantCreation inquiry={approvedInquiry} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays tenant creation error", () => {
    useTenantCreation.mockReturnValue({
      ...defaultTenantHook,
      error: "Failed to create tenant.",
    });

    render(<TenantCreation inquiry={approvedInquiry} />);

    expect(
      screen.getAllByText("Failed to create tenant.").length,
    ).toBeGreaterThan(0);
  });

  it("shows an empty state without an approved inquiry", () => {
    render(<TenantCreation />);

    expect(
      screen.getByText(/must be created from an approved inquiry/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/no records found/i)).toBeInTheDocument();
  });
});
