import { expect, test } from "@playwright/test";
import { mockApi } from "./fixtures";

test.describe("Spartment sign-in screen", () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await page.goto("/");
  });

  test("shows the available ways to enter the application", async ({ page }) => {
    await expect(page.getByLabel("Spartment home")).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: /Everything your property needs/ }),
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "password");
    await expect(page.getByRole("button", { name: "Sign In" })).toBeEnabled();
    await expect(
      page.getByRole("button", { name: "Continue as guest" }),
    ).toBeEnabled();
  });

  test("accepts credentials and submits the sign-in action", async ({ page }) => {
    const email = page.getByLabel("Email");
    const password = page.getByLabel("Password", { exact: true });
    await email.fill("tenant@example.com");
    await password.fill("correct-horse-battery-staple");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL(/\/tenant$/);
    await expect(page.getByRole("heading", { name: /Hello, Terry/ })).toBeVisible();
  });

  test("allows a user to continue as a guest", async ({ page }) => {
    await page.getByRole("button", { name: "Continue as guest" }).click();
    await expect(page).toHaveURL(/\/rooms$/);
    await expect(page.getByRole("heading", { name: "Find your next room." })).toBeVisible();
  });
});
