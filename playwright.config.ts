import { defineConfig, devices } from "@playwright/test";

// Runs against the built static site (`pnpm build` first), like production.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://127.0.0.1:4322", trace: "on-first-retry" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "node scripts/serve-out.mjs 4322",
    url: "http://127.0.0.1:4322/fa/",
    reuseExistingServer: !process.env.CI,
  },
});
