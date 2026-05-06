// BUG-141: partner-card on the board uses div+routerLink. Convert
// to <a> so keyboard users can navigate to detail. Drag handle is
// scoped to a child element via cdkDragHandle.
import { test, expect } from '../../fixtures';

test.describe('Partners board card link', () => {
  test('partner-card is an anchor to the partner detail', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([{ id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead' }]),
    }));
    await page.goto('/partners/board');
    const card = page.getByTestId('partner-card-p1');
    await expect(card).toBeVisible({ timeout: 10000 });
    const tag = await card.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('a');
    await expect(card).toHaveAttribute('href', /\/partners\/p1$/);
  });
});
