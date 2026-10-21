import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("the root and the QR address open the Persian site", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/fa\/$/);
  await page.goto("/menu/");
  await expect(page).toHaveURL(/\/fa\/menu\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "منو" })).toBeVisible();
});

test("Persian is right-to-left, English left-to-right", async ({ page }) => {
  await page.goto("/fa/");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await page.goto("/en/");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});

test("the language switch keeps the page", async ({ page }) => {
  await page.goto("/fa/menu/");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/menu\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Menu" })).toBeVisible();
});

test("menu search filters items and shows an empty state", async ({ page }) => {
  await page.goto("/fa/menu/");
  const search = page.getByRole("searchbox", { name: "جست‌وجو در منو" });
  await search.fill("لاته");
  const names = page.locator("article h3");
  await expect(names.first()).toContainText("لاته");
  expect(await names.count()).toBeLessThan(12);
  await search.fill("zzzz");
  await expect(page.getByRole("status")).toHaveText("چیزی با جست‌وجوی شما پیدا نشد.");
});

test("prices: toman in Persian, dollars in English, no hookah", async ({ page }) => {
  await page.goto("/fa/menu/");
  await expect(page.locator("article").first()).toContainText("تومان");
  await expect(page.locator("main")).not.toContainText("قلیان");
  await page.goto("/en/menu/");
  await expect(page.locator("article").first()).toContainText("$");
});

test("a gallery photo opens in the lightbox", async ({ page }) => {
  await page.goto("/en/gallery/");
  await expect(page.locator("[data-lightbox=ready]")).toBeAttached();
  await page.locator("main ul a").first().click();
  const lightbox = page.locator(".pswp");
  await expect(lightbox).toBeVisible();
  // Full-size WebP, not the grid thumbnail (PhotoSwipe also preloads the neighbours).
  await expect(lightbox.locator("img.pswp__img").first()).toHaveAttribute(
    "src",
    /\/photos\/[a-z-]+-\d+\.webp$/,
  );
  await lightbox.getByTitle("Close").click();
  await expect(lightbox).toBeHidden();
});

test("route prefetches find their files", async ({ page }) => {
  const missing: string[] = [];
  page.on("response", (r) => r.status() === 404 && missing.push(r.url()));
  await page.goto("/en/");
  await page.waitForLoadState("networkidle");
  expect(missing).toEqual([]);
});

test("no horizontal scrolling on any page", async ({ page }) => {
  for (const path of ["/fa/", "/fa/menu/", "/fa/gallery/", "/fa/about/", "/fa/contact/", "/en/"]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

for (const path of ["/fa/", "/en/", "/fa/menu/", "/en/menu/", "/fa/contact/", "/fa/gallery/"]) {
  test(`no serious accessibility problems on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .exclude(".leaflet-container") // third-party map tiles
      .analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(serious.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}
