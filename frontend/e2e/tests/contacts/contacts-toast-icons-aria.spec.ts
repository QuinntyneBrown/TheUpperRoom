// BUG-081: contacts-list toast icons inside role="alert" / role="status"
// containers lack aria-hidden="true". Mirrors BUG-080 (team-page).
import { test, expect } from '../../fixtures';

test.describe('Contacts-list toast icons are aria-hidden', () => {
  test('contacts-load-error icon has aria-hidden="true"', async ({ page }) => {
    await page.route('**/api/contacts*', (r) => r.fulfill({
      status: 502, body: 'Bad Gateway',
    }));
    await page.goto('/contacts');
    await expect(page.getByTestId('contacts-load-error')).toBeVisible({ timeout: 10000 });

    const icon = page.locator('[data-testid="contacts-load-error"] mat-icon');
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
