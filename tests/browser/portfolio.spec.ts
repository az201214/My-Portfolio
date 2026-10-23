import { test, expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function ready(page: Page) {
  await page.goto("./");
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.locator(".loading-screen")).toHaveCount(0, {
    timeout: 12000,
  });
}




test("resume and home links remain under the GitHub Pages project base", async ({
  page,
  request,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  const resume = page.locator('a[href$="Ali_Zain_Resume.pdf"]').first();
  await expect(resume).toHaveAttribute(
    "href",
    "/My-Portfolio/Ali_Zain_Resume.pdf",
  );
  const response = await request.get((await resume.getAttribute("href"))!);
  expect(response.status()).toBe(200);
  expect((await response.body()).subarray(0, 4).toString()).toBe("%PDF");
  await expect(page.locator(".navbar-title")).toHaveAttribute(
    "href",
    "/My-Portfolio/#",
  );
});

test("project carousel announces selection and makes inactive slides inert", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect(page.locator(".carousel-status")).toContainText(
    "NexusInsight CRM",
  );
  await expect(page.locator('.carousel-slide[aria-hidden="true"]')).toHaveCount(
    3,
  );
  expect(
    await page
      .locator('.carousel-slide[aria-hidden="true"]')
      .evaluateAll((nodes) =>
        nodes.every((node) => (node as HTMLElement).inert),
      ),
  ).toBe(true);
  await page.getByRole("button", { name: "Next project" }).click();
  await expect(page.locator(".carousel-status")).toContainText("Rally");
  await page.waitForTimeout(550);
  await page.getByRole("button", { name: "Next project" }).click();
  await expect(page.locator(".carousel-status")).toContainText("FormBridge");
  const activeCard = page.locator('.carousel-slide[aria-hidden="false"]');
  await expect(activeCard).toContainText("FormBridge");
  await expect(
    activeCard.getByRole("link", { name: "View FormBridge live demo" }),
  ).toHaveAttribute("href", "https://formbridge-october.vercel.app/");
  const image = activeCard.locator('img[alt="FormBridge"]');
  await expect(image).toHaveAttribute("src", /images\/formbridge\.webp$/);
  await expect
    .poll(async () =>
      image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(activeCard.locator('a[href*="github.com"]')).toHaveCount(0);
});

test("skip link works with keyboard and all visible links have accessible names", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  const scan = await new AxeBuilder({ page })
    .withRules([
      "link-name",
      "button-name",
      "aria-hidden-focus",
      "landmark-one-main",
      "landmark-no-duplicate-main",
    ])
    .analyze();
  expect(scan.violations).toEqual([]);
});

test("reduced-motion page passes WCAG A/AA automated checks", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
});

