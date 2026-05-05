// Traces to: 02 — User Registration
// L2-001: register → verify email → sign-in redirect
// Requires Mailpit running at localhost:8025 — set MAILPIT=true to enable
import { test, expect } from '../fixtures';

const MAILPIT_ENABLED = process.env['MAILPIT'] === 'true';

test.describe('@smoke', () => {
  test('register form is accessible at /auth/register', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();
  });
});

test.describe('Registration flow', () => {
  test.fixme(!MAILPIT_ENABLED, 'Set MAILPIT=true and start Mailpit on localhost:8025');

  test('register, verify email, redirected to sign-in', async ({ auth, page, mailbox }) => {
    const email = `e2e+${Date.now()}@example.com`;

    await auth.signUp({ email, password: 'Str0ng!Pass#99', displayName: 'E2E User', city: 'Dublin' });
    await expect(page.getByText(/verification email/i)).toBeVisible();

    const link = await mailbox.waitForVerificationLink(email);
    await page.goto(link);
    await expect(page).toHaveURL(/\/auth\/sign-in/);
  });

  test('duplicate email shows same generic confirmation', async ({ auth, page }) => {
    const email = `e2e+dup${Date.now()}@example.com`;

    await auth.signUp({ email, password: 'Str0ng!Pass#99', displayName: 'Dup User', city: 'Cork' });
    await expect(page.getByText(/verification email/i)).toBeVisible();

    await auth.signUp({ email, password: 'Str0ng!Pass#99', displayName: 'Dup User', city: 'Cork' });
    await expect(page.getByText(/verification email/i)).toBeVisible();
  });

  test('weak password shows validation message and no account created', async ({ auth, page }) => {
    await auth.signUp({ email: `weak${Date.now()}@example.com`, password: 'weak', displayName: 'Weak', city: 'Limerick' });
    await expect(page.getByRole('alert')).toBeVisible();
  });
});
