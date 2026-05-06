// BUG-064: hackathon-edit form actions are Save then Cancel; the
// symmetrical contact-form and partner-edit both render Cancel first,
// Save second. Normalize for cross-feature consistency.
import { test, expect } from '../../fixtures';

const HACKATHON = {
  id: 'h1', title: 'Spring Hackathon 2026', hostCity: 'Toronto',
  startDate: '2026-05-18', endDate: '2026-05-21', currentStage: 'Discover',
  partners: [], history: [], products: [],
};

test.describe('Hackathon-edit form action order', () => {
  test('Cancel button precedes Save changes button', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(HACKATHON),
    }));
    await page.goto('/hackathons/h1/edit');
    await expect(page.getByTestId('hackathon-edit-save-btn')).toBeVisible({ timeout: 10000 });

    const buttons = await page.locator('.hackathon-edit-page .form-actions ur-button').allInnerTexts();
    expect(buttons[0].trim()).toBe('Cancel');
    expect(buttons[1]).toContain('Save changes');
  });
});
