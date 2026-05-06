// BUG-152: partner-create's "Partner name" input uses hard-coded
// asterisk in the label string instead of the ur-input `required`
// attribute (added in BUG-124). Switch to required so the asterisk
// renders via ur-input's required indicator span — keeps the styling
// consistent across forms.
import { test, expect } from '../../fixtures';

test.describe('Partner-create required indicator', () => {
  test('Partner name label uses ur-input required indicator', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners**', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/partners');
    await expect(page.getByTestId('new-partner-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('new-partner-btn').click();
    await expect(page.getByTestId('partner-create-form')).toBeVisible();

    const label = page.locator('.ur-input__label', { hasText: /^Partner name/ });
    await expect(label).toBeVisible();
    await expect(label.locator('.ur-input__required')).toBeVisible();
    // The asterisk must come from the indicator span, NOT inline in the label.
    const ownText = await label.evaluate((el) => {
      return Array.from(el.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => (n as Text).textContent ?? '')
        .join('');
    });
    expect(ownText).not.toContain('*');
  });
});
