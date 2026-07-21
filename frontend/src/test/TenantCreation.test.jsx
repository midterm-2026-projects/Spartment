import { render, screen } from "@testing-library/react";

import { describe, it, expect, vi } from "vitest";

import TenantCreation from "../pages/TenantCreation";

import useTenantCreation from "../hooks/useTenantCreation";

vi.mock("../hooks/useTenantCreation", () => ({
  default: vi.fn(),
}));

describe("Tenant Creation Page", () => {
  it("should display tenant credentials and generated billing after creation", () => {
    useTenantCreation.mockReturnValue({
      registerTenant: vi.fn(),

      tenant: {
        email: "juan101@email.com",

        password: "Tenant123",
      },

      billing: {
        totalAmount: 5200,

        status: "Pending",
      },

      loading: false,

      error: null,
    });

    render(<TenantCreation />);

    expect(screen.getByText("Tenant Creation")).toBeInTheDocument();

    expect(screen.getByText("juan101@email.com")).toBeInTheDocument();

    expect(screen.getByText("Tenant123")).toBeInTheDocument();

    expect(screen.getByText(/5200/)).toBeInTheDocument();

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("should display loading state", () => {
    useTenantCreation.mockReturnValue({
      registerTenant: vi.fn(),

      tenant: null,

      billing: null,

      loading: true,

      error: null,
    });

    render(<TenantCreation />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should display error message", () => {
    useTenantCreation.mockReturnValue({
      registerTenant: vi.fn(),

      tenant: null,

      billing: null,

      loading: false,

      error: "Failed to create tenant.",
    });

    render(<TenantCreation />);

    expect(screen.getByText("Failed to create tenant.")).toBeInTheDocument();
  });
});
