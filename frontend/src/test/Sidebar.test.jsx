import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Sidebar from "../components/Sidebar";

describe("Sidebar Component", () => {
  it("renders Manage heading", () => {
    render(<Sidebar />);
    expect(screen.getByText("Manage")).toBeInTheDocument();
  });

  it("renders Dashboard button", () => {
    render(<Sidebar />);
    expect(
      screen.getByRole("button", { name: "Dashboard" })
    ).toBeInTheDocument();
  });

  it("renders Rooms button", () => {
    render(<Sidebar />);
    expect(
      screen.getByRole("button", { name: "Rooms" })
    ).toBeInTheDocument();
  });

  it("renders Tenants button", () => {
    render(<Sidebar />);
    expect(
      screen.getByRole("button", { name: "Tenants" })
    ).toBeInTheDocument();
  });

  it("renders Billing button", () => {
    render(<Sidebar />);
    expect(
      screen.getByRole("button", { name: "Billing" })
    ).toBeInTheDocument();
  });

  it("renders Customer Requests button", () => {
    render(<Sidebar />);
    expect(
      screen.getByRole("button", { name: "Customer Requests" })
    ).toBeInTheDocument();
  });

  it("renders Analytics & Reports button", () => {
    render(<Sidebar />);
    expect(
      screen.getByRole("button", { name: "Analytics & Reports" })
    ).toBeInTheDocument();
  });

  it("renders exactly six sidebar buttons", () => {
    render(<Sidebar />);
    expect(screen.getAllByRole("button")).toHaveLength(6);
  });
});