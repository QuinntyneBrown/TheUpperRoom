// Traces to: 47 — Dashboard Widget Catalog Add/Remove
// L2-033: add kpi + line-chart; remove widget; catalog is only discovery
import { test, expect } from '../../fixtures';

const MAILPIT_ENABLED = process.env['MAILPIT'] === 'true';

test.describe('Widget catalog — L2-033', () => {
  test('catalog lists kpi and line-chart', async ({ dashboard }) => {
    await dashboard.goto();
    await dashboard.addWidgetCta().click();
    await expect(dashboard.catalogItem('kpi')).toBeVisible();
    await expect(dashboard.catalogItem('line-chart')).toBeVisible();
  });

  test('adding kpi widget renders it on the board', async ({ page, dashboard }) => {
    await dashboard.goto();
    await dashboard.addWidgetCta().click();
    await dashboard.catalogItem('kpi').click();
    await expect(dashboard.emptyState()).not.toBeVisible();
    await expect(page.locator('[data-testid^="widget-"]')).toHaveCount(1);
  });

  test('adding kpi then line-chart renders two widgets', async ({ page, dashboard }) => {
    await dashboard.goto();

    await dashboard.addWidgetHeaderBtn().click();
    await dashboard.catalogItem('kpi').click();

    await dashboard.addWidgetHeaderBtn().click();
    await dashboard.catalogItem('line-chart').click();

    await expect(page.locator('[data-testid^="widget-"]')).toHaveCount(2);
  });

  test('removing a widget decrements widget count and shows undo snackbar', async ({ page, dashboard }) => {
    await dashboard.goto();
    await dashboard.addWidgetCta().click();
    await dashboard.catalogItem('kpi').click();
    await expect(page.locator('[data-testid^="widget-"]')).toHaveCount(1);

    await page.getByTestId('remove-widget-btn').first().click();
    await expect(dashboard.emptyState()).toBeVisible();
    await expect(dashboard.undoSnackbar()).toBeVisible();
  });

  test('undo remove restores widget', async ({ page, dashboard }) => {
    await dashboard.goto();
    await dashboard.addWidgetCta().click();
    await dashboard.catalogItem('kpi').click();
    await expect(page.locator('[data-testid^="widget-"]')).toHaveCount(1);

    await page.getByTestId('remove-widget-btn').first().click();
    await expect(dashboard.undoSnackbar()).toBeVisible();
    await dashboard.undoRemoveBtn().click();
    await expect(page.locator('[data-testid^="widget-"]')).toHaveCount(1);
    await expect(dashboard.undoSnackbar()).not.toBeVisible();
  });
});

test.describe('Widget persistence — L2-033', () => {
  test.fixme(!MAILPIT_ENABLED, 'Set MAILPIT=true and start Mailpit on localhost:8025');

  test('add kpi and line-chart, reload restores both', async ({ page, dashboard, auth, mailbox }) => {
    const email = `e2e+cat${Date.now()}@example.com`;
    const password = 'Str0ng!Pass#99';

    await auth.signUp({ email, password, displayName: 'Cat User', city: 'Dublin' });
    const link = await mailbox.waitForVerificationLink(email);
    await page.goto(link);
    await auth.signIn(email, password);

    await dashboard.goto();
    await dashboard.addWidgetCta().click();
    await dashboard.catalogItem('kpi').click();
    await dashboard.addWidgetHeaderBtn().click();
    await dashboard.catalogItem('line-chart').click();
    await page.waitForTimeout(500);

    await page.reload();
    await expect(page.locator('[data-testid^="widget-"]')).toHaveCount(2);
  });

  test('remove widget persists after reload', async ({ page, dashboard, auth, mailbox }) => {
    const email = `e2e+rem${Date.now()}@example.com`;
    const password = 'Str0ng!Pass#99';

    await auth.signUp({ email, password, displayName: 'Rem User', city: 'Cork' });
    const link = await mailbox.waitForVerificationLink(email);
    await page.goto(link);
    await auth.signIn(email, password);

    await dashboard.goto();
    await dashboard.addWidgetCta().click();
    await dashboard.catalogItem('kpi').click();
    await page.waitForTimeout(500);

    await page.getByTestId('remove-widget-btn').first().click();
    await page.waitForTimeout(500);

    await page.reload();
    await expect(dashboard.emptyState()).toBeVisible();
  });
});
