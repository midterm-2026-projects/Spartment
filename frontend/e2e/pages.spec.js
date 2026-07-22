import { expect, test } from "@playwright/test";
import { mockApi } from "./fixtures";

async function signInAsAdmin(page) {
  await page.addInitScript(() => {
    localStorage.setItem("token", "e2e-admin-token");
    localStorage.setItem("user", JSON.stringify({
      id: "admin-1",
      name: "Demo Admin",
      role: "admin",
      authToken: "e2e-admin-token",
    }));
  });
}

async function signInAsTenant(page) {
  await page.addInitScript(() => {
    localStorage.setItem("token", "e2e-tenant-token");
    localStorage.setItem("tenantId", "tenant-1");
    localStorage.setItem("user", JSON.stringify({
      id: "user-1",
      name: "Terry Tenant",
      role: "tenant",
      tenantId: "tenant-1",
      authToken: "e2e-tenant-token",
    }));
  });
}

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

const pages = [
  ["/analytics", "Analytics & Reports", 1],
  ["/billing", "Rent payment history", 2],
  ["/customer-requests", "Customer Requests", 1],
  ["/financial", "Financial Dashboard", 1],
  ["/rooms", "Find your next room.", 1],
  ["/revenue", "Revenue Dashboard", 1],
  ["/risk", "Tenant Risk Monitoring", 1],
  ["/tenant-creation", "Tenants", 1],
];

for (const [path, heading, level] of pages) {
  test(`${heading} page loads`, async ({ page }) => {
    if (path === "/analytics" || path === "/billing" || path === "/customer-requests" || path === "/tenant-creation") {
      await signInAsAdmin(page);
    }
    await page.goto(path);
    await expect(page.getByRole("heading", { level, name: heading })).toBeVisible();
  });
}

test("tenant dashboard loads tenant, billing, payment, and risk data", async ({ page }) => {
  await signInAsTenant(page);
  await page.goto("/tenant");

  await expect(page.getByRole("heading", { level: 1, name: /Hello, Terry/ })).toBeVisible();
  await expect(page.getByText("Terry Tenant")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Payment History" })).toBeVisible();
});

test("tenant dashboard renders when billing and payments do not exist yet", async ({ page }) => {
  await page.route("**/api/tenants/tenant-without-billing", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: {
          id: "tenant-without-billing",
          full_name: "Demo Tenant",
          room: { room_number: "101", monthly_rent: 6500 },
          billing: null,
          payments: null,
        },
      }),
    }),
  );
  await signInAsTenant(page);
  await page.addInitScript(() => localStorage.setItem("tenantId", "tenant-without-billing"));
  await page.goto("/tenant");
  await expect(page.getByRole("heading", { name: /Hello, Demo/ })).toBeVisible();
  await expect(page.getByText("No payment history found.")).toBeVisible();
});

for (const [path, heading] of [["/tenant/billing", "My Billing"], ["/tenant/settings", "Settings"]]) {
  test(`${heading} tenant page loads`, async ({ page }) => {
    await signInAsTenant(page);
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  });
}

for (const [path, buttonName] of [["/admin/notifications", "Admin Notifications"], ["/tenant/notifications", "Tenant Notifications"]]) {
  test(`${buttonName} page marks a notification as read`, async ({ page }) => {
    if (path.startsWith("/admin")) await signInAsAdmin(page);
    else await signInAsTenant(page);
    await page.goto(path);
    await page.getByRole("button", { name: buttonName }).click();
    await expect(page.getByText("Rent is due soon")).toBeVisible();
    await page.getByRole("button", { name: "Mark as Read" }).click();
    await expect(page.getByRole("button", { name: "Mark as Read" })).toHaveCount(0);
  });
}

test("unknown routes show a useful not-found page", async ({ page }) => {
  await page.goto("/does-not-exist");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Return to sign in" })).toHaveAttribute("href", "/");
});
