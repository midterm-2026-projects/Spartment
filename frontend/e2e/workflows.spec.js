import { expect, test } from "@playwright/test";
import { mockApi } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test("guest browses a room and submits an inquiry", async ({ page }) => {
  await page.goto("/rooms");
  await page.getByRole("button", { name: "Inquire" }).click();
  await page.getByLabel("Full Name").fill("Grace Guest");
  await page.getByLabel("Email").fill("grace@example.com");
  await page.getByLabel("Contact").fill("09171234567");
  await page.getByLabel("Preferred Move-in Date").fill("2026-08-10");
  await page.getByLabel("Message").fill("I would like to reserve this room.");
  await page.getByRole("button", { name: "Submit Inquiry" }).click();

  await expect(page.getByRole("status")).toHaveText("Inquiry submitted successfully.");
});

test("admin approves a pending customer request", async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem("token", "e2e-admin-token"); localStorage.setItem("user", JSON.stringify({ name:"Demo Admin", role:"admin", authToken:"e2e-admin-token" })); });
  await page.goto("/customer-requests");
  const card = page.locator("article").filter({ hasText: "Pat Pending" });
  await card.getByRole("button", { name: "Approve" }).click();

  await expect(card.getByText("Approved")).toBeVisible();
  await expect(card.getByRole("button", { name: "Add Tenant" })).toBeEnabled();
});

test("admin creates a tenant from an approved request", async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem("token", "e2e-admin-token"); localStorage.setItem("user", JSON.stringify({ name:"Demo Admin", role:"admin", authToken:"e2e-admin-token" })); });
  await page.goto("/customer-requests");
  const card = page.locator("article").filter({ hasText: "Ada Approved" });
  await card.getByRole("button", { name: "Add Tenant" }).click();
  const dialog = page.getByRole("dialog", { name: "Add Tenant" });
  await dialog.getByLabel("Username").fill("ada.approved");
  await dialog.getByLabel("Default Password").fill("SecurePass123");
  await dialog.getByRole("button", { name: "Create Tenant" }).click();

  await expect(dialog).toHaveCount(0);
});

test("risk dashboard refreshes the high-risk tenant list", async ({ page }) => {
  let requests = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/api/risk/high-risk")) requests += 1;
  });
  await page.goto("/risk");
  await expect(page.getByText("Two overdue payments")).toBeVisible();
  const requestsBeforeRefresh = requests;
  await page.getByRole("button", { name: "Refresh" }).click();
  await expect.poll(() => requests).toBeGreaterThan(requestsBeforeRefresh);
});

test("customer service assistant opens the inquiry form", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open customer service" }).click();
  await expect(page.getByRole("dialog", { name: "Spartment Assistant" })).toBeVisible();
  await expect(page.getByText(/how can we help today/i)).toBeVisible();
  await page.getByRole("button", { name: "Inquiry" }).click();
  await expect(page.getByLabel("Full Name")).toBeVisible();
  await expect(page.getByLabel("Preferred Room")).toBeVisible();
  await expect(page.getByLabel("Preferred Room").getByRole("option", { name: "Room 101" })).toBeAttached();
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByRole("button", { name: "Maintenance" })).toBeVisible();
  await page.getByRole("button", { name: "Close customer service" }).click();
  await expect(page.getByRole("dialog", { name: "Spartment Assistant" })).toHaveCount(0);
});

test("authenticated admin rooms links never open the guest catalogue", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("token", "e2e-token");
    localStorage.setItem("user", JSON.stringify({ id: "admin-1", name: "Demo Admin", email: "admin@example.com", role: "admin" }));
  });
  await page.goto("/rooms");
  await expect(page.getByRole("heading", { name: "Rooms", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Find your next room." })).toHaveCount(0);
});

test("admin sign-in preserves its session when opening Rooms", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Email").fill("admin.demo@spartment.local");
  await page.getByLabel("Password", { exact: true }).fill("AdminDemo123!");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.getByRole("link", { name: "Rooms" }).click();
  await expect(page).toHaveURL(/\/admin\/rooms$/);
  await expect(page.getByRole("heading", { name: "Rooms", exact: true })).toBeVisible();
  await expect(page.evaluate(() => localStorage.getItem("token"))).resolves.toBe("e2e-admin-token");
});

test("admin lists tenants and creates one from an approved inquiry", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("token", "e2e-admin-token");
    localStorage.setItem("user", JSON.stringify({ id: "admin-1", name: "Demo Admin", email: "admin@example.com", role: "admin", authToken: "e2e-admin-token" }));
  });
  const createRequest = page.waitForRequest((request) => request.url().endsWith("/api/tenants") && request.method() === "POST");
  await page.goto("/admin/tenants");
  await expect(page.getByRole("heading", { name: "Tenants", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Add Tenant" }).click();
  const dialog = page.getByRole("dialog", { name: "Add tenant" });
  await dialog.getByLabel("Approved Inquiry").selectOption("inq-approved");
  await dialog.getByLabel("Default Password").fill("SecurePass123");
  await dialog.getByRole("button", { name: "Create Tenant" }).click();
  const request = await createRequest;
  expect(request.postDataJSON()).toMatchObject({ inquiryId: "inq-approved", roomId: "room-101", email: "ada@example.com" });
  await expect(dialog).toHaveCount(0);
});

test("admin billing loads database records and utility values", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("token", "e2e-admin-token");
    localStorage.setItem("user", JSON.stringify({ name:"Demo Admin", email:"admin@example.com", role:"admin", authToken:"e2e-admin-token" }));
  });
  await page.goto("/billing");
  await expect(page.getByText("Terry Tenant")).toBeVisible();
  await expect(page.getByText("₱6,500").first()).toBeVisible();
  await page.getByRole("button", { name:"Utility Billing" }).click();
  await expect(page.getByLabel("Electricity for Terry Tenant")).toHaveValue("850");
  await expect(page.getByLabel("Water for Terry Tenant")).toHaveValue("220");
});

test("admin analytics renders database-backed reports", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("token", "e2e-admin-token");
    localStorage.setItem("user", JSON.stringify({ name:"Demo Admin", email:"admin@example.com", role:"admin", authToken:"e2e-admin-token" }));
  });
  await page.goto("/analytics");
  await expect(page.getByRole("heading", { name:"Analytics & Reports" })).toBeVisible();
  await expect(page.getByText("₱52,000")).toBeVisible();
  await expect(page.getByText("50% of rooms currently occupied")).toBeVisible();
  await expect(page.getByText("Follow up on late payments")).toBeVisible();
});

test("admin room monitor does not redirect a cached admin profile", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("user", JSON.stringify({ name: "Demo Admin", role: "admin" })));
  await page.goto("/admin/rooms");
  await expect(page).toHaveURL(/\/admin\/rooms$/);
  await expect(page.getByRole("heading", { name: "Rooms", exact: true })).toBeVisible();
});
