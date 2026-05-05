// Traces to: 03 — User Sign-In
// L2-002: sign in with valid credentials → redirect to /dashboard
import { test, expect } from '../fixtures';

test.describe('@smoke', () => {
  test('sign-in form is accessible at /auth/sign-in', async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });
});

test.describe('Sign-in flow', () => {
  test.fixme(true, 'Requires a seeded verified user — enable with full E2E setup');

  test('valid credentials redirect to /dashboard', async ({ auth, page }) => {
    await auth.signIn('verified@example.com', 'Str0ng!Pass#99');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('invalid credentials show generic error', async ({ auth, page }) => {
    await auth.signIn('nobody@example.com', 'WrongPass!99');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('unverified account shows verification required message', async ({ auth, page }) => {
    await auth.signIn('unverified@example.com', 'Str0ng!Pass#99');
    await expect(page.getByText(/verif/i)).toBeVisible();
  });
});
