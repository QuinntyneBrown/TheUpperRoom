// Traces to: Page titles — browser tab shows meaningful names per route
// T47: router title property updates document.title on navigation
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Page titles update on navigation', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('sign-in page has descriptive title', async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(page).toHaveTitle(/Sign in/i);
  });

  test('hackathons list page has descriptive title', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/hackathons');
    await expect(page).toHaveTitle(/Hackathons/i);
  });

  test('partners list page has descriptive title', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/partners');
    await expect(page).toHaveTitle(/Partners/i);
  });

  test('contacts list page has descriptive title', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/contacts');
    await expect(page).toHaveTitle(/Contacts/i);
  });

  test('dashboard page has descriptive title', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/dashboard');
    await expect(page).toHaveTitle(/Dashboard/i);
  });
});
