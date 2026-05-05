// Traces to: 01 - project skeleton
// Description: SPA boots and reads /api/health
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test('shows healthy status', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await expect(home.healthStatus()).toHaveText('OK');
});
