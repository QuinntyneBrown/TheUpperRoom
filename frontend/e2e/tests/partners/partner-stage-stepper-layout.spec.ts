// T166: partner stage stepper should render as a horizontal row, not a vertical stack
import { test, expect } from '../../fixtures';

const PARTNER = {
  id: 'p1', teamId: 't1', name: 'FaithTech Toronto', city: 'Toronto',
  stage: 'InFunnel', version: 2,
  history: [{ id: 'h1', fromStage: 'Lead', toStage: 'InFunnel', changedBy: 'Quinn', changedAt: '2025-04-02T10:00:00Z' }],
  contacts: [], notes: [],
};

test.describe('Partner stage stepper layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/partners/p1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER) });
    });
    await page.goto('/partners/p1');
    await expect(page.getByTestId('stage-stepper')).toBeVisible({ timeout: 5000 });
  });

  test('stage stepper is a horizontal flex row', async ({ page }) => {
    const stepper = page.getByTestId('stage-stepper');
    const flexDir = await stepper.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('row');
  });

  test('stage stepper has a container background', async ({ page }) => {
    const stepper = page.getByTestId('stage-stepper');
    const bg = await stepper.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(bg).not.toBe('transparent');
  });

  test('current stage step has an accent-soft background', async ({ page }) => {
    const currentStep = page.getByTestId('stage-step-InFunnel');
    const bg = await currentStep.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(bg).not.toBe('transparent');
  });
});
