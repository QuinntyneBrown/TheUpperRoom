// T144 — note edit and delete buttons must be visible (non-empty labels or icon buttons)
import { test, expect } from '../../fixtures';

const ME = { id: 'u1', displayName: 'Quinn', email: 'q@test.com', roles: ['CityLead'] };
const NOTE = { id: 'n1', body: 'Test note body', createdAt: '2026-04-01T10:00:00Z', authorId: 'u1' };
const CONTACT = { id: 'c1', firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', phone: '', city: 'Toronto', notes: [NOTE], deletedAt: null };

test.describe('Note edit/delete button visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ME) }));
    await page.route('**/api/contacts/c1', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CONTACT) }));
    await page.goto('/contacts/c1', { waitUntil: 'load' });
    await page.waitForSelector('[data-testid=note-edit-btn]', { timeout: 8000 });
  });

  test('note edit button is visible and has non-zero size', async ({ page }) => {
    const btn = page.locator('[data-testid=note-edit-btn]').first();
    await expect(btn).toBeVisible();
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('note delete button is visible and has non-zero size', async ({ page }) => {
    const btn = page.locator('[data-testid=note-delete-btn]').first();
    await expect(btn).toBeVisible();
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('note edit button has visible icon content', async ({ page }) => {
    const icon = page.locator('[data-testid=note-edit-btn] mat-icon').first();
    await expect(icon).toBeVisible();
  });

  test('note delete button has visible icon content', async ({ page }) => {
    const icon = page.locator('[data-testid=note-delete-btn] mat-icon').first();
    await expect(icon).toBeVisible();
  });
});
