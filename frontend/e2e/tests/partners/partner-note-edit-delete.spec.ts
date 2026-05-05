// T168: notes panel edit/delete must use partner service, not contact service, when targetType=Partner
import { test, expect } from '../../fixtures';

const PARTNER = {
  id: 'p1', teamId: 't1', name: 'FaithTech Toronto', city: 'Toronto',
  stage: 'InFunnel', version: 2,
  history: [], contacts: [],
  notes: [{ id: 'n1', body: 'Partner meeting went well.', authorId: 'u1', createdAt: '2025-04-01T10:00:00Z' }],
};

test.describe('Partner note edit and delete use partner service', () => {
  test('edit note calls PATCH /api/notes/:id, not contact endpoint', async ({ page }) => {
    const requests: string[] = [];

    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/partners/p1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER) });
    });
    await page.route('**/api/notes/n1', (route) => {
      requests.push(route.request().method() + ' ' + route.request().url());
      route.fulfill({ status: 204 });
    });

    await page.goto('/partners/p1');
    await expect(page.getByTestId('note-n1')).toBeVisible({ timeout: 5000 });

    await page.getByTestId('note-edit-btn').click();
    await page.getByLabel('Edit note').fill('Updated note text');
    await page.getByTestId('note-save-btn').click();

    await expect(page.getByTestId('note-n1')).toContainText('Updated note text');
    expect(requests.some((r) => r.startsWith('PATCH'))).toBe(true);
    expect(requests.some((r) => r.includes('/contacts/'))).toBe(false);
  });

  test('delete note calls DELETE /api/notes/:id, not contact endpoint', async ({ page }) => {
    const requests: string[] = [];

    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/partners/p1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER) });
    });
    await page.route('**/api/notes/n1', (route) => {
      requests.push(route.request().method() + ' ' + route.request().url());
      route.fulfill({ status: 204 });
    });

    await page.goto('/partners/p1');
    await expect(page.getByTestId('note-n1')).toBeVisible({ timeout: 5000 });

    await page.getByTestId('note-delete-btn').click();
    await page.getByTestId('note-confirm-delete-btn').click();

    await expect(page.getByTestId('note-n1')).not.toBeVisible();
    expect(requests.some((r) => r.startsWith('DELETE'))).toBe(true);
    expect(requests.some((r) => r.includes('/contacts/'))).toBe(false);
  });
});
