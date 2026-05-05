// T128 — contact detail body layout and summary card CSS
import { test, expect } from '../../fixtures';

const CONTACT = {
  id: 'c1', firstName: 'Alice', lastName: 'Smith',
  email: 'alice@example.com', phone: '+1 416 555 1234', city: 'Toronto',
  notes: [], createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-03-20T14:30:00Z',
};

test.describe('Contact detail body layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/contacts/c1**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CONTACT) });
    });
    await page.goto('/contacts/c1');
  });

  test('summary and notes panel are side by side', async ({ page }) => {
    const summary = page.locator('.contact-detail__summary');
    const notes = page.locator('ur-notes-panel');
    const summaryBox = await summary.boundingBox();
    const notesBox = await notes.boundingBox();
    // notes panel should start to the right of the summary
    expect(notesBox!.x).toBeGreaterThan(summaryBox!.x);
    expect(Math.abs((summaryBox!.y ?? 0) - (notesBox!.y ?? 0))).toBeLessThan(50);
  });

  test('summary card has sufficient width for left column', async ({ page }) => {
    const summary = page.locator('.contact-detail__summary');
    const box = await summary.boundingBox();
    expect(box!.width).toBeGreaterThan(200);
    expect(box!.width).toBeLessThan(500);
  });

  test('meta row has email icon and text on same line', async ({ page }) => {
    const emailRow = page.getByTestId('contact-meta-email');
    const box = await emailRow.boundingBox();
    expect(box!.height).toBeLessThan(40);
  });

  test('meta rows are visible', async ({ page }) => {
    await expect(page.getByTestId('contact-meta-email')).toBeVisible();
    await expect(page.getByTestId('contact-meta-phone')).toBeVisible();
    await expect(page.getByTestId('contact-meta-city')).toBeVisible();
  });
});
