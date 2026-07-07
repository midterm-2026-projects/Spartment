import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TenantHeader from "../components/TenantHeader";

describe("TenantHeader", () => {
  const tenant = {
    name: "Juan Dela Cruz",
    contact: "09123456789",
    email: "juan@email.com",
  };

  it("should render the Tenant Header and Sub-Header correctly", () => {
    // Arrange
    render(<TenantHeader tenant={tenant} />);

    // Act
    const heading = screen.getByRole("heading", {
      name: /tenant portal/i,
    });

    const subHeading = screen.getByText(
      /welcome to your tenant dashboard/i
    );

    // Assert
    expect(heading).toBeInTheDocument();
    expect(subHeading).toBeInTheDocument();
  });

  it("should display tenant information correctly", () => {
    // Arrange
    render(<TenantHeader tenant={tenant} />);

    // Assert
    expect(screen.getByText(tenant.name)).toBeInTheDocument();
    expect(screen.getByText(tenant.contact)).toBeInTheDocument();
    expect(screen.getByText(tenant.email)).toBeInTheDocument();
  });

  it.each([
    ["Juan Dela Cruz"],
    ["Maria Santos"],
    ["Pedro Cruz"],
  ])("should display tenant name %s", (name) => {
    // Arrange
    render(
      <TenantHeader
        tenant={{
          name,
          contact: "09111111111",
          email: "sample@email.com",
        }}
      />
    );

    // Assert
    expect(screen.getByText(name)).toBeInTheDocument();
  });
});