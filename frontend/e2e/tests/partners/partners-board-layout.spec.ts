// T123 — partners board columns should render side by side
import { test, expect } from '../../fixtures';

const PARTNERS = [
  { id: 'p1', name: 'Riverside Church', city: 'Toronto', stage: 'Lead', contactCount: 1 },
  { id: 'p2', name: 'Mountain Top', city: 'Vancouver', stage: 'InFunnel', contactCount: 0 },
];

test.describe('Partners board layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/partners**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTNERS) });
    });
    await page.goto('/partners/board');
  });

  test('shows all three stage columns', async ({ page }) => {
    await expect(page.getByTestId('column-Lead')).toBeVisible();
    await expect(page.getByTestId('column-InFunnel')).toBeVisible();
    await expect(page.getByTestId('column-Confirmed')).toBeVisible();
  });

  test('Lead column contains Riverside Church card', async ({ page }) => {
    const col = page.getByTestId('column-Lead');
    await expect(col.getByTestId('partner-card-p1')).toBeVisible();
  });

  test('columns are arranged horizontally (not stacked)', async ({ page }) => {
    const lead = page.getByTestId('column-Lead');
    const funnel = page.getByTestId('column-InFunnel');
    const leadBox = await lead.boundingBox();
    const funnelBox = await funnel.boundingBox();
    // columns should be at roughly the same vertical position
    expect(Math.abs((leadBox?.y ?? 0) - (funnelBox?.y ?? 0))).toBeLessThan(50);
  });

  test('CTA button says "New partner"', async ({ page }) => {
    await expect(page.getByTestId('create-partner-button')).toContainText('New partner');
  });
});
