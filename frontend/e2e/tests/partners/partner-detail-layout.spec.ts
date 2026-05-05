// T124 — partner detail should render two-column layout with styled cards
import { test, expect } from '../../fixtures';

const PARTNER = {
  id: 'p1', name: 'Riverside Church', city: 'Toronto', stage: 'Lead',
  notes: [], contacts: [], stageHistory: [],
};

test.describe('Partner detail layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/partners/p1**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER) });
    });
    await page.goto('/partners/p1');
  });

  test('shows partner name in hero card', async ({ page }) => {
    await expect(page.getByTestId('partner-detail')).toContainText('Riverside Church');
  });

  test('stage card is visible', async ({ page }) => {
    await expect(page.getByTestId('stage-card')).toBeVisible();
  });

  test('stage stepper is visible', async ({ page }) => {
    await expect(page.getByTestId('stage-stepper')).toBeVisible();
  });

  test('left and right columns sit side by side', async ({ page }) => {
    const left = page.locator('.partner-detail__left');
    const right = page.locator('.partner-detail__right');
    const leftBox = await left.boundingBox();
    const rightBox = await right.boundingBox();
    // right column should start after left column (same row)
    expect(Math.abs((leftBox?.y ?? 0) - (rightBox?.y ?? 0))).toBeLessThan(50);
    expect((rightBox?.x ?? 0)).toBeGreaterThan((leftBox?.x ?? 0));
  });
});
