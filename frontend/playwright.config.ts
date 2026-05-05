import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'xs-mobile',  use: { viewport: { width: 375,  height: 667  } } },
    { name: 'md-tablet',  use: { viewport: { width: 768,  height: 1024 } } },
    { name: 'lg-desktop', use: { viewport: { width: 1280, height: 800  } } },
  ],
  webServer: {
    command: 'npx ng serve --project app-shell',
    url: 'http://localhost:4200',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
