// BUG-151: hackathon-edit loading container has aria-busy but no
// aria-label, unlike other loading states across the app.
import { test, expect } from '../../fixtures';

test.describe('Hackathon edit loading aria-label', () => {
  test('loading container has aria-label', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', async () => {
      await new Promise(resolve => setTimeout(resolve, 30000));
    });
    await page.goto('/hackathons/h1/edit');
    const loading = page.getByTestId('hackathon-edit-loading');
    await expect(loading).toBeVisible({ timeout: 5000 });
    const label = await loading.getAttribute('aria-label');
    expect(label).toBeTruthy();
    expect(label).toMatch(/loading/i);
  });
});
