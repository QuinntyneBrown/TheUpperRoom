// BUG-080: team-page error icons inside role="alert" containers
// lack aria-hidden="true". The mat-icon's text ("error_outline") is
// announced by screen readers before the actual message.
import { test, expect } from '../../fixtures';

test.describe('Team-page error icons are aria-hidden', () => {
  test('team-load-error icon has aria-hidden="true"', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    await page.route('**/api/teams/local', (r) => r.fulfill({
      status: 502, body: 'Bad Gateway',
    }));
    await page.goto('/team');
    await expect(page.getByTestId('team-load-error')).toBeVisible({ timeout: 10000 });

    const icon = page.locator('[data-testid="team-load-error"] mat-icon');
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
