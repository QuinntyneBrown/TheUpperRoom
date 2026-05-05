// T148 — Stage advance button must open confirmation dialog, not call API directly
import { test, expect } from '../../fixtures';

const ME = { id: 'u1', displayName: 'Quinn', email: 'q@test.com', roles: ['CityLead'] };
const PARTNER = {
  id: 'p-t148', name: 'LifeChurch Toronto', city: 'Toronto',
  website: '', stage: 'Lead', description: '', version: 1,
  notes: [], contacts: [],
  history: [{ id: 'h1', fromStage: null, toStage: 'Lead', changedById: 'u1', changedAt: '2026-01-15T10:00:00Z' }],
};

test.describe('Partner stage change dialog', () => {
  test('clicking advance button opens dialog instead of calling API', async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ME) }));
    await page.route('**/api/partners/p-t148', r => {
      if (r.request().method() === 'GET') {
        r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER) });
      } else {
        r.fulfill({ status: 400, body: 'should not be called' });
      }
    });
    let stageApiCalled = false;
    await page.route('**/api/partners/p-t148/stage', r => { stageApiCalled = true; r.fulfill({ status: 400, body: 'unexpected' }); });

    await page.goto('/partners/p-t148');
    await page.waitForSelector('[data-testid=stage-advance-btn]', { timeout: 8000 });

    await page.getByTestId('stage-advance-btn').click();

    // Dialog must appear
    await expect(page.getByTestId('stage-change-dialog')).toBeVisible({ timeout: 3000 });

    // API must NOT have been called yet
    expect(stageApiCalled).toBe(false);
  });

  test('stage change dialog has reason field', async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ME) }));
    await page.route('**/api/partners/p-t148', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER) }));
    await page.route('**/api/partners/p-t148/stage', r => r.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));

    await page.goto('/partners/p-t148');
    await page.waitForSelector('[data-testid=stage-advance-btn]', { timeout: 8000 });
    await page.getByTestId('stage-advance-btn').click();

    await expect(page.getByTestId('stage-change-dialog')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('stage-change-reason')).toBeVisible();
  });

  test('cancel button closes dialog without calling stage API', async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ME) }));
    await page.route('**/api/partners/p-t148', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER) }));
    let stageApiCalled = false;
    await page.route('**/api/partners/p-t148/stage', r => { stageApiCalled = true; r.fulfill({ status: 200, body: '{}' }); });

    await page.goto('/partners/p-t148');
    await page.waitForSelector('[data-testid=stage-advance-btn]', { timeout: 8000 });
    await page.getByTestId('stage-advance-btn').click();
    await expect(page.getByTestId('stage-change-dialog')).toBeVisible({ timeout: 3000 });

    await page.getByTestId('stage-change-cancel-btn').click();

    await expect(page.getByTestId('stage-change-dialog')).not.toBeVisible();
    expect(stageApiCalled).toBe(false);
  });

  test('confirm button calls stage API and shows success toast', async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ME) }));
    await page.route('**/api/partners/p-t148', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER) }));
    let stageApiCalled = false;
    await page.route('**/api/partners/p-t148/stage', r => {
      stageApiCalled = true;
      r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ...PARTNER, stage: 'InFunnel' }) });
    });

    await page.goto('/partners/p-t148');
    await page.waitForSelector('[data-testid=stage-advance-btn]', { timeout: 8000 });
    await page.getByTestId('stage-advance-btn').click();
    await expect(page.getByTestId('stage-change-dialog')).toBeVisible({ timeout: 3000 });

    await page.getByTestId('stage-change-confirm-btn').click();

    expect(stageApiCalled).toBe(true);
    await expect(page.getByTestId('stage-success-toast')).toBeVisible({ timeout: 5000 });
  });
});
