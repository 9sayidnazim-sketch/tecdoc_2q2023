import { test, expect } from "@playwright/test";

test.describe("Octaspards Automotive Parts Portal E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");
    // Ensure initial load completes
    await expect(page.getByRole("link", { name: "Octaspards Home" })).toBeVisible();
  });

  test("1. Cascading dropdowns enable sequentially and find parts", async ({ page }) => {
    // Check initial disabled states
    const manufacturerBtn = page.locator("#select-manufacturer");
    const modelBtn = page.locator("#select-model");
    const typeBtn = page.locator("#select-type");
    const findPartsBtn = page.locator('button[type="submit"]:has-text("Find parts")');

    await expect(manufacturerBtn).toBeEnabled();
    await expect(modelBtn).toBeDisabled();
    await expect(typeBtn).toBeDisabled();
    await expect(findPartsBtn).toBeDisabled();

    // 1. Select Manufacturer -> Toyota
    await manufacturerBtn.click();
    await page.locator('li[role="option"]:has-text("Toyota")').click();

    // Model dropdown is now enabled
    await expect(modelBtn).toBeEnabled({ timeout: 5000 });

    // 2. Select Model -> Corolla (E210)
    await modelBtn.click();
    await page.locator('li[role="option"]:has-text("Corolla (E210)")').click();

    // Type dropdown is now enabled
    await expect(typeBtn).toBeEnabled({ timeout: 5000 });

    // 3. Select Type -> 1.8 Hybrid
    await typeBtn.click();
    await page.locator('li[role="option"]:has-text("1.8 Hybrid")').click();

    // Find parts button is now active and clickable
    await expect(findPartsBtn).toBeEnabled();
    await findPartsBtn.click();

    // Verify search results section displays filtered vehicle
    await expect(page.locator("text=Toyota Corolla (E210)")).toBeVisible({ timeout: 8000 });
    await expect(page.locator("text=found results")).toBeVisible();
  });

  test("2. Global number search and part details modal", async ({ page }) => {
    const searchInput = page.locator('input[aria-label="OE number, Part number, Cross reference"]');
    const searchBtn = page.locator('button[aria-label="Search parts catalog"]');

    // Search by Bosch part number
    await searchInput.fill("0 986 494 124");
    await searchBtn.click();

    // Wait for search result card to appear
    const partCard = page.locator('text=0 986 494 124').first();
    await expect(partCard).toBeVisible({ timeout: 8000 });

    // Click "View Details" to open part modal
    const viewDetailsBtn = page.locator('button:has-text("View Details")').first();
    await viewDetailsBtn.click();

    // Verify modal elements
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal.locator("text=Technical Specifications")).toBeVisible();
    await expect(modal.locator("text=OE Numbers")).toBeVisible();
    await expect(modal.locator("text=Compatible Vehicles")).toBeVisible();

    // Close modal
    const closeBtn = modal.locator('button:has-text("Close")');
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test("3. Exact search mode toggle", async ({ page }) => {
    const exactCheckbox = page.locator("#exact-search-checkbox");
    await expect(exactCheckbox).not.toBeChecked();

    // Toggle exact search
    await exactCheckbox.check();
    await expect(exactCheckbox).toBeChecked();

    const searchInput = page.locator('input[aria-label="OE number, Part number, Cross reference"]');
    const searchBtn = page.locator('button[aria-label="Search parts catalog"]');

    // Search by exact OE number
    await searchInput.fill("04465-02220");
    await searchBtn.click();

    // Verify results show OE match badge
    await expect(page.locator('text=OE Match: 04465-02220').first()).toBeVisible({ timeout: 8000 });
  });

  test("4. Recent search persistence across reloads", async ({ page }) => {
    // Find the recent searches section
    const recentSection = page.locator('section[aria-label="Recent search"]');
    await expect(recentSection).toBeVisible();

    // Click a brand chip from the initial top brands (e.g. BMW or Honda)
    const brandChip = recentSection.locator('button:has-text("Honda")').first();
    await expect(brandChip).toBeVisible();
    await brandChip.click();

    // Wait for search results to load for that manufacturer
    await expect(page.locator("text=found results")).toBeVisible({ timeout: 8000 });

    // Reload page and check that recent search cookies persist
    await page.reload();
    await expect(page.locator('section[aria-label="Recent search"]')).toBeVisible();
    await expect(recentSection.locator('button:has-text("Honda")').first()).toBeVisible();
  });

  test("5. English to Arabic RTL layout toggle", async ({ page }) => {
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "ltr");

    // Click language toggle button
    const langBtn = page.locator("#lang-toggle-btn");
    await langBtn.click();

    // Verify RTL orientation and Arabic text
    await expect(html).toHaveAttribute("dir", "rtl");
    await expect(page.locator("text=البحث عن قطع الغيار")).toBeVisible();
    await expect(page.getByRole("link", { name: "الرئيسية" })).toBeVisible();

    // Toggle back to English
    await langBtn.click();
    await expect(html).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { name: "Find Parts" })).toBeVisible();
  });
});
