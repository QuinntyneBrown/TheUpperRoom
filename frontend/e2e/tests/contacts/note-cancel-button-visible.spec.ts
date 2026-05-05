// T145 — notes panel Cancel buttons must be visible when in edit/delete state
import { test, expect } from '../../fixtures';

const ME = { id: 'u1', displayName: 'Quinn', email: 'q@test.com', roles: ['CityLead'] };
const NOTE = { id: 'n1', body: 'Test note body', createdAt: '2026-04-01T10:00:00Z', authorId: 'u1' };
const CONTACT = { id: 'c1', firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', phone: '', city: 'Toronto', notes: [NOTE], deletedAt: null };

test.describe('Note cancel button visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ME) }));
    await page.route('**/api/contacts/c1', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CONTACT) }));
    await page.goto('/contacts/c1', { waitUntil: 'load' });
    await page.waitForSelector('[data-testid=note-edit-btn]', { timeout: 8000 });
  });

  test('cancel button in edit state is visible with text', async ({ page }) => {
    await page.click('[data-testid=note-edit-btn]');
    const cancel = page.locator('[data-testid=note-cancel-edit-btn]');
    await expect(cancel).toBeVisible();
    const text = await cancel.textContent();
    expect(text?.trim()).toBe('Cancel');
  });

  test('cancel button in delete state is visible with text', async ({ page }) => {
    await page.click('[data-testid=note-delete-btn]');
    const cancel = page.locator('[data-testid=note-cancel-delete-btn]');
    await expect(cancel).toBeVisible();
    const text = await cancel.textContent();
    expect(text?.trim()).toBe('Cancel');
  });
});
