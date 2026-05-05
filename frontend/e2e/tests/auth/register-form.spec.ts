// T152: register form field order must match design (City before Password)
import { test, expect } from '../../fixtures';

test.describe('Register form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.getByTestId('register-submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('City field appears before Password field in DOM order', async ({ page }) => {
    const cityHandle = await page.getByLabel('City').elementHandle();
    const passwordHandle = await page.getByLabel('Password').elementHandle();
    const position = await page.evaluate(
      ([city, password]) => city!.compareDocumentPosition(password!),
      [cityHandle, passwordHandle]
    );
    // DOCUMENT_POSITION_FOLLOWING (4) means password follows city
    expect(position & 4).toBeTruthy();
  });

  test('password hint is visible', async ({ page }) => {
    await expect(page.getByTestId('register-password-hint')).toBeVisible();
  });
});
