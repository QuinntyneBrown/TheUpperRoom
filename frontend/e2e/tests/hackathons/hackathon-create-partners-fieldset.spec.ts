// BUG-157: hackathon-create Partners checkbox group is labelled by
// a span; use fieldset/legend. Mirrors BUG-156.
import { test, expect } from '../../fixtures';

test.describe('Hackathon-create partners fieldset', () => {
  test('Partners checkboxes are inside a fieldset with a legend', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([{ id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead' }]),
    }));
    await page.goto('/hackathons');
    await expect(page.getByTestId('new-hackathon-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('new-hackathon-btn').click();
    await expect(page.getByTestId('hackathon-create-form')).toBeVisible();

    const dialog = page.getByTestId('hackathon-create-form');
    const fieldset = dialog.locator('fieldset', { hasText: /Partners/i });
    await expect(fieldset).toBeVisible();
    const legend = fieldset.locator('legend');
    await expect(legend).toContainText(/Partners/i);
  });
});
