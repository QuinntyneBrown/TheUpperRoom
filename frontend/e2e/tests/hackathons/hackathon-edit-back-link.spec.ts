// BUG-198: hackathon-edit page lacks a back link to the hackathon
// detail. Mirrors BUG-177 contact-edit-back-link.
import { test, expect } from '../../fixtures';

test.describe('Hackathon-edit back link', () => {
  test('renders back link to /hackathons/:id', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring Hack', startsOn: '2026-05-01', endsOn: '2026-05-03',
        hostCity: 'Toronto', version: 1,
      }),
    }));
    await page.goto('/hackathons/h1/edit');
    const back = page.getByTestId('hackathon-edit-back-link');
    await expect(back).toBeVisible({ timeout: 10000 });
    await expect(back).toHaveAttribute('href', /\/hackathons\/h1$/);
  });
});
