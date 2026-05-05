// T96 — stage history must show display labels, not raw API values
import { test, expect } from '../../fixtures';

const PARTNER = {
  id: 'p-t96',
  name: 'FaithTech Toronto',
  city: 'Toronto',
  stage: 'Confirmed',
  contacts: [],
  notes: [],
  history: [
    { id: 'h1', fromStage: 'Lead', toStage: 'InFunnel', changedById: 'u1', changedAt: '2026-02-01T10:00:00Z' },
    { id: 'h2', fromStage: 'InFunnel', toStage: 'Confirmed', changedById: 'u1', changedAt: '2026-03-01T10:00:00Z' },
  ],
};

test.describe('Partner stage history labels', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/partners/p-t96', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER) })
    );
    await page.route('**/api/auth/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', roles: ['Admin'] }) })
    );
    await page.goto('/partners/p-t96');
    await expect(page.getByTestId('stage-history')).toBeVisible();
  });

  test('stage history shows "In funnel" not "InFunnel"', async ({ page }) => {
    const history = page.getByTestId('stage-history');
    await expect(history).not.toContainText('InFunnel');
    await expect(history).toContainText('In funnel');
  });
});
