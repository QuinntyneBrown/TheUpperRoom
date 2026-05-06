// BUG-031: design frame M1XBkr shows the partners header subtitle with
// stage breakdown ("{total} organizations · {leads} leads · {confirmed}
// confirmed"). Current implementation shows only "{n} partners".
import { test, expect } from '../../fixtures';

test.describe('Partners list count subtitle stage breakdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['city-lead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 'p1', name: 'A', city: 'Toronto', stage: 'Lead' },
        { id: 'p2', name: 'B', city: 'Toronto', stage: 'Lead' },
        { id: 'p3', name: 'C', city: 'Vancouver', stage: 'Confirmed' },
        { id: 'p4', name: 'D', city: 'Calgary', stage: 'InFunnel' },
      ]),
    }));
    await page.goto('/partners');
    await expect(page.getByTestId('new-partner-btn')).toBeVisible({ timeout: 10000 });
  });

  test('subtitle reads "4 organizations · 2 leads · 1 confirmed"', async ({ page }) => {
    await expect(page.getByTestId('partners-count-subtitle')).toHaveText(
      '4 organizations · 2 leads · 1 confirmed'
    );
  });
});
