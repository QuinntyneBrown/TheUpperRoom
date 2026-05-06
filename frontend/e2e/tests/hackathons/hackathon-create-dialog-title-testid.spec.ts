// BUG-276: hackathon-create dialog should expose titleTestId.
import { test, expect } from '../../fixtures';

test.describe('Hackathon create dialog title testid', () => {
  test('hackathon-create-dialog-title is present', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/hackathons/new');
    await expect(page.getByTestId('hackathon-create-dialog-title')).toContainText(/plan hackathon/i, { timeout: 10000 });
  });
});
