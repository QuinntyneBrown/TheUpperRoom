// Traces to: 46 — Dashboard Empty State and First Widget
// L2-032: empty for new user; add first widget; widget persists across sign-out/sign-in
import { test, expect } from '../../fixtures';

const MAILPIT_ENABLED = process.env['MAILPIT'] === 'true';

test.describe('Dashboard empty state — L2-032', () => {
  test('navigating to /dashboard shows empty state and Add widget CTA', async ({ page, dashboard }) => {
    await dashboard.goto();
    await expect(dashboard.emptyState()).toBeVisible();
    await expect(dashboard.addWidgetCta()).toBeVisible();
  });

  test('clicking Add widget CTA opens catalog dialog', async ({ page, dashboard }) => {
    await dashboard.goto();
    await dashboard.addWidgetCta().click();
    await expect(dashboard.catalogDialog()).toBeVisible();
  });

  test('selecting a widget from catalog makes it appear and hides empty state', async ({ page, dashboard }) => {
    await dashboard.goto();
    await dashboard.addWidgetCta().click();
    await dashboard.catalogItem('kpi').click();
    await expect(dashboard.emptyState()).not.toBeVisible();
    await expect(dashboard.anyWidget()).toBeVisible();
  });
});

test.describe('Dashboard widget persistence — L2-032', () => {
  test.fixme(!MAILPIT_ENABLED, 'Set MAILPIT=true and start Mailpit on localhost:8025');

  test('widget persists after sign-out and sign-in', async ({ page, dashboard, auth, mailbox }) => {
    const email = `e2e+dash${Date.now()}@example.com`;
    const password = 'Str0ng!Pass#99';

    await auth.signUp({ email, password, displayName: 'Dash User', city: 'Toronto' });
    const link = await mailbox.waitForVerificationLink(email);
    await page.goto(link);
    await auth.signIn(email, password);

    await dashboard.goto();
    await expect(dashboard.emptyState()).toBeVisible();

    await dashboard.addWidgetCta().click();
    await dashboard.catalogItem('kpi').click();
    await expect(dashboard.anyWidget()).toBeVisible();

    await page.waitForTimeout(500);
    await auth.signOut();

    await auth.signIn(email, password);
    await dashboard.goto();
    await expect(dashboard.anyWidget()).toBeVisible();
    await expect(dashboard.emptyState()).not.toBeVisible();
  });
});
